import InnerImageZoom from "react-inner-image-zoom";
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.min.css';
import styled from "styled-components";

const Overlay = styled.div`
	position: absolute;
	left: 0;
	top: 0;
	background-color: black;
	opacity: ${p => (p.open ? 0.9 : 0)};
	transition: all 500ms;
    height: 100%;
	width: 100%;
`;

const Container = styled.div`
	z-index: ${p => (p.open ? 1 : -1)};
    transition: all 500ms;
    position: absolute;
    left: 0;
	top: 0;
    height: 100%;
	width: 100%;
`;

const ImageContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: ${p => (p.open ? 1 : 0)};
	transition: all 500ms;
`;

export const BirthdayCard = ({ onDismiss, open }) => (
    <Container open={open}>
        <Overlay onClick={onDismiss} open={open}/>
        <ImageContainer open={open} onClick={e => e.stopPropagation()}>
            <InnerImageZoom
                moveType={'drag'}
                hasSpacer
                width={600}
                height={900}
                src="images/bday-card.jpg"
                zoomScale={0.5}
            />
        </ImageContainer>
    </Container>
);
