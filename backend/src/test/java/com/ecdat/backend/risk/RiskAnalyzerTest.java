package com.ecdat.backend.risk;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class RiskAnalyzerTest {

    private final RiskAnalyzer analyzer = new RiskAnalyzer();

    @Test
    void rsaForDefenseIsCriticalWithMlKem() {
        AssetRisk a = analyzer.analyze("RSA", false, 30, 5, 15, "CryptoDemo.java", 10);
        assertEquals("CRITICAL", a.risk());
        assertEquals("ML-KEM-768", a.recommendation().primary());
    }

    @Test
    void sameRsaForSessionTokensIsLow() {
        AssetRisk a = analyzer.analyze("RSA", false, 1, 1, 15, "CryptoDemo.java", 15);
        assertEquals("LOW", a.risk());
    }

    @Test
    void safeAlgorithmHasNoRecommendation() {
        AssetRisk a = analyzer.analyze("AES-256", false, 30, 5, 15, "CryptoDemo.java", 32);
        assertEquals("SAFE", a.risk());
        assertNull(a.recommendation());
    }
}
