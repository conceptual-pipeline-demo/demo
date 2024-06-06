package com.conceptual.pipeline.demo;

import io.restassured.RestAssured;
import org.apache.logging.log4j.util.Strings;
import org.hamcrest.Matchers;
import org.junit.Before;
import org.junit.jupiter.api.Test;


class ClientApiTest {
    private String baseUrl = System.getenv("smokeTestBaseUrl");

    @Before
    public void setUp() {
        if (Strings.isBlank(baseUrl)) {
            throw new Error("smokeTestBaseUrl is not set: " + baseUrl);
        }
    }

    @Test
    void test_client_api() throws Exception {
        RestAssured.given()
                .get(baseUrl + "/client/1")
                .then()
                .statusCode(200)
                .assertThat()
                .body("id", Matchers.equalTo("1"))
                .body("name", Matchers.equalTo("bob"))
                .body("gender", Matchers.equalTo("male"))
                .body("email", Matchers.equalTo("bob@gmail.com"))
                .body("phone", Matchers.equalTo("123456"))
                .body("address", Matchers.equalTo("somewhere"));
    }
}