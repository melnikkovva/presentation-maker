import { Input } from '../../common/Input/Input';
import styles from './PresentationTitle.module.css';

interface PresentationTitleProps {
    title: string;
    onTitleChange: (newTitle: string) => void;
}

export function PresentationTitle(props: PresentationTitleProps) {
    return (
        <div className={styles.container}>
            <Input
                value={props.title}
                onChange={props.onTitleChange}
                className={styles.titleInput}
                placeholder="Название презентации"
            />
        </div>
    );
}