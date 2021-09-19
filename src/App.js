import { useRandom } from "./hooks/prng";
import { useGame } from "./hooks/game";
import { getPath } from "./util";
import { Card } from "./components/Card";
import { Stack } from "./components/Stack";
import { useDragNDrop } from "./hooks/dragAndDrop";
import { useState, useRef, useEffect } from "react";
import { Bottom } from "./components/Bottom";
import { Header } from "./components/Header";
import styled from "styled-components";
import Confetti from "react-confetti";
import { useTimer } from "./hooks/useTimer";
import { BirthdayCard } from "./components/BirthdayCard";

const Container = styled.div`
	display: flex;
	flex-flow: column;
	height: 100vh;
`;

const HeaderWrapper = styled.div`
	height: 140px;
`;

const GameWrapper = styled.div`
	flex: 1;
	overflow: auto;
	display: flex;
	flex-direction: row;
	justify-content: space-evenly;
`;

const BottomWrapper = styled.div`
	min-height: 9.5vw;
`;

function App() {
	const {
		state,
		splitStack,
		mergeStacks,
		couldMerge,
		dealCards,
		resetGame,
		newGame,
		setSuit,
	} = useGame(4);

	const enteredStackRef = useRef(false);
	const onEnterStack = i => (enteredStackRef.current = i);
	const onLeaveStack = () => (enteredStackRef.current = undefined);

	const [selectedStack, setSelectedStack] = useState(undefined);
	const [customCards, setCustomCards] = useState(true);


	const draggable = useDragNDrop({
		dragEndCallback: e => mergeStacks(enteredStackRef.current),
		dragStartCallback: () => {},
	});

	useEffect(() => {
		if (state.dragStack.length) setSelectedStack(enteredStackRef.current);
		else setSelectedStack(undefined);
	}, [enteredStackRef.current]);

	const gameWrapperRef = useRef();
	const draggableStackRef = useRef();

	const [windowSize, setwindowSize] = useState({
		height: window.innerHeight,
		width: window.innerWidth,
	});
	const [cardOpen, setCardOpen] = useState(false);

	useEffect(() => {
		const resizeListener = () =>
			setwindowSize({
				height: window.innerHeight,
				width: window.innerWidth,
			});
		resizeListener();

		window.addEventListener("resize", resizeListener);
		return () => window.removeEventListener("resize", resizeListener);
	}, []);

	return (
		<>
			<Confetti
				numberOfPieces={state.won ? 200 : 0}
				recycle={state.won}
				width={windowSize.width}
				height={windowSize.height}
			/>
			<Container>
				<HeaderWrapper>
					<Header
						{...{
							newGame,
							setSuit,
							resetGame,
							showCard: () => {setCardOpen(c => !c)},
							toggleCustomCards: () => setCustomCards(s => !s),
							moves: state.moves,
							timer: state.timer,
						}}
					/>
				</HeaderWrapper>
				<GameWrapper ref={gameWrapperRef}>
					{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(index => (
						<Stack
							cards={state.stacks[index]}
							custom={customCards}
							parentRef={gameWrapperRef}
							{...{
								selected:
									selectedStack === index &&
									couldMerge(state, index),
								index,
								splitStack,
								onEnterStack,
								onLeaveStack,
								splitCallback: draggable.onMouseDown,
							}}
						/>
					))}
				</GameWrapper>
				<BottomWrapper>
					<Bottom
						onDeal={dealCards}
						stack={state.stack}
						custom={customCards}
						collected={state.collected}
					/>
				</BottomWrapper>
			</Container>
			<div {...draggable} ref={draggableStackRef}>
				<Stack
					cards={state.dragStack || []}
					isDragStack="true"
					parentRef={draggableStackRef}
				/>
			</div>
			<BirthdayCard onDismiss={() => setCardOpen(false)} open={cardOpen}/>
		</>
	);
}

export default App;
