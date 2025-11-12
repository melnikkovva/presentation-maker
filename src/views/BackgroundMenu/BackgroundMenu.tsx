import React, { useState, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { changeSlideBackground } from '../../store/actions/ActionCreators';
import { Button } from '../../common/Button/Button';
import { Input } from '../../common/Input/Input';
import styles from './Background.module.css';

interface BackgroundMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export function BackgroundMenu(props: BackgroundMenuProps) {
    const [currentColor, setCurrentColor] = useState('#ffffff');
    const [imageUrl, setImageUrl] = useState('');
    const [selectedTab, setSelectedTab] = useState<'color' | 'image'>('color');
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const currentSlideId = useAppSelector(state => state.presentation.slides.currentSlideId);
    const dispatch = useAppDispatch();

    function handleColorChange(event: React.ChangeEvent<HTMLInputElement>) {
        const color = event.target.value;
        setCurrentColor(color);
            
        if (currentSlideId) {
            dispatch(changeSlideBackground(currentSlideId, { type: 'color', color: color }));
        }
    }

    function handleUrlApply() {
        if (imageUrl.trim() && currentSlideId) {
            dispatch(changeSlideBackground(currentSlideId, { type: 'picture', src: imageUrl.trim() }));
            setImageUrl('');
        }
    }

    function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file && currentSlideId) {
            const imageUrl = URL.createObjectURL(file);
            dispatch(changeSlideBackground(currentSlideId, { type: 'picture', src: imageUrl }));
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }

    function handleFileSelect() {
        fileInputRef.current?.click();
    }

    if (!props.isOpen) return null;

    return (
        <div className={styles.overlay} onClick={props.onClose}>
            <div className={styles.menu} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3>Фон слайда</h3>
                    <button className={styles.closeButton} onClick={props.onClose}>×</button>
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
    );
}