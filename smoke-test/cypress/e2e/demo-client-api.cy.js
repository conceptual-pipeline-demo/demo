describe(' Demo client api test', () => {
    it('Should retrieve client by id', () => {
        cy.request('GET', '/clients/1')
            .then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.id).to.eq("1")
                expect(response.body.name).to.eq("bob")
                expect(response.body.gender).to.eq("male")
                expect(response.body.email).to.eq("bob@gmail.com")
                expect(response.body.phone).to.eq("123456")
                expect(response.body.address).to.eq("somewhere")
            })
    })
    it('Should create client', () => {
        cy.request(
            'POST',
            '/clients',
            {
                "name" : "smoke-test-name",
                "gender": "Female",
                "email": "test-name@gmail.com",
                "phone": "123456789",
                "address": "address1",
                "age": 18
            })
            .then((response) => {
                expect(response.status).to.eq(200)
            })
    })
})