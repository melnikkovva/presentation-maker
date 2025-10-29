import styles from './Toolbar.module.css';
import { Button } from '../../common/Button/Button';
import changeBackground from '../../assets/icons/change.png';

interface BackgroundControlsProps {
    onOpenBackgroundMenu: () => void;
}

export function BackgroundControls(props: BackgroundControlsProps) {
    return (
        <div className={styles.backgroundControls}>
            <Button 
                onClick={props.onOpenBackgroundMenu}
                icon={changeBackground}
            />
        </div>
    );
}