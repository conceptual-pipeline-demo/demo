package com.conceptual.pipeline.demo.service;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

import com.conceptual.pipeline.demo.controller.request.CreateClientRequest;
import com.conceptual.pipeline.demo.controller.response.ClientInfoResponse;
import com.conceptual.pipeline.demo.repository.ClientRepository;
import com.conceptual.pipeline.demo.repository.entity.ClientEntity;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ClientServiceTest {
    @InjectMocks
    private ClientService clientService;
    @Mock
    private ClientRepository clientRepository;

    @Test
    void should_return_client_info_when_given_id_is_exist() {
        // given
        String id = "existId";
        ClientEntity clientEntity = generateClientEntity(id);
        given(clientRepository.findById(id)).willReturn(Optional.of(clientEntity));

        // when
        ClientInfoResponse clientInfo = clientService.getClientInfoById(id);

        // then
        assertNotNull(clientInfo);
    }

    @Test
    void should_return_null_when_given_id_is_nonexistent() {
        // given
        String id = "nonExistId";
        given(clientRepository.findById(id)).willReturn(Optional.empty());

        // when
        ClientInfoResponse clientInfo = clientService.getClientInfoById(id);

        // then
        assertNull(clientInfo);
    }

    @Test
    void should_return_id_when_create_client_successfully() {
        // given
        CreateClientRequest request = CreateClientRequest.builder()
                .name("name")
                .gender("male")
                .phone("123456")
                .email("123@gmail.com")
                .address("somewhere")
                .age(20)
                .birthday("1990-01-01")
                .build();
        ClientEntity clientEntity = generateClientEntity("id");
        given(clientRepository.save(any())).willReturn(clientEntity);

        // when
        String clientId = clientService.createClient(request);

        // then
        assertNotNull(clientId);
    }

    private ClientEntity generateClientEntity(String id) {
        ClientEntity clientEntity = new ClientEntity();
        clientEntity.setId(id);
        clientEntity.setName("name");
        clientEntity.setGender("male");
        clientEntity.setPhone("123456");
        clientEntity.setEmail("123@gmail.com");
        clientEntity.setAddress("somewhere");
        clientEntity.setAge(20);
        clientEntity.setBirthday("1990-01-01");
        return clientEntity;
    }
}