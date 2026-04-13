package com.example.animelist.service;

import com.example.animelist.entity.Anime;
import com.example.animelist.entity.WatchListEntry;
import com.example.animelist.repository.AnimeRepository;
import com.example.animelist.repository.WatchListEntryRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class AnimeRatingService {

    private final AnimeRepository animeRepository;
    private final WatchListEntryRepository watchListEntryRepository;

    public AnimeRatingService(
            AnimeRepository animeRepository,
            WatchListEntryRepository watchListEntryRepository
    ) {
        this.animeRepository = animeRepository;
        this.watchListEntryRepository = watchListEntryRepository;
    }

    public void recalculateAverageRating(Long animeId) {
        Anime anime = animeRepository.findById(animeId)
                .orElseThrow(() -> new RuntimeException("Anime not found with id: " + animeId));

        List<WatchListEntry> entries = watchListEntryRepository.findByAnimeId(animeId);

        int total = 0;
        int count = 0;

        for (WatchListEntry entry : entries) {
            Integer personalRating = entry.getPersonalRating();

            if (personalRating != null) {
                total += personalRating;
                count++;
            }
        }

        BigDecimal newAverage;

        if (count == 0) {
            newAverage = BigDecimal.ZERO.setScale(1, RoundingMode.HALF_UP);
        } else {
            newAverage = BigDecimal.valueOf((double) total / count)
                    .setScale(1, RoundingMode.HALF_UP);
        }

        anime.setAverageRating(newAverage);
        animeRepository.save(anime);
    }
}