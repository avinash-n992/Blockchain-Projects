/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const path = require("path");
const fs = require('fs');
const secrets = JSON.parse(
  fs.readFileSync(".secrets").toString().trim()
);

require('@nomiclabs/hardhat-waffle')
module.exports = {
  solidity: "0.8.0",
  networks: {
    kovan: {
      url: `https://kovan.infura.io/v3/${secrets.projectId}`,
      accounts: {mnemonic: `${secrets.mnemonic}`}
    }
  }
}
