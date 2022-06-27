#!/bin/bash
vegawallet init -f --home ~/.vegacapsule/testnet/wallet
vegawallet create --wallet dex -p ./passphrase.txt  --home ~/.vegacapsule/testnet/wallet
vegawallet key generate --wallet dex -p ./passphrase.txt  --home ~/.vegacapsule/testnet/wallet
vegawallet key generate --wallet dex -p ./passphrase.txt  --home ~/.vegacapsule/testnet/wallet
vegawallet service run --network DV --automatic-consent  --home ~/.vegacapsule/testnet/wallet
