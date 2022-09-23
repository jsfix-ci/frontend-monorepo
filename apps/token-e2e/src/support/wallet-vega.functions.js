const vegaWalletContainer = '[data-testid="vega-wallet"]';
const restConnectorForm = '[data-testid="rest-connector-form"]';
const vegaWalletName = Cypress.env('vegaWalletName');
const vegaWalletNameElement = '[data-testid="wallet-name"]';
const vegaWalletLocation = Cypress.env('vegaWalletLocation');
const vegaWalletPassphrase = Cypress.env('vegaWalletPassphrase');
const vegaWalletPublicKey = Cypress.env('vegaWalletPublicKey');
const vegaWalletCurrencyTitle = '[data-testid="currency-title"]';
const txTimeout = Cypress.env('txTimeout');

Cypress.Commands.add('vega_wallet_import', () => {
  cy.highlight(`Importing Vega Wallet ${vegaWalletName}`);
  cy.exec(`vega wallet init -f --home ${vegaWalletLocation}`);
  cy.exec(
    `vega wallet import -w ${vegaWalletName} --recovery-phrase-file ./src/fixtures/wallet/recovery -p ./src/fixtures/wallet/passphrase --home ${vegaWalletLocation}`,
    { failOnNonZeroExit: false }
  );
  cy.exec(
    `vega wallet service run --network DV --automatic-consent  --home ${vegaWalletLocation}`
  );
  cy.exec(`vega wallet version`)
    .its('stdout')
    .then((output) => {
      cy.log(output);
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
  cy.get(vegaWalletNameElement).should('be.visible');
});

Cypress.Commands.add(
  'vega_wallet_top_up_with_asset',
  function (assetName, amount) {
    cy.highlight(`Topping up vega wallet with ${assetName}, amount: ${amount}`);
    cy.get_asset_information().then((assets) => {
      let asset = assets[assetName];
      for (let i = 0; i < asset.decimals; i++) amount += '0';
      cy.exec(
        `curl -X POST -d '{"amount": "${amount}", "asset": "${asset.id}", "party": "${vegaWalletPublicKey}"}' -u "hedgehogandvega:hiccup" http://localhost:1790/api/v1/mint`
      );
      cy.get(vegaWalletContainer).within(() => {
        cy.get(vegaWalletCurrencyTitle, txTimeout).contains(
          asset.id,
          txTimeout
        );
      });
    });
  }
);

Cypress.Commands.add(
  'vega_wallet_send_asset_to_reward_pool',
  (assetName, amount) => {
    cy.highlight(
      `Sending ${assetName} from Vega Wallet to reward pool amount: ${amount}`
    );
    cy.get_current_epoch().then((currentEpoch) => {
      currentEpoch = parseInt(currentEpoch);
      cy.get_vega_wallet_asset_info().then((assets) => {
        let asset = assets[assetName];
        for (let i = 0; i < asset.decimals; i++) amount += '0';

        cy.exec(
          `vegawallet command send -w ${vegaWalletName} --pubkey ${vegaWalletPublicKey} -p ./src/fixtures/wallet/passphrase --home ${vegaWalletLocation} --network DV '{
        "transfer":{
            "fromAccountType": "ACCOUNT_TYPE_GENERAL",
            "toAccountType": "ACCOUNT_TYPE_GLOBAL_REWARD",
            "to":"0000000000000000000000000000000000000000000000000000000000000000",
            "asset":"${asset.id}",
            "amount":"${amount}",
            "recurring":{ 
              "start_epoch": "${currentEpoch + 1}",
              "end_epoch": "${currentEpoch + 2}",
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
  }
);

Cypress.Commands.add('get_asset_information', () => {
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
      let object = response.reduce(function (assets, entry) {
        assets[entry.name] = {
          rewardPoolBalance: entry.globalRewardPoolAccount.balance,
          id: entry.id,
          decimals: entry.decimals,
        };
        return assets;
      }, {});

      return object;
    });
});

Cypress.Commands.add('get_vega_wallet_asset_info', () => {
  let mutation =
    '{ partiesConnection {edges {node {accountsConnection {edges {node {type asset {name id decimals}}}}}}}}';
  cy.request({
    method: 'POST',
    url: `http://localhost:3028/query`,
    body: {
      query: mutation,
    },
    headers: { 'content-type': 'application/json' },
  })
    .its(`body.data.partiesConnection.edges.1.node.accountsConnection.edges`)
    .then(function (response) {
      let object = [];
      response.forEach((vegaAsset) => {
        let asset = {
          name: vegaAsset.node.asset.name,
          id: vegaAsset.node.asset.id,
          decimals: vegaAsset.node.asset.decimals,
        };
        object[asset.id] = asset;
      });
      return object;
    });
});
