import { dispatch } from '../../store/editor';
import { addSlide, removeSlide } from '../../store/functions/functions_of_presentation';
import { Button } from '../../common/Button/Button';

import addSlideIcon from '../../assets/icons/add-slide.png';
import removeSlideIcon from '../../assets/icons/delete.png';

interface SlideControlsProps {
    currentSlideId: string | null;
}

export function SlideControls(props: SlideControlsProps) {
    function handleAddSlide(): void {
        console.log('Действие: добавлен слайд');
        dispatch(addSlide);
    };

    function handleRemoveSlide(): void {
        console.log('Действие: удален слайд');
        if (props.currentSlideId) {
            dispatch(removeSlide, props.currentSlideId);
        }
    };

    return (
        <div>
            <Button 
                onClick={handleAddSlide}
                icon={addSlideIcon}
            />
            <Button 
                onClick={handleRemoveSlide}
                icon={removeSlideIcon}
            />
        </div>
    );
}