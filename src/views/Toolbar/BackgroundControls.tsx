import React, { useState, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { changeSlideBackground } from '../../store/slices/slidesSlice'; 
import { selectCurrentSlideId } from '../../store/selectors/presentationSelectors';
import { Button } from '../../common/Button/Button';
import { Input } from '../../common/Input/Input';
import changeBackground from '../../assets/icons/change.png';
import styles from './Background.module.css';

export function BackgroundControls() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentColor, setCurrentColor] = useState('#ffffff');
    const [imageUrl, setImageUrl] = useState('');
    const [selectedTab, setSelectedTab] = useState<'color' | 'image'>('color');
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const currentSlideId = useAppSelector(selectCurrentSlideId);
    const dispatch = useAppDispatch();

    function handleOpen(): void {
        setIsOpen(true);
    }

    function handleClose(): void {
        setIsOpen(false);
    }

    function handleColorChange(event: React.ChangeEvent<HTMLInputElement>) {
        const color = event.target.value;
        setCurrentColor(color);
            
        if (currentSlideId) {
            dispatch(changeSlideBackground({ 
                slideId: currentSlideId, 
                background: { type: 'color', color: color } 
            }));
        }
    }

    function handleUrlApply() {
        if (imageUrl.trim() && currentSlideId) {
            dispatch(changeSlideBackground({ 
                slideId: currentSlideId, 
                background: { type: 'picture', src: imageUrl.trim() } 
            }));
            setImageUrl('');
        }
    }

    function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file && currentSlideId) {
            const imageUrl = URL.createObjectURL(file);
            dispatch(changeSlideBackground({ 
                slideId: currentSlideId, 
                background: { type: 'picture', src: imageUrl } 
            }));
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }

    function handleFileSelect() {
        fileInputRef.current?.click();
    }

    return (
        <>
            <Button 
                onClick={handleOpen}
                icon={changeBackground}
            />
            
            {isOpen && (
                <div className={styles.overlay} onClick={handleClose}>
                    <div className={styles.menu} >
                        <div className={styles.header}>
                            <h3>Фон слайда</h3>
                            <button className={styles.closeButton} onClick={handleClose}>×</button>
                        </div>
                
                        <div className={styles.tabs}>
                            <Button 
                                onClick={() => setSelectedTab('color')}
                                className={`${styles.tab} ${selectedTab === 'color' ? styles.activeTab : ''}`}
                            >
                            Цвет
                            </Button>
                            <Button 
                                onClick={() => setSelectedTab('image')}
                                className={`${styles.tab} ${selectedTab === 'image' ? styles.activeTab : ''}`}
                            >
                                Изображение
                            </Button>
                        </div>

                        <div className={styles.content}>
                            {selectedTab === 'color' && (
                                <div className={styles.section}>
                                <label className={styles.label}>Цвет фона:</label>
                                <input
                                    type="color"
                                    value={currentColor}
                                    onChange={handleColorChange}
                                />
                        
                                </div>
                            )}

                            {selectedTab === 'image' && (
                                <div className={styles.section}>
                                    <div className={styles.urlSection}>
                                        <label className={styles.label}>Ссылка на изображение:</label>
                                        <Input
                                            value={imageUrl}
                                            onChange={setImageUrl}
                                            placeholder="https://example.com/image.jpg"
                                            className={styles.urlInput}
                                        />
                                        <Button 
                                            onClick={handleUrlApply}
                                            disabled={!imageUrl.trim() || !currentSlideId}
                                        >
                                        Применить
                                        </Button>
                                    </div>
                            
                                    <div className={styles.divider}>или</div>
                            
                                    <div className={styles.fileSection}>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            className={styles.hiddenFileInput}
                                        />
                                        <Button 
                                            onClick={handleFileSelect}
                                            disabled={!currentSlideId}
                                        >
                                        Выбрать файл
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}