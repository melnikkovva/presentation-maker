import { useState, useCallback, useEffect } from 'react'

type ResizeHandleAxis = 's' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne';

type ResizeArgs = {
    width: number,
    height: number,
    x: number,
    y: number,
    onResize?: (newWidth: number, newHeight: number, newX: number, newY: number) => void,
    onResizeEnd?: (newWidth: number, newHeight: number, newX: number, newY: number) => void,
    lockAspectRatio?: boolean,
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
        lockAspectRatio = false,
        minWidth = 20,
        minHeight = 20,
        enabled = true,
    } = args

    const [resizeState, setResizeState] = useState<ResizeHandleState | null>(null)
    const [currentSize, setCurrentSize] = useState({
        width,
        height,
        x,
        y
    })

    const calculateNewSize = useCallback((
        axis: ResizeHandleAxis,
        deltaX: number,
        deltaY: number,
        startWidth: number,
        startHeight: number,
        startX: number,
        startY: number
    ) => {
        let newWidth = startWidth
        let newHeight = startHeight
        let newX = startX
        let newY = startY

        switch (axis) {
            case 'e': 
                newWidth = Math.max(minWidth, startWidth + deltaX)
                break
            case 'w': 
                newWidth = Math.max(minWidth, startWidth - deltaX)
                newX = startX + deltaX
                break
            case 's': 
                newHeight = Math.max(minHeight, startHeight + deltaY)
                break
            case 'n': 
                newHeight = Math.max(minHeight, startHeight - deltaY)
                newY = startY + deltaY
                break
            case 'se': 
                newWidth = Math.max(minWidth, startWidth + deltaX)
                newHeight = Math.max(minHeight, startHeight + deltaY)
                break
            case 'sw':
                newWidth = Math.max(minWidth, startWidth - deltaX)
                newHeight = Math.max(minHeight, startHeight + deltaY)
                newX = startX + deltaX
                break
            case 'ne':
                newWidth = Math.max(minWidth, startWidth + deltaX)
                newHeight = Math.max(minHeight, startHeight - deltaY)
                newY = startY + deltaY
                break
            case 'nw':
                newWidth = Math.max(minWidth, startWidth - deltaX)
                newHeight = Math.max(minHeight, startHeight - deltaY)
                newX = startX + deltaX
                newY = startY + deltaY
                break
        }

        if (lockAspectRatio) {
            const aspectRatio = startWidth / startHeight
            
            if (axis.includes('e') || axis.includes('w')) {
                const calculatedHeight = newWidth / aspectRatio
                
                if (axis.includes('n')) {
                    newY = startY + (startHeight - calculatedHeight)
                }
                newHeight = Math.max(minHeight, calculatedHeight)
            } else if (axis.includes('s') || axis.includes('n')) {
                const calculatedWidth = newHeight * aspectRatio
                
                if (axis.includes('w')) {
                    newX = startX + (startWidth - calculatedWidth)
                }
                newWidth = Math.max(minWidth, calculatedWidth)
            }
        }

        return { newWidth, newHeight, newX, newY }
    }, [minWidth, minHeight, lockAspectRatio])

    const onResizeHandleMouseDown = useCallback((axis: ResizeHandleAxis, event: React.MouseEvent) => {
        if (!enabled) return
        
        event.preventDefault()
        event.stopPropagation()

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
    }, [enabled, currentSize])

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
    }, [resizeState, calculateNewSize, onResize, onResizeEnd, currentSize])

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