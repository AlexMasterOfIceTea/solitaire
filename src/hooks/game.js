import { useState, useEffect } from "react";
import { getPath, isNumericSuccecessor, predecesor, successor } from "../util";
import { useDragNDrop } from "./dragAndDrop";
import { useRandom } from "./prng";
import { useTimer } from "./useTimer";

export const useGame = (suit) => {
	const seed = Math.floor(Math.random()*0xFFFFFFFF);
	const [timer, resetTimer, stopTimer] = useTimer();
	const [next, resetRandom, newRandom] = useRandom(seed);

	//Idk why 
    useEffect(() => {resetGame()}, []);

	const [state, setState] = useState(() => ({
		moves: 0,
		won: false,
		suit,
		...initStacks(next, suit),
	}));

    const couldMerge = (s, index) => {
        if(!s.dragStack.length || s.dragOrigin === undefined || index === undefined)
            return false;
        const target = s.stacks[index];
        return !target.length || index === s.dragOrigin || isNumericSuccecessor(s.dragStack[0].card, target[target.length-1].card)
    }

	const splitStack = (stackIndex, cardIndex) => {
		setState(s => {
			if (
				s.dragStack.length ||
				!isSplittable(s.stacks[stackIndex], cardIndex)
			)
				return s;
			const first = s.stacks[stackIndex].slice(0, cardIndex);
			const second = s.stacks[stackIndex].slice(cardIndex);

			const newStacks = [...s.stacks];
			newStacks[stackIndex] = first;

			return {
				...s,
				dragStack: second,
				dragOrigin: stackIndex,
				stacks: newStacks,
			};
		});
	};

	const dealCards = () => {
		stopTimer();
		setState(s => {
			if (!s.stack.length) 
				return s;
			for(const stack of s.stacks)
				if(!stack.length)
					return s;
			const stacks = [...s.stacks];
			const stack = [...s.stack];
			for(let i=0; i<stacks.length; i++){
				//deep clone to not mutate state
				stacks[i] = [...stacks[i]];
				stacks[i].push(stack.pop());
			}
			
			return {
				...s,
				stacks,
				stack
			}
		});
	};

	const mergeStacks = stackIndex => {
		setState(s => {
            if(s.dragOrigin === undefined)
                return s;
			const mergeIndex =
				couldMerge(s, stackIndex)
					? stackIndex
					: s.dragOrigin;
			
			let moves = s.moves;
			if(couldMerge(s, stackIndex))
				moves++;
								
			const newStack = [...s.stacks[mergeIndex], ...s.dragStack];
			const newStacks = [...s.stacks];
					
			const shouldOpen = s.stacks[s.dragOrigin].length && mergeIndex === stackIndex && mergeIndex !== s.dragOrigin; 
            if(shouldOpen)
                openLastCard(newStacks[s.dragOrigin]);

			const collected = [...s.collected];
			let won = s.won;

			if(checkCollected(newStack)){
				collected.push(newStack[newStack.length-13]);
				newStack.splice(newStack.length - 13, 13);
				openLastCard(newStack);
				if(collected.length === 8){
					won = true;
					stopTimer();
				}
			}
			
			newStacks[mergeIndex] = newStack;
			return {
				...s,
				won,
				moves,
				collected,
				dragStack: [],
				dragOrigin: undefined,
				stacks: newStacks,
			};
		});
	};

	const resetGame = () => {
		resetRandom();
		resetTimer();
		setState(s => ({...s, moves: 0, won: false, ...initStacks(next, s.suit)}));
	}

	const newGame = () => {
		const seed = Math.floor(Math.random()*0xFFFFFFFF);
		newRandom(seed);
		setState(s => ({...s, moves: 0, won: false, ...initStacks(next, s.suit)}));
	}

	return {
		state: {...state, timer},
		mergeStacks,
		splitStack,
        couldMerge,
		dealCards,
		resetGame,
		setSuit: (suit) => {
			setState(s => ({...s, suit}));
			resetGame();
		},
		newGame
	};
};

const openLastCard = (stack) => {
	if(stack.length) 
		stack[stack.length-1].open = true;
}

const checkCollected = (stack) => {
	if(stack.length < 13)
		return false;
	if(!stack[stack.length-1].open)
		return false;
	for(let i=1; i<13; i++){
		if(!stack[stack.length-1-i].open)
			return false;
		if(stack[stack.length-1-i].card !== successor(stack[stack.length-i].card))
			return false;
	}
	return true;
}

const preloadImages = () => Array.from(new Array(52), (v, i) => i).forEach(i => new Image().src = getPath(i));

const isSplittable = (stack, index) => {
	for (let i = index; i < stack.length - 1; i++) {
		if (!stack[i].open || stack[i + 1].card !== predecesor(stack[i].card))
			return false;
	}
	return true;
};

const initStacks = (next, suits) => {
	let key = 0;
	const cards = Array.from(new Array(suits*13), (v, i) => i);
	let allCards = [...cards, ...cards];
	if(suits < 4)
		allCards = [...allCards, ...allCards];
	if(suits < 2)	
		allCards = [...allCards, ...allCards];
	const stacks = [];
	const stack = [];

	for (let i = 0; i < 10; i++, key++) {
		stacks.push([]);
		const max = i % 3 ? 5 : 6;
		for (let j = 0; j < max; j++) {
			const index = Math.floor(next() * allCards.length);
			const card = allCards[index];
			allCards.splice(index, 1);
			stacks[i].push({ card, open: j === max-1, key});
		}
	}

	const len = allCards.length;
	for (let i = 0; i < len; i++, key++) {
		const index = Math.floor(next() * allCards.length);
		const card = allCards[index];
		allCards.splice(index, 1);
		stack.push({ card, open: true, key });
	}

	return { stacks, stack, dragStack: [], collected: [], dragOrigin: undefined };
};
