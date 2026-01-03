import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { changeObjectPosition, changeObjectSize } from '../../store/slices/objectsSlice';
import { selectImageObjectById, selectSelectedObjects, isObjectSelected } from '../../store/selectors/presentationSelectors';
import { PREVIEW_SCALE, MIN_DIV_HEIGHT, MIN_DIV_WIDTH, PLAYER_RATIO } from '../../store/data/const_for_presantation';
import { useResize } from '../../hooks/useResize';
import { ResizeHandles } from '../../hooks/ResizeHandle';
import { getImageUrl, preloadImageForUI } from '../../store/functions/functions_for_DB'; 
import styles from './ImageObject.module.css';

type ImageObjectProps = {
  objectId: string;
  isPreview: boolean;
  isPlayer: boolean;
  isDragging: boolean;
  isSelected: boolean;
  isPrimarySelected: boolean;
  onMouseDown?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

export function ImageObject(props: ImageObjectProps) {
  const object = useAppSelector(selectImageObjectById(props.objectId));
  const selectedObjects = useAppSelector(selectSelectedObjects);
  const isSelected = useAppSelector(state => isObjectSelected(state, props.objectId));
  const dispatch = useAppDispatch();
  
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  let scale = props.isPreview ? PREVIEW_SCALE : 1;
  if (props.isPlayer) {
    scale = PLAYER_RATIO;
  }
  const isInteractive = !(props.isPreview || props.isPlayer);
  
  const hasMultipleSelection = selectedObjects.length > 1;
  const isPartOfMultipleSelection = isSelected && hasMultipleSelection;

  useEffect(() => {
    if (!object?.src) {
      setImageSrc('');
      setIsLoading(false);
      return;
    }

    const loadImage = async () => {
      setIsLoading(true);
      try {
        const url = getImageUrl(object.src);
        setImageSrc(url);
        
        await preloadImageForUI(object.src);
      } catch (error) {
        console.error('Error loading image:', error);
        setImageSrc(''); 
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [object?.src]); 

  const resize = useResize({
      width: object?.w ? object.w * scale : 100,
      height: object?.h ? object.h * scale : 100,
      x: object?.x ? object.x * scale : 0,
      y: object?.y ? object.y * scale : 0,
      enabled: isInteractive && isSelected && !hasMultipleSelection,
      preserveAspectRatio: false, 
      minWidth: MIN_DIV_WIDTH * scale, 
      minHeight: MIN_DIV_HEIGHT * scale,
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
              
              dispatch(changeObjectPosition({ 
                  objectId: object.id, 
                  x: actualX, 
                  y: actualY 
              }));
          }
      }
  });

  if (!object) {
    return null;
  }

  const containerClass = [
    styles.container,
    isSelected ? styles.containerSelected : '',
    isPartOfMultipleSelection ? styles.multiSelected : ''
  ].join(' ');

  const imageClass = [
    styles.image,
    props.isDragging ? styles.cursorGrabbing : styles.cursorPointer
  ].join(' ');

  const containerStyle: React.CSSProperties = {
    left: `${object.x * scale}px`,
    top: `${object.y * scale}px`,
    width: `${object.w * scale}px`,
    height: `${object.h * scale}px`,
    position: 'absolute',
    ...props.style 
  };

  return (
    <div 
      className={containerClass} 
      style={containerStyle}
      onMouseDown={props.onMouseDown}
    >
      {isLoading ? (
        <div className={styles.loadingPlaceholder}>
          <div className={styles.spinner}></div>
          <span>Загрузка изображения...</span>
        </div>
      ) : imageSrc ? (
        <img
          src={imageSrc}
          className={imageClass}
          draggable={false}
          alt=""
          onError={(e) => {
            console.error('Error loading image:', object.src);
            e.currentTarget.src = '/path/to/placeholder.png';
          }}
        />
      ) : (
        <div className={styles.errorPlaceholder}>
          <span>Не удалось загрузить изображение</span>
        </div>
      )}

      {isSelected && isInteractive && !hasMultipleSelection && (
        <ResizeHandles onMouseDown={resize.onResizeHandleMouseDown} />
      )}
    </div>
  );
}