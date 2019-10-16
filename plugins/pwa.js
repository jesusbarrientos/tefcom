let deferredPrompt;
let btnAdd = document.createElement('button');

window.addEventListener('beforeinstallprompt',  (e) => {
    console.log('paso')
    e.preventDefault();
    deferredPrompt = e;
    btnAdd.style.display = 'block';
});

btnAdd.addEventListener('click', (e) => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('Accepted!')
        }

        deferredPrompt = null;
    })
});
