package com.sismoview.domain.models;

import java.util.List;

public class TsunamiResult {
    private String gridId;
    private List<LegendItem> etaLegend;
    private List<LegendItem> heightLegend;

    public TsunamiResult(){}
    public TsunamiResult(String gridId, List<LegendItem> etaLegend, List<LegendItem> heightLegend) {
        this.gridId = gridId;
        this.etaLegend = etaLegend;
        this.heightLegend = heightLegend;
    }

    public String getGridId(){ return gridId; }
    public List<LegendItem> getEtaLegend(){ return etaLegend; }
    public List<LegendItem> getHeightLegend(){ return heightLegend; }

    public void setGridId(String g){ this.gridId=g; }
    public void setEtaLegend(List<LegendItem> l){ this.etaLegend=l; }
    public void setHeightLegend(List<LegendItem> l){ this.heightLegend=l; }
}
