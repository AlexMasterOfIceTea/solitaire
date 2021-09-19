import styled from "styled-components";
import { useAnimatedMovement } from "../hooks/animateMovement";
import { getPath } from "../util";

export const CardStyled = styled.div`
	transition: margin 200ms;
	width: 7vw;
	aspect-ratio: 7/9.5;
	margin-top: ${p => -p.spacing}px;
	${p =>
		p.selected
			? "border: 0.5vmin dashed red;"
			: "border: 0.25vmin solid black;"}

	border-radius: 1vmin;
	${p => !p.empty && `background-image: url(${p.src})`};
	background-repeat: no-repeat;
	background-size: cover;
`;

export const Card = ({ card, spacing, custom, ...props }) => (
	<CardStyled
		{...{ spacing }}
		selected={props.selected}
		empty={props.empty || card.empty}
		src={card.open ? getPath(card.card, custom) : "images/cards/back.jpeg"}
	/>
);
