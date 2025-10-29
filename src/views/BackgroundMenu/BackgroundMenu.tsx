import React, { useState, useRef } from 'react';
import { dispatch } from '../../store/editor';
import { createColorBackground, createImageBackground, changeSlideBackground } from '../../store/functions/functions_of_presentation';
import { Button } from '../../common/Button/Button';
import { Input } from '../../common/Input/Input';
import styles from './Background.module.css';

interface BackgroundMenuProps {
    isOpen: boolean;
    onClose: () => void;
    currentSlideId: string | null;
}

export function BackgroundMenu(props: BackgroundMenuProps) {
    const [currentColor, setCurrentColor] = useState('#ffffff');
    const [imageUrl, setImageUrl] = useState('');
    const [selectedTab, setSelectedTab] = useState<'color' | 'image'>('color');
    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleColorChange(event: React.ChangeEvent<HTMLInputElement>) {
        const color = event.target.value;
        setCurrentColor(color);
            
        if (props.currentSlideId) {
            dispatch(changeSlideBackground, {
                slideId: props.currentSlideId,
                background: createColorBackground(color)
            });
        }
    }

    function handleUrlApply() {
        if (imageUrl.trim() && props.currentSlideId) {
            dispatch(changeSlideBackground, {
                slideId: props.currentSlideId,
                background: createImageBackground(imageUrl.trim())
            });
            setImageUrl('');
        }
    }

    function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file && props.currentSlideId) {
            const imageUrl = URL.createObjectURL(file);
            dispatch(changeSlideBackground, {
                slideId: props.currentSlideId,
                background: createImageBackground(imageUrl)
            });
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
                                    disabled={!imageUrl.trim() || !props.currentSlideId}
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
                                    disabled={!props.currentSlideId}
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