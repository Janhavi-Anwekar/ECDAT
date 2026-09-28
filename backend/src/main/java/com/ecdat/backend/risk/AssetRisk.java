package com.ecdat.backend.risk;

public record AssetRisk(
        String name,
        String status,
        boolean quantumVulnerable,
        String reason,
        double dataLifetimeYears,
        double migrationYears,
        double yearsToCrqc,
        double moscaMargin,
        String risk,
        Recommendation recommendation,
        String location,
        int line
) { }
