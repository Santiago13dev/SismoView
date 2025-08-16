package com.sismoview.service;

import com.sismoview.domain.EarthGeometry;
import com.sismoview.domain.models.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class SeismicService {
  private static final double VP = 6.0; // km/s
  private static final double VS = 3.5; // km/s

  public List<RingSegment> ringsMinutes(double minutes) {
    double t = minutes;
    double rP = VP * 60.0 * t;
    double rS = VS * 60.0 * t;
    return Arrays.asList(new RingSegment("P", t, rP), new RingSegment("S", t, rS));
  }

  public List<Arrival> arrivalsForCities(
      double srcLat, double srcLon, double magnitude, List<City> cities) {
    List<Arrival> out = new ArrayList<>();
    for (City c : cities) {
      double d = EarthGeometry.haversineKm(srcLat, srcLon, c.getLat(), c.getLon());
      double tP = d / (VP * 60.0);
      double tS = d / (VS * 60.0);
      out.add(new Arrival(c.getName(), "P", tP));
      out.add(new Arrival(c.getName(), "S", tS));
    }
    return out;
  }

  public IntensityResult intensityLegend(String gridId) {
    List<LegendItem> legend =
        Arrays.asList(
            new LegendItem("1 Muy débil", "#4aa5ff"),
            new LegendItem("2 Débil", "#7fb3ff"),
            new LegendItem("3 Ligero", "#9de0ff"),
            new LegendItem("4 Moderado", "#ffc266"),
            new LegendItem("5 Fuerte", "#ff9f40"),
            new LegendItem("6 Muy fuerte", "#ff6b6b"),
            new LegendItem("7 Severo", "#d64562"),
            new LegendItem("8 Extremo", "#ad2e5c"));
    return new IntensityResult(gridId, legend);
  }
}
