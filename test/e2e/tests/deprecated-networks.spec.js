const { strict: assert } = require('assert');
const FixtureBuilder = require('../fixture-builder');
const { withFixtures, unlockWallet } = require('../helpers');

describe('Deprecated networks', function () {
  it('User should not find goerli network when clicking on the network selector', async function () {
    await withFixtures(
      {
        dapp: true,
        fixtures: new FixtureBuilder().build(),
        title: this.test.fullTitle(),
      },
      async ({ driver }) => {
        await unlockWallet(driver);

        await driver.clickElement('[data-testid="network-display"]');

        const isGoerliNetworkPresent = await driver.isElementPresent(
          '[data-testid="Goerli"]',
        );

        assert.equal(isGoerliNetworkPresent, false);
      },
    );
  });
});
