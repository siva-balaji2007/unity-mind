package com.unitymind.embedding;

import com.unitymind.common.ResourceType;
import com.unitymind.project.Project;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "embeddings", indexes = {
        @Index(name = "idx_embeddings_project_id", columnList = "project_id"),
        @Index(name = "idx_embeddings_resource", columnList = "resource_type,resource_id")
})
public class Embedding {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResourceType resourceType;

    @Column(nullable = false)
    private UUID resourceId;

    @Column(nullable = false, columnDefinition = "vector(1536)")
    private String embeddingVector;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
}
