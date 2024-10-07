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
let currSelectedCard = null;
function populateDropdown() {
    return __awaiter(this, void 0, void 0, function* () {
        const cards = yield window.electronAPI.storeGet('card-list');
        if (!cards)
            return;
        let htmlFill = '<option disabled selected value="">Select One</option>';
        for (let i = 0; i < cards.length; i++) {
            htmlFill += `
            <option value="${i}">${cards[i].name}</option>
        `;
        }
        let cardSelectBox = document.getElementById('cardSelectBox');
        if (cardSelectBox) {
            cardSelectBox.addEventListener('change', (event) => __awaiter(this, void 0, void 0, function* () {
                let target = event.target;
                let selectedOption = target.value;
                let currCards = yield window.electronAPI.storeGet('card-list');
                if (currCards) {
                    currSelectedCard = currCards[selectedOption];
                }
            }));
            cardSelectBox.innerHTML = htmlFill;
        }
    });
}
function printSettingsCards() {
    return __awaiter(this, void 0, void 0, function* () {
        let settingsCards = yield window.electronAPI.storeGet('settings-card-list');
        let selectedCardIndex = yield window.electronAPI.storeGet('selected-settings-card');
        let settingsCardsDiv = document.getElementById('settings-cards');
        if (settingsCardsDiv && settingsCards) {
            let htmlFill = '';
            for (let i = 0; i < settingsCards.length; i++) {
                let settingsCardKey = settingsCards[i].key ? settingsCards[i].key : '---';
                let classes = 'hotkey-element';
                if (selectedCardIndex && settingsCards[selectedCardIndex].id == settingsCards[i].id)
                    classes += ' hotkey-selected';
                htmlFill += `
                <div data-index=${i} class="${classes}">
                    <div>${settingsCards[i].name}</div>
                    <div>${settingsCardKey}</div>
                </div>
            `;
            }
            if (settingsCardsDiv) {
                settingsCardsDiv.innerHTML = htmlFill;
            }
        }
    });
}
window.electronAPI.setCard((event, key) => __awaiter(void 0, void 0, void 0, function* () {
    //settingsCards[settingsCardIndex].key = key;
    //await window.electronAPI.storeSet('settings-card-list', settingsCards);
    //await window.electronAPI.storeDelete('selected-settings-card');
    yield printSettingsCards();
}));
(_a = document.getElementById('add-card')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    let settingsCards = yield window.electronAPI.storeGet('settings-card-list');
    if (currSelectedCard && settingsCards) {
        let newSettingsCard = Object.assign(Object.assign({}, currSelectedCard), { key: null });
        settingsCards.push(newSettingsCard);
        yield window.electronAPI.storeSet('settings-card-list', settingsCards);
        printSettingsCards();
    }
}));
// Event listener for selecting/deselecting a card
(_b = document.getElementById('settings-cards')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', (event) => __awaiter(void 0, void 0, void 0, function* () {
    let target = event.target;
    let hotkeyElement = target.closest('.hotkey-element');
    if (hotkeyElement) {
        let index = hotkeyElement.getAttribute('data-index');
        let selectedCard = yield window.electronAPI.storeGet('selected-settings-card');
        let settingsCards = yield window.electronAPI.storeGet('settings-card-list');
        if (selectedCard && index) {
            if (settingsCards[index].id == selectedCard.id) {
                yield window.electronAPI.storeDelete('selected-settings-card');
            }
            else {
                yield window.electronAPI.storeSet('selected-settings-card', index);
            }
        }
        else {
            if (index)
                yield window.electronAPI.storeSet('selected-settings-card', index);
        }
        // Update the UI
        yield printSettingsCards(); // This ensures the UI updates after changing the selected card
    }
}));
populateDropdown();
printSettingsCards();
