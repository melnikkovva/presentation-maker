import { useState, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { addTextObject, addImageObject, removeObject, removeMultipleObjects } from '../../store/slices/objectsSlice';
import { selectCurrentSlideId, selectSelectedObjectIds, selectSelectedObjects } from '../../store/selectors/presentationSelectors';
import { clearSelection } from '../../store/slices/selectionSlice';
import { Button } from '../../common/Button/Button';
import styles from './Toolbar.module.css';
import { uploadImageToStorage } from '../../store/functions/functions_for_DB';
import { scaleToFitSlide } from '../../store/functions/imageDownloader';
import addTextIcon from '../../assets/icons/add-text.png';
import addImageIcon from '../../assets/icons/add-image.png';
import deleteObjectIcon from '../../assets/icons/delete-obj.png';

export function ObjectControls() {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const currentSlideId = useAppSelector(selectCurrentSlideId);
  const selectedObjects = useAppSelector(selectSelectedObjects);
  const selectedObjectIds = useAppSelector(selectSelectedObjectIds);
  const dispatch = useAppDispatch();

  const hasSelection = selectedObjects.length > 0;

  function handleAddText(): void {
    if (!currentSlideId) return;
    dispatch(addTextObject({ slideId: currentSlideId }));
  }

  function handleDeleteSelectedObjects(): void {
    if (!hasSelection) {
      console.log('Нет выбранных объектов для удаления');
      return;
    }

    if (selectedObjectIds.length === 1) {
      dispatch(removeObject(selectedObjectIds[0]));
    } else {
      dispatch(removeMultipleObjects(selectedObjectIds));
    }
    
    dispatch(clearSelection());
  }

  function handleAddImageFromComputer(): void {
    fileInputRef.current?.click();
  }

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    if (!file || !currentSlideId) return;

    setIsLoading(true);
    if (fileInputRef.current) fileInputRef.current.value = '';

    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const dataUrl = e.target?.result as string;
        
        const fileId = await uploadImageToStorage(file);
        
        const img = new Image();
        
        img.onload = () => {
          const scaled = scaleToFitSlide(img.naturalWidth, img.naturalHeight);
          
          dispatch(addImageObject({
            slideId: currentSlideId,
            src: fileId,
            width: scaled.width,
            height: scaled.height,
          }));
          
          setIsLoading(false);
        };
        
        img.src = dataUrl;
        
      } catch (err) {
        console.error('Ошибка загрузки изображения:', err);
        setIsLoading(false);
      }
    };
    
    reader.readAsDataURL(file);
  }

  return (
    <div className={styles.buttonGroup}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      
      <Button 
        onClick={handleAddText}
        icon={addTextIcon}
        disabled={isLoading}
      />
      
      <Button 
        onClick={handleAddImageFromComputer}
        icon={addImageIcon}
        disabled={isLoading}
      />
      
      <Button 
        onClick={handleDeleteSelectedObjects}
        icon={deleteObjectIcon}
        disabled={!hasSelection || isLoading}
      />
    </div>
  );
}