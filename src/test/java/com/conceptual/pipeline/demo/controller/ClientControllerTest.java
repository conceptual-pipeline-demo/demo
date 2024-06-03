package com.conceptual.pipeline.demo.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.conceptual.pipeline.demo.repository.ClientRepository;
import com.conceptual.pipeline.demo.repository.entity.ClientEntity;
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
        clientRepository.save(clientEntity);

        // when
        // then
        mockMvc.perform((get("/client/{id}", "1")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.name").value("name"));
    }
}