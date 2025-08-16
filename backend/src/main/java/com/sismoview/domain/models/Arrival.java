package com.sismoview.domain.models;

public class Arrival {
    private String place;
    private String type;
    private double minutes;

    public Arrival(){}
    public Arrival(String place, String type, double minutes) {
        this.place = place; this.type = type; this.minutes = minutes;
    }

    public String getPlace(){ return place; }
    public String getType(){ return type; }
    public double getMinutes(){ return minutes; }

    public void setPlace(String p){ this.place = p; }
    public void setType(String t){ this.type = t; }
    public void setMinutes(double m){ this.minutes = m; }
}
