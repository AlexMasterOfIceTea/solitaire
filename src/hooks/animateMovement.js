import {useRef, useEffect, useLayoutEffect, useState} from 'react';

export const useAnimatedMovement = () => {
    const ref = useRef();
    const positionRef = useRef({
        top: 0,
        left: 0,
    });
    const [dirty, setDirty] = useState(false);
    const [dx, setDx] = useState(0);
    const [dy, setDy] = useState(0);

    useLayoutEffect(() => {
        if(!ref.current)
            return;
        const rect = ref.current.getBoundingClientRect();
        setDx(rect.left - positionRef.current.left);
        setDy(rect.top - positionRef.current.top );
        setDirty(true);
        //console.log(rect.left - positionRef.current.left);
        //console.log(rect.top - positionRef.current.top);
        positionRef.current = {
            left: rect.left,
            top: rect.top,
        }
    }, [ref.current?.parentNode]);

    useEffect(() => {
        if(!ref.current || !dirty)
            return;
        setTimeout(() => {
            setDx(0);
            setDy(0);
            setDirty(false);
        }, 1000);
    }, [dirty]);

    return [ref, {dx, dy}];
}