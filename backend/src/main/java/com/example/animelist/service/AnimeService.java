package com.example.animelist.service;

import com.example.animelist.dto.AnimeDetailResponse;
import com.example.animelist.dto.AnimeSummaryResponse;
import com.example.animelist.entity.Anime;
import com.example.animelist.entity.Genre;
import com.example.animelist.repository.AnimeRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnimeService {

    private final AnimeRepository animeRepository;

    public AnimeService(AnimeRepository animeRepository) {
        this.animeRepository = animeRepository;
    }

    public List<AnimeSummaryResponse> getAnimeList(String search, String genre, String sort) {
        Sort sorting = buildSort(sort);

        List<Anime> animeList;

        boolean hasSearch = search != null && !search.isBlank();
        boolean hasGenre = genre != null && !genre.isBlank();

        if (hasSearch && hasGenre) {
            animeList = animeRepository.findByTitleContainingIgnoreCaseAndGenresNameIgnoreCase(
                    search.trim(),
                    genre.trim(),
                    sorting
            );
        } else if (hasSearch) {
            animeList = animeRepository.findByTitleContainingIgnoreCase(search.trim(), sorting);
        } else if (hasGenre) {
            animeList = animeRepository.findByGenresNameIgnoreCase(genre.trim(), sorting);
        } else {
            animeList = animeRepository.findAll(sorting);
        }

        return animeList.stream()
                .map(this::toSummaryResponse)
                .toList();
    }

    public AnimeDetailResponse getAnimeById(Long id) {
        Anime anime = animeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Anime not found with id: " + id));

        return toDetailResponse(anime);
    }

    private Sort buildSort(String sort) {
        if (sort == null || sort.isBlank()) {
            return Sort.by(Sort.Direction.ASC, "title");
        }

        return switch (sort) {
            case "rating_desc" -> Sort.by(Sort.Direction.DESC, "averageRating");
            case "rating_asc" -> Sort.by(Sort.Direction.ASC, "averageRating");
            case "title_desc" -> Sort.by(Sort.Direction.DESC, "title");
            default -> Sort.by(Sort.Direction.ASC, "title");
        };
    }

    private AnimeSummaryResponse toSummaryResponse(Anime anime) {
        return new AnimeSummaryResponse(
                anime.getId(),
                anime.getTitle(),
                anime.getImageUrl(),
                anime.getAverageRating()
        );
    }

    private AnimeDetailResponse toDetailResponse(Anime anime) {
        List<String> genres = anime.getGenres().stream()
                .map(Genre::getName)
                .sorted()
                .toList();

        return new AnimeDetailResponse(
                anime.getId(),
                anime.getTitle(),
                anime.getSynopsis(),
                anime.getImageUrl(),
                anime.getAverageRating(),
                genres
        );
    }
}