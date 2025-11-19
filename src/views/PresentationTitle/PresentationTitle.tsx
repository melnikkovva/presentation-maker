import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { renamePresentation } from '../../store/slices/presentationSlice';
import { Input } from '../../common/Input/Input';
import styles from './PresentationTitle.module.css';
import { selectTitle } from '../../store/selectors/presentationSelectors';

export function PresentationTitle() {
    const title = useAppSelector(selectTitle);
    const dispatch = useAppDispatch();

    return (
        <div className={styles.container}>
            <Input
                value={title}
                onChange={(newTitle) => dispatch(renamePresentation(newTitle))}
                className={styles.titleInput}
                placeholder="Название презентации"
            />
        </div>
    );
}