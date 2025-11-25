import { useEffect, useState, useCallback } from 'react';

type Axis = 'both' | 'x' | 'y';

type DndArgs = {
  startX: number;
  startY: number;
  onDrag?: (newX: number, newY: number, deltaX: number, deltaY: number) => void;
  onFinish?: (newX: number, newY: number) => void;
  axis?: Axis;
};

type DndResult = {
  isDragging: boolean;
  top: number;
  left: number;
  onMouseDown: (event: React.MouseEvent) => void;
};

export function useDnd({
  startX,
  startY,
  onDrag,
  onFinish,
  axis = 'both',
}: DndArgs): DndResult {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: startX, y: startY });
  const [dragStartPosition, setDragStartPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isDragging) {
      setPosition({ x: startX, y: startY });
    }
  }, [startX, startY, isDragging]);

  const onMouseDown = useCallback((event: React.MouseEvent) => {
    event.preventDefault(); 
    setIsDragging(true);
    setDragStartPosition({ 
      x: event.clientX - position.x, 
      y: event.clientY - position.y 
    });
  }, [position]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (event: MouseEvent) => {
      let newX = event.clientX - dragStartPosition.x;
      let newY = event.clientY - dragStartPosition.y;

      const deltaX = newX - position.x;
      const deltaY = newY - position.y;

      setPosition({ x: newX, y: newY });
      onDrag?.(newX, newY, deltaX, deltaY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      onFinish?.(position.x, position.y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, position, dragStartPosition, axis, onDrag, onFinish]);

  return { 
    isDragging, 
    top: position.y, 
    left: position.x, 
    onMouseDown 
  };
}