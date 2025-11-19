import { useState, useEffect } from 'react'
import { MIN_DIV_HEIGHT, MIN_DIV_WIDTH } from '../store/data/const_for_presantation';


type ResizeHandleAxis = 's' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne';

type ResizeArgs = {
    width: number,
    height: number,
    x: number,
    y: number,
    onResize?: (newWidth: number, newHeight: number, newX: number, newY: number) => void,
    onResizeEnd?: (newWidth: number, newHeight: number, newX: number, newY: number) => void,
    minWidth?: number,
    minHeight?: number,
    enabled?: boolean,
}

type ResizeHandleState = {
    axis: ResizeHandleAxis;
    isResizing: boolean;
    startWidth: number;
    startHeight: number;
    startX: number;
    startY: number;
    mouseStartX: number;
    mouseStartY: number;
}

type ResizeResult = {
    isResizing: boolean;
    width: number;
    height: number;
    x: number;
    y: number;
    onResizeHandleMouseDown: (axis: ResizeHandleAxis, event: React.MouseEvent) => void;
}

export function useResize(args: ResizeArgs): ResizeResult {
    const {
        width,
        height,
        x,
        y,
        onResize,
        onResizeEnd,
        minWidth = MIN_DIV_WIDTH,
        minHeight = MIN_DIV_HEIGHT,
        enabled = true,
    } = args

    const [resizeState, setResizeState] = useState<ResizeHandleState | null>(null)
    const [currentSize, setCurrentSize] = useState({
        width,
        height,
        x,
        y
    })

    function calculateNewSize(
        axis: ResizeHandleAxis,
        deltaX: number,
        deltaY: number,
        startWidth: number,
        startHeight: number,
        startX: number,
        startY: number
    ) {
        let newWidth = startWidth
        let newHeight = startHeight
        let newX = startX
        let newY = startY

        const aspectRatio = startWidth / startHeight

        switch (axis) {
            case 'e': 
                newWidth = Math.max(minWidth, startWidth + deltaX)
                break
            case 'w': 
                const maxDeltaX = startWidth - minWidth
                const actualDeltaX = Math.min(deltaX, maxDeltaX)
                newWidth = Math.max(minWidth, startWidth - actualDeltaX)
                newX = startX + actualDeltaX
                break
            case 's': 
                newHeight = Math.max(minHeight, startHeight + deltaY)
                break
            case 'n': 
                const maxDeltaY = startHeight - minHeight
                const actualDeltaY = Math.min(deltaY, maxDeltaY)
                newHeight = Math.max(minHeight, startHeight - actualDeltaY)
                newY = startY + actualDeltaY
                break
            case 'se':      
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    newWidth = Math.max(minWidth, startWidth + deltaX)
                    newHeight = newWidth / aspectRatio
                } else {
                    newHeight = Math.max(minHeight, startHeight + deltaY)
                    newWidth = newHeight * aspectRatio
                }
                break
            case 'sw':
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    newWidth = Math.max(minWidth, startWidth - deltaX)
                    newHeight = newWidth / aspectRatio
                } else {
                    newHeight = Math.max(minHeight, startHeight + deltaY)
                    newWidth = newHeight * aspectRatio
                }
                newX = startX + (startWidth - newWidth)
                break
            case 'ne':
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    newWidth = Math.max(minWidth, startWidth + deltaX)
                    newHeight = newWidth / aspectRatio
                } else {
                    newHeight = Math.max(minHeight, startHeight - deltaY)
                    newWidth = newHeight * aspectRatio
                }
                newY = startY + (startHeight - newHeight)
                break
            case 'nw':
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    newWidth = Math.max(minWidth, startWidth - deltaX)
                    newHeight = newWidth / aspectRatio
                } else {
                    newHeight = Math.max(minHeight, startHeight - deltaY)
                    newWidth = newHeight * aspectRatio
                }
                newX = startX + (startWidth - newWidth)
                newY = startY + (startHeight - newHeight)
                break
        }

        return { newWidth, newHeight, newX, newY }
    }

    function onResizeHandleMouseDown(axis: ResizeHandleAxis, event: React.MouseEvent) {
        if (!enabled) return
        
        event.preventDefault()

        setResizeState({
            axis,
            isResizing: true,
            startWidth: currentSize.width,
            startHeight: currentSize.height,
            startX: currentSize.x,
            startY: currentSize.y,
            mouseStartX: event.clientX,
            mouseStartY: event.clientY,
        })
    }

    useEffect(() => {
        const onMouseMove = (event: MouseEvent) => {
            if (!resizeState?.isResizing) return

            const deltaX = event.clientX - resizeState.mouseStartX
            const deltaY = event.clientY - resizeState.mouseStartY

            const { newWidth, newHeight, newX, newY } = calculateNewSize(
                resizeState.axis,
                deltaX,
                deltaY,
                resizeState.startWidth,
                resizeState.startHeight,
                resizeState.startX,
                resizeState.startY
            )

            setCurrentSize({
                width: newWidth,
                height: newHeight,
                x: newX,
                y: newY
            })
            
            onResize?.(newWidth, newHeight, newX, newY)
        }

        const onMouseUp = () => {
            if (resizeState?.isResizing) {
                onResizeEnd?.(currentSize.width, currentSize.height, currentSize.x, currentSize.y)
                setResizeState(null)
            }
        }

        if (resizeState?.isResizing) {
            window.addEventListener('mousemove', onMouseMove)
            window.addEventListener('mouseup', onMouseUp)
        }

        return () => {
            window.removeEventListener('mousemove', onMouseMove)
            window.removeEventListener('mouseup', onMouseUp)
        }
    }, [resizeState, onResize, onResizeEnd, currentSize])

    useEffect(() => {
        if (!resizeState?.isResizing) {
            setCurrentSize({
                width,
                height,
                x,
                y
            })
        }
    }, [width, height, x, y, resizeState])

    return {
        isResizing: resizeState?.isResizing ?? false,
        width: currentSize.width,
        height: currentSize.height,
        x: currentSize.x,
        y: currentSize.y,
        onResizeHandleMouseDown,
    }
}