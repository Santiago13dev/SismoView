package com.sismoview.domain.ports;

public interface BathymetryPort {
  double depthMeters(double lat, double lon);
}
