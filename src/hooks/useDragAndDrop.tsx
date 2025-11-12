import { useEffect, useState } from 'react'

type Axis = 'both' | 'x' | 'y'

type DndArgs = {
	startX: number
	startY: number
	onDrag?: (newX: number, newY: number) => void
	onFinish?: (newX: number, newY: number) => void
	axis?: Axis
	isMultiple?: boolean
	onMultipleDragStart?: () => void
	onMultipleDrag?: (deltaX: number, deltaY: number) => void
	onMultipleDragFinish?: () => void
}

type DndResult = {
	isDragging: boolean
	top: number
	left: number
	onMouseDown: (event: React.MouseEvent) => void
}

export function useDnd({
	startX,
	startY,
	onDrag, 
	onFinish,
	axis = 'both',
	isMultiple = false,
	onMultipleDragStart,
	onMultipleDrag,
	onMultipleDragFinish,
}: DndArgs): DndResult {
	const [isDragging, setIsDragging] = useState(false)
	const [offsetX, setOffsetX] = useState(0)
	const [offsetY, setOffsetY] = useState(0)
	const [top, setTop] = useState(startY)
	const [left, setLeft] = useState(startX)
	const [startDragPosition, setStartDragPosition] = useState({ x: 0, y: 0 })

	const onMouseDown = (event: React.MouseEvent) => {
		event.preventDefault()
		event.stopPropagation()
		
		setIsDragging(true)
		setOffsetX(left - event.clientX)
		setOffsetY(top - event.clientY)
		setStartDragPosition({ x: event.clientX, y: event.clientY })
		
		if (isMultiple) {
			onMultipleDragStart?.()
		}
	}

	useEffect(() => {
		if (!isDragging) return

		const handleMouseMove = (event: MouseEvent) => {
			let newLeft = left
			let newTop = top

			if (axis === 'both' || axis === 'x') {
				newLeft = event.clientX + offsetX
			}
			if (axis === 'both' || axis === 'y') {
				newTop = event.clientY + offsetY
			}

			setLeft(newLeft)
			setTop(newTop)
			
			if (isMultiple) {
				const deltaX = event.clientX - startDragPosition.x
				const deltaY = event.clientY - startDragPosition.y
				onMultipleDrag?.(deltaX, deltaY)
			} else {
				onDrag?.(newLeft, newTop)
			}
		}

		const handleMouseUp = () => {
			setIsDragging(false)
			
			if (isMultiple) {
				onMultipleDragFinish?.()
			} else {
				onFinish?.(left, top)
			}
		}

		window.addEventListener('mousemove', handleMouseMove)
		window.addEventListener('mouseup', handleMouseUp)

		return () => {
			window.removeEventListener('mousemove', handleMouseMove)
			window.removeEventListener('mouseup', handleMouseUp)
		}
	}, [isDragging, offsetX, offsetY, axis, left, top, onDrag, onFinish, isMultiple, onMultipleDrag, onMultipleDragFinish, startDragPosition])

	return { isDragging, top, left, onMouseDown }
}