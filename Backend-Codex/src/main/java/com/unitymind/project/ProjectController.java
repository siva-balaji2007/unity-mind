package com.unitymind.project;

import com.unitymind.project.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;
    private final ProjectSyncService projectSyncService;
    private final ProjectUploadService projectUploadService;

    @GetMapping
    public List<ProjectResponse> getProjects() {
        return projectService.getProjects();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectResponse createProject(@Valid @RequestBody CreateProjectRequest request) {
        return projectService.createProject(request);
    }

    @GetMapping("/{id}")
    public ProjectResponse getProject(@PathVariable UUID id) {
        return projectService.getProject(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProject(@PathVariable UUID id) {
        projectService.deleteProject(id);
    }

    @PostMapping(value = "/{id}/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public UploadResponse uploadProjectFiles(
            @PathVariable UUID id,
            @RequestParam(value = "files", required = false) List<MultipartFile> files,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) {
        if (files != null && !files.isEmpty()) {
            return projectUploadService.uploadProjectFiles(id, files);
        }
        if (file != null && !file.isEmpty()) {
            return projectUploadService.uploadProjectFiles(id, Collections.singletonList(file));
        }
        return new UploadResponse(0, 0, null, "No files received for upload");
    }

    @PostMapping(value = "/{id}/upload-zip", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public UploadResponse uploadProjectZip(
            @PathVariable UUID id,
            @RequestParam("file") MultipartFile file
    ) {
        return projectUploadService.uploadProjectZip(id, file);
    }

    @PostMapping(value = "/upload-zip", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectResponse createProjectFromZip(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "unityVersion", required = false) String unityVersion,
            @RequestParam(value = "description", required = false) String description
    ) {
        return projectUploadService.createProjectFromZip(file, name, unityVersion, description);
    }

    @GetMapping("/{id}/files")
    public List<ProjectFileDto> getProjectFiles(@PathVariable UUID id) {
        return projectUploadService.getProjectFiles(id);
    }

    @GetMapping("/{id}/files/{fileId}")
    public ProjectFile getProjectFile(@PathVariable UUID id, @PathVariable UUID fileId) {
        return projectUploadService.getProjectFile(id, fileId);
    }

    @PostMapping("/{id}/sync")
    public SyncProjectResponse syncProject(@PathVariable UUID id, @Valid @RequestBody SyncProjectRequest request) {
        return projectSyncService.sync(id, request);
    }
}
