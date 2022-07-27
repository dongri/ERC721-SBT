# Soulbound Token

## deploy
```
npx hardhat run --network goerli scripts/deploy.js

SoulboundToken deployed to: 0xdC542E31d8634549A9754Ec968aD82Ac074e2046
```

## setting
```
npx hardhat console --network goerli

const f = await ethers.getContractFactory("SoulboundToken")

const c = await f.attach("0xdC542E31d8634549A9754Ec968aD82Ac074e2046")

await c.setBaseURI('https://example.com/metadata/')
```
