"use strict";
console.log("Hello from the renderer process!");
const idInputs = document.getElementsByClassName("idInput");
const firstInput = idInputs[0];
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
