package com.example.animelist.dto;

import java.time.LocalDateTime;

public class CommentResponse {

    private Long id;
    private String username;
    private String content;
    private LocalDateTime createdAt;

    public CommentResponse() {
    }

    public CommentResponse(Long id, String username, String content, LocalDateTime createdAt) {
        this.id = id;
        this.username = username;
        this.content = content;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}