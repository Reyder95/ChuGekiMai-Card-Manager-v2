import { CardData } from "./interfaces";


let currSelectedCard : CardData | null = null;

async function populateDropdown() {
    const cards = await window.electronAPI.storeGet('card-list');

    if (!cards)
        return;

    let htmlFill = '<option disabled selected value="">Select One</option>';

    for (let i = 0; i < cards.length; i++) {
        htmlFill += `
            <option value="${i}">${cards[i].name}</option>
        `
    }

    let cardSelectBox = document.getElementById('cardSelectBox');

    if (cardSelectBox) {
        cardSelectBox.addEventListener('change', async (event) => {
            let target = event.target as HTMLOptionElement;
            let selectedOption = target.value;

            let currCards = await window.electronAPI.storeGet('card-list');
            

            if (currCards) {
                currSelectedCard = currCards[selectedOption];

            }
        })

        cardSelectBox.innerHTML = htmlFill;
    }
}

async function printSettingsCards() {
    let settingsCards = await window.electronAPI.storeGet('settings-card-list');

    let settingsCardsDiv = document.getElementById('settings-cards');

    if (settingsCardsDiv && settingsCards) {
        let htmlFill = '';

        for (let i = 0; i < settingsCards.length; i++) {
            let settingsCardKey = settingsCards[i].key ? settingsCards[i].key : '---'

            htmlFill += `
                <div class="hotkey-element">
                    <div>${settingsCards[i].name}</div>
                    <div>${settingsCardKey}</div>
                </div>
            `
        }

        settingsCardsDiv.innerHTML = htmlFill;
    }
}

document.getElementById('add-card')?.addEventListener('click', async () => {
    let settingsCards = await window.electronAPI.storeGet('settings-card-list');

    if (currSelectedCard && settingsCards) {
        let newSettingsCard = {...currSelectedCard, key: null};
        settingsCards.push(newSettingsCard);

        await window.electronAPI.storeSet('settings-card-list', settingsCards)

        printSettingsCards();
    }
})

populateDropdown();

printSettingsCards();