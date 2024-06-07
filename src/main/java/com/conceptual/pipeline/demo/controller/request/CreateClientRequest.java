package com.conceptual.pipeline.demo.controller.request;

import com.conceptual.pipeline.demo.controller.common.ClientPublicAttribute;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
public class CreateClientRequest extends ClientPublicAttribute {

}
