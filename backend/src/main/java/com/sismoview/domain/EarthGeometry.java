package com.sismoview.domain;

public final class EarthGeometry {
    private static final double R_KM = 6371.0;

    private EarthGeometry() {}

    public static double toRad(double deg) { return Math.toRadians(deg); }

    public static double haversineKm(double lat1, double lon1, double lat2, double lon2) {
        double phi1 = toRad(lat1), phi2 = toRad(lat2);
        double dPhi = toRad(lat2 - lat1), dLam = toRad(lon2 - lon1);
        double a = Math.sin(dPhi/2)*Math.sin(dPhi/2) +
                   Math.cos(phi1)*Math.cos(phi2)*Math.sin(dLam/2)*Math.sin(dLam/2);
        return 2 * R_KM * Math.asin(Math.sqrt(a));
    }
}
