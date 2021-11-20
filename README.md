# Challenge 1 NFT projects

The first day I used the assembly script to build an NFT project and deployed the contract. But I missed the time. I hope it will give me a combo bonus.

# How to use it

```bash
yarn build

near deploy steveyu.testnet ./build/debug/singleton.wasm

near call steveyu.testnet mint '{"token_id": "abc", "owner_id": "steveyu.testnet"}' --accountId steveyu.testnet

near view steveyu.testnet nft_token '{"token_id": "abc"}'
```

# Deploy Link

[Click Me](https://explorer.testnet.near.org/transactions/DbVMeMTs5uXKozDezC33jsQ3gAcGbNs4DhWCN8aM4MMB)

