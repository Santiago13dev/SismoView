package com.sismoview.adapters.rest.dto;

import com.sismoview.domain.models.Arrival;
import com.sismoview.domain.models.IntensityResult;
import com.sismoview.domain.models.RingSegment;
import java.util.List;
import java.util.Map;

public class SeismicResponse {
  private Map<String, List<RingSegment>> rings;
  private List<Arrival> arrivals;
  private IntensityResult intensity;

  public Map<String, List<RingSegment>> getRings() {
    return rings;
  }

  public List<Arrival> getArrivals() {
    return arrivals;
  }

  public IntensityResult getIntensity() {
    return intensity;
  }

  public void setRings(Map<String, List<RingSegment>> r) {
    this.rings = r;
  }

  public void setArrivals(List<Arrival> a) {
    this.arrivals = a;
  }

  public void setIntensity(IntensityResult i) {
    this.intensity = i;
  }
}
