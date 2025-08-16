package com.sismoview.domain.models;

public class LegendItem {
    private String label;
    private String colorHex;

    public LegendItem(){}
    public LegendItem(String label, String colorHex){ this.label = label; this.colorHex = colorHex; }

    public String getLabel(){ return label; }
    public String getColorHex(){ return colorHex; }

    public void setLabel(String l){ this.label=l; }
    public void setColorHex(String c){ this.colorHex=c; }
}
