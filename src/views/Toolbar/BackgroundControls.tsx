import { useState } from 'react';
import styles from './Toolbar.module.css';
import { Button } from '../../common/Button/Button';
import changeBackground from '../../assets/icons/change.png';

export function BackgroundControls() {
    const [isBackgroundMenuOpen, setIsBackgroundMenuOpen] = useState(false);

    function handleOpenBackgroundMenu(): void {
        setIsBackgroundMenuOpen(true);
    }

    return (
        <div className={styles.backgroundControls}>
            <Button 
                onClick={handleOpenBackgroundMenu}
                icon={changeBackground}
            />
        </div>
    );
}