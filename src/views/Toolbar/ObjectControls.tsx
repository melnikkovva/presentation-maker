import { useState, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { addTextObject, addImageObject, removeObject, removeMultipleObjects } from '../../store/slices/objectsSlice';
import { selectCurrentSlideId, selectSelectedObjectIds, selectSelectedObjects } from '../../store/selectors/presentationSelectors';
import { clearSelection } from '../../store/slices/selectionSlice';
import { Button } from '../../common/Button/Button';
import { Input } from '../../common/Input/Input';
import styles from './Toolbar.module.css';
import { uploadImageFromUrlToStorage } from '../../store/functions_for_DB';

import addTextIcon from '../../assets/icons/add-text.png';
import addImageIcon from '../../assets/icons/add-image.png';
import deleteObjectIcon from '../../assets/icons/delete-obj.png';

export function ObjectControls() {
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
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

    if (!file.type.startsWith('image/')) {
      console.log('Надо выбрать изображение, а не что-то другое');
      return;
    }

    setIsLoading(true);

    const reader = new FileReader();
    
    reader.onload = (e) => {
      const dataUrl = e.target?.result;
      
      if (dataUrl && typeof dataUrl === 'string') {
        dispatch(addImageObject({ 
          slideId: currentSlideId, 
          src: dataUrl 
        }));
      }
      
      setIsLoading(false);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      setShowImageInput(false);
    };

    reader.onerror = () => {
      console.error('Ошибка при чтении файла');
      setIsLoading(false);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    reader.readAsDataURL(file);
  }

  async function handleAddImageFromUrl(): Promise<void> {
    if (!currentSlideId || !imageUrl.trim()) return;
    
    setIsLoading(true);

    try {
      const storageUrl = await uploadImageFromUrlToStorage(imageUrl.trim());
      
      dispatch(addImageObject({ 
        slideId: currentSlideId, 
        src: storageUrl 
      })); 
      
      setImageUrl('');
      setShowImageInput(false);
    } catch (error) {
      console.error('Ошибка при загрузке изображения по URL:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleImageUrlChange(value: string): void {
    setImageUrl(value);
  }

  function handleCloseImageInput(): void {
    setShowImageInput(false);
    setImageUrl('');
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
      
      <div className={styles.dropdownContainer}>
        <Button 
          onClick={() => setShowImageInput(!showImageInput)}
          icon={addImageIcon}
          disabled={isLoading}
        />
        
        {showImageInput && (
          <>
            <div className={styles.overlay} onClick={handleCloseImageInput} />
            <div className={styles.dropdownContent}>
              <div className={styles.dropdownHeader}>
                <h4>Добавить изображение</h4>
                <button 
                  className={styles.closeButton}
                  onClick={handleCloseImageInput}
                  aria-label="Закрыть"
                >
                  ×
                </button>
              </div>
              
              <div className={styles.dropdownSection}>
                <label className={styles.label}>Изображение по URL:</label>
                <div className={styles.urlInputContainer}>
                  <Input
                    value={imageUrl}
                    onChange={handleImageUrlChange}
                    placeholder="Введите URL изображения"
                    className={styles.urlInput}
                  />
                  <Button 
                    onClick={handleAddImageFromUrl}
                    className={styles.submitButton}
                    disabled={!imageUrl.trim() || isLoading}
                  >
                    {isLoading ? 'Загрузка...' : 'Добавить'}
                  </Button>
                </div>
              </div>

              <div className={styles.divider}>или</div>

              <div className={styles.dropdownSection}>
                <Button 
                  onClick={handleAddImageFromComputer}
                  className={styles.dropdownItem}
                  disabled={isLoading}
                >
                  {isLoading ? 'Загрузка...' : 'Загрузить с компьютера'}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
      
      <Button 
        onClick={handleDeleteSelectedObjects}
        icon={deleteObjectIcon}
        disabled={!hasSelection || isLoading}
      >
      </Button>
    </div>
  );
}