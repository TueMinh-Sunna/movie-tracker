package com.example.animelist.repository;

import com.example.animelist.entity.Anime;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnimeRepository extends JpaRepository<Anime, Long> {

    Page<Anime> findByTitleContainingIgnoreCase(String titlePart, Pageable pageable);

    Page<Anime> findByGenresNameIgnoreCase(String genreName, Pageable pageable);

    Page<Anime> findByTitleContainingIgnoreCaseAndGenresNameIgnoreCase(
            String titlePart,
            String genreName,
            Pageable pageable
    );
}