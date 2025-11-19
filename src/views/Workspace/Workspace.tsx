import { useAppSelector } from '../../store/hooks';
import { SlideRender } from '../SlideRender/SlideRender';
import { SLIDE_HEIGHT, SLIDE_WIDTH } from '../../store/data/const_for_presantation';
import styles from './Workspace.module.css';
import { selectCurrentSlide, selectCurrentSlideId } from '../../store/selectors/presentationSelectors';

export function Workspace() {
    const currentSlideId = useAppSelector(selectCurrentSlideId);
    const currentSlide = useAppSelector(selectCurrentSlide);

    if (!currentSlide) {
        return (
            <div className={styles.workspace}>
                <div className={styles.noSlide}>Создайте первый слайд</div>
            </div>
        );
    }

    return (
        <div className={styles.workspace}>
            <div className={styles.workspaceContent}>
                <div 
                    className={styles.slideContainer}
                    style={{
                        width: `${SLIDE_WIDTH}px`,
                        height: `${SLIDE_HEIGHT}px`
                    }}
                >
                    <SlideRender
                        slideId={currentSlideId}
                        isPreview={false}
                    />
                </div>
            </div>
        </div>
    );
}