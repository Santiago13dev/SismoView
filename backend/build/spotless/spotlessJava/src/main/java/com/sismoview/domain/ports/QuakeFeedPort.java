package com.sismoview.domain.ports;

import com.sismoview.domain.models.Quake;
import java.util.List;

public interface QuakeFeedPort {
  List<Quake> getLiveQuakes(String window); // "day" | "week"
}
