const blockContainer = require('./block.js');
const mempool = require('./mempool').MEMPOOL;
const getFee = require('./mempool').getFee;
const hashTransMap = require('./mempool').hashTransMap;
const transHashMap = require('./mempool').transHashMap;
const genesisBlock = require('./block').genesisBlock;
const Blockchain = require('./block').Blockchain;
const hash = blockContainer.hash;


var blockchain = new Blockchain();
let initMempoolLength = mempool.length;
// blockchain.setChain([genesisBlock]);
blockchain.initMempool(mempool);
blockchain.add(genesisBlock);
// console.log(newBlock);
while (blockchain.mempool.length > 0) {
    let newBlock = blockchain.mine(0);
    if (blockchain.add(newBlock)) {
        console.log('Added new Block!');
    } else {
        console.log('\n\nFAILURE\nFAILURE\nFAILURE\nFAILURE\nFAILURE\nFAILURE\nFAILURE\nFAILURE\n\n')
        break;
    }
}

blockchain.print();
console.log(`PROCCESSED ALL TRANSACTIONS: ${initMempoolLength == blockchain.chain.length}`);

// TOOLS ################################

// mempool.map((val) => {
//     console.log(`${hash(val)}:\"${val}\"`);
// });

// END TOOLS ################################

// TESTING ################################

// let header1 = new blockContainer.Header(3,'006b3c8718f3ec171b62a086ab2d063ef31e1f01ab4eaa68aae1a56cc4a18c56','Camel3','Steven Gordon',37);
// let block1 = new blockContainer.Block(header1, 'Camel3');

// let block1 = new blockContainer.ExternalBlock(header1, '21681b7b9f15b3dcae61c4d2ebcbc596ccffe604db3f13e56229cca13278b03a', 'Camel3');
// console.log(genesisBlock.validate());

// console.log(block1.toString());
// console.log(hash('3,006b3c8718f3ec171b62a086ab2d063ef31e1f01ab4eaa68aae1a56cc4a18c56,7f8276bedb87d4489547909266569c8ae14669b283d38abd71bc206ccb6729ea,Steven Gordon,37'));
// console.log(hashTransMap['7f8276bedb87d4489547909266569c8ae14669b283d38abd71bc206ccb6729ea']);
// console.log(genesisBlock.toString());
// console.log(getFee(mempool[0]));

// END TESTING ################################


