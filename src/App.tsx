import { dispatch } from './store/editor';
import { renamePresentation, selectSlide } from './store/functions/functions_of_presentation';

import type { Presentation } from './store/types/types_of_presentation';
import { PresentationTitle } from './views/PresentationTitle/PresentationTitle';
import { Workspace } from './views/Workspace/Workspace';
import { SlideList } from './views/SlideList/SlideList';
import { Toolbar } from './views/Toolbar/Toolbar';
import styles from './App.module.css';


interface AppProps {
    presentation: Presentation;
}

export function App(props: AppProps) {
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

    return (
        <div className={styles.app}>
            <PresentationTitle 
                title={props.presentation.title}
                onTitleChange={handleTitleChange}
            />

            <Toolbar presentation={props.presentation} />

            <div className={styles.mainContainer}>
                 <SlideList
                    slides={props.presentation.slides.slides}
                    currentSlideId={props.presentation.slides.currentSlideId}
                    onSlideClick={(slideId, index) => handleSlideClick(slideId, index)}
                />
                
                <Workspace currentSlide={currentSlide} />
                
            </div>
        </div>
    );
}