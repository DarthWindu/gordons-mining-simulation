
var sha256 = require('js-sha256');
var hash = require('js-sha256').create();
var hashTransMap = require('./mempool').hashTransMap;
const getFee = require('./mempool').getFee;

const MY_MINER_NAME = "pujitm";

class Blockchain {

    constructor() {
        this.chain = [];
        this.mempool = [];
    }


    setChain(blocks, newMempool) {
        let validChain = true;

        blocks.map((block) => {
            if (!block.validate()) {
                validChain = false;
            }
        });

        if (validChain) {
            this.chain = blocks;
            this.mempool == newMempool;
        }
    }

    initMempool(kMempool) {
        this.mempool = kMempool;
        this.mempool.sort((a,b) => {
            // Order in descending order of fees (highest fees first)
            let aFee = getFee(a);
            let bFee = getFee(b);
            return bFee-aFee;
        })
    }

    blockNumberIsValid(block_number) {
        if (this.chain.length == 0) {
            // TODO: CHANGE TO MAKE SURE BLOCK # IS 0
            return true;
        }
        return block_number == this.chain[this.chain.length-1].header.block_number + 1;
    }

    add(block) {
        if (block.validate()) {
            if (this.blockNumberIsValid(block.header.block_number)) {
                if (this.transactionIsInPool(block.transaction)) {
                    this.chain.push(block);
                    this.removeFromMempool(block.transaction);
                    return true;
                } else {
                    console.log(`Attempted to add invalid block: This transaction [${block.transaction}] is no longer in the pool!`);
                    console.log(`Mempool: ${this.mempool}`);
                }
            } else {
                console.log('Attempted to add block with invalid block number!')
            }
        } else {
            console.log('Attempted to add invalid block!');
        }

        return false;
    }

    transactionIsInPool(trans) {
        return this.mempool.indexOf(trans) != -1;
    }

    removeFromMempool(trans) {
        // https://stackoverflow.com/questions/9792927/javascript-array-search-and-remove-string
        let transactionIndex = this.mempool.indexOf(trans);
        // console.log(`[removeFromMempool] transaction index: ${transactionIndex}`);
        if (transactionIndex !== -1) {
            this.mempool.splice(transactionIndex, 1);
        }
    }

    validate() {
        let validChain = true;

        this.chain.map((block) => {
            if (!block.validate()) {
                validChain = false;
            }
        });

        return validChain;
    }

    getNextBlockNumber() {
        return this.chain[this.chain.length-1].header.block_number + 1;
        // return this.chain.length;
    }

    mine(startingNonce) {

        for (let index = 0; index < this.mempool.length; index ++) {
            let mHeader = new Header(this.getNextBlockNumber(), this.chain[this.chain.length - 1].getHash(), this.mempool[index], MY_MINER_NAME, startingNonce);
            if (mHeader.validate()) {
                return new Block(mHeader, this.mempool[index]);
            }
        }

        // All transactions have failed to produce valid header
        return this.mine(startingNonce + 1);
    }

    print() {
        console.log('\n\nPrinting Blockchain ...\n\n')
        for (let index = 0; index < this.chain.length; index ++) {
            console.log(this.chain[index].toString());
        }
        console.log('\n')
    }
}

class Block {
    constructor(header, transaction) {
        this.header = header;
        this.header_hash = hash(header.toString());
        this.transaction = transaction;
    }

    toString() {
        return `${this.header.toString()},${this.header_hash},${this.transaction}`;
    }

    validate() {
        return this.header.validate();
    }

    getHash() {
        return hash(this.toString());
    }

}

class ExternalBlock extends Block {
    constructor(header, header_hash, transaction) {
        super(header, transaction);
        this.header = header;
        this.header_hash = header_hash;
        this.transaction = transaction;
    }

    toString() {
        return `${this.header.toString()},${this.header_hash},${this.transaction}`;
    }

    validate() {
        return this.header.validate() && (hash(this.header.toString()) == this.header_hash);
    }
}

class Header {
    constructor(block_number, prev_block_hash, transaction, miner_name, nonce) {
        this.block_number = block_number;
        this.prev_block_hash = prev_block_hash;
        this.transaction = transaction;
        this.transaction_hash = hash(transaction);
        this.miner_name = miner_name;
        this.nonce = nonce;
    }

    validate() {
        let mHash = hash(this.toString());

        //TODO: IMPLEMENT!
        return mHash.charAt(2) == '6';
    }

    toString() {
        return `${this.block_number},${this.prev_block_hash},${this.transaction_hash},${this.miner_name},${this.nonce}`;
    }
}

var hash = function hash(transaction) {
    return sha256(transaction);
};

var genesisBlockData = {
    header: {
        block_number: 3,
        prev_block_hash: '006b3c8718f3ec171b62a086ab2d063ef31e1f01ab4eaa68aae1a56cc4a18c56',
        transaction_hash: '7f8276bedb87d4489547909266569c8ae14669b283d38abd71bc206ccb6729ea',
        miner_name: 'Steven Gordon',
        nonce: 37
    },
    transaction: hashTransMap['7f8276bedb87d4489547909266569c8ae14669b283d38abd71bc206ccb6729ea']
};

var genesisHeader = new Header(genesisBlockData.header.block_number, genesisBlockData.header.prev_block_hash, genesisBlockData.transaction, genesisBlockData.header.miner_name, genesisBlockData.header.nonce);
var genesisBlock = new Block(genesisHeader, genesisBlockData.transaction);


module.exports = { Block, Header, hash, genesisBlock, ExternalBlock, Blockchain, MY_MINER_NAME };