package com.java.health.util;

import java.security.SecureRandom;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class PasswordGenerator {
    private static final String CHAR_LOWER = "abcdefghijklmnopqrstuvwxyz";
    private static final String CHAR_UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String NUMBER = "0123456789";
    private static final String OTHER_CHAR = "!@#$%&*()_+-=";
    private static final String PASSWORD_ALLOW = CHAR_LOWER + CHAR_UPPER + NUMBER + OTHER_CHAR;

    private static final SecureRandom random = new SecureRandom();

    public static String generateSecurePassword() {
        List<Character> charList = random.ints(3, 0, CHAR_LOWER.length()).mapToObj(CHAR_LOWER::charAt).collect(Collectors.toList());
        charList.addAll(random.ints(3, 0, CHAR_UPPER.length()).mapToObj(CHAR_UPPER::charAt).toList());
        charList.addAll(random.ints(3, 0, NUMBER.length()).mapToObj(NUMBER::charAt).toList());
        charList.addAll(random.ints(3, 0, OTHER_CHAR.length()).mapToObj(OTHER_CHAR::charAt).toList());

        Collections.shuffle(charList);
        return charList.stream().map(String::valueOf).collect(Collectors.joining());
    }
}