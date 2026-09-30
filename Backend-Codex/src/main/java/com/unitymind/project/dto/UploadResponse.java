package com.unitymind.project.dto;

import java.time.Instant;

public record UploadResponse(
        int filesUploaded,
        int filesIndexed,
        Instant lastUploadedAt,
        String message
) {
    public UploadResponse(int filesUploaded, int filesIndexed, Instant lastUploadedAt) {
        this(filesUploaded, filesIndexed, lastUploadedAt, "Successfully uploaded and processed " + filesUploaded + " files.");
    }
}
