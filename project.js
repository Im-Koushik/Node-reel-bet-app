//1. Get the Deposit amount
//2. Determine the No. of Lines
//3. Collect Bet amount
//4. Spin the Slot Machine
//5. Check if the User Won
//6. Give the user their winnings
//7. Play again

const prompt = require("prompt-sync")();


const ROWS = 3;
const COLS = 3;

const SYMBOL_COUNT = {
    A: 3,
    B: 4,
    C: 6,
    D: 8,
}

const SYMBOL_VALUE = {
    A: 5,
    B: 4,
    C: 3,
    D: 2,
}





const getDeposit = () => {
    while (true) {
        const depositAmount = prompt("Enter the Deposit Amount: ");
        const numberDepositAmount = parseFloat(depositAmount);

        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log("Invalid Deposit Amount... Enter Again! ");
        }
        else {
            return numberDepositAmount;
        }
    }
}

const getLines = () => {
    while (true) {
        const lines = prompt("Enter the No. of Lines to bet on (1-3): ");
        const numberLines = parseFloat(lines);

        if (isNaN(numberLines) || numberLines <= 0 || numberLines > 3) {
            console.log("Invalid No. of Lines... Enter Again! ");
        }
        else {
            return numberLines;
        }
    }
}

const getBet = (balance, lines) => {
    while (true) {
        const bet = prompt("Enter the Total Bet: ");
        const numberBet = parseFloat(bet);

        if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {
            console.log("Invalid Bet Amount... Enter Again! ");
        }
        else {
            return numberBet;
        }
    }
}


const spin = () => {

    //Copying all the symbols of the SYMBOL object into an array
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOL_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    //Getting a Random Reel from the symbols array
    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const dupArray = [...symbols];   //creating a dup array of symbols so we can delete after every push of the symbol into reels
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * dupArray.length);
            const selectedSymbol = dupArray[randomIndex];
            reels[i].push(selectedSymbol);
            dupArray.splice(randomIndex, 1);  //deleting the symbol that pushed into reels
        }
    }

    return reels;
}

const transpose = (reels) => {
    const transposeReels = [];

    for (let i = 0; i < ROWS; i++) {
        transposeReels.push([]);
        for (let j = 0; j < COLS; j++) {
            transposeReels[i].push(reels[j][i]);
        }
    }

    return transposeReels;
}

const printReels = (outputReels) => {
    for (let i = 0; i < outputReels.length; i++) {
        let rowString = "";
        for (let j = 0; j < outputReels[0].length; j++) {
            rowString += outputReels[i][j];
            if (j != outputReels[0].length - 1) {
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
}

const getWinnings = (outputReels, bet, lines) => {
    let winnings = 0;
    for (let row = 0; row < lines; row++) {
        const symbols = outputReels[row];
        let allSame = true;
        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }
        if (allSame) {
            winnings += bet * SYMBOL_VALUE[symbols[0]];
        }
    }
    return winnings;
}

const game = () => {
    let balance = getDeposit();

    while (true) {
        const lines = getLines();
        const bet = getBet(balance, lines);
        balance -= bet * lines;
        const reels = spin();
        const outputReels = transpose(reels);
        printReels(outputReels);
        const winnings = getWinnings(outputReels, bet, lines);
        balance += winnings;
        console.log("You Won, $" + winnings.toString());

        if (balance <= 0) {
            console.log("You ran out of Money!");
            break;
        }

        console.log("You have a balance of $" + balance);

        const gameAgain = prompt("Do you want to play again? (y/n) ");
        if (gameAgain != 'y') break;
    }
}

game();


