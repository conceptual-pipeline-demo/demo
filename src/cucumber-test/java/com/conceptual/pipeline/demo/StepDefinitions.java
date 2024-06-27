package com.conceptual.pipeline.demo;

import static io.restassured.RestAssured.given;
import static io.restassured.RestAssured.when;
import static org.hamcrest.Matchers.equalTo;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;

public class StepDefinitions {

    private final RequestSpecification requestSpecification;
    private int id;
    private Response response;

    public StepDefinitions() {
        this.requestSpecification = new RequestSpecBuilder()
                .setBaseUri("http://localhost")
                .setPort(80)
                .build();
    }

    @Given("client id is {int}")
    public void clientIdIs(int id) {
        this.id = id;
    }

    @Then("^client name is \"([^\"]*)\"$")
    public void clientNameIs(String name) {
        this.response.then()
                .statusCode(200)
                .body("name", equalTo(name));
    }

    @When("I get client details")
    public void getClientDetails() {
        response = given()
                .spec(this.requestSpecification)
                .when()
                .get("/clients/{id}", this.id);
    }
}
