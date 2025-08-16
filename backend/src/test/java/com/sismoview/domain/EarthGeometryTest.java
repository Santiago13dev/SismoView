package com.sismoview.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

public class EarthGeometryTest {
    @Test
    void haversineOneDegreeAtEquator() {
        double d = EarthGeometry.haversineKm(0,0,0,1);
        // ~111.19 km
        assertEquals(111.2, d, 1.0);
    }
}
