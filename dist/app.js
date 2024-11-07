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
const express_1 = __importDefault(require("express"));
const generator_1 = require("./generator");
const generator_2 = require("./generator");
const test_1 = require("./test");
const consts_1 = require("./consts");
const http_status_codes_1 = require("http-status-codes");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use(express_1.default.json());
app.get('/api/status', (req, res) => {
    res.send("OK");
});
app.get('/api/help', (req, res) => {
    const filePath = path_1.default.join(__dirname, '../public', 'api.html');
    res.sendFile(filePath);
});
app.post('/api/generate', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, generator_1.checkRequestDataStructure)(req.body);
    if (errors.length !== 0) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            error: "Incorrect request body structure.",
            details: errors
        });
        return;
    }
    try {
        const gameId = req.body.gameId;
        const earnedPoints = req.body.earnedPoints;
        const assetClicks = req.body.assetClicks;
        const wasmData = { gameId, earnedPoints, assetClicks, challenge: (0, generator_1.generateChallenge)(gameId) };
        const payload = (0, generator_1.generatePayload)(wasmData);
        res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({ payload: payload }, wasmData));
    }
    catch (e) {
        // @ts-ignore
        const error = e;
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}));
app.get('/api/testdata', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const wasmData = (0, test_1.getTestData)();
    res.json({ testData: wasmData });
}));
app.get('/api/test', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const wasmData = (0, test_1.getTestData)();
    const payload = (0, generator_1.generatePayload)(wasmData);
    if (payload.length !== 684) {
        res.json({ message: `Payload length (${payload.length}) is not expected length, specified - 684, real - ${payload.length}` });
    }
    else {
        res.json({ message: "OK" });
    }
}));
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        const wasmPath = path_1.default.join(__dirname, '../public', consts_1.appConstants.GENERATOR_WASM_FILENAME);
        console.log("started");
        yield (0, generator_2.loadWasmFileForGenerator)(wasmPath);
        app.listen();
    });
}
start().then();
