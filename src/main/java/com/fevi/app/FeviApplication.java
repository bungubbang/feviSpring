package com.fevi.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.thymeleaf.ThymeleafAutoConfiguration;
import org.springframework.boot.autoconfigure.web.WebMvcAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

/**
 * Created by bungubbang
 * Email: sungyong.jung@sk.com
 * Date: 3/6/14
 */
@Configuration
@ComponentScan(basePackages = "com.fevi.app")
@EnableAutoConfiguration
public class FeviApplication {

    public static void main(String[] args) throws Exception {
        SpringApplication.run(FeviApplication.class, args);
    }
}
