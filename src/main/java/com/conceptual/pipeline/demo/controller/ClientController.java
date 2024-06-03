package com.conceptual.pipeline.demo.controller;

import com.conceptual.pipeline.demo.controller.response.ClientInfoResponse;
import com.conceptual.pipeline.demo.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    @GetMapping("/client/{id}")
    public ClientInfoResponse getClientInfoById(@PathVariable String id) {
        return clientService.getClientInfoById(id);
    }
}
