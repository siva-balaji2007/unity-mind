package com.unitymind.project;

import com.unitymind.common.DependencyRelationshipType;
import com.unitymind.common.ResourceType;
import com.unitymind.embedding.EmbeddingService;
import com.unitymind.prefab.Prefab;
import com.unitymind.prefab.PrefabRepository;
import com.unitymind.project.dto.CreateProjectRequest;
import com.unitymind.project.dto.ProjectFileDto;
import com.unitymind.project.dto.ProjectResponse;
import com.unitymind.project.dto.UploadResponse;
import com.unitymind.scene.Scene;
import com.unitymind.scene.SceneRepository;
import com.unitymind.script.Script;
import com.unitymind.script.ScriptRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProjectUploadService {
    private static final int MAX_TEXT_FILE_SIZE = 2 * 1024 * 1024; // 2 MB limit for text content storage
    private static final Pattern GUID_PATTERN = Pattern.compile("guid:\\s*([0-9a-fA-F]{32})");
    private static final Pattern UNITY_VERSION_PATTERN = Pattern.compile("m_EditorVersion:\\s*([^\\r\\n]+)");

    private static final Set<String> IGNORED_DIRECTORIES = Set.of(
            "library/", "temp/", "obj/", "build/", "builds/", "logs/",
            "memorycaptures/", ".vs/", ".idea/", "usersettings/", "__macosx/", ".git/"
    );

    private static final Set<String> TEXT_EXTENSIONS = Set.of(
            "cs", "unity", "prefab", "asset", "meta", "shader", "compute",
            "cginc", "hlsl", "json", "asmdef", "asmref", "txt", "md",
            "xml", "yaml", "yml"
    );

    private final ProjectService projectService;
    private final ProjectRepository projectRepository;
    private final ProjectFileRepository projectFileRepository;
    private final ScriptRepository scriptRepository;
    private final SceneRepository sceneRepository;
    private final PrefabRepository prefabRepository;
    private final DependencyRepository dependencyRepository;
    private final EmbeddingService embeddingService;

    @Transactional
    public UploadResponse uploadProjectFiles(UUID projectId, List<MultipartFile> files) {
        Project project = projectService.getOwnedProject(projectId);
        if (files == null || files.isEmpty()) {
            return new UploadResponse(project.getFilesUploaded(), project.getFilesIndexed(), project.getLastUploadedAt(), "No files received");
        }

        int totalUploaded = 0;
        int totalIndexed = 0;

        for (MultipartFile file : files) {
            if (file == null || file.isEmpty()) {
                continue;
            }

            String filename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "";
            if (isZipFile(filename, file.getContentType())) {
                ProcessedArchiveResult result = processZipArchive(project, file);
                totalUploaded += result.filesUploaded();
                totalIndexed += result.filesIndexed();
            } else {
                ProcessedFileResult result = processSingleFile(project, file);
                if (result != null) {
                    totalUploaded += 1;
                    if (result.indexed()) {
                        totalIndexed += 1;
                    }
                }
            }
        }

        project.setFilesUploaded(project.getFilesUploaded() + totalUploaded);
        project.setFilesIndexed(project.getFilesIndexed() + totalIndexed);
        project.setLastUploadedAt(Instant.now());
        project.setLastSyncAt(Instant.now());
        projectRepository.save(project);

        String msg = "Successfully uploaded and processed " + totalUploaded + " files (" + totalIndexed + " indexed).";
        return new UploadResponse(project.getFilesUploaded(), project.getFilesIndexed(), project.getLastUploadedAt(), msg);
    }

    @Transactional
    public UploadResponse uploadProjectZip(UUID projectId, MultipartFile zipFile) {
        Project project = projectService.getOwnedProject(projectId);
        ProcessedArchiveResult result = processZipArchive(project, zipFile);

        project.setFilesUploaded(project.getFilesUploaded() + result.filesUploaded());
        project.setFilesIndexed(project.getFilesIndexed() + result.filesIndexed());
        project.setLastUploadedAt(Instant.now());
        project.setLastSyncAt(Instant.now());
        projectRepository.save(project);

        String msg = "Successfully extracted " + result.filesUploaded() + " files from project archive (" + result.filesIndexed() + " indexed).";
        return new UploadResponse(project.getFilesUploaded(), project.getFilesIndexed(), project.getLastUploadedAt(), msg);
    }

    @Transactional
    public ProjectResponse createProjectFromZip(MultipartFile zipFile, String name, String unityVersion, String description) {
        String derivedName = (name != null && !name.isBlank())
                ? name.trim()
                : extractBaseName(zipFile.getOriginalFilename());
        if (derivedName.isBlank()) {
            derivedName = "Unity Project";
        }

        String derivedVersion = (unityVersion != null && !unityVersion.isBlank())
                ? unityVersion.trim()
                : "2022.3.0f1";

        ProjectResponse created = projectService.createProject(new CreateProjectRequest(derivedName, derivedVersion));
        Project project = projectService.getOwnedProject(created.id());

        ProcessedArchiveResult result = processZipArchive(project, zipFile);
        project.setFilesUploaded(result.filesUploaded());
        project.setFilesIndexed(result.filesIndexed());
        project.setLastUploadedAt(Instant.now());
        project.setLastSyncAt(Instant.now());
        projectRepository.save(project);

        return projectService.toResponseWithStats(project);
    }

    @Transactional(readOnly = true)
    public List<ProjectFileDto> getProjectFiles(UUID projectId) {
        Project project = projectService.getOwnedProject(projectId);
        return projectFileRepository.findAllByProjectId(project.getId()).stream()
                .map(file -> new ProjectFileDto(
                        file.getId(),
                        file.getName(),
                        file.getType(),
                        file.getPath(),
                        file.getSize(),
                        file.getUploadedAt(),
                        file.getIndexedAt()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public ProjectFile getProjectFile(UUID projectId, UUID fileId) {
        Project project = projectService.getOwnedProject(projectId);
        return projectFileRepository.findById(fileId)
                .filter(file -> file.getProject().getId().equals(project.getId()))
                .orElseThrow(() -> new IllegalArgumentException("Project file not found"));
    }

    private ProcessedArchiveResult processZipArchive(Project project, MultipartFile zipFile) {
        int uploadedCount = 0;
        int indexedCount = 0;

        Map<String, UUID> scriptGuidMap = new HashMap<>();
        Map<String, Script> savedScripts = new HashMap<>();
        List<Prefab> savedPrefabs = new ArrayList<>();
        List<Scene> savedScenes = new ArrayList<>();

        try (InputStream is = zipFile.getInputStream();
             BufferedInputStream bis = new BufferedInputStream(is);
             ZipInputStream zis = new ZipInputStream(bis)) {

            ZipEntry entry;
            while ((entry = zis.getNextEntry()) != null) {
                if (entry.isDirectory()) {
                    continue;
                }

                String rawPath = entry.getName().replace('\\', '/');
                if (shouldIgnorePath(rawPath)) {
                    continue;
                }

                String cleanPath = sanitizeZipPath(rawPath);
                String extension = extractExtension(cleanPath);
                boolean isText = isTextExtension(extension);

                ExtractedEntryContent extracted = readZipEntry(zis, isText);
                String content = extracted.content();
                long size = extracted.size();

                // Auto-detect Unity editor version if ProjectVersion.txt is encountered
                if (cleanPath.endsWith("ProjectVersion.txt") && content != null) {
                    Matcher m = UNITY_VERSION_PATTERN.matcher(content);
                    if (m.find()) {
                        String version = m.group(1).trim();
                        if (!version.isBlank()) {
                            project.setUnityVersion(version);
                        }
                    }
                }

                ProjectFileType fileType = deriveType(extension);
                String fileName = extractName(cleanPath);

                // Save or update ProjectFile
                ProjectFile projectFile = projectFileRepository.findByProjectIdAndPath(project.getId(), cleanPath)
                        .orElseGet(() -> ProjectFile.builder().project(project).path(cleanPath).build());
                projectFile.setName(fileName);
                projectFile.setType(fileType);
                projectFile.setSize(size);
                projectFile.setContent(content);
                projectFile.setIndexedAt(Instant.now());
                projectFileRepository.save(projectFile);
                uploadedCount++;

                // Populate corresponding domain entities and index embeddings
                if (fileType == ProjectFileType.SCRIPT) {
                    Script script = scriptRepository.findByProjectIdAndPath(project.getId(), cleanPath)
                            .orElseGet(() -> Script.builder().project(project).path(cleanPath).build());
                    script.setName(fileName);
                    script.setContent(content != null ? content : "");
                    Script saved = scriptRepository.save(script);
                    savedScripts.put(saved.getName(), saved);

                    tryIndexEmbedding(project, ResourceType.SCRIPT, saved.getId(),
                            "Script: " + saved.getName() + "\nPath: " + saved.getPath() + "\n" + saved.getContent());
                    indexedCount++;
                } else if (fileType == ProjectFileType.SCENE) {
                    Scene scene = sceneRepository.findByProjectIdAndPath(project.getId(), cleanPath)
                            .orElseGet(() -> Scene.builder().project(project).path(cleanPath).build());
                    scene.setName(fileName);
                    Scene saved = sceneRepository.save(scene);
                    savedScenes.add(saved);

                    tryIndexEmbedding(project, ResourceType.SCENE, saved.getId(),
                            "Scene: " + saved.getName() + "\nPath: " + saved.getPath());
                    indexedCount++;
                } else if (fileType == ProjectFileType.PREFAB) {
                    Prefab prefab = prefabRepository.findByProjectIdAndPath(project.getId(), cleanPath)
                            .orElseGet(() -> Prefab.builder().project(project).path(cleanPath).build());
                    prefab.setName(fileName);
                    Prefab saved = prefabRepository.save(prefab);
                    savedPrefabs.add(saved);

                    tryIndexEmbedding(project, ResourceType.PREFAB, saved.getId(),
                            "Prefab: " + saved.getName() + "\nPath: " + saved.getPath());
                    indexedCount++;
                } else if (fileType == ProjectFileType.META && cleanPath.endsWith(".cs.meta") && content != null) {
                    Matcher m = GUID_PATTERN.matcher(content);
                    if (m.find()) {
                        String guid = m.group(1);
                        String scriptPath = cleanPath.substring(0, cleanPath.length() - 5);
                        scriptRepository.findByProjectIdAndPath(project.getId(), scriptPath)
                                .ifPresent(s -> scriptGuidMap.put(guid, s.getId()));
                    }
                }
            }

            // Extract and persist dependencies across project resources
            discoverAndSaveDependencies(project, scriptGuidMap, savedScripts, savedPrefabs, savedScenes);

        } catch (IOException e) {
            log.error("Failed to unpack project zip archive", e);
        }

        return new ProcessedArchiveResult(uploadedCount, indexedCount);
    }

    private ProcessedFileResult processSingleFile(Project project, MultipartFile file) {
        String filename = file.getOriginalFilename();
        if (filename == null || filename.isBlank()) {
            return null;
        }

        String path = filename.replace('\\', '/');
        String extension = extractExtension(path);
        ProjectFileType fileType = deriveType(extension);
        boolean isText = isTextExtension(extension);

        String content = null;
        try {
            if (isText) {
                byte[] bytes = file.getBytes();
                if (bytes.length <= MAX_TEXT_FILE_SIZE) {
                    content = new String(bytes, StandardCharsets.UTF_8);
                }
            }
        } catch (IOException ignored) {
        }

        String name = extractName(path);
        ProjectFile projectFile = projectFileRepository.findByProjectIdAndPath(project.getId(), path)
                .orElseGet(() -> ProjectFile.builder().project(project).path(path).build());
        projectFile.setName(name);
        projectFile.setType(fileType);
        projectFile.setSize(file.getSize());
        projectFile.setContent(content);
        projectFile.setIndexedAt(Instant.now());
        projectFileRepository.save(projectFile);

        boolean indexed = false;
        if (fileType == ProjectFileType.SCRIPT) {
            Script script = scriptRepository.findByProjectIdAndPath(project.getId(), path)
                    .orElseGet(() -> Script.builder().project(project).path(path).build());
            script.setName(name);
            script.setContent(content != null ? content : "");
            Script saved = scriptRepository.save(script);
            tryIndexEmbedding(project, ResourceType.SCRIPT, saved.getId(),
                    "Script: " + saved.getName() + "\nPath: " + saved.getPath() + "\n" + saved.getContent());
            indexed = true;
        } else if (fileType == ProjectFileType.SCENE) {
            Scene scene = sceneRepository.findByProjectIdAndPath(project.getId(), path)
                    .orElseGet(() -> Scene.builder().project(project).path(path).build());
            scene.setName(name);
            Scene saved = sceneRepository.save(scene);
            tryIndexEmbedding(project, ResourceType.SCENE, saved.getId(),
                    "Scene: " + saved.getName() + "\nPath: " + saved.getPath());
            indexed = true;
        } else if (fileType == ProjectFileType.PREFAB) {
            Prefab prefab = prefabRepository.findByProjectIdAndPath(project.getId(), path)
                    .orElseGet(() -> Prefab.builder().project(project).path(path).build());
            prefab.setName(name);
            Prefab saved = prefabRepository.save(prefab);
            tryIndexEmbedding(project, ResourceType.PREFAB, saved.getId(),
                    "Prefab: " + saved.getName() + "\nPath: " + saved.getPath());
            indexed = true;
        }

        return new ProcessedFileResult(true, indexed);
    }

    private void discoverAndSaveDependencies(
            Project project,
            Map<String, UUID> scriptGuidMap,
            Map<String, Script> savedScripts,
            List<Prefab> savedPrefabs,
            List<Scene> savedScenes
    ) {
        List<Dependency> dependencies = new ArrayList<>();
        Set<String> uniqueKeys = new HashSet<>();

        // 1. Prefab -> Script dependencies (via GUID or Script class names)
        for (Prefab prefab : savedPrefabs) {
            projectFileRepository.findByProjectIdAndPath(project.getId(), prefab.getPath())
                    .ifPresent(pf -> {
                        String yaml = pf.getContent();
                        if (yaml == null) return;

                        Matcher m = GUID_PATTERN.matcher(yaml);
                        while (m.find()) {
                            String guid = m.group(1);
                            UUID scriptId = scriptGuidMap.get(guid);
                            if (scriptId != null) {
                                String key = "PREFAB-" + prefab.getId() + "-SCRIPT-" + scriptId;
                                if (uniqueKeys.add(key)) {
                                    dependencies.add(Dependency.builder()
                                            .project(project)
                                            .sourceType(ResourceType.PREFAB)
                                            .sourceId(prefab.getId())
                                            .targetType(ResourceType.SCRIPT)
                                            .targetId(scriptId)
                                            .relationshipType(DependencyRelationshipType.ATTACHED_TO)
                                            .build());
                                }
                            }
                        }
                    });
        }

        // 2. Scene -> Script dependencies
        for (Scene scene : savedScenes) {
            projectFileRepository.findByProjectIdAndPath(project.getId(), scene.getPath())
                    .ifPresent(pf -> {
                        String yaml = pf.getContent();
                        if (yaml == null) return;

                        Matcher m = GUID_PATTERN.matcher(yaml);
                        while (m.find()) {
                            String guid = m.group(1);
                            UUID scriptId = scriptGuidMap.get(guid);
                            if (scriptId != null) {
                                String key = "SCENE-" + scene.getId() + "-SCRIPT-" + scriptId;
                                if (uniqueKeys.add(key)) {
                                    dependencies.add(Dependency.builder()
                                            .project(project)
                                            .sourceType(ResourceType.SCENE)
                                            .sourceId(scene.getId())
                                            .targetType(ResourceType.SCRIPT)
                                            .targetId(scriptId)
                                            .relationshipType(DependencyRelationshipType.REFERENCES)
                                            .build());
                                }
                            }
                        }
                    });
        }

        // 3. Script -> Script cross-references
        List<Script> scriptList = new ArrayList<>(savedScripts.values());
        for (Script s1 : scriptList) {
            String content = s1.getContent();
            if (content == null || content.isBlank()) continue;

            int count = 0;
            for (Script s2 : scriptList) {
                if (s1.getId().equals(s2.getId())) continue;
                String className = s2.getName();
                if (className.length() >= 3 && content.contains(className)) {
                    String key = "SCRIPT-" + s1.getId() + "-SCRIPT-" + s2.getId();
                    if (uniqueKeys.add(key)) {
                        dependencies.add(Dependency.builder()
                                .project(project)
                                .sourceType(ResourceType.SCRIPT)
                                .sourceId(s1.getId())
                                .targetType(ResourceType.SCRIPT)
                                .targetId(s2.getId())
                                .relationshipType(DependencyRelationshipType.USES)
                                .build());
                        count++;
                        if (count >= 15) break; // Limit fan-out per script
                    }
                }
            }
        }

        if (!dependencies.isEmpty()) {
            dependencyRepository.saveAll(dependencies);
        }
    }

    private void tryIndexEmbedding(Project project, ResourceType type, UUID id, String text) {
        try {
            embeddingService.upsertEmbedding(project, type, id, text);
        } catch (Exception e) {
            log.warn("Embedding indexing failed for {} {}: {}", type, id, e.getMessage());
        }
    }

    private ExtractedEntryContent readZipEntry(ZipInputStream zis, boolean isText) throws IOException {
        ByteArrayOutputStream baos = isText ? new ByteArrayOutputStream() : null;
        byte[] buffer = new byte[8192];
        long totalBytes = 0;
        int n;

        while ((n = zis.read(buffer)) != -1) {
            totalBytes += n;
            if (isText && totalBytes <= MAX_TEXT_FILE_SIZE && baos != null) {
                baos.write(buffer, 0, n);
            }
        }

        String content = null;
        if (isText && baos != null && baos.size() > 0) {
            content = baos.toString(StandardCharsets.UTF_8);
        }

        return new ExtractedEntryContent(content, totalBytes);
    }

    private boolean isZipFile(String filename, String contentType) {
        String lower = filename.toLowerCase();
        if (lower.endsWith(".zip")) {
            return true;
        }
        return contentType != null && (
                contentType.equals("application/zip") ||
                contentType.equals("application/x-zip-compressed") ||
                contentType.equals("multipart/x-zip")
        );
    }

    private boolean isTextExtension(String extension) {
        return TEXT_EXTENSIONS.contains(extension.toLowerCase());
    }

    private boolean shouldIgnorePath(String path) {
        String lower = path.toLowerCase();
        if (lower.contains("..") || lower.startsWith("/")) {
            return true;
        }
        for (String ignored : IGNORED_DIRECTORIES) {
            if (lower.contains(ignored) || lower.startsWith(ignored)) {
                return true;
            }
        }
        return lower.endsWith(".ds_store") || lower.contains("/.ds_store");
    }

    private String sanitizeZipPath(String rawPath) {
        String path = rawPath.replace('\\', '/');
        while (path.startsWith("/")) {
            path = path.substring(1);
        }

        // If top folder contains Assets/ or ProjectSettings/, strip preceding wrapper folder
        // e.g., "MyProject/Assets/Scripts/Foo.cs" -> "Assets/Scripts/Foo.cs"
        int assetsIdx = path.indexOf("Assets/");
        if (assetsIdx > 0) {
            return path.substring(assetsIdx);
        }
        int settingsIdx = path.indexOf("ProjectSettings/");
        if (settingsIdx > 0) {
            return path.substring(settingsIdx);
        }
        int packagesIdx = path.indexOf("Packages/");
        if (packagesIdx > 0) {
            return path.substring(packagesIdx);
        }

        return path;
    }

    private String extractExtension(String filename) {
        if (filename == null) return "";
        int idx = filename.lastIndexOf('.');
        return idx < 0 ? "" : filename.substring(idx + 1).toLowerCase();
    }

    private String extractName(String path) {
        if (path == null) return "";
        int idx = path.lastIndexOf('/');
        String last = idx < 0 ? path : path.substring(idx + 1);
        int dot = last.lastIndexOf('.');
        return dot < 0 ? last : last.substring(0, dot);
    }

    private String extractBaseName(String filename) {
        if (filename == null) return "Unity Project";
        int idx = filename.lastIndexOf('.');
        return idx < 0 ? filename : filename.substring(0, idx);
    }

    private ProjectFileType deriveType(String extension) {
        return switch (extension.toLowerCase()) {
            case "cs" -> ProjectFileType.SCRIPT;
            case "unity" -> ProjectFileType.SCENE;
            case "prefab" -> ProjectFileType.PREFAB;
            case "meta" -> ProjectFileType.META;
            default -> ProjectFileType.ASSET;
        };
    }

    private record ExtractedEntryContent(String content, long size) {}
    private record ProcessedArchiveResult(int filesUploaded, int filesIndexed) {}
    private record ProcessedFileResult(boolean uploaded, boolean indexed) {}
}
