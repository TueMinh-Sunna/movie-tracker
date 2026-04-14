package com.example.animelist.service;

import com.example.animelist.dto.WatchListEntryResponse;
import com.example.animelist.dto.WatchListRequest;
import com.example.animelist.entity.Anime;
import com.example.animelist.entity.User;
import com.example.animelist.entity.WatchListEntry;
import com.example.animelist.repository.AnimeRepository;
import com.example.animelist.repository.UserRepository;
import com.example.animelist.repository.WatchListEntryRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@Service
public class WatchListService {

    private static final String SESSION_USER_ID = "userId";

    private final WatchListEntryRepository watchListEntryRepository;
    private final UserRepository userRepository;
    private final AnimeRepository animeRepository;
    private final AnimeRatingService animeRatingService;

    public WatchListService(
            WatchListEntryRepository watchListEntryRepository,
            UserRepository userRepository,
            AnimeRepository animeRepository,
            AnimeRatingService animeRatingService
    ) {
        this.watchListEntryRepository = watchListEntryRepository;
        this.userRepository = userRepository;
        this.animeRepository = animeRepository;
        this.animeRatingService = animeRatingService;
    }

    public List<WatchListEntryResponse> getCurrentUserWatchList(HttpSession session) {
        Long userId = getRequiredUserId(session);

        return watchListEntryRepository.findByUserId(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public WatchListEntryResponse getCurrentUserWatchListEntry(Long animeId, HttpSession session) {
        Long userId = getRequiredUserId(session);

        WatchListEntry entry = watchListEntryRepository.findByUserIdAndAnimeId(userId, animeId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Watch list entry not found"));

        return toResponse(entry);
    }

    public WatchListEntryResponse addToWatchList(WatchListRequest request, HttpSession session) {
        Long userId = getRequiredUserId(session);

        if (request.getAnimeId() == null) {
            throw new ResponseStatusException(BAD_REQUEST, "Anime id is required");
        }

        if (request.getStatus() == null) {
            throw new ResponseStatusException(BAD_REQUEST, "Status is required");
        }

        validatePersonalRating(request.getPersonalRating());

        if (watchListEntryRepository.findByUserIdAndAnimeId(userId, request.getAnimeId()).isPresent()) {
            throw new ResponseStatusException(BAD_REQUEST, "Anime is already in watch list");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(UNAUTHORIZED, "User not found"));

        Anime anime = animeRepository.findById(request.getAnimeId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Anime not found"));

        WatchListEntry entry = new WatchListEntry();
        entry.setUser(user);
        entry.setAnime(anime);
        entry.setStatus(request.getStatus());
        entry.setPersonalRating(request.getPersonalRating());

        WatchListEntry savedEntry = watchListEntryRepository.save(entry);

        animeRatingService.recalculateAverageRating(anime.getId());

        return toResponse(savedEntry);
    }

    public WatchListEntryResponse updateWatchListEntry(Long animeId, WatchListRequest request, HttpSession session) {
        Long userId = getRequiredUserId(session);

        WatchListEntry entry = watchListEntryRepository.findByUserIdAndAnimeId(userId, animeId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Watch list entry not found"));

        if (request.getStatus() == null) {
            throw new ResponseStatusException(BAD_REQUEST, "Status is required");
        }

        validatePersonalRating(request.getPersonalRating());

        entry.setStatus(request.getStatus());
        entry.setPersonalRating(request.getPersonalRating());

        WatchListEntry savedEntry = watchListEntryRepository.save(entry);

        animeRatingService.recalculateAverageRating(animeId);

        return toResponse(savedEntry);
    }

    public void deleteWatchListEntry(Long animeId, HttpSession session) {
        Long userId = getRequiredUserId(session);

        WatchListEntry entry = watchListEntryRepository.findByUserIdAndAnimeId(userId, animeId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Watch list entry not found"));

        watchListEntryRepository.delete(entry);

        animeRatingService.recalculateAverageRating(animeId);
    }

    private Long getRequiredUserId(HttpSession session) {
        Object userIdObject = session.getAttribute(SESSION_USER_ID);

        if (userIdObject == null) {
            throw new ResponseStatusException(UNAUTHORIZED, "Not logged in");
        }

        return (Long) userIdObject;
    }

    private void validatePersonalRating(Integer personalRating) {
        if (personalRating == null) {
            return;
        }

        if (personalRating < 1 || personalRating > 10) {
            throw new ResponseStatusException(BAD_REQUEST, "Personal rating must be between 1 and 10");
        }
    }

    private WatchListEntryResponse toResponse(WatchListEntry entry) {
        return new WatchListEntryResponse(
                entry.getAnime().getId(),
                entry.getAnime().getTitle(),
                entry.getAnime().getImageUrl(),
                entry.getStatus(),
                entry.getPersonalRating(),
                entry.getUpdatedAt()
        );
    }
}