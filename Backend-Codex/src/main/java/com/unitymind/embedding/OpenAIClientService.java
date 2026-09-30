package com.unitymind.embedding;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.unitymind.exception.OpenAIException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class OpenAIClientService {
    private final String apiKey;
    private final String chatModel;
    private final String embeddingModel;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public OpenAIClientService(
            @Value("${app.openai.api-key}") String apiKey,
            @Value("${app.openai.chat-model}") String chatModel,
            @Value("${app.openai.embedding-model}") String embeddingModel,
            ObjectMapper objectMapper
    ) {
        this.apiKey = apiKey;
        this.chatModel = chatModel;
        this.embeddingModel = embeddingModel;
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newHttpClient();
    }

    public List<Double> createEmbedding(String input) {
        ensureConfigured();
        try {
            String body = objectMapper.writeValueAsString(Map.of(
                    "model", embeddingModel,
                    "input", input
            ));
            JsonNode root = post("https://api.openai.com/v1/embeddings", body);
            JsonNode array = root.path("data").get(0).path("embedding");
            List<Double> vector = new ArrayList<>(array.size());
            array.forEach(value -> vector.add(value.asDouble()));
            return vector;
        } catch (Exception ex) {
            throw new OpenAIException("Failed to create embedding", ex);
        }
    }

    public String answer(String systemPrompt, List<Map<String, String>> history, String userQuestion) {
        ensureConfigured();
        try {
            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "system", "content", systemPrompt));
            messages.addAll(history);
            messages.add(Map.of("role", "user", "content", userQuestion));
            String body = objectMapper.writeValueAsString(Map.of(
                    "model", chatModel,
                    "messages", messages,
                    "temperature", 0.2
            ));
            JsonNode root = post("https://api.openai.com/v1/chat/completions", body);
            return root.path("choices").get(0).path("message").path("content").asText();
        } catch (Exception ex) {
            throw new OpenAIException("Failed to generate chat response", ex);
        }
    }

    private JsonNode post(String url, String body) throws Exception {
        HttpRequest request = HttpRequest.newBuilder(URI.create(url))
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() >= 400) {
            throw new OpenAIException("OpenAI API returned status " + response.statusCode());
        }
        return objectMapper.readTree(response.body());
    }

    private void ensureConfigured() {
        if (apiKey == null || apiKey.isBlank()) {
            throw new OpenAIException("OPENAI_API_KEY is not configured");
        }
    }
}
