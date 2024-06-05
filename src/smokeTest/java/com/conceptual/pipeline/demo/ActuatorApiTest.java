package com.conceptual.pipeline.demo;

import io.restassured.RestAssured;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;


class ActuatorApiTest {

    @Test
    void test_actuator_health_api() throws Exception {
        RestAssured.given()
                .get("http://localhost:9090/actuator/health")
                .then()
                .statusCode(200)
                .assertThat()
                .body("status", Matchers.equalTo("something"));
    }
}