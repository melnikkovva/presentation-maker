import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { addSlide, removeSlide } from '../../store/slices/slidesSlice';
import { selectCurrentSlideId } from '../../store/selectors/presentationSelectors';
import { Button } from '../../common/Button/Button';

import addSlideIcon from '../../assets/icons/add-slide.png';
import removeSlideIcon from '../../assets/icons/delete.png';

export function SlideControls() {
    const currentSlideId = useAppSelector(selectCurrentSlideId);
    const dispatch = useAppDispatch();

    function handleAddSlide(): void {
        dispatch(addSlide());
    }

    function handleRemoveSlide(): void {
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