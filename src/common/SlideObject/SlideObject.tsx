import React, { useState, useEffect } from 'react';
import { useDnd } from '../../hooks/useDragAndDrop';
import { useResize } from '../../hooks/useResize';
import { ResizeHandles } from '../../hooks/ResizeHandle';
import { MIN_DIV_HEIGHT, MIN_DIV_WIDTH, PREVIEW_SCALE } from '../../store/data/const_for_presantation';
import { dispatch } from '../../store/editor';
import { selectObject, toggleObjectSelection } from '../../store/functions/functions_of_presentation';
import type { SlideObject as SlideObjectType } from '../../store/types/types_of_presentation';

interface SlideObjectProps {
  object: SlideObjectType;
  isPreview: boolean;
  isSelected: boolean;
  currentSlideId?: string | null;
  isCtrlPressed?: boolean;
  onObjectMove?: (objectId: string, newX: number, newY: number) => void;
  onObjectResize?: (objectId: string, newWidth: number, newHeight: number, newX: number, newY: number) => void;
}

export function SlideObject(props: SlideObjectProps) {
  const scale = props.isPreview ? PREVIEW_SCALE : 1;
  const isInteractive = !props.isPreview;

  const [position, setPosition] = useState({
    x: props.object.x * scale,
    y: props.object.y * scale
  });

  const [size, setSize] = useState({
    width: props.object.w * scale,
    height: props.object.h * scale
  });

  useEffect(() => {
    setPosition({
      x: props.object.x * scale,
      y: props.object.y * scale
    });
    setSize({
      width: props.object.w * scale,
      height: props.object.h * scale
    });
  }, [props.object.x, props.object.y, props.object.w, props.object.h, scale]);

  const drag = useDnd({
    startX: position.x,
    startY: position.y,
    onDrag: (newX, newY) => {
      if (isInteractive) {
        setPosition({ x: newX, y: newY });
      }
    },
    onFinish: (finalX, finalY) => {
      if (isInteractive && props.onObjectMove && props.currentSlideId) {
        const originalX = finalX / scale;
        const originalY = finalY / scale;
        props.onObjectMove(props.object.id, originalX, originalY);
      }
    }
  });

  const resize = useResize({
    width: size.width,
    height: size.height,
    x: position.x,
    y: position.y,
    enabled: isInteractive && props.isSelected,
    onResize: (newWidth, newHeight, newX, newY) => {
      if (isInteractive) {
        setSize({ width: newWidth, height: newHeight });
        setPosition({ x: newX, y: newY });
      }
    },
    onResizeEnd: (finalWidth, finalHeight, finalX, finalY) => {
      if (isInteractive && props.onObjectResize && props.currentSlideId) {
        const originalWidth = finalWidth / scale;
        const originalHeight = finalHeight / scale;
        const originalX = finalX / scale;
        const originalY = finalY / scale;
        props.onObjectResize(props.object.id, originalWidth, originalHeight, originalX, originalY);
      }
    },
    minWidth: MIN_DIV_WIDTH,
    minHeight: MIN_DIV_HEIGHT
  });

  const handleClick = (event: React.MouseEvent) => {
    if (props.isPreview || !props.currentSlideId) return;
    event.stopPropagation();

    const selectionPayload = {
      slideId: props.currentSlideId,
      objectId: props.object.id,
      typeElement: props.object.type
    };

    if (props.isCtrlPressed) {
      dispatch(toggleObjectSelection, selectionPayload);
    } else {
      dispatch(selectObject, selectionPayload);
    }
  };

  const renderContent = () => {
    if (props.object.type === 'text') {
      return (
        <div style={{
          fontSize: `${props.object.fontSize}px`,
          fontFamily: props.object.fontFamily,
          fontWeight: props.object.fontWeight,
          color: props.object.color,
          textAlign: props.object.textAlign,
          width: '100%',
          height: '100%',
          padding: '8px',
          boxSizing: 'border-box',
          overflow: 'hidden',
          wordWrap: 'break-word'
        }}>
          {props.object.text}
        </div>
      );
    } else {
      return (
        <img
          src={props.object.src}
          alt="slide object"
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'contain',
            display: 'block'
          }}
        />
      );
    }
  };

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${size.width}px`,
    height: `${size.height}px`,
    cursor: drag.isDragging ? 'grabbing' : (isInteractive ? 'pointer' : 'default'),
    border: props.isSelected && isInteractive ? '2px dashed #007bff' : 'none',
    boxSizing: 'border-box'
  };

  return (
    <div style={style}>
      <div
        onClick={handleClick}
        onMouseDown={isInteractive ? drag.onMouseDown : undefined}
        style={{ 
          width: '100%', 
          height: '100%',
          pointerEvents: isInteractive ? 'auto' : 'none'
        }}
      >
        {renderContent()}
      </div>

      {props.isSelected && isInteractive && (
        <ResizeHandles onMouseDown={resize.onResizeHandleMouseDown} />
      )}
    </div>
  );
}