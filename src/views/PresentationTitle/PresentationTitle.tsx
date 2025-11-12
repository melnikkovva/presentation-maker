import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { renamePresentation } from '../../store/actions/ActionCreators';
import { Input } from '../../common/Input/Input';
import styles from './PresentationTitle.module.css';

export function PresentationTitle() {
    const title = useAppSelector(state => state.presentation.title);
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