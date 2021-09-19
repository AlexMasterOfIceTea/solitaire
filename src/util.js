export const getName = (num) => {
    const color = ["CLUB", "DIAMOND", "HEART", "SPADE"][Math.floor(num/13)];
    const number = num%13 + 1;
    return `${color}-${number}`;
}

export const getPath = (num, custom=true) => {
    if(custom && (num%13 >= 10 || num%13 === 0))
        return `images/customCards/${getName(num)}.jpg`;
    return `images/cards/${getName(num)}.svg`;
}

//Big brain english words: predecessor and successor
export const predecesor = (card) => card%13 ? card-1 : null;

export const successor = (card) => (card+1)%13 ? card+1 : null;

export const isNumericPredecessor = (card1, card2) => predecesor(card1%13) === card2%13;

export const isNumericSuccecessor = (card1, card2) => successor(card1%13) === card2%13;