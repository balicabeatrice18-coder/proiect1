describe('Register page', () => {
   

    it('inregistrarea unui utilizator nou - happy path', () => {
        cy.visit('/register');

        cy.get('#username').type('testuser31.03');
        cy.get('#email').type('testuser31.03@example.com');
        cy.get('#password').type('TestPassword123');
        cy.get('#confirm-password').type('TestPassword123');
        cy.get('#age').type('30');

        cy.contains('button', 'Înregistrează-te').click();

        cy.location('pathname').should('eq', '/register-success.html');
        cy.contains('h1', 'Înregistrare reușită').should('be.visible');
    });
});