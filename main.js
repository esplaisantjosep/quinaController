MIN_NUMBER = 1,
MAX_NUMBER = 90,
NUMBERS_PER_ROW = 10,
ACTUAL_NUMBER_EMPTY_STATE = 'EN BREUS COMENCEM!';

const tbody = document.getElementById('numberTableBody'),
actualNumberElem = document.getElementById('actualNumber'),
shownNumbers = [];

// TODO: Hacer hotkeys para que no haya botones en la pantalla...

window.onload = () => {
    setListeners();
    loadView();
}

const loadView = () => {
    addEmptyState();
    buildTable();
}

const setListeners = () => {

    window.onbeforeunload = () => {
        if (shownNumbers.length > 0) return false;
    }

    window.onkeydown = (event) => {
        preventComposingBug(event);

        // Space bar or Intro
        if (event.keyCode === 32 || event.keyCode === 13) {
            event.preventDefault();
            stir();
        }

        // Delte bar
        if (event.keyCode === 8) {
            reset();
        }

        // F
        if (event.keyCode === 70) {
            toggleFullScreen();
        }
    }
}

const buildTable = () => {
    for (let i = MIN_NUMBER, perRowCounter = 1, actualTr; i <= MAX_NUMBER; i++, perRowCounter++) {

        if (perRowCounter == 1) {
            actualTr = document.createElement('tr');
            tbody.appendChild(actualTr);
        }

        const td = document.createElement('td');
        td.id = `number-${i}`;
        td.innerHTML = i;
        td.onclick = tdClick;
        actualTr.appendChild(td);

        if (perRowCounter === NUMBERS_PER_ROW) {
            perRowCounter = 0;
        }

    }
}

const tdClick = (event) => {
    updateSelectionLenghtView(event.target);
    toggleSelectedStatus(event.target);
}

const updateSelectionLenghtView = (elem) => {
    if (elem.classList.contains('shown')) {
        const selectedElems = document.getElementsByClassName('selected') | [];
        const container = document.getElementById('lenghtContainer');
        if (selectedElems.length > 0) {
            container.innerHTML = `(${selectedElems.length})`;
        }
    }
}

const stir = () => {
    if (!gameIsFinished()) {
        const newNumber = getNewNumber();
        actualNumberElem.innerHTML = newNumber;
        shownNumbers.push(newNumber);
        document.getElementById(`number-${newNumber}`).classList.add('shown');
        showWarningIfGameFinished();
    }
}

const getNewNumber = () => {
    let number = getRandomNumber();
    while (shownNumbers.includes(number)) {
        number = getRandomNumber();
    }
    return number;
}

const getRandomNumber = () => {
    return Math.floor(Math.random() * (MAX_NUMBER - MIN_NUMBER + 1) + MIN_NUMBER);
}

const reset = () => {
    shownNumbers.splice(0, shownNumbers.length);
    addEmptyState();
    deselect();
    [...tbody.getElementsByClassName('shown')].forEach( elem => {
        elem.classList.remove('shown');
    });
}

const gameIsFinished = () => {
    return shownNumbers.length > MAX_NUMBER - MIN_NUMBER;
}

const showWarningIfGameFinished = () => {
    if (gameIsFinished()) {
        setTimeout(() => {
            alert('S\'HA ACABAT EL TAULER');
        }, 400);
    }
}

const addEmptyState = () => {
    const paragraph = document.createElement('p');
    actualNumberElem.innerHTML = ACTUAL_NUMBER_EMPTY_STATE;
}

const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
}

const preventComposingBug = (event) => {
    if (event.isComposing || event.keyCode === 229) {
        return;
    }
}

const toggleSelectedStatus = (elem) => {
    if (elem.classList.contains('shown')) {
        elem.classList.toggle('selected');
    }
}

const deselect = () => {
    [...tbody.getElementsByClassName('selected')].forEach( elem => {
        elem.classList.remove('selected');
    });
}