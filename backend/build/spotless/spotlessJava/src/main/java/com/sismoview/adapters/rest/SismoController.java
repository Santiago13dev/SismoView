package com.sismoview.adapters.rest;

import com.sismoview.adapters.rest.dto.SeismicRequest;
import com.sismoview.adapters.rest.dto.SeismicResponse;
import com.sismoview.adapters.rest.dto.TsunamiResponse;
import com.sismoview.domain.models.Arrival;
import com.sismoview.domain.models.City;
import com.sismoview.domain.models.IntensityResult;
import com.sismoview.domain.models.Quake;
import com.sismoview.domain.models.RingSegment;
import com.sismoview.domain.ports.QuakeFeedPort;
import com.sismoview.service.SeismicService;
import com.sismoview.service.TsunamiService;
import jakarta.validation.Valid;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
public class SismoController {

  private final SeismicService seismic;
  private final TsunamiService tsunami;
  private final QuakeFeedPort quakes;

  public SismoController(SeismicService seismic, TsunamiService tsunami, QuakeFeedPort quakes) {
    this.seismic = seismic;
    this.tsunami = tsunami;
    this.quakes = quakes;
  }

  @PostMapping("/simulate/seismic")
  public SeismicResponse simulateSeismic(@Valid @RequestBody SeismicRequest req) {
    List<RingSegment> at10 = seismic.ringsMinutes(10);
    Map<String, List<RingSegment>> rings = new HashMap<>();
    List<RingSegment> p = new ArrayList<>(), s = new ArrayList<>();
    for (RingSegment r : at10) {
      if ("P".equals(r.getType())) p.add(r);
      else s.add(r);
    }
    rings.put("P", p);
    rings.put("S", s);

    List<City> cities =
        req.getCities() != null ? req.getCities() : List.of(new City("Bogotá", 4.7110, -74.0721));
    List<Arrival> arrivals =
        seismic.arrivalsForCities(req.getLat(), req.getLon(), req.getMagnitude(), cities);
    IntensityResult intensity = seismic.intensityLegend("grid-intensity-demo");

    SeismicResponse res = new SeismicResponse();
    res.setRings(rings);
    res.setArrivals(arrivals);
    res.setIntensity(intensity);
    return res;
  }

  @PostMapping("/simulate/tsunami")
  public TsunamiResponse simulateTsunami(@Valid @RequestBody SeismicRequest req) {
    var t = tsunami.simulate(req.getLat(), req.getLon(), req.getMagnitude(), req.getDepthKm());
    Map<String, Object> eta = new HashMap<>(), rh = new HashMap<>();
    eta.put("gridId", t.getGridId());
    eta.put("legend", t.getEtaLegend());
    rh.put("gridId", t.getGridId());
    rh.put("legend", t.getHeightLegend());
    TsunamiResponse res = new TsunamiResponse();
    res.setEta(eta);
    res.setRelativeHeight(rh);
    return res;
  }

  @GetMapping("/live/earthquakes")
  public List<Quake> live(@RequestParam(defaultValue = "day") String window) {
    return quakes.getLiveQuakes(window);
  }
}
