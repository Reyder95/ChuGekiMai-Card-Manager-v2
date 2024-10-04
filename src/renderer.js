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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const idInputs = document.getElementsByClassName("idInput");
const firstInput = idInputs[0];
function readJsonFile(fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield window.electronAPI.readJsonFile(fileName);
        if (result.error) {
            console.error("Error reading from a JSON file: ", result.error);
            return null;
        }
        return result;
    });
}
function writeJsonFile(fileName, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            window.electronAPI.writeJsonFile(fileName, data).then(() => console.log("Data written successfully!"));
            window.electronAPI.getAppPath().then((path) => console.log(path));
        }
        catch (error) {
            console.error("Error writing data", error);
        }
    });
}
firstInput.addEventListener('paste', (event) => {
    event.preventDefault();
    const clipboardData = event.clipboardData;
    if (clipboardData) {
        let clipboardText = clipboardData.getData('text');
        clipboardText = clipboardText.replace(/\D/g, '');
        if (clipboardText.length == 20 && clipboardText[0] !== '3') {
            for (let i = 0; i < idInputs.length; i++) {
                const currInput = idInputs[i];
                let endIndex = (i * 4) + 4;
                let start = i * 4;
                currInput.value = clipboardText.slice(start, endIndex);
            }
        }
    }
});
for (let i = 0; i < idInputs.length; i++) {
    const currElement = idInputs[i];
    currElement.addEventListener('input', () => {
        currElement.value = currElement.value.replace(/\D/g, '');
        if (currElement.value.length >= 4) {
            if (i < idInputs.length - 1)
                idInputs[i + 1].focus();
            else
                currElement.value = currElement.value.slice(0, 4);
        }
    });
}
(_a = document.getElementById('addCardButton')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
    const inputData = document.getElementsByClassName('idInput');
    const inputName = document.getElementById("nameInput");
    let totalInput = '';
    for (let i = 0; i < inputData.length; i++) {
        const currInput = inputData[i];
        totalInput += currInput.value;
    }
    if (totalInput.length == 20 && inputName.value.length !== 0)
        confirmCardForm(totalInput, inputName.value);
});
(_b = document.getElementById('generateCardButton')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
    const inputData = document.getElementsByClassName('idInput');
    console.log(inputData);
    for (let i = 0; i < inputData.length; i++) {
        const currInput = inputData[i];
        let rand4 = String(getRandomArbitrary(0, 9999));
        rand4 = rand4.padStart(4, '0');
        if (rand4[0] === '3' && i == 0)
            rand4 = '4' + rand4.substring(1);
        currInput.value = rand4;
    }
});
function confirmCardForm(totalInput, inputName) {
    let newData = { id: totalInput, name: inputName };
    writeJsonFile('cards.json', newData);
}
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
