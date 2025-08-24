//importaciones necesarias para el proyecto
package com.sismoview.adapters.bathy;

import com.sismoview.domain.ports.BathymetryPort;
import org.springframework.stereotype.Component;

@Component
public class BathymetryMockAdapter implements BathymetryPort {
    @Override
    public double depthMeters(double lat, double lon) {
        return 4000.0;
    }
}
