package com.fevi.app.config;

import com.mongodb.Mongo;
import com.mongodb.MongoClient;
import com.mongodb.MongoURI;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoConfiguration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

/**
 * Created by bungubbang
 * Email: sungyong.jung@sk.com
 * Date: 3/9/14
 */
@Configuration
@EnableMongoRepositories(basePackages = "com.fevi.app.repository")
public class MongoDbConfig extends AbstractMongoConfiguration {
    @Override
    protected String getDatabaseName() {
        return "db";
    }

    @Override
    public Mongo mongo() throws Exception {
        return new MongoClient("127.0.0.1");
    }

    @Override
    protected String getMappingBasePackage() {
        return "com.fevi.app.domain";
    }
}
