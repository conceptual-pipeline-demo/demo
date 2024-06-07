package com.conceptual.pipeline.demo.controller.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CreateClientRequest {
    private String name;
    private String gender;
    private String email;
    private String phone;
    private String address;
    private Integer age;
}
