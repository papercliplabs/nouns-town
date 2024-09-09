## Nouns Town Contracts 

Contracts specific to Noun Town Ticketing built using [Foundry](https://book.getfoundry.sh). 

## Deployments

### Mainnet

| Name                   | Address |
| ---------------------- | ------- |
| Nouns Town 2024 Ticket | TODO    |

### Sepolia

| Name                   | Address |
| ---------------------- | ------- |
| Nouns Town 2024 Ticket | TODO    |

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
