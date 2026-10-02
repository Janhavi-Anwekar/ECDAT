package com.ecdat.backend.cbom;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

public class CbomParser {

    public List<CbomComponent> parse(InputStream cbomJson) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(cbomJson);
        List<CbomComponent> result = new ArrayList<>();

        for (JsonNode component : root.path("components")) {
            String assetType = component.path("cryptoProperties").path("assetType").asString("");
            if(!"algorithm".equals(assetType)){
                continue;
            }
            String name = component.path("name").asString();
            String primitive = component
                    .path("cryptoProperties")
                    .path("algorithmProperties")
                    .path("primitive")
                    .asString("");

            JsonNode occurrence = component.path("evidence").path("occurrences").path(0);
            String location = occurrence.path("location").asString("unknown");
            int line = occurrence.path("line").asInt(0);

            result.add(new CbomComponent(name, primitive,location,line));
        }
        return result;
    }
}