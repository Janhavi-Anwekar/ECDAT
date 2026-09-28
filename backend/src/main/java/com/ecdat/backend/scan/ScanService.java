package com.ecdat.backend.scan;

import com.ecdat.backend.cbom.CbomComponent;
import com.ecdat.backend.cbom.CbomParser;
import com.ecdat.backend.risk.*;

import java.io.InputStream;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

public class ScanService {

    private final CbomParser parser = new CbomParser();
    private final RiskAnalyzer analyzer = new RiskAnalyzer();
    private final Map<Long, ScanResult> store = new HashMap<>();
    private final AtomicLong idCounter = new AtomicLong(1);

    public ScanResult runScan(InputStream cbomJson, String profileKey, double z) throws Exception {
        Profile profile = ProfileCatalog.get(profileKey);
        List<CbomComponent> components = parser.parse(cbomJson);

        List<AssetRisk> assets = new ArrayList<>();
        for (CbomComponent c : components) {
            boolean isSignature = "signature".equalsIgnoreCase(c.primitive());
            AssetRisk risk = analyzer.analyze(
                    c.name(), isSignature,
                    profile.dataLifetimeYears(), profile.migrationYears(), z,
                    c.location(), c.line()
            );
            assets.add(risk);
        }

        Long id = idCounter.getAndIncrement();
        ScanResult result = new ScanResult(id, profile.name(), assets);
        store.put(id, result);
        return result;
    }

    public ScanResult getScan(Long id) {
        return store.get(id);
    }
}
