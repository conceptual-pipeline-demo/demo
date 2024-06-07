package com.conceptual.pipeline.demo.controller.response;

import com.conceptual.pipeline.demo.controller.common.ClientPublicAttribute;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
public class ClientInfoResponse extends ClientPublicAttribute {
    private String id;
}
