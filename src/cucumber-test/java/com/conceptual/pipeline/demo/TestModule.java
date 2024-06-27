package com.conceptual.pipeline.demo;

import com.google.inject.AbstractModule;
import com.google.inject.Provides;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.specification.RequestSpecification;

public class TestModule extends AbstractModule {
    @Provides
    RequestSpecification requestSpecification() {
        return new RequestSpecBuilder()
                .setBaseUri(System.getProperty("test.base.url", "http://localhost:80"))
                .build();
    }
}
