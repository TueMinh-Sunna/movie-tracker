package com.example.animelist.dto;

import java.math.BigDecimal;

public class AnimeSummaryResponse {

    private Long id;
    private String title;
    private String imageUrl;
    private BigDecimal averageRating;

    public AnimeSummaryResponse() {
    }

    public AnimeSummaryResponse(Long id, String title, String imageUrl, BigDecimal averageRating) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.averageRating = averageRating;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public BigDecimal getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(BigDecimal averageRating) {
        this.averageRating = averageRating;
    }
}