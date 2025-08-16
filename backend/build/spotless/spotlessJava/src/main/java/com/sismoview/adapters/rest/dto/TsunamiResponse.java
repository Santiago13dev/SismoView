package com.sismoview.adapters.rest.dto;

import java.util.Map;

public class TsunamiResponse {
  private Map<String, Object> eta;
  private Map<String, Object> relativeHeight;

  public Map<String, Object> getEta() {
    return eta;
  }

  public Map<String, Object> getRelativeHeight() {
    return relativeHeight;
  }

  public void setEta(Map<String, Object> m) {
    this.eta = m;
  }

  public void setRelativeHeight(Map<String, Object> m) {
    this.relativeHeight = m;
  }
}
