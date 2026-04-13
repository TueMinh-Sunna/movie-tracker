package com.example.animelist.dto;

import java.math.BigDecimal;
import java.util.List;

public class AnimeDetailResponse {

    private Long id;
    private String title;
    private String synopsis;
    private String imageUrl;
    private BigDecimal averageRating;
    private List<String> genres;

    public AnimeDetailResponse() {
    }

    public AnimeDetailResponse(Long id, String title, String synopsis, String imageUrl, BigDecimal averageRating, List<String> genres) {
        this.id = id;
        this.title = title;
        this.synopsis = synopsis;
        this.imageUrl = imageUrl;
        this.averageRating = averageRating;
        this.genres = genres;
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

    public String getSynopsis() {
        return synopsis;
    }

    public void setSynopsis(String synopsis) {
        this.synopsis = synopsis;
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

    public List<String> getGenres() {
        return genres;
    }

    public void setGenres(List<String> genres) {
        this.genres = genres;
    }
}