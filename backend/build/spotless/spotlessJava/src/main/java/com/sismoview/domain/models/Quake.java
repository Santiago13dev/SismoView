package com.sismoview.domain.models;

public class Quake {
  private String id;
  private String timeUtc;
  private double lat;
  private double lon;
  private double depthKm;
  private double magnitude;
  private String place;

  public Quake() {}

  public Quake(
      String id,
      String timeUtc,
      double lat,
      double lon,
      double depthKm,
      double magnitude,
      String place) {
    this.id = id;
    this.timeUtc = timeUtc;
    this.lat = lat;
    this.lon = lon;
    this.depthKm = depthKm;
    this.magnitude = magnitude;
    this.place = place;
  }

  public String getId() {
    return id;
  }

  public String getTimeUtc() {
    return timeUtc;
  }

  public double getLat() {
    return lat;
  }

  public double getLon() {
    return lon;
  }

  public double getDepthKm() {
    return depthKm;
  }

  public double getMagnitude() {
    return magnitude;
  }

  public String getPlace() {
    return place;
  }

  public void setId(String s) {
    this.id = s;
  }

  public void setTimeUtc(String s) {
    this.timeUtc = s;
  }

  public void setLat(double v) {
    this.lat = v;
  }

  public void setLon(double v) {
    this.lon = v;
  }

  public void setDepthKm(double v) {
    this.depthKm = v;
  }

  public void setMagnitude(double v) {
    this.magnitude = v;
  }

  public void setPlace(String s) {
    this.place = s;
  }
}
