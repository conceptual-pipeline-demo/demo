package com.conceptual.pipeline.demo.controller.common;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
public class ClientPublicAttribute {
    private String name;
    private String gender;
    private String email;
    private String phone;
    private String address;
    private Integer age;
    private String birthday;
}
