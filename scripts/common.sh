near deploy steveyu.testnet ./build/debug/singleton.wasm
near call steveyu.testnet mint '{"token_id": "edawcdfr", "owner_id": "steveyu.testnet"}' --accountId steveyu.testnet
near view steveyu.testnet nft_token '{"token_id": "edawcdfr"}'