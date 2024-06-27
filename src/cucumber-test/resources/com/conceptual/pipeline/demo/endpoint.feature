Feature: Client

  Scenario: client id with name
    Given client id is 1
    When I get client details
    Then client name is "bob"