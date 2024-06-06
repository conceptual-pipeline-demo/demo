describe(' Demo client api test', () => {
    it('Should retrieve client by id', () => {
        cy.request('GET', '/client/1')
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
})