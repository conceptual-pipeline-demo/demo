package com.conceptual.pipeline.demo.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.conceptual.pipeline.demo.controller.request.CreateClientRequest;
import com.conceptual.pipeline.demo.repository.ClientRepository;
import com.conceptual.pipeline.demo.repository.entity.ClientEntity;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestPropertySource(properties = {"spring.jpa.hibernate.ddl-auto=update"})
class ClientControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ClientRepository clientRepository;

    @Test
    void should_get_client_info_when_given_id_is_exist() throws Exception {
        // given
        ClientEntity clientEntity = new ClientEntity();
        clientEntity.setId("1");
        clientEntity.setName("name");
        clientEntity.setGender("male");
        clientEntity.setPhone("123456");
        clientEntity.setEmail("123@gmail.com");
        clientEntity.setAddress("somewhere");
        clientEntity.setAge(20);
        clientEntity.setBirthday("1990-01-01");
        clientRepository.save(clientEntity);

        // when
        // then
        mockMvc.perform((get("/clients/{id}", "1")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.name").value("name"));
    }

    @Test
    void should_create_client_info_successfully() throws Exception {
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
        ObjectMapper objectMapper = new ObjectMapper();

        // when
        // then
        mockMvc.perform(post("/clients")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }
}