const vegaWalletContainer = '[data-testid="vega-wallet"]';
const restConnectorForm = '[data-testid="rest-connector-form"]';
const vegaWalletName = Cypress.env('vegaWalletName');
const vegaWalletLocation = Cypress.env('vegaWalletLocation');
const vegaWalletPassphrase = Cypress.env('vegaWalletPassphrase');

Cypress.Commands.add('vega_wallet_import', () => {
  cy.highlight(`Importing Vega Wallet ${vegaWalletName}`);
  cy.exec(`vegawallet init -f --home ${vegaWalletLocation}`);
  cy.exec(
    `vegawallet import -w ${vegaWalletName} --recovery-phrase-file ./src/fixtures/wallet/recovery -p ./src/fixtures/wallet/passphrase --home ~/.vegacapsule/testnet/wallet`,
    { failOnNonZeroExit: false }
  );
  cy.exec(
    `vegawallet service run --network DV --automatic-consent  --home ${vegaWalletLocation}`
  );
  cy.exec(`vegawallet version`);
});

Cypress.Commands.add('vega_wallet_send_tokens_to_reward_pool', (amount) => {
  cy.highlight(
    `Sending Vega from Vega Wallet to reward Pool amount: ${amount}`
  );

  // cy.ensure_specified_unstaked_tokens_are_associated(50000);

  cy.exec(
    `vegawallet command send --wallet capsule_wallet --pubkey 02eceaba4df2bef76ea10caf728d8a099a2aa846cced25737cccaa9812342f65 -p ./src/fixtures/wallet/passphrase --network DV '{
    "transfer":{
        "fromAccountType": "ACCOUNT_TYPE_GENERAL",
        "toAccountType": "ACCOUNT_TYPE_GLOBAL_REWARD",
        "to":"0000000000000000000000000000000000000000000000000000000000000000",
        "asset":"b4f2726571fbe8e33b442dc92ed2d7f0d810e21835b7371a7915a365f07ccd9b",
        "amount":"500000000000000000000",
        "oneOff":{ 
            "deliverOn": 0
        }
    }
  }'`
  );
});

Cypress.Commands.add('vega_wallet_connect', () => {
  cy.highlight('Connecting Vega Wallet');
  cy.get(vegaWalletContainer).within(() => {
    cy.get('button')
      .contains('Connect Vega wallet to use associated $VEGA')
      .should('be.enabled')
      .and('be.visible')
      .click({ force: true });
  });
  cy.get('button').contains('rest provider').click();
  cy.get(restConnectorForm).within(() => {
    cy.get('#wallet').click().type(vegaWalletName);
    cy.get('#passphrase').click().type(vegaWalletPassphrase);
    cy.get('button').contains('Connect').click();
  });
  cy.contains(`${vegaWalletName} key`, { timeout: 20000 }).should('be.visible');
});
