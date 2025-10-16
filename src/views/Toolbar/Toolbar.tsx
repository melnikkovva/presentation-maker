import { Button } from '../../common/Button/Button';
import styles from './Toolbar.module.css';

import { dispatch } from '../../store/editor';
import { addSlide, removeSlide, addTextToSlide, addImageToSlide, removeObject } from '../../store/functions/functions_of_presentation';
import type { Presentation } from '../../store/types/types_of_presentation';

import addSlideIcon from '../../assets/icons/add-slide.png';
import removeSlideIcon from '../../assets/icons/delete.png';
import addTextIcon from '../../assets/icons/add-text.png';
import addImageIcon from '../../assets/icons/add-image.png';
import changeBgIcon from '../../assets/icons/change.png';
import saveIcon from '../../assets/icons/save.png';
import deleteObjectIcon from '../../assets/icons/delete-obj.png';

interface ToolbarProps {
    presentation: Presentation;
}

export function Toolbar({ presentation }: ToolbarProps) {

    function handleAction(actionName: string): void {
        console.log('Действие:', actionName);
    };

    function handleAddSlide(): void {
        console.log('Действие: добавлен слайд');
        dispatch(addSlide);
    };

    function handleRemoveSlide(): void {
        console.log('Действие: удален слайд');
        if (presentation.slides.currentSlideId) {
            dispatch(removeSlide, presentation.slides.currentSlideId);
        }
    };

    function handleChangeBackground(): void {
        console.log('Действие: изменен фон слайда');
       
    };

    function handleAddText(): void {
        
        if (presentation.slides.currentSlideId) {
            dispatch(addTextToSlide, {
                slideId: presentation.slides.currentSlideId,
                text: "Новый текст"
            });
            console.log('Действие: добавлен текст');
        }
    }

    function handleAddImage(): void {
        if (presentation.slides.currentSlideId) {
            const imageSrc = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/React_Logo_SVG.svg/1024px-React_Logo_SVG.svg.png';
            dispatch(addImageToSlide, {
                slideId: presentation.slides.currentSlideId,
                imageSrc: imageSrc
            });
            console.log('Действие: добавлено изображение');
        }
    }

    function handleDeleteSelectedObject(): void {

        const currentSlideId = presentation.slides.currentSlideId;
        
        if (!currentSlideId || !presentation.selection?.objectId) {
            console.log('Нет выбранного объекта для удаления');
            return;
        }

        dispatch(removeObject, {
            slideId: currentSlideId,
            objectId: presentation.selection.objectId
        });
        console.log('Действие: удален объект');
    }

    return (
        <div className={styles.toolbar}>
            <div className={styles.toolbarSection}>
                <div className={styles.sectionTitle}>Слайды</div>
                <Button 
                    onClick={handleAddSlide}
                    icon={addSlideIcon}
                >
                </Button>
                <Button 
                    onClick={handleRemoveSlide}
                    icon={removeSlideIcon}
                >
                </Button>
            </div>

            <div className={styles.toolbarSection}>
                <div className={styles.sectionTitle}>Объекты</div>
                <Button 
                    onClick={handleAddText}
                    icon={addTextIcon}
                >
                </Button>
                <Button 
                    onClick={handleAddImage}
                    icon={addImageIcon}
                >
                </Button>
                <Button 
                    onClick={handleDeleteSelectedObject}
                    icon={deleteObjectIcon}
                >
                </Button>
            </div>

            <div className={styles.toolbarSection}>
                <div className={styles.sectionTitle}>Фон</div>
                <Button 
                    onClick={handleChangeBackground}
                    icon={changeBgIcon}
                >
                </Button>
            </div>

            <div className={styles.toolbarSection}>
                <div className={styles.sectionTitle}>Экспорт</div>
                <Button 
                    onClick={() => handleAction('Сохранить')}
                    icon={saveIcon}
                >
                </Button>
            </div>
        </div>
    );
}