const vegaWalletContainer = '[data-testid="vega-wallet"]';
const restConnectorForm = '[data-testid="rest-connector-form"]';
const vegaWalletName = Cypress.env('vegaWalletName');
const vegaWalletLocation = Cypress.env('vegaWalletLocation');
const vegaWalletPassphrase = Cypress.env('vegaWalletPassphrase');
const vegaWalletPublicKey = Cypress.env('vegaWalletPublicKey');

Cypress.Commands.add('vega_wallet_import', () => {
  cy.highlight(`Importing Vega Wallet ${vegaWalletName}`);
  cy.exec(`vegawallet init -f --home ${vegaWalletLocation}`);
  cy.exec(
    `vegawallet import -w ${vegaWalletName} --recovery-phrase-file ./src/fixtures/wallet/recovery -p ./src/fixtures/wallet/passphrase --home ${vegaWalletLocation}`,
    { failOnNonZeroExit: false }
  );
  cy.exec(
    `vegawallet service run --network DV --automatic-consent  --home ${vegaWalletLocation}`
  );
});

Cypress.Commands.add('vega_wallet_send_to_reward_pool', (name, amount) => {
  cy.highlight(
    `Sending ${name} from Vega Wallet to reward pool amount: ${amount}`
  );
  cy.get_current_epoch().then((currentEpoch) => {
    currentEpoch = parseInt(currentEpoch);
    cy.get_global_reward_pool_info().then((assets) => {
      for (let i = 0; i < assets[name].decimals; i++) amount += '0';

      // b4f2726571fbe8e33b442dc92ed2d7f0d810e21835b7371a7915a365f07ccd9b

      cy.log(`vegawallet command send -w ${vegaWalletName} --pubkey ${vegaWalletPublicKey} -p ./src/fixtures/wallet/passphrase --home ${vegaWalletLocation} --network DV '{
        "transfer":{
            "fromAccountType": "ACCOUNT_TYPE_GENERAL",
            "toAccountType": "ACCOUNT_TYPE_GLOBAL_REWARD",
            "to":"0000000000000000000000000000000000000000000000000000000000000000",
            "asset":"${assets[name].id}",
            "amount":"${amount}",
            "recurring":{ 
              "start_epoch": "${currentEpoch+1}",
              "end_epoch": "${currentEpoch+2}",
              "factor": 1
          }
        }
      }'`);

      cy.exec(
        `vegawallet command send -w ${vegaWalletName} --pubkey ${vegaWalletPublicKey} -p ./src/fixtures/wallet/passphrase --home ${vegaWalletLocation} --network DV '{
        "transfer":{
            "fromAccountType": "ACCOUNT_TYPE_GENERAL",
            "toAccountType": "ACCOUNT_TYPE_GLOBAL_REWARD",
            "to":"0000000000000000000000000000000000000000000000000000000000000000",
            "asset":"${assets[name].id}",
            "amount":"${amount}",
            "recurring":{ 
              "start_epoch": "${currentEpoch+1}",
              "end_epoch": "${currentEpoch+2}",
              "factor": "1"
          }
        }
      }'`
      )
        .its('stdout')
        .then((output) => {
          cy.log(output);
        });
    });
  });
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

Cypress.Commands.add('get_global_reward_pool_info', () => {
  let mutation =
    '{ assets {name id decimals globalRewardPoolAccount {balance}}}';
  cy.request({
    method: 'POST',
    url: `http://localhost:3028/query`,
    body: {
      query: mutation,
    },
    headers: { 'content-type': 'application/json' },
  })
    .its(`body.data.assets`)
    .then(function (response) {
      let object = response.reduce(function (reward_pool, entry) {
        reward_pool[entry.name] = {
          balance: entry.globalRewardPoolAccount.balance,
          id: entry.id,
          decimals: entry.decimals,
        };
        return reward_pool;
      }, {});

      return object;
    });
});

