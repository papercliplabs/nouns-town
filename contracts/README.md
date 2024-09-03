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
# TODO
# To load the variables in the .env file
source .env

# To deploy and verify our contract
forge script --chain 84532 script/EventTicket.s.sol:EventTicketDeploy --rpc-url $BASE_SEPOLIA_RPC_URL --broadcast --verify -vvvv
```
