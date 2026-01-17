package com.example.backend.models;



import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "streaming")
public class StreamingService {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long Id;

    @ManyToOne
    @JoinColumn(name = "movie_id", nullable = false)
    @JsonIgnore
    private Movie movie;

    private String streamingService;

    private String url;

    private String logoURL;

    private String paymentType;

    public StreamingService() {}

    public StreamingService(Long id, Movie movie, String streamingService, String url, String logoURL, String paymentType) {
        this.movie = movie;
        this.streamingService = streamingService;
        this.url = url;
        this.logoURL = logoURL;
        this.paymentType = paymentType;
    }

    public Long getId() { return Id; }
    public Movie getMovie() { return movie; }
    public String getStreamingService() { return streamingService; }
    public String getLogoURL() { return logoURL; }
    public String getURL() { return url; }
    public String getPaymentType() { return paymentType; }


    public void setId(Long Id) {this.Id = Id;}
    public void setMovie(Movie movie) { this.movie = movie; }
    public void setStreamingService(String streamingService) { this.streamingService = streamingService; }
    public void setURL(String url) { this.url = url; }
    public void setLogoURL(String logoURL) { this.logoURL = logoURL; }
    public void setPaymentType(String paymentType) { this.paymentType = paymentType; }

}
