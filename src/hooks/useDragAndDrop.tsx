import { useEffect, useState } from 'react'

type Axis = 'both' | 'x' | 'y'

type DndArgs = {
	startX: number
	startY: number
	onDrag?: (newX: number, newY: number) => void
	onFinish?: (newX: number, newY: number) => void
	axis?: Axis
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
}: DndArgs): DndResult {
	const [isDragging, setIsDragging] = useState(false)
	const [offsetX, setOffsetX] = useState(0)
	const [offsetY, setOffsetY] = useState(0)
	const [top, setTop] = useState(startY)
	const [left, setLeft] = useState(startX)

	const onMouseDown = (event: React.MouseEvent) => {
		event.preventDefault()
		setIsDragging(true)
		setOffsetX(left - event.clientX)
		setOffsetY(top - event.clientY)
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
			onDrag?.(newLeft, newTop)
		}

		const handleMouseUp = () => {
			setIsDragging(false)
			onFinish?.(left, top)
		}

		window.addEventListener('mousemove', handleMouseMove)
		window.addEventListener('mouseup', handleMouseUp)

		return () => {
			window.removeEventListener('mousemove', handleMouseMove)
			window.removeEventListener('mouseup', handleMouseUp)
		}
	}, [isDragging, offsetX, offsetY, axis, left, top, onDrag, onFinish])

	return { isDragging, top, left, onMouseDown }
}
