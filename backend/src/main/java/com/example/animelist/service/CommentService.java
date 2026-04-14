package com.example.animelist.service;

import com.example.animelist.dto.CommentRequest;
import com.example.animelist.dto.CommentResponse;
import com.example.animelist.entity.Anime;
import com.example.animelist.entity.Comment;
import com.example.animelist.entity.User;
import com.example.animelist.repository.AnimeRepository;
import com.example.animelist.repository.CommentRepository;
import com.example.animelist.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@Service
public class CommentService {

    private static final String SESSION_USER_ID = "userId";

    private final CommentRepository commentRepository;
    private final AnimeRepository animeRepository;
    private final UserRepository userRepository;

    public CommentService(
            CommentRepository commentRepository,
            AnimeRepository animeRepository,
            UserRepository userRepository
    ) {
        this.commentRepository = commentRepository;
        this.animeRepository = animeRepository;
        this.userRepository = userRepository;
    }

    public List<CommentResponse> getCommentsByAnimeId(Long animeId) {
        // Check anime exists first
        if (!animeRepository.existsById(animeId)) {
            throw new ResponseStatusException(NOT_FOUND, "Anime not found");
        }

        return commentRepository.findByAnimeIdOrderByCreatedAtDesc(animeId)
                .stream()
                .map(this::toCommentResponse)
                .toList();
    }

    public CommentResponse createComment(Long animeId, CommentRequest request, HttpSession session) {
        Object userIdObject = session.getAttribute(SESSION_USER_ID);

        if (userIdObject == null) {
            throw new ResponseStatusException(UNAUTHORIZED, "Not logged in");
        }

        Long userId = (Long) userIdObject;

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(UNAUTHORIZED, "User not found"));

        Anime anime = animeRepository.findById(animeId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Anime not found"));

        String content = request.getContent().trim();

        Comment comment = new Comment();
        comment.setUser(user);
        comment.setAnime(anime);
        comment.setContent(content);

        Comment savedComment = commentRepository.save(comment);

        return toCommentResponse(savedComment);
    }

    private CommentResponse toCommentResponse(Comment comment) {
        return new CommentResponse(
                comment.getId(),
                comment.getUser().getUsername(),
                comment.getContent(),
                comment.getCreatedAt()
        );
    }
}