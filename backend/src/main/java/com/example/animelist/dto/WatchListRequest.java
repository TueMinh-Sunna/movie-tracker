package com.example.animelist.dto;

import com.example.animelist.entity.WatchStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class WatchListRequest {

    private Long animeId;

    @NotNull(message = "Status is required")
    private WatchStatus status;

    @Min(value = 1, message = "Personal rating must be between 1 and 10")
    @Max(value = 10, message = "Personal rating must be between 1 and 10")
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