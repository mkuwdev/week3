//[assignment] write your own unit test to show that your Mastermind variation circuit is working as expected
const chai = require('chai');
const path = require('path');

const wasm_tester = require("circom_tester").wasm;
const buildPoseidon = require("circomlibjs").buildPoseidon;

const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);

const assert = chai.assert;

describe("Super Mastermind Test", function () {
    this.timeout(100000000);

    let circuit;
    let poseidon;

    before(async () => { 
        circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");
        await circuit.loadConstraints();
        poseidon = await buildPoseidon();
    });

    it("CASE 1: 2 Hits 3 Blows", async () => {
        const INPUT = {
            "pubGuessA": 1,
            "pubGuessB": 2,
            "pubGuessC": 3,
            "pubGuessD": 5,
            "pubGuessE": 4,
            "pubNumHit": 2,
            "pubNumBlow": 3,
            "pubSolnHash": null,
            "privSolnA": 5,
            "privSolnB": 2,
            "privSolnC": 3,
            "privSolnD": 4,
            "privSolnE": 1,
            "privSalt": 34
        };

        INPUT["pubSolnHash"] = poseidon.F.toObject(
            poseidon([
                INPUT["privSalt"],
                INPUT["privSolnA"],
                INPUT["privSolnB"],
                INPUT["privSolnC"],
                INPUT["privSolnD"],
                INPUT["privSolnE"],
            ])
        );

        const witness = await circuit.calculateWitness(INPUT, true);

        // console.log(witness);

        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        assert(Fr.eq(Fr.e(witness[1]),Fr.e(INPUT["pubSolnHash"])));
    });

    it("CASE 2: All Hits", async () => {
        const INPUT = {
            "pubGuessA": 5,
            "pubGuessB": 2,
            "pubGuessC": 3,
            "pubGuessD": 4,
            "pubGuessE": 1,
            "pubNumHit": 5,
            "pubNumBlow": 0,
            "pubSolnHash": null,
            "privSolnA": 5,
            "privSolnB": 2,
            "privSolnC": 3,
            "privSolnD": 4,
            "privSolnE": 1,
            "privSalt": 34
        };

        INPUT["pubSolnHash"] = poseidon.F.toObject(
            poseidon([
                INPUT["privSalt"],
                INPUT["privSolnA"],
                INPUT["privSolnB"],
                INPUT["privSolnC"],
                INPUT["privSolnD"],
                INPUT["privSolnE"],
            ])
        );

        const witness = await circuit.calculateWitness(INPUT, true);

        // console.log(witness);

        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        assert(Fr.eq(Fr.e(witness[1]),Fr.e(INPUT["pubSolnHash"])));
    });
});
