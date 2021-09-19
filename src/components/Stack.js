import styled from "styled-components";
import { Card } from "./Card";
import { useRef, useEffect, useState } from "react";

const Container = styled.div`
	height: ${p => (p.isDragStack ? "50vh" : "100%")};
	width: 7vw;
`;

export const Stack = ({
	custom,
	parentRef,
	cards,
	index,
	splitStack,
	splitCallback,
	...props
}) => {
	//calculate spacing between the cards
	let { containerHeight, cardHeight } = useCurrentHeight(parentRef);
	containerHeight -= 100;

	//h = (c_h*l) - s*(c_l-1)
	let spacing =
		(cardHeight * cards.length - containerHeight) / (cards.length - 1);
	if (spacing < cardHeight * 0.6) 
		spacing = cardHeight * 0.6;
	

	const myCards =
		cards.length || props.isDragStack ? cards : [{ empty: true }];
	return (
		<Container
			spacing={spacing}
			isDragStack={props.isDragStack || false}
			onMouseEnter={() => props?.onEnterStack?.(index)}
			onMouseLeave={() => props?.onLeaveStack?.(index)}
		>
			{myCards.map((card, i) => (
				<div
					onMouseDown={e => {
						if (!props.isDragStack) {
							splitStack(index, i);
							splitCallback(e);
						}
					}}
				>
					<Card
						card={card}
						custom={custom}
						spacing={i ? spacing : 0}
						selected={props.selected && i === myCards.length - 1}
					/>
				</div>
			))}
		</Container>
	);
};

function useCurrentHeight(ref) {
	const [heights, setHeights] = useState({
		containerHeight: 0,
		cardHeight: 0,
	});

	useEffect(() => {
		const resizeListener = () =>
			setHeights({
				containerHeight:
					ref?.current?.getBoundingClientRect().height || 0,
				cardHeight: (window.innerWidth / 100) * 9.5,
			});
		resizeListener();

		window.addEventListener("resize", resizeListener);
		return () => window.removeEventListener("resize", resizeListener);
	}, []);

	return heights;
}
