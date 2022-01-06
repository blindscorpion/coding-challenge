# TokenAvgPrice

This contract allows users to calculate the average price for a token over a given period of time. The price is set daily by the owner.

## Install all dependencies

```
pnpm install
```

## Run tests

```
npx hardhat test
```

## Running a local blockchain node

```
npx hardhat node
```

## Deploy contracts on localhost network

```
npx hardhat run --network localhost scripts/deployV1.ts
```

## Upgrade to Version 2 (Only owner can set daily price)
```
npx hardhat run --network localhost scripts/upgradeV2.ts
```

## Upgrade to Version 3 (Price can only be set for the current day)
```
npx hardhat run --network localhost scripts/upgradeV3.ts
```