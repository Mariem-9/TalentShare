package com.talentshare.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.security.SecureRandom;
import java.util.Base64;

@SpringBootApplication
@EnableScheduling
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
		//System.out.println(new BCryptPasswordEncoder().encode("admin123"));
		// 64 bytes = 512 bits. You can also use 32 for 256 bits.
//		byte[] key = new byte[64];
//		SecureRandom secureRandom = new SecureRandom();
//		secureRandom.nextBytes(key);
//
//		String secretKey = Base64.getEncoder().encodeToString(key);
//		System.out.println("Your SECRET_KEY: " + secretKey);
	}


}
