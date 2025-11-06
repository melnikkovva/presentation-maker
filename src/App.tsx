import { useState } from 'react';
import { dispatch } from './store/editor';
import { renamePresentation, selectSlide, reorderSlides } from './store/functions/functions_of_presentation';
import { BackgroundMenu } from './views/BackgroundMenu/BackgroundMenu';
import type { Presentation, Slide } from './store/types/types_of_presentation'; 
import { PresentationTitle } from './views/PresentationTitle/PresentationTitle';
import { Workspace } from './views/Workspace/Workspace';
import { SlideList } from './views/SlideList/SlideList';
import { Toolbar } from './views/Toolbar/Toolbar';
import styles from './App.module.css';

interface AppProps {
    presentation: Presentation;
}

export function App(props: AppProps) {
    const [isBackgroundMenuOpen, setIsBackgroundMenuOpen] = useState(false);

    function handleTitleChange(newTitle: string): void {
        dispatch(renamePresentation, newTitle);
        console.log('Новое название:', newTitle);
    };

    const currentSlide = props.presentation.slides.slides.find(
        slide => slide.id === props.presentation.slides.currentSlideId
    );

    function handleSlideClick(slideId: string, index: number): void {
        dispatch(selectSlide, slideId);
        console.log(`Выбран слайд: ${slideId}, порядковый номер: ${index + 1}`);
    }

    function handleOpenBackgroundMenu(): void {
        setIsBackgroundMenuOpen(true);
    }

    function handleCloseBackgroundMenu(): void {
        setIsBackgroundMenuOpen(false);
    }

    function handleSlidesReorder(reorderedSlides: Slide[]): void {
        dispatch(reorderSlides, reorderedSlides);
    }

    return (
        <div className={styles.app}>
            <PresentationTitle 
                title={props.presentation.title}
                onTitleChange={handleTitleChange}
            />

            <Toolbar 
                currentSlideId={props.presentation.slides.currentSlideId}
                onOpenBackgroundMenu={handleOpenBackgroundMenu}
                selectedObjectId={props.presentation.selection?.objectId || null}
            />
            
            <div className={styles.mainContainer}>
                <SlideList
                    slides={props.presentation.slides.slides} 
                    currentSlideId={props.presentation.slides.currentSlideId}
                    onSlideClick={handleSlideClick}
                    onSlidesReorder={handleSlidesReorder}
                />
                
                <Workspace 
                    currentSlide={currentSlide} 
                    currentSlideId={props.presentation.slides.currentSlideId}
                    selectedObjectId={props.presentation.selection?.objectId}
                />
                <BackgroundMenu 
                    isOpen={isBackgroundMenuOpen}
                    onClose={handleCloseBackgroundMenu}
                    currentSlideId={props.presentation.slides.currentSlideId}
                />
            </div>
        </div>
    );
}