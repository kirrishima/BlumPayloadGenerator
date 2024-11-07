import fs from "fs";
// @ts-ignore
import { D, F, R } from "../public/game.js";

export type GameId = string

type PayloadType = string

type Clicks = { clicks: number }

interface AssetsClicksType {
    [any: string]: Clicks;
}

type ChallengeType = {
    nonce: number,
    hash: string,
    id: string
}

export type AmountType = { amount: number }

interface EarnedPointsType {
    [any: string]: AmountType;
}

type WasmDataType = {
    gameId: GameId,
    challenge: ChallengeType,
    earnedPoints: EarnedPointsType,
    assetClicks: AssetsClicksType
}

export const trueWASMData = {
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
}

export class WasmFileNotLoadedError extends Error {
    message = 'wasm file not loaded for generator! use "await loadWasmFileForGenerator("game_wasm_bg-BnV071fP.wasm")"'
}

export function checkRequestDataStructure(data: any): string[] {
    const errors: string[] = [];

    if (!data?.gameId) {
        errors.push("Missing or invalid 'gameId'. Expected a non-empty string.");
    }

    if (data?.challenge != null) {
        if (typeof data?.challenge !== "object" || data.challenge === null) {
            errors.push("Invalid 'challenge'. Expected an object.");
        } else {
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

    if (typeof data?.earnedPoints !== "object" || data.earnedPoints === null) {
        errors.push("Missing or invalid 'earnedPoints'. Expected an object.");
    } else {
        for (const key of Object.keys(data.earnedPoints)) {
            if (typeof data.earnedPoints[key]?.amount !== "number") {
                errors.push(`Invalid 'amount' in 'earnedPoints' for key '${key}'. Expected a number.`);
            }
        }
    }

    if (typeof data?.assetClicks !== "object" || data.assetClicks === null) {
        errors.push("Missing or invalid 'assetClicks'. Expected an object.");
    } else {
        for (const key of Object.keys(data.assetClicks)) {
            if (typeof data.assetClicks[key]?.clicks !== "number") {
                errors.push(`Invalid 'clicks' in 'assetClicks' for key '${key}'. Expected a number.`);
            }
        }
    }

    return errors;
}

export async function loadWasmFileForGenerator(gameWasmFilePath: string) {
    const file = fs.readFileSync(gameWasmFilePath);
    await R(file);
}

export const generateUUID = () => {
    const generateUUID = (mask: string) => {
        const base = (Math.random() * 16) | 0;
        return (mask === "x" ? base : (base & 3) | 8).toString(16);
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, generateUUID);
}

export function generatePayload(wasmData: WasmDataType): PayloadType {
    return F(wasmData.gameId, wasmData.challenge, wasmData.earnedPoints, wasmData.assetClicks);
}

export function generateChallenge(gameId: GameId): ChallengeType {
    try {
        const challengeData = D(gameId)
        return { id: generateUUID(), ...challengeData };
    } catch (error) {
        if (error instanceof TypeError &&
            error.message === "Cannot read properties of undefined (reading '__wbindgen_add_to_stack_pointer')"
        ) {
            throw new WasmFileNotLoadedError();
        }
        throw error
    }
}

export async function getPayload(gameId: GameId, earnedPoints: EarnedPointsType, assetClicks: AssetsClicksType) {
    const wasmData = {
        gameId: gameId,
        challenge: generateChallenge(gameId),
        earnedPoints: earnedPoints,
        assetClicks: assetClicks
    };
    const payload = generatePayload(wasmData);
    return { payload: payload };
}