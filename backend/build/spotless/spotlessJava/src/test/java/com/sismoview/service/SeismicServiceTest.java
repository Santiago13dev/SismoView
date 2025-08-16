package com.sismoview.service;

import static org.junit.jupiter.api.Assertions.assertTrue;

import com.sismoview.domain.models.City;
import java.util.List;
import org.junit.jupiter.api.Test;

public class SeismicServiceTest {
  @Test
  void arrivalsPositiveTimes() {
    SeismicService s = new SeismicService();
    var arr = s.arrivalsForCities(0, 0, 6.0, List.of(new City("Bogotá", 4.7110, -74.0721)));
    assertTrue(arr.stream().allMatch(a -> a.getMinutes() > 0.0));
  }
}
