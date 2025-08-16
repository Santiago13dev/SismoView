package com.sismoview.adapters.rest.dto;

import com.sismoview.domain.models.City;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class SeismicRequest {
    @NotNull private Double lat;
    @NotNull private Double lon;
    @NotNull @Min(0) private Double depthKm;
    @NotNull @Min(0) @Max(10) private Double magnitude;
    private List<City> cities;

    public Double getLat(){ return lat; }
    public Double getLon(){ return lon; }
    public Double getDepthKm(){ return depthKm; }
    public Double getMagnitude(){ return magnitude; }
    public List<City> getCities(){ return cities; }

    public void setLat(Double v){ this.lat=v; }
    public void setLon(Double v){ this.lon=v; }
    public void setDepthKm(Double v){ this.depthKm=v; }
    public void setMagnitude(Double v){ this.magnitude=v; }
    public void setCities(List<City> c){ this.cities=c; }
}
