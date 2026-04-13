package com.example.animelist.dto;

import com.example.animelist.entity.WatchStatus;

public class WatchListRequest {

    private Long animeId;
    private WatchStatus status;
    private Integer personalRating;

    public WatchListRequest() {
    }

    public Long getAnimeId() {
        return animeId;
    }

    public void setAnimeId(Long animeId) {
        this.animeId = animeId;
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
}