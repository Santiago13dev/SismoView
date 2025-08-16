package com.sismoview.adapters.usgs;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sismoview.domain.models.Quake;
import com.sismoview.domain.ports.QuakeFeedPort;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class QuakeFeedAdapter implements QuakeFeedPort {
    private final RestClient http = RestClient.create();
    private final ObjectMapper om = new ObjectMapper();

    @Override
    public List<Quake> getLiveQuakes(String window) {
        String feed;
        if ("week".equalsIgnoreCase(window)) {
            feed = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";
        } else {
            feed = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson";
        }
        String body = http.get().uri(feed).retrieve().body(String.class);
        List<Quake> out = new ArrayList<>();
        try {
            JsonNode root = om.readTree(body);
            for (JsonNode f : root.get("features")) {
                JsonNode props = f.get("properties");
                JsonNode geom = f.get("geometry");
                String id = f.get("id").asText();
                double lon = geom.get("coordinates").get(0).asDouble();
                double lat = geom.get("coordinates").get(1).asDouble();
                double depth = geom.get("coordinates").get(2).asDouble();
                double mag = props.get("mag").asDouble();
                long timeMs = props.get("time").asLong();
                String place = props.get("place").asText();
                String timeUtc = DateTimeFormatter.ISO_INSTANT.format(Instant.ofEpochMilli(timeMs).atOffset(ZoneOffset.UTC));
                out.add(new Quake(id, timeUtc, lat, lon, depth, mag, place));
            }
        } catch (Exception e) {
            return out;
        }
        return out;
    }
}
