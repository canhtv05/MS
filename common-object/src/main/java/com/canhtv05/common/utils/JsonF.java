package com.canhtv05.common.utils;

import com.canhtv05.common.utils.json.InstantToStringSerializer;
import com.canhtv05.common.utils.json.StringToInstantDeserializer;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.extern.slf4j.Slf4j;

import java.time.Instant;

@Slf4j
public class JsonF {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    static {
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        JavaTimeModule jtm = new JavaTimeModule();
        jtm.addSerializer(Instant.class, new InstantToStringSerializer());
        jtm.addDeserializer(Instant.class, new StringToInstantDeserializer());
        objectMapper.registerModule(jtm);
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    public static String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            log.error("objectToJson exception: ", e);
            return null;
        }
    }

    public static <T> T jsonToObject(String str, Class<T> clazz) {

        try {
            return objectMapper.readValue(str, clazz);
        } catch (Exception e) {
            log.error("jsonToObject exception: ", e);
            return null;
        }
    }

    public static <T> T jsonToObject(String str, TypeReference<T> type) {
        try {
            return objectMapper.readValue(str, type);
        } catch (Exception e) {
            log.error("jsonToObject exception: ", e);
            return null;
        }
    }
}
