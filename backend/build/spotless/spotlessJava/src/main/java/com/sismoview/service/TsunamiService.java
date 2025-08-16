package com.sismoview.service;

import com.sismoview.domain.models.LegendItem;
import com.sismoview.domain.models.TsunamiResult;
import com.sismoview.domain.ports.BathymetryPort;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class TsunamiService {
  private final BathymetryPort bathy;

  public TsunamiService(BathymetryPort bathy) {
    this.bathy = bathy;
  }

  public TsunamiResult simulate(double lat, double lon, double magnitude, double depthKm) {
    List<LegendItem> eta = new ArrayList<>();
    eta.add(new LegendItem("0–30 min", "#4aa5ff"));
    eta.add(new LegendItem("30–60 min", "#7fb3ff"));
    eta.add(new LegendItem("1–3 h", "#9de0ff"));
    eta.add(new LegendItem(">3 h", "#ffc266"));

    List<LegendItem> height = new ArrayList<>();
    height.add(new LegendItem("Baja", "#7fb3ff"));
    height.add(new LegendItem("Media", "#ff9f40"));
    height.add(new LegendItem("Alta", "#ff6b6b"));

    return new TsunamiResult("grid-tsunami-demo", eta, height);
  }
}
