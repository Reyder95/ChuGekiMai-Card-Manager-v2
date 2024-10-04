import { CardData } from './interfaces'

const idInputs = document.getElementsByClassName("idInput");

const firstInput = idInputs[0] as HTMLInputElement;

async function readJsonFile(fileName: string): Promise<any> {
    const result = await window.electronAPI.readJsonFile(fileName);

    if (result.error) {
        console.error("Error reading from a JSON file: ", result.error);
        return null;
    }

    return result;
}

async function writeJsonFile(fileName: string, data: CardData): Promise<void> {

    try {
        window.electronAPI.writeJsonFile(fileName, data).then(() => console.log("Data written successfully!"))
        window.electronAPI.getAppPath().then((path) => console.log(path))
    } catch (error: any) {
        console.error("Error writing data", error);
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

function confirmCardForm(totalInput : string, inputName: string) {
    let newData : CardData = { id: totalInput, name: inputName }

    writeJsonFile('cards.json', newData);
}

function getRandomArbitrary(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
}