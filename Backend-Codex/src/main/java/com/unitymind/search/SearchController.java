package com.unitymind.search;

import com.unitymind.search.dto.SearchResponse;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Validated
@RestController
@RequestMapping("/api/projects/{id}/search")
@RequiredArgsConstructor
public class SearchController {
    private final SearchService searchService;

    @GetMapping
    public List<SearchResponse> search(@PathVariable UUID id, @RequestParam("q") @NotBlank String query) {
        return searchService.search(id, query);
    }
}
