import {useState, useEffect, useRef} from 'react';

export const useDragNDrop = (callbacks) => {
    
    const [{style, dragging}, setState] = useState({
        dx: 0,
        dy: 0,
        dragging: false,
        style: {},
    });

    const dragRef = useRef(dragging);
    useEffect(() => dragRef.current = dragging, [dragging]);

    useEffect(() => {
        const dragListener = (e) => {
            if(dragRef.current)
                setState(s => ({
                ...s,
                style: getStyle(e, s.dx, s.dy) 
            }));
        }
        window.addEventListener("pointermove", dragListener);
        const mouseUpListener = (e) => {
            callbacks?.dragEndCallback?.(e);
            setState(s => ({...s, dragging: false}));
        }
        window.addEventListener("mouseup", mouseUpListener);
        return () => {
            window.removeEventListener("mouseup", mouseUpListener);
            window.removeEventListener("pointermove", dragListener);
        }
    }, []);

    const onMouseDown = (e) => {
        setState(s => {
            const dx = e.screenX - e.target.getBoundingClientRect().left;
            const dy = e.screenY - e.target.getBoundingClientRect().top;
            return {
                dx, dy,
                dragging: true,
                style: getStyle(e, dx, dy),
            }});
        callbacks?.dragStartCallback?.(e);
    }

    const clearStyle = () => 
        setState(s => ({
            ...s,
            style:{},
        }));
    

    return {
        style,
        onMouseDown,
        onMouseEnter: (e) => e.preventDefault(),
        clearStyle,
    }
}

const getStyle = (e, dx, dy) => ({
    position: 'absolute',
    pointerEvents: 'none',
    left: e.screenX - dx,
    top: e.screenY - dy,
});