package com.example.animelist.service;

import com.example.animelist.repository.GenreRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GenreService {

    private final GenreRepository genreRepository;

    public GenreService(GenreRepository genreRepository) {
        this.genreRepository = genreRepository;
    }

    public List<String> getAllGenres() {
        return genreRepository.findAllByOrderByNameAsc()
                .stream()
                .map(genre -> genre.getName())
                .toList();
    }
}