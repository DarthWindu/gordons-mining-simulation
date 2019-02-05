# gordons-mining-simulation

## Getting Started

- Clone the repository or (download/extract it)
- Run `npm install`
- Configure `Header::validate` in `block.js`
- Configure `genesisBlock` in `block.js`
- Configure `MEMPOOL` in `mempool.js` (Run `TOOLS` scripts in `index.js` if you do modify them)
- Configure `MY_MINER_NAME` in `block.js`
- Adjust `index.js` logic if necessary
- Run `npm start`

## Principles and Concepts Implemented

- Idempotency
- Consensus Protocols
- Blockchain (basic) --> mining & validation

## Anatomy

### Blockchain::mine

Logic for mining (searching for new block)

### `Block and Header :: Validate`

Validation logic

### `mempool.js`

Initial pool of transactions

### `Blockchain::add`

Logic for adding a block

### `Blockchain::setChain`

Logic for chain consesus