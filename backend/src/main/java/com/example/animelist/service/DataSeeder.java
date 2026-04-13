package com.example.animelist.service;

import com.example.animelist.entity.Anime;
import com.example.animelist.entity.Genre;
import com.example.animelist.entity.User;
import com.example.animelist.entity.WatchListEntry;
import com.example.animelist.entity.WatchStatus;
import com.example.animelist.repository.AnimeRepository;
import com.example.animelist.repository.GenreRepository;
import com.example.animelist.repository.UserRepository;
import com.example.animelist.repository.WatchListEntryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Component
public class DataSeeder implements CommandLineRunner {

    private final GenreRepository genreRepository;
    private final AnimeRepository animeRepository;
    private final UserRepository userRepository;
    private final WatchListEntryRepository watchListEntryRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(
            GenreRepository genreRepository,
            AnimeRepository animeRepository,
            UserRepository userRepository,
            WatchListEntryRepository watchListEntryRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.genreRepository = genreRepository;
        this.animeRepository = animeRepository;
        this.userRepository = userRepository;
        this.watchListEntryRepository = watchListEntryRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (animeRepository.count() > 0) {
            return;
        }

        Genre action = createGenreIfNotFound("Action");
        Genre adventure = createGenreIfNotFound("Adventure");
        Genre fantasy = createGenreIfNotFound("Fantasy");
        Genre drama = createGenreIfNotFound("Drama");
        Genre sciFi = createGenreIfNotFound("Sci-Fi");
        Genre comedy = createGenreIfNotFound("Comedy");
        Genre romance = createGenreIfNotFound("Romance");
        Genre sliceOfLife = createGenreIfNotFound("Slice of Life");

        Anime a1 = new Anime();
        a1.setTitle("Attack on Titan");
        a1.setSynopsis("Humanity fights for survival against giant Titans behind massive walls.");
        a1.setImageUrl("/images/Belobog Display_Business Sign Set_1.png");
        a1.setAverageRating(new BigDecimal("9.0"));
        a1.setGenres(setOf(action, drama, fantasy));

        Anime a2 = new Anime();
        a2.setTitle("Fullmetal Alchemist: Brotherhood");
        a2.setSynopsis("Two brothers use alchemy in a quest to restore what they lost.");
        a2.setImageUrl("/images/Belobog Display_Business Sign Set_2.png");
        a2.setAverageRating(new BigDecimal("9.2"));
        a2.setGenres(setOf(action, adventure, fantasy));

        Anime a3 = new Anime();
        a3.setTitle("Your Name");
        a3.setSynopsis("Two teenagers mysteriously begin swapping bodies across time and distance.");
        a3.setImageUrl("/images/Belobog Display_Business Sign Set_3.png");
        a3.setAverageRating(new BigDecimal("8.8"));
        a3.setGenres(setOf(romance, drama, fantasy));

        Anime a4 = new Anime();
        a4.setTitle("One Punch Man");
        a4.setSynopsis("A hero who can defeat any enemy with one punch searches for excitement.");
        a4.setImageUrl("/images/Belobog Display_Business Sign Set_4.png");
        a4.setAverageRating(new BigDecimal("8.7"));
        a4.setGenres(setOf(action, comedy, sciFi));

        Anime a5 = new Anime();
        a5.setTitle("Naruto");
        a5.setSynopsis("A young ninja dreams of becoming the strongest leader of his village.");
        a5.setImageUrl("/images/Belobog Display_Business Sign Set_5.png");
        a5.setAverageRating(new BigDecimal("8.4"));
        a5.setGenres(setOf(action, adventure));

        Anime a6 = new Anime();
        a6.setTitle("Demon Slayer");
        a6.setSynopsis("A boy joins a demon-slaying corps after tragedy strikes his family.");
        a6.setImageUrl("/images/Belobog Display_Business Sign Set_6.png");
        a6.setAverageRating(new BigDecimal("8.9"));
        a6.setGenres(setOf(action, fantasy));

        Anime a7 = new Anime();
        a7.setTitle("Steins;Gate");
        a7.setSynopsis("A group of friends accidentally discover a method of sending messages through time.");
        a7.setImageUrl("/images/Belobog Display_Business Sign Set_7.png");
        a7.setAverageRating(new BigDecimal("9.1"));
        a7.setGenres(setOf(sciFi, drama));

        Anime a8 = new Anime();
        a8.setTitle("Kaguya-sama: Love Is War");
        a8.setSynopsis("Two elite students are secretly in love and try to make the other confess first.");
        a8.setImageUrl("/images/Belobog Display_Business Sign Set_8.png");
        a8.setAverageRating(new BigDecimal("8.6"));
        a8.setGenres(setOf(comedy, romance));

        animeRepository.save(a1);
        animeRepository.save(a2);
        animeRepository.save(a3);
        animeRepository.save(a4);
        animeRepository.save(a5);
        animeRepository.save(a6);
        animeRepository.save(a7);
        animeRepository.save(a8);

        User user1 = new User();
        user1.setUsername("demo");
        user1.setEmail("demo@example.com");
        user1.setPasswordHash(passwordEncoder.encode("password123"));
        userRepository.save(user1);

        User user2 = new User();
        user2.setUsername("minh");
        user2.setEmail("minh@example.com");
        user2.setPasswordHash(passwordEncoder.encode("password123"));
        userRepository.save(user2);

        WatchListEntry w1 = new WatchListEntry();
        w1.setUser(user1);
        w1.setAnime(a1);
        w1.setStatus(WatchStatus.COMPLETED);
        w1.setPersonalRating(9);
        watchListEntryRepository.save(w1);

        WatchListEntry w2 = new WatchListEntry();
        w2.setUser(user1);
        w2.setAnime(a3);
        w2.setStatus(WatchStatus.WATCH_LATER);
        w2.setPersonalRating(8);
        watchListEntryRepository.save(w2);

        WatchListEntry w3 = new WatchListEntry();
        w3.setUser(user2);
        w3.setAnime(a2);
        w3.setStatus(WatchStatus.COMPLETED);
        w3.setPersonalRating(10);
        watchListEntryRepository.save(w3);
    }

    private Genre createGenreIfNotFound(String name) {
        return genreRepository.findByName(name).orElseGet(() -> {
            Genre genre = new Genre();
            genre.setName(name);
            return genreRepository.save(genre);
        });
    }

    private Set<Genre> setOf(Genre... genres) {
        Set<Genre> set = new HashSet<>();
        for (Genre genre : genres) {
            set.add(genre);
        }
        return set;
    }
}