/// <reference types="cypress" />
const stakeNextEpochValue = '[data-testid="stake-next-epoch"]';
const stakeThisEpochValue = '[data-testid="stake-this-epoch"]';
const vegaWalletUnstakedBalance =
  '[data-testid="vega-wallet-balance-unstaked"]';
const vegaWalletStakedBalances =
  '[data-testid="vega-wallet-balance-staked-validators"]';
const partValidatorId = '…';
const txTimeout = Cypress.env('txTimeout');
const epochTimeout = Cypress.env('epochTimeout');

context('Rewards Tab - with eth and vega wallets connected', function () {
  before('visit staking tab and connect vega wallet', function () {
    cy.vega_wallet_import();
    cy.visit('/');
    cy.verify_page_header('The $VEGA token');
    cy.vega_wallet_connect();
    cy.ethereum_wallet_connect();
    cy.navigate_to('staking');
    cy.wait_for_spinner();
    cy.vega_wallet_send_to_reward_pool('Vega','50');
    // cy.wait(5000) // temporary

    cy.get_global_reward_pool_info().then((rewards) => {
      cy.wrap(parseInt(rewards['Vega'].balance)).as('vega_reward_pool_balance');
    })
  });

  describe('Eth wallet - contains VEGA tokens', function () {
    before('Check network has enough vega tokens in reward pool - to test', function () {
        assert.isAtLeast(this.vega_reward_pool_balance, 0.00001,
            'Asserting that the Vega reward pool has at least 1 token'
        );
    })

    beforeEach(
      'teardown wallet & drill into a specific validator',
      function () {
        cy.vega_wallet_teardown();
        cy.navigate_to('staking');
        cy.wait_for_spinner();
      }
    );

    it('Able to stake against a validator - using vega from wallet', function () {
      cy.staking_page_associate_tokens('10000');

      cy.get(vegaWalletUnstakedBalance, txTimeout).should(
        'contain',
        3.0,
        txTimeout
      );

    //   cy.get(ethWalletTotalAssociatedBalance, txTimeout)
    //     .contains('3.0', txTimeout)
    //     .should('be.visible');

    //   cy.get(ethWalletAssociatedBalances, txTimeout)
    //     .contains(vegaWalletPublicKeyShort, txTimeout)
    //     .parent()
    //     .should('contain', 3.0, txTimeout);

      cy.get('button').contains('Select a validator to nominate').click();

      cy.click_on_validator_from_list(0);

      cy.staking_validator_page_add_stake('10000');

      cy.get(vegaWalletUnstakedBalance, txTimeout).should(
        'contain',
        '0.0',
        txTimeout
      );

      cy.get(vegaWalletStakedBalances, txTimeout)
        .should('contain', 10000.0, txTimeout)
        .and('contain', partValidatorId);

      cy.get(stakeNextEpochValue, epochTimeout)
        .contains(2.0, epochTimeout)
        .should('be.visible');

      cy.get(stakeThisEpochValue, epochTimeout)
        .contains(2.0, epochTimeout)
        .should('be.visible');

      cy.navigate_to('staking');

      cy.validate_validator_list_total_stake_and_share('0', '', '2.00', '100%');
    });

    // after(
    //   'teardown wallet so state/results dont bleed into other test suites',
    //   function () {
    //     cy.vega_wallet_teardown();
    //   }
    // );

  });
});
