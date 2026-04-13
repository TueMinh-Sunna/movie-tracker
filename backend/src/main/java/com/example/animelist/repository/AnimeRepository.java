package com.example.animelist.repository;

import com.example.animelist.entity.Anime;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AnimeRepository extends JpaRepository<Anime, Long> {

    List<Anime> findByTitleContainingIgnoreCase(String titlePart, Sort sort);

    List<Anime> findByGenresNameIgnoreCase(String genreName, Sort sort);

    List<Anime> findByTitleContainingIgnoreCaseAndGenresNameIgnoreCase(
            String titlePart,
            String genreName,
            Sort sort
    );

    Optional<Anime> findById(Long id);
}