import styled from "styled-components";
import {Card} from './Card';

const Container = styled.div`
    max-height: 20vh;
    width: 100%;
    margin: 16px;
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    vertical-align: bottom;
`;

const DealButton = styled.div`
    grid-area: 1/1/1/3;
`;

export const Bottom = ({onDeal, stack, collected, custom}) => {
    return (
        <Container>
            <DealButton onClick={onDeal}>
                <Card 
                    card={{open: false, empty: !stack.length}}
                    spacing={0}/>
            </DealButton>
            {
                [0, 1, 2, 3, 4, 5, 6, 7].map(i => (
                    collected[i] ? 
                    <Card card={collected[i]} spacing={0} custom={custom}/> :
                    <Card card={{card: 0, empty: true}} custom={custom}/> 
                ))
            }
        </Container>
    );
}