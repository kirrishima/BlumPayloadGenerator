import express, { Request, Response } from 'express'
import { generatePayload, generateChallenge, checkRequestDataStructure } from "./generator"
import { loadWasmFileForGenerator } from "./generator";
import { getTestData } from "./test";
import { appConstants } from "./consts"
import { StatusCodes } from "http-status-codes"
import path from 'path'

const app = express()

app.use(express.static(path.join(__dirname, '../public')))
app.use(express.json());


app.get('/api/status', (req, res) => {
    res.send("OK")
})

app.get('/api/help', (req, res) => {
    const filePath = path.join(__dirname, '../public', 'api.html')
    res.sendFile(filePath)
})

app.post('/api/generate', async (req: Request, res: Response) => {
    const errors = checkRequestDataStructure(req.body);
    if (errors.length !== 0) {
        res.status(StatusCodes.BAD_REQUEST).json({
            error: "Incorrect request body structure.",
            details: errors
        });
        return;
    }
    try {
        const gameId = req.body.gameId;
        const earnedPoints = req.body.earnedPoints;
        const assetClicks = req.body.assetClicks;
        const wasmData = { gameId, earnedPoints, assetClicks, challenge: generateChallenge(gameId) };
        const payload = generatePayload(wasmData);
        res.status(StatusCodes.OK).json({ payload: payload, ...wasmData });
    } catch (e) {
        // @ts-ignore
        const error: Error = e;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
})

app.get('/api/testdata', async (req, res) => {
    const wasmData = getTestData();
    res.json({ testData: wasmData });
})

app.get('/api/test', async (req, res) => {

    const wasmData = getTestData();

    const payload = generatePayload(wasmData);

    if (payload.length !== 684) {
        res.json({ message: `Payload length (${payload.length}) is not expected length, specified - 684, real - ${payload.length}` });
    }
    else {
        res.json({ message: "OK" });
    }
})

async function start() {
    const wasmPath = path.join(__dirname, '../public', appConstants.GENERATOR_WASM_FILENAME);
    console.log("started");
    await loadWasmFileForGenerator(wasmPath);

    app.listen();
}

start().then();