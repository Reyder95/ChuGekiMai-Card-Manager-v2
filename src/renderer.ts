import { CardData } from './interfaces'

let cards : CardData[] = [];
let mainCardIndex = -1;

const idInputs = document.getElementsByClassName("idInput");

const firstInput = idInputs[0] as HTMLInputElement;

async function readJsonFile(fileName: string): Promise<any> {
    const result = await window.electronAPI.readJsonFile(fileName);

    cards = result;

    if (result.error) {
        console.error("Error reading from a JSON file: ", result.error);
        return null;
    }

    return result;
}

async function writeJsonFile(fileName: string, data: CardData[]): Promise<void> {

    try {
        window.electronAPI.writeJsonFile(fileName, data).then(() => console.log("Data written successfully!"))
        window.electronAPI.getAppPath().then((path) => console.log(path))
    } catch (error: any) {
        console.error("Error writing data", error);
    }
}

async function writeAimeFile(fileName: string, cardId: string): Promise<void> {
    try {
        window.electronAPI.writeAimeFile(fileName, cardId);
    } catch (error: any) {
        console.error("Error writing aime file", error);
    }
}

function confirmCardForm(totalInput : string, inputName: string) {
    let newData : CardData = { id: totalInput, name: inputName }
    cards.push(newData);

    printCardsToScreen(cards);

    writeJsonFile('cards.json', cards);
}

function getRandomArbitrary(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
}

function printCardsToScreen() {
    const listDiv = document.getElementById('listDiv');
    if (listDiv)
        listDiv.innerHTML = '';
    for (let i = 0; i < cards.length; i++) {
        
        const htmlCode = `
            <div class="listElement">
                <p>${cards[i].name}</p>
                <div class="cardButtons">
                    <span data-index="${i}" id="checkIcon" class="material-icons cardIcon">check</span>
                    <span data-index="${i}" id="clearIcon" class="material-icons cardIcon">clear</span>             
                </div>
            </div>
        `;
    
        if (listDiv)
            listDiv.innerHTML += htmlCode;
    }

    const cardListElements = listDiv?.getElementsByClassName("cardButtons");

    if (cardListElements) {
        for (let i = 0; i < cardListElements.length; i++) {
            const currElement = cardListElements[i] as HTMLDivElement;
            currElement.querySelector('#checkIcon')?.addEventListener("click", (event) => {
                const button = event.target as HTMLSpanElement;
                if (button) {
                    mainCardIndex = Number(button.dataset.index);
                    const topCard = document.getElementById("topCard");
                    if (topCard) {
                        topCard.innerHTML = `
                            <h3 class="playerName">${cards[mainCardIndex].name}</h3>
                            <h3 class="cardId">${cards[mainCardIndex].id}</h3>
                        `

                        writeAimeFile('aime.txt', cards[mainCardIndex].id);
                    }
                }
            })
        }
    }

}

firstInput.addEventListener('paste', (event) => {
    event.preventDefault();
    const clipboardData = event.clipboardData;
    
    if (clipboardData) {
        let clipboardText = clipboardData.getData('text');
        clipboardText = clipboardText.replace(/\D/g, '');

        if (clipboardText.length == 20 && clipboardText[0] !== '3') {
            for (let i = 0; i < idInputs.length; i++) {
                const currInput = idInputs[i] as HTMLInputElement;

                let endIndex = (i * 4) + 4;
                let start = i * 4;

                currInput.value = clipboardText.slice(start, endIndex);
            }
        }
    }
})

for (let i = 0; i < idInputs.length; i++) {
    const currElement = idInputs[i] as HTMLInputElement;

    currElement.addEventListener('input', () => {
        currElement.value = currElement.value.replace(/\D/g, '');

        if (currElement.value.length >= 4) {

            if (i < idInputs.length - 1)
                (idInputs[i+1] as HTMLInputElement).focus()
            else
                currElement.value = currElement.value.slice(0, 4);
        }
            
    })
}

document.getElementById('addCardButton')?.addEventListener('click', () => {
    const inputData = document.getElementsByClassName('idInput');
    const inputName = document.getElementById("nameInput");
    
    let totalInput = '';

    for (let i = 0; i < inputData.length; i++) {
        const currInput = inputData[i] as HTMLInputElement;

        totalInput += currInput.value;
    }

    if (totalInput.length == 20 && (inputName as HTMLInputElement).value.length !== 0)
        confirmCardForm(totalInput, (inputName as HTMLInputElement).value)

})

document.getElementById('generateCardButton')?.addEventListener('click', () => {
    const inputData = document.getElementsByClassName('idInput');
    console.log(inputData);

    for (let i = 0; i < inputData.length; i++) {
        const currInput = inputData[i] as HTMLInputElement;
        let rand4: string = String(getRandomArbitrary(0, 9999));
        rand4 = rand4.padStart(4, '0');
        if (rand4[0] === '3' && i == 0)
            rand4 = '4' + rand4.substring(1);

        currInput.value = rand4;
        
    }
})

readJsonFile('cards.json')
.then((data: CardData[]) => {
    printCardsToScreen();
})

