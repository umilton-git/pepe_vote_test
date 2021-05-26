const HDWalletProvider = require('@Truffle/hdwallet-provider');
const mnemonic = "payment nephew pledge strategy blush clump online undo word predict fitness chimney";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    binanceTestnet: {
      provider: () => new HDWalletProvider(
        mnemonic,
        "https://data-seed-prebsc-2-s1.binance.org:8545/"
      ),
      network_id: "97",
      skipDryRun: true
    }
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: "0.6.12",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
