package com.example.animelist.controller;

import com.example.animelist.dto.WatchListEntryResponse;
import com.example.animelist.dto.WatchListRequest;
import com.example.animelist.service.WatchListService;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/watchlist")
public class WatchListController {

    private final WatchListService watchListService;

    public WatchListController(WatchListService watchListService) {
        this.watchListService = watchListService;
    }

    @GetMapping
    public List<WatchListEntryResponse> getWatchList(HttpSession session) {
        return watchListService.getCurrentUserWatchList(session);
    }

    @GetMapping("/{animeId}")
    public WatchListEntryResponse getWatchListEntry(
            @PathVariable Long animeId,
            HttpSession session
    ) {
        return watchListService.getCurrentUserWatchListEntry(animeId, session);
    }

    @PostMapping
    public WatchListEntryResponse addToWatchList(
            @RequestBody WatchListRequest request,
            HttpSession session
    ) {
        return watchListService.addToWatchList(request, session);
    }

    @PutMapping("/{animeId}")
    public WatchListEntryResponse updateWatchListEntry(
            @PathVariable Long animeId,
            @RequestBody WatchListRequest request,
            HttpSession session
    ) {
        return watchListService.updateWatchListEntry(animeId, request, session);
    }

    @DeleteMapping("/{animeId}")
    public void deleteWatchListEntry(
            @PathVariable Long animeId,
            HttpSession session
    ) {
        watchListService.deleteWatchListEntry(animeId, session);
    }
}