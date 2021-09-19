import {GrNewWindow} from 'react-icons/gr';
import {VscDebugRestart} from 'react-icons/vsc';
import {IoGift} from 'react-icons/io5';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 16px;
    margin-bottom: 16px;
    background-color: lightgray;
`;

const Icon = styled.image`
    margin: 8px;
    &:hover{
        filter: invert(50%);
    }
`;

const Select = styled.select`
    border-radius: 8px;
    border: none;
    padding: 16px 8px;
    font-size: 1rem;
    background-color: white;
    margin: 8px;
`

export const Header = ({timer, moves, newGame, setSuit, resetGame, showCard, toggleCustomCards}) => {
    return (
        <Container>
            <div>
                <Icon 
                    alt="Открытка" 
                    title="Открытка"
                    onClick={showCard}>
                    <IoGift size={30}/>
                </Icon>
                <Icon 
                    alt="новая игра" 
                    title="новая игра"
                    onClick = {newGame}>
                    <GrNewWindow size={30}/>
                </Icon>
                <Icon 
                    alt="сбросить игру " 
                    title="сбросить игру " 
                    onClick={resetGame}>
                    <VscDebugRestart size={30} />
                </Icon>
                <Select onChange={e => setSuit(parseInt(e.target.value, 10))}>
                    <option value="4">четыре масти</option>
                    <option value="2">две масти</option>
                    <option value="1">однa масть</option>
                </Select>
                <input type="checkbox" name="custom" value="custom" checked="true" onChange={toggleCustomCards}/>  
                <label for="custom"> собственные карты </label>
            </div>
            <div>
                таймер: {timer}s <br /> ходы: {moves} 
            </div>
        </Container>
    )   
}