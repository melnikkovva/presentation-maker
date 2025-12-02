import { useEffect, useState, useCallback } from 'react';

type Axis = 'both' | 'x' | 'y';

type DndArgs = {
  startX: number;
  startY: number;
  onDrag?: (newX: number, newY: number, deltaX: number, deltaY: number) => void;
  onFinish?: (finalX: number, finalY: number) => void;
  axis?: Axis;
  isSelected?: boolean;
  objectId?: string;
  onSelectionChange?: (objectId: string, addToSelection: boolean) => void;
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
  objectId = '',
  onSelectionChange,
}: DndArgs): DndResult {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: startX, y: startY });
  const [dragStartPosition, setDragStartPosition] = useState({
    clientX: 0,
    clientY: 0,
    objectX: startX,
    objectY: startY,
  });

  useEffect(() => {
    if (!isDragging) {
      setPosition({ x: startX, y: startY });
    }
  }, [startX, startY, isDragging]);

  const onMouseDown = useCallback(
  (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const ctrlKey = event.ctrlKey || event.metaKey;

    if (onSelectionChange && objectId) {
      onSelectionChange(objectId, ctrlKey); 
    }

    setIsDragging(true);
    setDragStartPosition({
      clientX: event.clientX,
      clientY: event.clientY,
      objectX: position.x,
      objectY: position.y,
    });
  },
  [position, objectId, onSelectionChange]
);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (event: MouseEvent) => {
      const deltaX = event.clientX - dragStartPosition.clientX;
      const deltaY = event.clientY - dragStartPosition.clientY;

      let newX = dragStartPosition.objectX + deltaX;
      let newY = dragStartPosition.objectY + deltaY;

      if (axis === 'x') newY = dragStartPosition.objectY;
      if (axis === 'y') newX = dragStartPosition.objectX;

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
  }, [isDragging, dragStartPosition, axis, onDrag, onFinish, position]);

  return {
    isDragging,
    top: position.y,
    left: position.x,
    onMouseDown,
  };
}