import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { addSlide, removeSlide } from '../../store/actions/ActionCreators';
import { Button } from '../../common/Button/Button';

import addSlideIcon from '../../assets/icons/add-slide.png';
import removeSlideIcon from '../../assets/icons/delete.png';

export function SlideControls() {
    const currentSlideId = useAppSelector(state => state.presentation.slides.currentSlideId);
    const dispatch = useAppDispatch();

    function handleAddSlide(): void {
        console.log('Действие: добавлен слайд');
        dispatch(addSlide());
    }

    function handleRemoveSlide(): void {
        console.log('Действие: удален слайд');
        if (currentSlideId) {
            dispatch(removeSlide(currentSlideId));
        }
    }

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