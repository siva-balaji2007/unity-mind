package com.unitymind.scene;

import com.unitymind.project.Project;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "scenes", indexes = {
        @Index(name = "idx_scenes_project_id", columnList = "project_id"),
        @Index(name = "idx_scenes_path_project", columnList = "project_id,path", unique = true)
})
public class Scene {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String path;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;
}
