import { useState, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { addTextObject, addImageObject, removeObjectFromSlide } from '../../store/slices/objectsSlice';
import { selectCurrentSlideId, selectSelectedObjectId } from '../../store/selectors/presentationSelectors';
import { Button } from '../../common/Button/Button';
import { Input } from '../../common/Input/Input';
import styles from './Toolbar.module.css';

import addTextIcon from '../../assets/icons/add-text.png';
import addImageIcon from '../../assets/icons/add-image.png';
import deleteObjectIcon from '../../assets/icons/delete-obj.png';

export function ObjectControls() {
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const currentSlideId = useAppSelector(selectCurrentSlideId);
  const selectedObjectId = useAppSelector(selectSelectedObjectId);
  const dispatch = useAppDispatch();

  function handleAddText(): void {
    if (!currentSlideId) return;
    dispatch(addTextObject({ slideId: currentSlideId }));
  }

  function handleDeleteSelectedObject(): void {
    if (!currentSlideId || !selectedObjectId) {
      console.log('Нет выбранного объекта для удаления');
      return;
    }
    dispatch(removeObjectFromSlide({ 
        slideId: currentSlideId, 
        objectId: selectedObjectId 
    })); 
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
      const dataUrl = e.target ? e.target.result : undefined;
      
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

  function handleAddImageFromUrl(): void {
    if (!currentSlideId || !imageUrl.trim()) return;
    
    dispatch(addImageObject({ 
        slideId: currentSlideId, 
        src: imageUrl.trim() 
    })); 
    
    setImageUrl('');
    setShowImageInput(false);
  }

  function handleImageUrlChange(value: string): void {
    setImageUrl(value);
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
          <div className={styles.dropdownContent}>
            <Button 
                onClick={handleAddImageFromComputer}
                className={styles.dropdownItem}
                disabled={isLoading}
            >
                {isLoading ? 'Идет загрузка' : 'С компьютера'}
            </Button>
            
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
                    Добавить
                </Button>
            </div>
        </div>
        )}
      </div>
      
        <Button 
            onClick={handleDeleteSelectedObject}
            icon={deleteObjectIcon}
            disabled={isLoading}
        />
    </div>
  );
}