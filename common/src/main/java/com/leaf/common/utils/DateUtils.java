package com.leaf.common.utils;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import org.apache.logging.log4j.util.Strings;

public class DateUtils {

    private static final String DATE_FORMAT = "dd-MM-yyyy HH:mm:ss";

    public static final DateTimeFormatter sdf = DateTimeFormatter.ofPattern(DATE_FORMAT);

    public static String dateToString(Instant instant) {
        if (instant == null) {
            return Strings.EMPTY;
        }
        return sdf.format(instant.atZone(ZoneId.systemDefault()));
    }

    public static Instant stringToDate(String dateString) {
        LocalDateTime ldt = LocalDateTime.parse(dateString, sdf);
        return ldt.atZone(ZoneId.systemDefault()).toInstant();
    }

    public static String getCurrentDate() {
        return DateTimeFormatter.ofPattern("ddMMyyyy").format(Instant.now().atZone(ZoneId.systemDefault()));
    }

    public static Instant parseDateOnly(String dateString) {
        LocalDate localDate = LocalDate.parse(dateString);
        return localDate.atStartOfDay(ZoneId.systemDefault()).toInstant();
    }
}
