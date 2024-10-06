let currSelectedCard = null;

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

            if (currCards)
                console.log(currCards[selectedOption].name);
        })

        cardSelectBox.innerHTML = htmlFill;
    }
}

document.getElementById('add-card')?.addEventListener('click', () => {

})

populateDropdown();