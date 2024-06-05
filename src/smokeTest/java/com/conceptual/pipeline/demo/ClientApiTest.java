package com.conceptual.pipeline.demo;

import io.restassured.RestAssured;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;


class ClientApiTest {

    @Test
    void test_client_api() throws Exception {
        RestAssured.given()
                .get("http://localhost:9090/client/1")
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