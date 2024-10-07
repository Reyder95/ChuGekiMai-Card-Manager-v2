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
    let selectedCardIndex = await window.electronAPI.storeGet('selected-settings-card');

    let settingsCardsDiv = document.getElementById('settings-cards');

    if (settingsCardsDiv && settingsCards) {
        let htmlFill = '';

        for (let i = 0; i < settingsCards.length; i++) {
            let settingsCardKey = settingsCards[i].key ? settingsCards[i].key : '---'

            let classes = 'hotkey-element';
            
            if (selectedCardIndex && settingsCards[selectedCardIndex].id == settingsCards[i].id)
                classes += ' hotkey-selected'
            

            htmlFill += `
                <div data-index=${i} class="${classes}">
                    <div>${settingsCards[i].name}</div>
                    <div>${settingsCardKey}</div>
                </div>
            `
        }

        if (settingsCardsDiv) {
            settingsCardsDiv.innerHTML = htmlFill;
        }
    }
}

window.electronAPI.setCard(async (event, key) => {

        //settingsCards[settingsCardIndex].key = key;

        //await window.electronAPI.storeSet('settings-card-list', settingsCards);

        //await window.electronAPI.storeDelete('selected-settings-card');

        await printSettingsCards();

})

document.getElementById('add-card')?.addEventListener('click', async () => {
    let settingsCards = await window.electronAPI.storeGet('settings-card-list');

    if (currSelectedCard && settingsCards) {
        let newSettingsCard = {...currSelectedCard, key: null};
        settingsCards.push(newSettingsCard);

        await window.electronAPI.storeSet('settings-card-list', settingsCards)

        printSettingsCards();
    }
})

// Event listener for selecting/deselecting a card
document.getElementById('settings-cards')?.addEventListener('click', async (event) => {
    let target = event.target as HTMLElement;
    let hotkeyElement = target.closest('.hotkey-element');

    if (hotkeyElement) {
        let index = hotkeyElement.getAttribute('data-index');
        let selectedCard = await window.electronAPI.storeGet('selected-settings-card');
        let settingsCards = await window.electronAPI.storeGet('settings-card-list')

        if (selectedCard && index) {
            if (settingsCards[index].id == selectedCard.id) {
                await window.electronAPI.storeDelete('selected-settings-card');
            } else {
                await window.electronAPI.storeSet('selected-settings-card', index);
            }
        } else {
            if (index)
                await window.electronAPI.storeSet('selected-settings-card', index);
        }

        // Update the UI
        await printSettingsCards();  // This ensures the UI updates after changing the selected card
    }
});

populateDropdown();

printSettingsCards();