import { useState, useRef } from 'react';
import { dispatch } from '../../store/editor';
import { addTextToSlide, addImageToSlide } from '../../store/functions/functions_of_presentation';
import { Button } from '../../common/Button/Button';
import { Input } from '../../common/Input/Input';
import { removeObject } from '../../store/functions/functions_of_presentation';
import styles from './Toolbar.module.css';

import addTextIcon from '../../assets/icons/add-text.png';
import addImageIcon from '../../assets/icons/add-image.png';
import deleteObjectIcon from '../../assets/icons/delete-obj.png';

interface ObjectControlsProps {
    currentSlideId: string | null;
    selectedObjectId: string | null;
}

export function ObjectControls(props: ObjectControlsProps) {
    const [imageUrl, setImageUrl] = useState('');
    const [showImageInput, setShowImageInput] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleAddText(): void {
        if (!props.currentSlideId) return;
        dispatch(addTextToSlide, {
            slideId: props.currentSlideId,
            text: "Новый текст"
        });
    }

    function handleDeleteSelectedObject(): void {
        if (!props.currentSlideId || !props.selectedObjectId) {
            console.log('Нет выбранного объекта для удаления');
            return;
        }

        dispatch(removeObject, {
            slideId: props.currentSlideId,
            objectId: props.selectedObjectId
        });
        
    }

    function handleAddImageFromComputer(): void {
        fileInputRef.current?.click();
    }

    function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>): void {
        const file = event.target.files?.[0];
        
        if (!file || !props.currentSlideId) return;

        if (!file.type.startsWith('image/')) {
            console.log('Надо выбрать изображение, а не что-то другое');
            return;
        }

        setIsLoading(true);

        const reader = new FileReader();
        
        reader.onload = (e) => {
            const dataUrl = e.target ? e.target.result : undefined;
            
            if (dataUrl) {
                dispatch(addImageToSlide, {
                    slideId: props.currentSlideId,
                    imageSrc: dataUrl
                });
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
        if (!props.currentSlideId || !imageUrl.trim()) return;
        
        dispatch(addImageToSlide, {
            slideId: props.currentSlideId,
            imageSrc: imageUrl.trim()
        });
        
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