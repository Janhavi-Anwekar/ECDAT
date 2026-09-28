package com.ecdat.backend.risk;

import java.util.Map;

public class ProfileCatalog {

    private static final Map<String, Profile> PROFILES = Map.of(
            "DEFENSE",    new Profile("Defense", 50, 5),
            "GOVERNMENT", new Profile("Government", 30, 5),
            "HEALTHCARE", new Profile("Healthcare", 40, 4),
            "FINANCIAL",  new Profile("Financial", 20, 3),
            "GENERIC",    new Profile("Generic", 10, 2)
    );

    public static Profile get(String key) {
        Profile p = PROFILES.get(key.toUpperCase());
        if (p == null) throw new IllegalArgumentException("Unknown profile: " + key);
        return p;
    }
}
