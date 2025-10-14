package com.example.ModuleTaskMenadger;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})
public class SmartNewsHubApplication {

	public static void main(String[] args) {
		SpringApplication.run(SmartNewsHubApplication.class, args);
	}
	@GetMapping("/")
	public String Hello()
	{
		return "Hello world";
	}
}
