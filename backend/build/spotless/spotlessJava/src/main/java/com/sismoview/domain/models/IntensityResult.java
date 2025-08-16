package com.sismoview.domain.models;

import java.util.List;

public class IntensityResult {
  private String gridId;
  private List<LegendItem> legend;

  public IntensityResult() {}

  public IntensityResult(String gridId, List<LegendItem> legend) {
    this.gridId = gridId;
    this.legend = legend;
  }

  public String getGridId() {
    return gridId;
  }

  public List<LegendItem> getLegend() {
    return legend;
  }

  public void setGridId(String g) {
    this.gridId = g;
  }

  public void setLegend(List<LegendItem> l) {
    this.legend = l;
  }
}
