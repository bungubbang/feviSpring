package com.fevi.app;

import com.fevi.app.config.FeviConfig;
import com.fevi.app.config.MongoDbConfig;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.web.SpringBootServletInitializer;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;

/**
 * Created by bungubbang
 * Email: sungyong.jung@sk.com
 * Date: 3/24/14
 */
public class FeviInitializer extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(FeviConfig.class, MongoDbConfig.class);
    }
}
