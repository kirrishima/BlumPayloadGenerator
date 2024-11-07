"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUUID = exports.WasmFileNotLoadedError = exports.trueWASMData = void 0;
exports.checkRequestDataStructure = checkRequestDataStructure;
exports.loadWasmFileForGenerator = loadWasmFileForGenerator;
exports.generatePayload = generatePayload;
exports.generateChallenge = generateChallenge;
exports.getPayload = getPayload;
const fs_1 = __importDefault(require("fs"));
// @ts-ignore
const game_js_1 = require("../public/game.js");
exports.trueWASMData = {
    "gameId": "ec4e3774-b5a7-4789-a23b-cc02cb655ca6",
    "challenge": {
        "id": "a9a6fdff-69c5-43a3-8bb7-fdf0f875766f",
        "nonce": 74114,
        "hash": "00001976638fc4d4aea3cdcbeaae2b17eb99306c814dc7e78e89ef448a1895ff"
    },
    "earnedPoints": {
        "BP": { "amount": 219 }
    },
    "assetClicks": {
        "CLOVER": { "clicks": 74 },
        "FREEZE": { "clicks": 3 },
        "BOMB": { "clicks": 0 }
    }
};
class WasmFileNotLoadedError extends Error {
    constructor() {
        super(...arguments);
        this.message = 'wasm file not loaded for generator! use "await loadWasmFileForGenerator("game_wasm_bg-BnV071fP.wasm")"';
    }
}
exports.WasmFileNotLoadedError = WasmFileNotLoadedError;
function checkRequestDataStructure(data) {
    var _a, _b;
    const errors = [];
    if (!(data === null || data === void 0 ? void 0 : data.gameId)) {
        errors.push("Missing or invalid 'gameId'. Expected a non-empty string.");
    }
    if ((data === null || data === void 0 ? void 0 : data.challenge) != null) {
        if (typeof (data === null || data === void 0 ? void 0 : data.challenge) !== "object" || data.challenge === null) {
            errors.push("Invalid 'challenge'. Expected an object.");
        }
        else {
            if (typeof data.challenge.id !== "string") {
                errors.push("Invalid 'id' in 'challenge'. Expected a string.");
            }
            if (typeof data.challenge.nonce !== "number") {
                errors.push("Invalid 'nonce' in 'challenge'. Expected a number.");
            }
            if (typeof data.challenge.hash !== "string") {
                errors.push("Invalid 'hash' in 'challenge'. Expected a string.");
            }
        }
    }
    if (typeof (data === null || data === void 0 ? void 0 : data.earnedPoints) !== "object" || data.earnedPoints === null) {
        errors.push("Missing or invalid 'earnedPoints'. Expected an object.");
    }
    else {
        for (const key of Object.keys(data.earnedPoints)) {
            if (typeof ((_a = data.earnedPoints[key]) === null || _a === void 0 ? void 0 : _a.amount) !== "number") {
                errors.push(`Invalid 'amount' in 'earnedPoints' for key '${key}'. Expected a number.`);
            }
        }
    }
    if (typeof (data === null || data === void 0 ? void 0 : data.assetClicks) !== "object" || data.assetClicks === null) {
        errors.push("Missing or invalid 'assetClicks'. Expected an object.");
    }
    else {
        for (const key of Object.keys(data.assetClicks)) {
            if (typeof ((_b = data.assetClicks[key]) === null || _b === void 0 ? void 0 : _b.clicks) !== "number") {
                errors.push(`Invalid 'clicks' in 'assetClicks' for key '${key}'. Expected a number.`);
            }
        }
    }
    return errors;
}
function loadWasmFileForGenerator(gameWasmFilePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const file = fs_1.default.readFileSync(gameWasmFilePath);
        yield (0, game_js_1.R)(file);
    });
}
const generateUUID = () => {
    const generateUUID = (mask) => {
        const base = (Math.random() * 16) | 0;
        return (mask === "x" ? base : (base & 3) | 8).toString(16);
    };
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, generateUUID);
};
exports.generateUUID = generateUUID;
function generatePayload(wasmData) {
    return (0, game_js_1.F)(wasmData.gameId, wasmData.challenge, wasmData.earnedPoints, wasmData.assetClicks);
}
function generateChallenge(gameId) {
    try {
        const challengeData = (0, game_js_1.D)(gameId);
        return Object.assign({ id: (0, exports.generateUUID)() }, challengeData);
    }
    catch (error) {
        if (error instanceof TypeError &&
            error.message === "Cannot read properties of undefined (reading '__wbindgen_add_to_stack_pointer')") {
            throw new WasmFileNotLoadedError();
        }
        throw error;
    }
}
function getPayload(gameId, earnedPoints, assetClicks) {
    return __awaiter(this, void 0, void 0, function* () {
        const wasmData = {
            gameId: gameId,
            challenge: generateChallenge(gameId),
            earnedPoints: earnedPoints,
            assetClicks: assetClicks
        };
        const payload = generatePayload(wasmData);
        return { payload: payload };
    });
}
