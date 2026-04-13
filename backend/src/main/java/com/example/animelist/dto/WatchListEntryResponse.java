package com.example.animelist.dto;

import com.example.animelist.entity.WatchStatus;

import java.time.LocalDateTime;

public class WatchListEntryResponse {

    private Long animeId;
    private String title;
    private String imageUrl;
    private WatchStatus status;
    private Integer personalRating;
    private LocalDateTime updatedAt;

    public WatchListEntryResponse() {
    }

    public WatchListEntryResponse(Long animeId, String title, String imageUrl, WatchStatus status, Integer personalRating, LocalDateTime updatedAt) {
        this.animeId = animeId;
        this.title = title;
        this.imageUrl = imageUrl;
        this.status = status;
        this.personalRating = personalRating;
        this.updatedAt = updatedAt;
    }

    public Long getAnimeId() {
        return animeId;
    }

    public void setAnimeId(Long animeId) {
        this.animeId = animeId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public WatchStatus getStatus() {
        return status;
    }

    public void setStatus(WatchStatus status) {
        this.status = status;
    }

    public Integer getPersonalRating() {
        return personalRating;
    }

    public void setPersonalRating(Integer personalRating) {
        this.personalRating = personalRating;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}