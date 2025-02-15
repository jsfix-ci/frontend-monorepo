declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      get_asset_information(): void;
    }
  }
}

export function addGetAssetInformation() {
  // @ts-ignore - ignoring Cypress type error which gets resolved when Cypress uses the command
  Cypress.Commands.add('get_asset_information', () => {
    const mutation =
      '{ assets {name id symbol decimals source{__typename \
        ... on ERC20{contractAddress} \
        ... on BuiltinAsset{maxFaucetAmountMint}} \
        infrastructureFeeAccount{__typename type balance} \
        globalRewardPoolAccount {balance}}}';
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
        // @ts-ignore - ignoring Cypress type error which gets resolved when Cypress uses the command
        const object = response.reduce(function (assets, entry) {
          assets[entry.name] = entry;
          return assets;
        }, {});
        return object;
      });
  });
}
