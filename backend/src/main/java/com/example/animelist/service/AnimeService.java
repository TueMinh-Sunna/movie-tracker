package com.example.animelist.service;

import com.example.animelist.dto.AnimeDetailResponse;
import com.example.animelist.dto.AnimeSummaryResponse;
import com.example.animelist.entity.Anime;
import com.example.animelist.entity.Genre;
import com.example.animelist.repository.AnimeRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import java.util.List;
import com.example.animelist.dto.PagedResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@Service
public class AnimeService {

    private final AnimeRepository animeRepository;

    public AnimeService(AnimeRepository animeRepository) {
        this.animeRepository = animeRepository;
    }

    public PagedResponse<AnimeSummaryResponse> getAnimeList(
            String search,
            String genre,
            String sort,
            int page,
            int size
    ) {
        Sort sorting = buildSort(sort);

        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 50);

        Pageable pageable = PageRequest.of(safePage, safeSize, sorting);

        Page<Anime> animePage;

        boolean hasSearch = search != null && !search.isBlank();
        boolean hasGenre = genre != null && !genre.isBlank();

        if (hasSearch && hasGenre) {
            animePage = animeRepository.findByTitleContainingIgnoreCaseAndGenresNameIgnoreCase(
                    search.trim(),
                    genre.trim(),
                    pageable
            );
        } else if (hasSearch) {
            animePage = animeRepository.findByTitleContainingIgnoreCase(search.trim(), pageable);
        } else if (hasGenre) {
            animePage = animeRepository.findByGenresNameIgnoreCase(genre.trim(), pageable);
        } else {
            animePage = animeRepository.findAll(pageable);
        }

        List<AnimeSummaryResponse> content = animePage.getContent()
                .stream()
                .map(this::toSummaryResponse)
                .toList();

        return new PagedResponse<>(
                content,
                animePage.getNumber(),
                animePage.getSize(),
                animePage.getTotalElements(),
                animePage.getTotalPages(),
                animePage.isFirst(),
                animePage.isLast()
        );
    }

    public AnimeDetailResponse getAnimeById(Long id) {
        Anime anime = animeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Anime not found"));

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