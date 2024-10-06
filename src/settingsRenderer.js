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
var _a;
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
        let settingsCardsDiv = document.getElementById('settings-cards');
        if (settingsCardsDiv && settingsCards) {
            let htmlFill = '';
            for (let i = 0; i < settingsCards.length; i++) {
                let settingsCardKey = settingsCards[i].key ? settingsCards[i].key : '---';
                htmlFill += `
                <div class="hotkey-element">
                    <div>${settingsCards[i].name}</div>
                    <div>${settingsCardKey}</div>
                </div>
            `;
            }
            settingsCardsDiv.innerHTML = htmlFill;
        }
    });
}
(_a = document.getElementById('add-card')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    let settingsCards = yield window.electronAPI.storeGet('settings-card-list');
    if (currSelectedCard && settingsCards) {
        let newSettingsCard = Object.assign(Object.assign({}, currSelectedCard), { key: null });
        settingsCards.push(newSettingsCard);
        yield window.electronAPI.storeSet('settings-card-list', settingsCards);
        printSettingsCards();
    }
}));
populateDropdown();
printSettingsCards();
