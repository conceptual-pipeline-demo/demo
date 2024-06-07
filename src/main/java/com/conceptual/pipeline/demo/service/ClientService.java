package com.conceptual.pipeline.demo.service;

import com.conceptual.pipeline.demo.controller.request.CreateClientRequest;
import com.conceptual.pipeline.demo.controller.response.ClientInfoResponse;
import com.conceptual.pipeline.demo.repository.ClientRepository;
import com.conceptual.pipeline.demo.repository.entity.ClientEntity;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClientService {
    private final ClientRepository clientRepository;

    public ClientInfoResponse getClientInfoById(String id) {
        Optional<ClientEntity> clientInfoOption = clientRepository.findById(id);
        if (clientInfoOption.isPresent()) {
            ClientEntity client = clientInfoOption.get();
            return ClientInfoResponse.builder()
                    .id(client.getId())
                    .name(client.getName())
                    .gender(client.getGender())
                    .email(client.getEmail())
                    .phone(client.getPhone())
                    .address(client.getAddress())
                    .build();
        }
        return null;
    }

    public String createClient(CreateClientRequest createClientRequest) {
        ClientEntity clientEntity = new ClientEntity();
        clientEntity.setId(UUID.randomUUID().toString().replace("-", ""));
        clientEntity.setName(createClientRequest.getName());
        clientEntity.setGender(createClientRequest.getGender());
        clientEntity.setEmail(createClientRequest.getEmail());
        clientEntity.setPhone(createClientRequest.getPhone());
        clientEntity.setAddress(createClientRequest.getAddress());
        clientEntity.setAge(createClientRequest.getAge());
        ClientEntity saved = clientRepository.save(clientEntity);
        return saved.getId();
    }
}
