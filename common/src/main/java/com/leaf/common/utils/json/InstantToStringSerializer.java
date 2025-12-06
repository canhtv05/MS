package com.leaf.common.utils.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.leaf.common.utils.DateUtils;
import java.io.IOException;
import java.time.Instant;
import java.time.ZoneId;

public class InstantToStringSerializer extends JsonSerializer<Instant> {

    @Override
    public void serialize(Instant value, JsonGenerator gen, SerializerProvider serializers)
        throws IOException {
        gen.writeString(DateUtils.sdf.format(value.atZone(ZoneId.systemDefault())));
    }
}
