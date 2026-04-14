package com.example.animelist.controller;

import com.example.animelist.dto.CommentRequest;
import com.example.animelist.dto.CommentResponse;
import com.example.animelist.service.CommentService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/anime/{id}/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping
    public List<CommentResponse> getComments(@PathVariable Long id) {
        return commentService.getCommentsByAnimeId(id);
    }

    @PostMapping
    public CommentResponse createComment(
            @PathVariable Long id,
            @Valid @RequestBody CommentRequest request,
            HttpSession session
    ) {
        return commentService.createComment(id, request, session);
    }
}