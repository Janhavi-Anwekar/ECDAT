package com.ecdat.backend.risk;

public class RiskAnalyzer {

    private final RecommendationEngine recommender = new RecommendationEngine();

    public AssetRisk analyze(String name, boolean isSignature,
                             double x, double y, double z,
                             String location, int line) {
        Classification c = AlgorithmClassifier.classify(name);
        RiskResult r = MoscaCalculator.assess(x, y, z, c.isVulnerable());
        Recommendation rec = recommender.recommend(name, isSignature);

        // Already-broken algorithms are urgent regardless of quantum timing
        String level = (c.status() == QuantumStatus.BROKEN) ? "CRITICAL" : r.level();

        return new AssetRisk(name, c.status().name(), c.isVulnerable(), c.reason(),
                x, y, z, r.margin(), level, rec, location, line);
    }
}
