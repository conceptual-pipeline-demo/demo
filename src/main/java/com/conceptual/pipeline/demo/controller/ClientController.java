package com.conceptual.pipeline.demo.controller;

import com.conceptual.pipeline.demo.controller.request.CreateClientRequest;
import com.conceptual.pipeline.demo.controller.response.ClientInfoResponse;
import com.conceptual.pipeline.demo.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    @GetMapping("/clients/{id}")
    public ClientInfoResponse getClientInfoById(@PathVariable String id) {
        return clientService.getClientInfoById(id);
    }

    @PostMapping("/clients")
    public String createClient(@RequestBody CreateClientRequest createClientRequest) {
        return clientService.createClient(createClientRequest);
    }
}
