package com.conceptual.pipeline.demo;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;

import com.google.inject.Inject;
import io.cucumber.guice.ScenarioScoped;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;

@ScenarioScoped
public class StepDefinitions {

    private final RequestSpecification requestSpecification;
    private int id;
    private Response response;

    @Inject
    public StepDefinitions(RequestSpecification requestSpecification) {
        this.requestSpecification = requestSpecification;
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
