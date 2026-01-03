import { useState, useEffect, useRef } from 'react'
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
    preserveAspectRatio?: boolean
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
        preserveAspectRatio = false,
    } = args

    const [resizeState, setResizeState] = useState<ResizeHandleState | null>(null)
    const [currentSize, setCurrentSize] = useState({
        width,
        height,
        x,
        y
    })

    const hasPositionChangedRef = useRef(false)

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

        const aspectRatio = preserveAspectRatio ? startWidth / startHeight : null

        switch (axis) {
            case 'e': 
                newWidth = Math.max(minWidth, startWidth + deltaX)
                break
            case 'w': 
                const maxDeltaXLeft = startWidth - minWidth
                const actualDeltaXLeft = Math.min(deltaX, maxDeltaXLeft)
                newWidth = Math.max(minWidth, startWidth - actualDeltaXLeft)
                if (actualDeltaXLeft === deltaX) {
                    newX = startX + deltaX
                } else {
                    newX = startX + maxDeltaXLeft
                }
                break
            case 's': 
                newHeight = Math.max(minHeight, startHeight + deltaY)
                break
            case 'n': 
                const maxDeltaYTop = startHeight - minHeight
                const actualDeltaYTop = Math.min(deltaY, maxDeltaYTop)
                newHeight = Math.max(minHeight, startHeight - actualDeltaYTop)
                if (actualDeltaYTop === deltaY) {
                    newY = startY + deltaY
                } else {
                    newY = startY + maxDeltaYTop 
                }
                break
            case 'se': 
                if (preserveAspectRatio && aspectRatio) {
                    const maxDeltaX = startWidth - minWidth
                    const maxDeltaY = startHeight - minHeight
                    
                    const scaleX = 1 + Math.min(deltaX / startWidth, maxDeltaX / startWidth)
                    const scaleY = 1 + Math.min(deltaY / startHeight, maxDeltaY / startHeight)
                    const scale = Math.min(scaleX, scaleY)
                    
                    newWidth = Math.max(minWidth, startWidth * scale)
                    newHeight = newWidth / aspectRatio
                } else {
                    newWidth = Math.max(minWidth, startWidth + deltaX)
                    newHeight = Math.max(minHeight, startHeight + deltaY)
                }
                break
            case 'sw':
                if (preserveAspectRatio && aspectRatio) {
                    const maxDeltaXLeft = startWidth - minWidth
                    const actualDeltaXLeft = Math.min(deltaX, maxDeltaXLeft)
                    
                    newWidth = Math.max(minWidth, startWidth - actualDeltaXLeft)
                    newHeight = newWidth / aspectRatio
                    newHeight = Math.max(minHeight, newHeight)
                    
                    if (actualDeltaXLeft === deltaX) {
                        newX = startX + deltaX
                    } else {
                        newX = startX + maxDeltaXLeft
                    }
                    
                    const maxDeltaYBottom = startHeight - minHeight
                    if (deltaY > maxDeltaYBottom) {
                        newHeight = minHeight
                    }
                } else {
                    const maxDeltaXLeft = startWidth - minWidth
                    const actualDeltaXLeft = Math.min(deltaX, maxDeltaXLeft)
                    
                    newWidth = Math.max(minWidth, startWidth - actualDeltaXLeft)
                    newHeight = Math.max(minHeight, startHeight + deltaY)
                    
                    if (actualDeltaXLeft === deltaX) {
                        newX = startX + deltaX
                    } else {
                        newX = startX + maxDeltaXLeft
                    }
                }
                break
            case 'ne':
                if (preserveAspectRatio && aspectRatio) {
                    const maxDeltaYTop = startHeight - minHeight
                    const actualDeltaYTop = Math.min(deltaY, maxDeltaYTop)
                    
                    newHeight = Math.max(minHeight, startHeight - actualDeltaYTop)
                    newWidth = newHeight * aspectRatio
                    newWidth = Math.max(minWidth, newWidth)
                    
                    if (actualDeltaYTop === deltaY) {
                        newY = startY + deltaY
                    } else {
                        newY = startY + maxDeltaYTop
                    }
                    
                    const maxDeltaXRight = startWidth - minWidth
                    if (deltaX > maxDeltaXRight) {
                        newWidth = minWidth
                    }
                } else {
                    const maxDeltaYTop = startHeight - minHeight
                    const actualDeltaYTop = Math.min(deltaY, maxDeltaYTop)
                    
                    newWidth = Math.max(minWidth, startWidth + deltaX)
                    newHeight = Math.max(minHeight, startHeight - actualDeltaYTop)
                    
                    if (actualDeltaYTop === deltaY) {
                        newY = startY + deltaY
                    } else {
                        newY = startY + maxDeltaYTop
                    }
                }
                break
            case 'nw': 
                if (preserveAspectRatio && aspectRatio) {
                    const maxDeltaXLeft = startWidth - minWidth
                    const maxDeltaYTop = startHeight - minHeight
                    const actualDeltaXLeft = Math.min(deltaX, maxDeltaXLeft)
                    const actualDeltaYTop = Math.min(deltaY, maxDeltaYTop)
                    
                    const scaleX = 1 - actualDeltaXLeft / startWidth
                    const scaleY = 1 - actualDeltaYTop / startHeight
                    const scale = Math.min(scaleX, scaleY)
                    
                    newWidth = Math.max(minWidth, startWidth * scale)
                    newHeight = newWidth / aspectRatio
                    
                    if (actualDeltaXLeft === deltaX) {
                        newX = startX + deltaX
                    } else {
                        newX = startX + maxDeltaXLeft
                    }
                    
                    if (actualDeltaYTop === deltaY) {
                        newY = startY + deltaY
                    } else {
                        newY = startY + maxDeltaYTop
                    }
                } else {
                    const maxDeltaXLeft = startWidth - minWidth
                    const maxDeltaYTop = startHeight - minHeight
                    const actualDeltaXLeft = Math.min(deltaX, maxDeltaXLeft)
                    const actualDeltaYTop = Math.min(deltaY, maxDeltaYTop)
                    
                    newWidth = Math.max(minWidth, startWidth - actualDeltaXLeft)
                    newHeight = Math.max(minHeight, startHeight - actualDeltaYTop)
                    
                    if (actualDeltaXLeft === deltaX) {
                        newX = startX + deltaX
                    } else {
                        newX = startX + maxDeltaXLeft
                    }
                    
                    if (actualDeltaYTop === deltaY) {
                        newY = startY + deltaY
                    } else {
                        newY = startY + maxDeltaYTop
                    }
                }
                break
        }

        newWidth = Math.max(minWidth, newWidth)
        newHeight = Math.max(minHeight, newHeight)

        return { newWidth, newHeight, newX, newY }
    }

    function onResizeHandleMouseDown(axis: ResizeHandleAxis, event: React.MouseEvent) {
        if (!enabled) return
        
        event.preventDefault()
        event.stopPropagation()

        // Сбрасываем флаг при начале ресайза
        hasPositionChangedRef.current = false

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

            // Проверяем, изменилась ли позиция
            if (newX !== resizeState.startX || newY !== resizeState.startY) {
                hasPositionChangedRef.current = true
            }

            setCurrentSize({
                width: newWidth,
                height: newHeight,
                x: newX,
                y: newY
            })
            
            onResize?.(newWidth, newHeight, newX, newY)
        }

        const onMouseUp = (event: MouseEvent) => {
            if (resizeState?.isResizing) {
                event.preventDefault()
                
                const deltaX = event.clientX - resizeState.mouseStartX
                const deltaY = event.clientY - resizeState.mouseStartY
                
                // Используем последние рассчитанные значения
                const { newWidth, newHeight, newX, newY } = calculateNewSize(
                    resizeState.axis,
                    deltaX,
                    deltaY,
                    resizeState.startWidth,
                    resizeState.startHeight,
                    resizeState.startX,
                    resizeState.startY
                )

                // Всегда вызываем onResizeEnd с актуальными значениями
                onResizeEnd?.(newWidth, newHeight, newX, newY)
                
                // Сбрасываем состояние только после вызова колбэков
                setTimeout(() => {
                    setResizeState(null)
                }, 0)
            }
        }

        if (resizeState?.isResizing) {
            window.addEventListener('mousemove', onMouseMove)
            window.addEventListener('mouseup', onMouseUp, { once: true })
        }

        return () => {
            window.removeEventListener('mousemove', onMouseMove)
            window.removeEventListener('mouseup', onMouseUp)
        }
    }, [resizeState, onResize, onResizeEnd, preserveAspectRatio, minWidth, minHeight])

    useEffect(() => {
        // Обновляем текущий размер только если не ресайзим
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