package com.example.animelist.repository;

import com.example.animelist.entity.WatchListEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WatchListEntryRepository extends JpaRepository<WatchListEntry, Long> {
    Optional<WatchListEntry> findByUserIdAndAnimeId(Long userId, Long animeId);

    List<WatchListEntry> findByUserId(Long userId);

    List<WatchListEntry> findByAnimeId(Long animeId);
}