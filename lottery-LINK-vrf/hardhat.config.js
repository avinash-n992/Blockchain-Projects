/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const path = require("path");
const fs = require('fs');
const secrets = JSON.parse(
  fs.readFileSync(".secrets").toString().trim()
);

 // kovan endpoint - https://kovan.infura.io/v3/b886e6b904fe4d58bfaa98f07c9b6dd7
require('@nomiclabs/hardhat-waffle')
module.exports = {
  solidity: "0.8.0",
  networks: {
    kovan: {
      url: `https://eth-ropsten.alchemyapi.io/v2/${secrets.projectId}`,
      accounts: {mnemonic: `${secrets.mnemonic}`}
    }
  }
}
