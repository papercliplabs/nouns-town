## Nouns Town Contracts 

Contracts specific to Noun Town Ticketing built using [Foundry](https://book.getfoundry.sh). 

## Deployments

| Name                     | Base                                       | Base Sepolia                               |
| ------------------------ | ------------------------------------------ | ------------------------------------------ |
| Nouns Town 2024 Ticket   | 0x04Db84527ecC5414B7FaDaeBE03fcADD978Ef5dF | 0x64c1aF051aDB77C4091C073eFdDc86d140131fde |
| Nouns Town 2024 Redeemer | 0x172E9C1b8521DEa96ea356132b0f12E0e4e12b40 | 0x06d7d31cE120e814fB0042C5ed3dfF949Bc33081 |


## Development

Build
```bash
forge build
```

Test
```bash
forge test
```

Gas Report
```bash
forge test --gas-report
```

Test coverage summary
```bash
forge coverage --report summary
```

Test coverage lcov
```bash
forge coverage --report lcov
```

Deploy
```bash
# To load the variables in the .env file
source .env

# To deploy and verify our contract on Base Sepolia
forge script --chain 84532 script/EventTicket.s.sol:EventTicketDeployTestnet --rpc-url $BASE_SEPOLIA_RPC_URL --broadcast --verify -vvvv

# To deploy and verify our contract on Base
forge script --chain 8453 script/EventTicket.s.sol:EventTicketDeployBase --rpc-url $BASE_RPC_URL --etherscan-api-key $ETHERSCAN_API_KEY --broadcast --verify -vvvv
```

Verify (if failed during deployment...)
```bash
forge verify-contract <CONTRACT_ADDRESS> src/EventTicket.sol:EventTicket \
--chain-id 8453 \
--etherscan-api-key $ETHERSCAN_API_KEY \
--rpc-url $BASE_RPC_URL \
--watch
```
