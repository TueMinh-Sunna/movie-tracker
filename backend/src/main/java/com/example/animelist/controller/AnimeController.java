package com.example.animelist.controller;

import com.example.animelist.dto.AnimeDetailResponse;
import com.example.animelist.dto.AnimeSummaryResponse;
import com.example.animelist.service.AnimeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/anime")
public class AnimeController {

    private final AnimeService animeService;

    public AnimeController(AnimeService animeService) {
        this.animeService = animeService;
    }

    @GetMapping
    public List<AnimeSummaryResponse> getAnimeList(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String sort
    ) {
        return animeService.getAnimeList(search, genre, sort);
    }

    @GetMapping("/{id}")
    public AnimeDetailResponse getAnimeById(@PathVariable Long id) {
        return animeService.getAnimeById(id);
    }
}