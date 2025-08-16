package com.sismoview.domain.models;

public class RingSegment {
  private String type;
  private double minutes;
  private double radiusKm;

  public RingSegment() {}

  public RingSegment(String type, double minutes, double radiusKm) {
    this.type = type;
    this.minutes = minutes;
    this.radiusKm = radiusKm;
  }

  public String getType() {
    return type;
  }

  public double getMinutes() {
    return minutes;
  }

  public double getRadiusKm() {
    return radiusKm;
  }

  public void setType(String t) {
    this.type = t;
  }

  public void setMinutes(double m) {
    this.minutes = m;
  }

  public void setRadiusKm(double r) {
    this.radiusKm = r;
  }
}
