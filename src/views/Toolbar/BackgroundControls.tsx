import { useState, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { changeSlideBackground } from '../../store/slices/slidesSlice';
import { selectCurrentSlideId } from '../../store/selectors/presentationSelectors';
import type { Color, Picture } from '../../store/types/types_of_presentation';
import { Button } from '../../common/Button/Button';
import { Input } from '../../common/Input/Input';
import styles from './Background.module.css';
import backgroundIcon from '../../assets/icons/change.png';
import { uploadImageToStorage, uploadImageFromUrlToStorage } from '../../store/functions_for_DB';

export function BackgroundControls() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'color' | 'image'>('color');
    const [selectedColor, setSelectedColor] = useState('#ffffff');
    const [imageUrl, setImageUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const currentSlideId = useAppSelector(selectCurrentSlideId);
    const dispatch = useAppDispatch();

    function openMenu(): void {
        setIsMenuOpen(true);
    }

    function closeMenu(): void {
        setIsMenuOpen(false);
        setSelectedColor('#ffffff');
        setImageUrl('');
        setActiveTab('color');
    }

    function handleColorChange(event: React.ChangeEvent<HTMLInputElement>): void {
        setSelectedColor(event.target.value);
    }

    function applyColor(): void {
        if (!currentSlideId) {
            console.log('Нет активного слайда');
            return;
        }

        const colorBackground: Color = {
            type: 'color',
            color: selectedColor
        };

        dispatch(changeSlideBackground({
            slideId: currentSlideId,
            background: colorBackground
        }));

        closeMenu();
    }

    function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>): void {
        const file = event.target.files?.[0];
        if (!file || !currentSlideId) return;

        setIsLoading(true);

        uploadImageToStorage(file)
            .then(storageUrl => {
                const pictureBackground: Picture = {
                    type: 'image',
                    src: storageUrl
                };

                dispatch(changeSlideBackground({
                    slideId: currentSlideId,
                    background: pictureBackground
                }));
            })
            .catch(error => {
                console.error('Ошибка загрузки изображения:', error);
            })
            .finally(() => {
                setIsLoading(false);
                closeMenu();
                if (fileInputRef.current) fileInputRef.current.value = '';
            });
    }

    async function applyImageFromUrl(): Promise<void> {
        if (!currentSlideId || !imageUrl.trim()) {
            console.log('Введите URL изображения');
            return;
        }

        setIsLoading(true);

        try {
            const storageUrl = await uploadImageFromUrlToStorage(imageUrl.trim());
            
            const pictureBackground: Picture = {
                type: 'image',
                src: storageUrl
            };

            dispatch(changeSlideBackground({
                slideId: currentSlideId,
                background: pictureBackground
            }));
        } catch (error) {
            console.error('Ошибка загрузки изображения по URL:', error);
        } finally {
            setIsLoading(false);
            closeMenu();
        }
    }

    function handleImageFromComputer(): void {
        fileInputRef.current?.click();
    }

    if (!isMenuOpen) {
        return (
            <div className={styles.buttonGroup}>
                <Button
                    onClick={openMenu}
                    icon={backgroundIcon}
                />
            </div>
        );
    }

    return (
        <>
            <div className={styles.overlay} onClick={closeMenu} />
            
            <div className={styles.menu}>
                <div className={styles.header}>
                    <h3>Настройка фона</h3>
                    <button 
                        className={styles.closeButton}
                        onClick={closeMenu}
                        aria-label="Закрыть"
                    >
                        ×
                    </button>
                </div>

                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'color' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('color')}
                    >
                        Цвет
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'image' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('image')}
                    >
                        Изображение
                    </button>
                </div>

                <div className={styles.content}>
                    {activeTab === 'color' ? (
                        <div className={styles.section}>
                            <label className={styles.label}>Выберите цвет:</label>
                            <input
                                type="color"
                                value={selectedColor}
                                onChange={handleColorChange}
                                className={styles.colorPicker}
                            />
                            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                <Button
                                    onClick={applyColor}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Загрузка...' : 'Применить цвет'}
                                </Button>
                                <Button
                                    onClick={closeMenu}
                                >
                                    Отмена
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.section}>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className={styles.hiddenFileInput}
                            />
                            
                            <div className={styles.urlSection}>
                                <label className={styles.label}>Изображение по URL:</label>
                                <Input
                                    value={imageUrl}
                                    onChange={(value) => setImageUrl(value)}
                                    placeholder="Введите URL изображения"
                                    className={styles.urlInput}
                                />
                                <Button
                                    onClick={applyImageFromUrl}
                                    disabled={!imageUrl.trim() || isLoading}
                                >
                                    {isLoading ? 'Загрузка...' : 'Применить из URL'}
                                </Button>
                            </div>

                            <div className={styles.divider}>или</div>

                            <div className={styles.fileSection}>
                                <Button
                                    onClick={handleImageFromComputer}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Загрузка...' : 'Загрузить с компьютера'}
                                </Button>
                            </div>

                            <Button
                                onClick={closeMenu}
                            >
                                Отмена
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}