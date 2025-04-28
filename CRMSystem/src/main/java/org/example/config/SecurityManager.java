package org.example.config;

import org.example.entity.enums.Privileges;
import org.example.repository.GlobalData;

import java.time.LocalDateTime;
import java.util.Random;

public class SecurityManager {

    public static String createAccessKey(Privileges level){
        Random random = new Random();
        int length = random.nextInt(4) + 6;
        LocalDateTime now = LocalDateTime.now();
        long cId = (long) level.ordinal() * (now.getHour() + now.getMinute() + now.getSecond())
                + length * ((long) level.ordinal() + 4L * now.getYear());
        StringBuilder key = new StringBuilder(String.valueOf(cId));
        for (int i = 0; i < length; i++){
            int ind = random.nextInt(GlobalData.ENGLISH_COMPLEX.size());
            key.append(GlobalData.ENGLISH_COMPLEX.get(ind));
        }
        return key.toString();
    }

    /*
    TODO:
        Реализовать метод шифрования паролей
     */
}
