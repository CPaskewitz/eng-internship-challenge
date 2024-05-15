//initialize types
type Grid = string[][];
type Position = {
    row: number;
    col: number;
};
const secretMessage = "IKEWENENXLNQLPZSLERUMRHEERYBOFNEINCHCV";
const key = "SUPERSPY";

console.log(playFair(secretMessage, key));

//solves the secret message via PlayFair Cipher rules
function playFair(secretMessage: string, key: string): string {
    const updatedKey = updateKey(key);
    const grid = createGrid(updatedKey);
    const pairedMessage = pairMessageChars(secretMessage);
    const decipheredMessage = decipherPairs(pairedMessage, grid);
    return formMessage(decipheredMessage);
}

//update key to playfair cipher rulings
function updateKey(key: string): string {
    //ensure all letters are uppercase and any J's are transformed to I's
    key = key.toUpperCase().replace(/J/g, "I");
    let keyWord = "";

    //loop over each character to ensure there are no duplicates
    for (let char of key) {
        if (!keyWord.includes(char)) {
            keyWord += char;
        }
    }
    return keyWord;
}

//create a 5x5 grid
function createGrid(key: string): Grid {
    const grid: Grid = [];
    //initialize alphabet in all caps and without a J
    const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
    //combine the key and the alphabet together into an array - Set is used as it only allows unique values to remove duplicate characters
    const combineKeyAlphabet = Array.from(new Set(updateKey(key) + alphabet)).join("");

    //loop over each character to form a 5x5 grid
    for (let i = 0; i < 5; i++) {
        grid[i] = combineKeyAlphabet.slice(i * 5, i * 5 + 5).split("");
    }
    return grid;
}

//split the encrypted message into pairs
function pairMessageChars(message: string): string {
    //ensure the encrypted message is in all caps, removes any non-letters and any J's are replaced with I's
    message = message.toUpperCase().replace(/[^A-Z]/g, "").replace(/J/g, "I");
    let pairedMessage = "";

    //loop over each character, skipping a number each iteration so characters remain in pairs
    for (let i = 0; i < message.length; i += 2) {
        let pair = message[i];
        //check if the positon in the array exists and if character is the same as the next character, if true adds X as next character
        //note if X is expected in deciphered message, use a special character or another unexpected character such as Z
        if (i + 1 < message.length && message[i] === message[i + 1]) {
            pair += "X";
            //reduces i by 1 to ensure the duplicated character also gets paired
            i--;
        //check if the next character exists, if true adds the next character to the pair
        } else if (i + 1 < message.length) {
            pair += message[i + 1];
        //otherwise pair with an X
        } else {
            pair += "X";
        }
        pairedMessage += pair;
    }
    return pairedMessage; 
}

//find the position of a character in the grid
function getPosition(char: string, grid: Grid): Position {
    let position = {row: -1, col: -1};

    //loop over each character by its position (row and column)
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            //check if the character in this position is the character we are looking for
            if (grid[row][col] === char) {
                //set the position of the character
                position = {row, col};
            }
        }
    }
    return position;
}

//deciper the given message
function decipherPairs(pairedMessage: string, grid: Grid): string {
    let decipheredMessage = "";

    //loop over each pair of characters
    for (let i = 0; i < pairedMessage.length; i += 2) {
        let char1 = pairedMessage[i];
        let char2 = pairedMessage[i + 1];
        //get the position of the first character of the pairing
        let position1 = getPosition(char1, grid);
        //get the position of the second character of the pairing
        let position2 = getPosition(char2, grid);

        //check if the pair of characters are in the same row
        if (position1.row === position2.row) {
            //shift the character to the left, wrapping if necessary
            decipheredMessage += grid[position1.row][(position1.col + 4) % 5];
            decipheredMessage += grid[position2.row][(position2.col + 4) % 5];
        //check if the pair of characters ar in the same column
        } else if (position1.col === position2.col) {
            //shift the character up one, wrapping if necessary
            decipheredMessage += grid[(position1.row + 4) % 5][position1.col];
            decipheredMessage += grid[(position2.row + 4) % 5][position2.col];
        } else {
            //swap columns between the pairing
            decipheredMessage += grid[position1.row][position2.col];
            decipheredMessage += grid[position2.row][position1.col];
        }
    }
    return decipheredMessage;
}

//remove the X's from the deciphered message -- note if X's expected in deciphered message, change to a special character or other unexpected letter such a Z
function formMessage(message: string): string {
    return message.replace(/X/g, "");
}