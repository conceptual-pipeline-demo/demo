package com.conceptual.pipeline.demo.controller.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ClientInfoResponse {
    private String id;
    private String name;
    private String gender;
    private String email;
    private String phone;
    private String address;
}
