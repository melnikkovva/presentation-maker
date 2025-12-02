import { SlideControls } from './SlideControls';
import { ObjectControls } from './ObjectControls';
import { BackgroundControls } from './BackgroundControls';
import { ExportControls } from './ExportControls';
import { UndoRedo } from './UndoRedo';
import styles from './Toolbar.module.css';

export function Toolbar() {
    return (
        <div className={styles.toolbar}>
            <div className={styles.toolbarSection}>
                <div className={styles.sectionTitle}>Слайды</div>
                <SlideControls />
            </div>

            <div className={styles.toolbarSection}>
                <div className={styles.sectionTitle}>Объекты</div>
                <ObjectControls />
            </div>

            <div className={styles.toolbarSection}>
                <div className={styles.sectionTitle}>Фон</div>
                <BackgroundControls />
            </div>

            <div className={styles.toolbarSection}>
                <div className={styles.sectionTitle}>Экспорт</div>
                <ExportControls />
            </div>
            <div className={styles.toolbarSection}>
                <UndoRedo />
            </div>
        </div>
    );
}