package com.sismoview.domain.models;

public class City {
  private String name;
  private double lat;
  private double lon;

  public City() {}

  public City(String name, double lat, double lon) {
    this.name = name;
    this.lat = lat;
    this.lon = lon;
  }

  public String getName() {
    return name;
  }

  public double getLat() {
    return lat;
  }

  public double getLon() {
    return lon;
  }

  public void setName(String name) {
    this.name = name;
  }

  public void setLat(double lat) {
    this.lat = lat;
  }

  public void setLon(double lon) {
    this.lon = lon;
  }
}
