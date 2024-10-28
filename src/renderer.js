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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
let settings = {
    hotkeyCards: {
        F1: null,
        F2: null,
        F3: null,
        F4: null,
        F5: null
    }
};
let mainCardIndex = -1;
const idInputs = document.getElementsByClassName("idInput");
const firstInput = idInputs[0];
window.electronAPI.onGlobalShortcut((event, action) => {
    if (action == 'top-card')
        displayTopCard();
    else if (action == 'display') {
        printCardsToScreen();
    }
});
function isCardData(obj) {
    return (typeof obj === 'object' &&
        obj !== null &&
        typeof obj.id === 'string' &&
        typeof obj.name === 'string');
}
function isCardDataArray(arr) {
    return Array.isArray(arr) && arr.every(isCardData);
}
function readSettingsFile(fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield window.electronAPI.readJsonFile(fileName);
        if (result.error) {
            console.error("Error reading from a JSON file: ", result.error);
            writeSettingsFile('settings.json', settings);
            return null;
        }
        settings = result;
    });
}
function writeSettingsFile(fileName, settings) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            window.electronAPI.writeJsonFile(fileName, settings).then(() => console.log("Data written successfully!"));
        }
        catch (error) {
            console.error("Error writing data", error);
        }
    });
}
function readJsonFile(fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield window.electronAPI.readJsonFile(fileName);
        if (isCardDataArray(result)) {
            //cards = result;
            window.electronAPI.storeSet('card-list', result);
        }
        console.log(window.electronAPI.storeGet('card-list'));
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
function writeAimeFile(fileName, cardId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            window.electronAPI.writeAimeFile(fileName, cardId);
        }
        catch (error) {
            console.error("Error writing aime file", error);
        }
    });
}
function confirmCardForm(totalInput, inputName) {
    return __awaiter(this, void 0, void 0, function* () {
        let newData = { id: totalInput, name: inputName };
        let cardData = yield window.electronAPI.storeGet('card-list');
        cardData.push(newData);
        yield window.electronAPI.storeSet('card-list', cardData);
        printCardsToScreen();
        writeJsonFile('cards.json', cardData);
    });
}
function displayTopCard() {
    return __awaiter(this, void 0, void 0, function* () {
        const mainCard = yield window.electronAPI.storeGet('curr-card');
        if (mainCard) {
            const topCard = document.getElementById("topCard");
            if (topCard) {
                let currId = mainCard.id;
                for (let i = 0; i < currId.length; i++) {
                    if (i % 5 == 0 && i != 0) {
                        currId = currId.slice(0, i - 1) + " " + currId.slice(i - 1, currId.length);
                    }
                }
                topCard.innerHTML = `
                <h3 class="playerName">${mainCard.name}</h3>
                <h3 class="cardId">${currId}</h3>
            `;
            }
        }
    });
}
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
function printCardsToScreen() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const cards = yield window.electronAPI.storeGet('card-list');
        const listDiv = document.getElementById('listDiv');
        if (listDiv)
            listDiv.innerHTML = '';
        if (!cards)
            return;
        for (let i = 0; i < cards.length; i++) {
            let cardKey = '---';
            if (cards[i].key)
                cardKey = cards[i].key;
            const htmlCode = `
            <div class="listElementParent">
            <div class="listElement">
                <p>${cards[i].name}</p>
                <div class="cardButtons">
                    <span data-index="${i}" id="checkIcon" class="material-icons cardIcon">check</span>
                    <span data-index="${i}" id="clearIcon" class="material-icons cardIcon">clear</span>             
                </div>
            </div>
            <button data-index=${i} class="keyButton">${cardKey}</button>
            </div>
        `;
            if (listDiv)
                listDiv.innerHTML += htmlCode;
        }
        const cardListElements = listDiv === null || listDiv === void 0 ? void 0 : listDiv.getElementsByClassName("cardButtons");
        if (cardListElements) {
            for (let i = 0; i < cardListElements.length; i++) {
                const currElement = cardListElements[i];
                (_a = currElement.querySelector('#checkIcon')) === null || _a === void 0 ? void 0 : _a.addEventListener("click", (event) => __awaiter(this, void 0, void 0, function* () {
                    const button = event.target;
                    if (button) {
                        let mainCard = cards[Number(button.dataset.index)];
                        yield window.electronAPI.storeSet('curr-card', mainCard);
                        //mainCardIndex = Number(button.dataset.index);
                        const topCard = document.getElementById("topCard");
                        if (topCard) {
                            displayTopCard();
                            writeAimeFile('aime.txt', mainCard.id);
                        }
                    }
                }));
                (_b = currElement.querySelector('#clearIcon')) === null || _b === void 0 ? void 0 : _b.addEventListener("click", (event) => __awaiter(this, void 0, void 0, function* () {
                    const button = event.target;
                    if (button) {
                        const index = Number(button.dataset.index);
                        const userConfirmed = confirm(`Are you sure you want to delete ${cards[index].name}'s profile?`);
                        if (userConfirmed) {
                            cards.splice(index, 1);
                            yield window.electronAPI.storeSet('card-list', cards);
                            printCardsToScreen();
                            writeJsonFile('cards.json', cards);
                        }
                    }
                }));
            }
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
        currInput.value = "";
    }
    if (totalInput.length == 20 && inputName.value.length !== 0) {
        confirmCardForm(totalInput, inputName.value);
    }
    inputName.value = "";
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
(_c = document.getElementById('open-settings')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => {
    window.electronAPI.openSettings();
});
(_d = document.getElementById('listDiv')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', (event) => __awaiter(void 0, void 0, void 0, function* () {
    let target = event.target;
    let keyButton = target.closest('.keyButton');
    if (keyButton) {
        let index = keyButton.getAttribute('data-index');
        if (index)
            yield window.electronAPI.storeSet('selected-hotkey-card-index', index);
    }
}));
readJsonFile('cards.json')
    .then((data) => __awaiter(void 0, void 0, void 0, function* () {
    yield window.electronAPI.storeSet('card-list', data);
    printCardsToScreen();
}));
readSettingsFile('settings.json')
    .then((data) => {
    settings = data;
});
displayTopCard();
