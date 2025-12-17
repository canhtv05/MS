package com.leaf.common.utils.json;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.leaf.common.utils.DateUtils;
import java.io.IOException;
import java.time.Instant;

public class StringToInstantDeserializer extends JsonDeserializer<Instant> {

    @Override
    public Instant deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        return DateUtils.stringToDate(p.getValueAsString());
    }
}
