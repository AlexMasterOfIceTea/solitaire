import {useState, useEffect} from 'react';

export const useTimer = () => {
    const [time, setTime] = useState(0);
    const [timer, setTimer] = useState();

    useEffect(() => {
        const t = setTimeout(() => 
            setTime(t => t+1), 1000);
        
        setTimer(t);
        return () => clearTimeout(timer);
    }, [time]);

    return [time, ()=>{
        setTime(0);
        clearTimeout(timer);
    }, () => {
        clearTimeout(timer);
    }];
}