import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectObject } from '../../store/slices/selectionSlice';
import { changeObjectPosition, changeObjectSize } from '../../store/slices/objectsSlice';
import { selectTextObjectById, selectSelectedObjectId } from '../../store/selectors/presentationSelectors';
import { DEFAULT_PADDING_TEXT_FIELD, MIN_DIV_HEIGHT, MIN_DIV_WIDTH, PREVIEW_SCALE } from '../../store/data/const_for_presantation';
import { useDnd } from '../../hooks/useDragAndDrop';
import { useResize } from '../../hooks/useResize';
import { ResizeHandles } from '../../hooks/ResizeHandle';
import styles from './TextObject.module.css';

type TextObjectProps = {
  objectId: string;
  isPreview: boolean;
}

export function TextObject({ objectId, isPreview }: TextObjectProps) {
  const object = useAppSelector(selectTextObjectById(objectId));
  const selectedObjectId = useAppSelector(selectSelectedObjectId);
  const dispatch = useAppDispatch();

  const scale = isPreview ? PREVIEW_SCALE : 1;
  const isInteractive = !isPreview;
  const isSelected = objectId === selectedObjectId;

  const drag = useDnd({
    startX: object?.x ? object.x * scale : 0,
    startY: object?.y ? object.y * scale : 0,
    onDrag: (newX, newY) => {
      if (object) {
        const actualX = newX / scale;
        const actualY = newY / scale;
        dispatch(changeObjectPosition({ 
          objectId: object.id, 
          x: actualX, 
          y: actualY 
        }));
      }
    },
    onFinish: (newX, newY) => {
      if (object) {
        const actualX = newX / scale;
        const actualY = newY / scale;
        dispatch(changeObjectPosition({ 
          objectId: object.id, 
          x: actualX, 
          y: actualY 
        }));
      }
    }
  });

  const resize = useResize({
    width: object?.w ? object.w * scale : 100,
    height: object?.h ? object.h * scale : 50,
    x: object?.x ? object.x * scale : 0,
    y: object?.y ? object.y * scale : 0,
    enabled: isInteractive && isSelected,
    onResize: (newWidth, newHeight, newX, newY) => {
      if (object) {
        const actualWidth = newWidth / scale;
        const actualHeight = newHeight / scale;
        const actualX = newX / scale;
        const actualY = newY / scale;
        dispatch(changeObjectSize({ 
          objectId: object.id, 
          width: actualWidth, 
          height: actualHeight 
        }));
        if (newX !== object.x * scale || newY !== object.y * scale) {
          dispatch(changeObjectPosition({ 
            objectId: object.id, 
            x: actualX, 
            y: actualY 
          }));
        }
      }
    },
    onResizeEnd: (newWidth, newHeight, newX, newY) => {
      if (object) {
        const actualWidth = newWidth / scale;
        const actualHeight = newHeight / scale;
        const actualX = newX / scale;
        const actualY = newY / scale;
        dispatch(changeObjectSize({ 
          objectId: object.id, 
          width: actualWidth, 
          height: actualHeight 
        }));
        if (newX !== object.x * scale || newY !== object.y * scale) {
          dispatch(changeObjectPosition({ 
            objectId: object.id, 
            x: actualX, 
            y: actualY 
          }));
        }
      }
    },
    minWidth: MIN_DIV_WIDTH,
    minHeight: MIN_DIV_HEIGHT
  });

  function handleClick(): void {
    if (isPreview || !object) return;

    if (isSelected) {
      dispatch(selectObject(null));
    } else {
      dispatch(selectObject({ 
        slideId: object.slideId, 
        objectId: object.id, 
        typeElement: 'text' 
      }));
    }
  }

  if (!object) {
    return null;
  }

  const getTextAlignClass = () => {
    switch (object.textAlign) {
      case 'left': return styles.textContentLeft;
      case 'right': return styles.textContentRight;
      case 'justify': return styles.textContentJustify;
      default: return styles.textContentCenter;
    }
  };

  const containerClasses = [
    styles.container,
    isSelected ? styles.containerSelected : ''
  ].join(' ');

  const textClasses = [
    styles.textContent,
    getTextAlignClass(),
    drag.isDragging ? styles.cursorGrabbing : styles.cursorPointer
  ].join(' ');

  const containerStyle: React.CSSProperties = {
    left: `${object.x * scale}px`,
    top: `${object.y * scale}px`,
    width: `${object.w * scale}px`,
    height: `${object.h * scale}px`,
    position: 'absolute',
  };

  const textStyle: React.CSSProperties = {
    fontSize: `${object.fontSize * scale}px`,
    fontFamily: object.fontFamily,
    fontWeight: object.fontWeight,
    textDecoration: object.textDecoration,
    color: object.color,
    padding: `${DEFAULT_PADDING_TEXT_FIELD}px`,
  };

  if (object.shadow) {
    textStyle.textShadow = `${object.shadow.x}px 
                            ${object.shadow.y}px 
                            ${object.shadow.blur}px 
                            ${object.shadow.color}`;
  }

  return (
    <div className={containerClasses} style={containerStyle}>
      <div
        className={textClasses}
        style={textStyle}
        onClick={handleClick}
        onMouseDown={drag.isDragging ? undefined : drag.onMouseDown}
      >
        {object.text}
      </div>

      {isSelected && isInteractive && (
        <ResizeHandles onMouseDown={resize.onResizeHandleMouseDown} />
      )}
    </div>
  );
}