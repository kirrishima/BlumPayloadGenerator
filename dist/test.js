"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTestData = getTestData;
const generator_1 = require("./generator");
function getTestData() {
    const gameId = "ad7cd4cd-29d1-4548-89a3-91301996ef31";
    const challengeHash = "0000467a51e7680d8a3c36d18b240697fb844dd269e21989f24044acddf10228";
    const challengeNonce = 16353;
    const earnedPoints = {
        "BP": { "amount": 219 }
    };
    const assetClicks = {
        "CLOVER": { "clicks": 74 },
        "FREEZE": { "clicks": 3 },
        "BOMB": { "clicks": 0 },
        "TRUMP": { "clicks": 10 },
        "HARRIS": { "clicks": 19 }
    };
    const challenge = (0, generator_1.generateChallenge)(gameId);
    if (challenge.hash !== challengeHash) {
        console.log(`Calculated: ${challenge.hash}, specified: ${challengeHash}`);
        throw Error("Challenge hash did not match the specified.");
    }
    if (challenge.nonce !== challengeNonce) {
        console.log(`Calculated: ${challenge.nonce}, specified: ${challengeNonce}`);
        throw Error("Challenge nonce did not match the specified.");
    }
    let wasmData = {
        gameId: gameId,
        challenge: challenge,
        earnedPoints: earnedPoints,
        assetClicks: assetClicks
    };
    return wasmData;
}
