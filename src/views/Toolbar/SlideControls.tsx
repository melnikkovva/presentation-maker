import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addSlide, removeSlide } from '../../store/slices/slidesSlice';
import { selectCurrentSlideId, selectSlides } from '../../store/selectors/presentationSelectors';
import { Button } from '../../common/Button/Button';
import addSlideIcon from '../../assets/icons/add-slide.png';
import removeSlideIcon from '../../assets/icons/delete.png';
// import { undoStack } from '../../store/UndoRedo';

export function SlideControls() {
    const currentSlideId = useAppSelector(selectCurrentSlideId);
    // const slides = useAppSelector(selectSlides);
    const dispatch = useAppDispatch();

    function handleAddSlide() {
        //TODO получить длину, написав новый селектор
        dispatch(addSlide());

        // undoStack.push(
        //     () => {dispatch(addSlide());},
        //     (prevLen) => {
        //         const currentSlides = store.getState().slides.slides;
        //         if (currentSlides.length > prevLen) {
        //             const lastId = currentSlides[currentSlides.length - 1].id;
        //             store.dispatch(removeSlide(lastId));
        //         }
        //     },
        //     prevLength
        // );
    }

    function handleRemoveSlide() {
    if (!currentSlideId) return;

    // const slideToRemove = slides.find(s => s.id === currentSlideId);
    // const index = slides.findIndex(s => s.id === currentSlideId);

    // if (!slideToRemove) return;

    dispatch(removeSlide(currentSlideId));

    // undoStack.push(
    //     () => {},
    //     (slide, idx) => {
    //         store.dispatch({
    //             type: 'slides/restoreSlide',
    //             payload: { slide, index: idx }
    //         });
    //     },
    //     slideToRemove,
    //     index
    // );
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
                disabled={!currentSlideId}
            />
        </div>
    );
}