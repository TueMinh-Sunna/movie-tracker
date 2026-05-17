package com.example.animelist.service;

import com.example.animelist.entity.*;
import com.example.animelist.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.*;

@Component
public class DataSeeder implements CommandLineRunner {

    private final GenreRepository genreRepository;
    private final AnimeRepository animeRepository;
    private final UserRepository userRepository;
    private final WatchListEntryRepository watchListEntryRepository;
    private final CommentRepository commentRepository;
    private final PasswordEncoder passwordEncoder;
    private final AnimeRatingService animeRatingService;

    public DataSeeder(
            GenreRepository genreRepository,
            AnimeRepository animeRepository,
            UserRepository userRepository,
            WatchListEntryRepository watchListEntryRepository,
            CommentRepository commentRepository,
            PasswordEncoder passwordEncoder,
            AnimeRatingService animeRatingService
    ) {
        this.genreRepository = genreRepository;
        this.animeRepository = animeRepository;
        this.userRepository = userRepository;
        this.watchListEntryRepository = watchListEntryRepository;
        this.commentRepository = commentRepository;
        this.passwordEncoder = passwordEncoder;
        this.animeRatingService = animeRatingService;
    }

    @Override
    public void run(String... args) {
        if (animeRepository.count() > 0) {
            return;
        }

        Random random = new Random(123);

        List<Genre> genres = createGenres();
        List<Anime> animeList = createAnime(genres, random);
        List<User> users = createUsers();
        createWatchListEntries(users, animeList, random);
        createComments(users, animeList, random);

        for (Anime anime : animeList) {
            animeRatingService.recalculateAverageRating(anime.getId());
        }

        System.out.println("Seed complete:");
        System.out.println("Anime: " + animeRepository.count());
        System.out.println("Genres: " + genreRepository.count());
        System.out.println("Users: " + userRepository.count());
        System.out.println("Watchlist entries: " + watchListEntryRepository.count());
        System.out.println("Comments: " + commentRepository.count());
    }

    private List<Genre> createGenres() {
        String[] names = {
                "Action", "Adventure", "Fantasy", "Drama", "Sci-Fi",
                "Comedy", "Romance", "Slice of Life", "Mystery", "Sports",
                "Supernatural", "Thriller", "Music", "Mecha", "Historical"
        };

        List<Genre> genres = new ArrayList<>();

        for (String name : names) {
            Genre genre = new Genre();
            genre.setName(name);
            genres.add(genreRepository.save(genre));
        }

        return genres;
    }

    private List<Anime> createAnime(List<Genre> genres, Random random) {
        String[] titles = {
                "Attack on Titan", "Fullmetal Alchemist: Brotherhood", "Your Name", "One Punch Man",
                "Naruto", "Demon Slayer", "Steins;Gate", "Kaguya-sama: Love Is War",
                "Jujutsu Kaisen", "Death Note", "Hunter x Hunter", "Haikyu!!",
                "Mob Psycho 100", "Spy x Family", "Vinland Saga", "Code Geass",
                "Cowboy Bebop", "Frieren: Beyond Journey's End", "Chainsaw Man", "Violet Evergarden",
                "A Silent Voice", "Made in Abyss", "Cyberpunk: Edgerunners", "Toradora!",
                "Re:Zero", "Bleach", "One Piece", "Dragon Ball Z",
                "My Hero Academia", "Black Clover", "Blue Lock", "Dr. Stone",
                "The Promised Neverland", "Erased", "Tokyo Revengers", "Horimiya",
                "Clannad", "Anohana", "Angel Beats!", "Nichijou",
                "Bocchi the Rock!", "Oshi no Ko", "Monster", "Parasyte",
                "Psycho-Pass", "Samurai Champloo", "Gintama", "Fruits Basket",
                "Noragami", "86 Eighty-Six", "Mushoku Tensei", "Konosuba",
                "No Game No Life", "Classroom of the Elite", "Hyouka", "The Garden of Words",
                "Weathering With You", "Suzume", "Akira", "Ghost in the Shell",
                "Neon Genesis Evangelion", "Gurren Lagann", "Kill la Kill", "Fairy Tail",
                "Soul Eater", "Fire Force", "Dororo", "Golden Kamuy",
                "March Comes in Like a Lion", "Run with the Wind", "Yuri on Ice", "K-On!",
                "Your Lie in April", "Nana", "Skip and Loafer", "Hell's Paradise",
                "The Apothecary Diaries", "Pluto", "Solo Leveling", "Kaiju No. 8"
        };

        List<Anime> animeList = new ArrayList<>();

        for (int i = 0; i < titles.length; i++) {
            Anime anime = new Anime();
            anime.setTitle(titles[i]);
            anime.setSynopsis("A demo synopsis for " + titles[i] + ". This sample text gives the details page enough content to look realistic.");
            int imageNumber;

            if (i < 13) {
                imageNumber = i + 1;
                anime.setImageUrl("/images/Belobog Display_Business Sign Set_" + imageNumber + ".png");
            } else {
                imageNumber = ((i - 13) % 9) + 1;
                anime.setImageUrl("/images/Belobog Display_Poster Set_" + imageNumber + ".png");
            }
            anime.setAverageRating(new BigDecimal("0.0"));
            anime.setGenres(randomGenreSet(genres, random));

            animeList.add(animeRepository.save(anime));
        }

        return animeList;
    }

    private List<User> createUsers() {
        List<User> users = new ArrayList<>();

        users.add(createUser("a", "a@example.com", "123456"));

        for (int i = 2; i <= 40; i++) {
            users.add(createUser("user" + i, "user" + i + "@example.com", "password123"));
        }

        return users;
    }

    private User createUser(String username, String email, String password) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        return userRepository.save(user);
    }

    private void createWatchListEntries(List<User> users, List<Anime> animeList, Random random) {
        Set<String> usedPairs = new HashSet<>();

        int ratedEntries = 0;
        int totalEntries = 0;

        while (ratedEntries < 450) {
            User user = users.get(random.nextInt(users.size()));

            // First 70 anime can receive ratings.
            // Last 10 anime will have no ratings.
            Anime anime = animeList.get(random.nextInt(70));

            String key = user.getId() + "-" + anime.getId();

            if (usedPairs.contains(key)) {
                continue;
            }

            createWatchListEntry(user, anime, random, 1 + random.nextInt(10));
            usedPairs.add(key);
            ratedEntries++;
            totalEntries++;
        }

        while (totalEntries < 700) {
            User user = users.get(random.nextInt(users.size()));
            Anime anime = animeList.get(random.nextInt(animeList.size()));

            String key = user.getId() + "-" + anime.getId();

            if (usedPairs.contains(key)) {
                continue;
            }

            createWatchListEntry(user, anime, random, null);
            usedPairs.add(key);
            totalEntries++;
        }
    }

    private void createWatchListEntry(User user, Anime anime, Random random, Integer rating) {
        WatchListEntry entry = new WatchListEntry();
        entry.setUser(user);
        entry.setAnime(anime);
        entry.setStatus(random.nextBoolean() ? WatchStatus.WATCH_LATER : WatchStatus.COMPLETED);
        entry.setPersonalRating(rating);
        watchListEntryRepository.save(entry);
    }

    private void createComments(List<User> users, List<Anime> animeList, Random random) {
        String[] commentTexts = {
                "Really enjoyed this one.",
                "The story was better than I expected.",
                "The animation style looks great.",
                "One of my favorites so far.",
                "The characters are very memorable.",
                "I would recommend this to a friend.",
                "The pacing was a little slow, but still good.",
                "The ending was satisfying.",
                "This deserves more attention.",
                "Great music and atmosphere."
        };

        for (int i = 0; i < 500; i++) {
            Comment comment = new Comment();
            comment.setUser(users.get(random.nextInt(users.size())));
            comment.setAnime(animeList.get(random.nextInt(animeList.size())));
            comment.setContent(commentTexts[random.nextInt(commentTexts.length)]);
            commentRepository.save(comment);
        }
    }

    private Set<Genre> randomGenreSet(List<Genre> genres, Random random) {
        Set<Genre> selected = new HashSet<>();

        while (selected.size() < 3) {
            selected.add(genres.get(random.nextInt(genres.size())));
        }

        return selected;
    }
}