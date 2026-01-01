import { SlideControls } from './SlideControls';
import { ObjectControls } from './ObjectControls';
import { BackgroundControls } from './BackgroundControls';
import { ExportControls } from './ExportControls';
import { UndoRedo } from './UndoRedo';

import { Button } from '../../common/Button/Button';
import styles from './Toolbar.module.css';

type ToolbarProps = {
  onLogout: () => void;
  onPreview: () => void;
  onOpenGallery: () => void;
}

export function Toolbar(props: ToolbarProps) {
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
          <ExportControls/>
      </div>

      <div className={styles.toolbarSection}>
        <UndoRedo />
      </div>

      <div className={styles.toolbarSection}>
        <div className={styles.sectionTitle}>Навигация</div>

        <Button
          onClick={props.onPreview}
          className={`${styles.toolbarButton} ${styles.previewButton}`}
        >
          Слайд-шоу
        </Button>

        <Button
          onClick={props.onOpenGallery}
          className={`${styles.toolbarButton} ${styles.galleryButton}`}
        >
          Галерея
        </Button>
      </div>

      <Button
        onClick={props.onLogout}
        className={styles.logoutButton}
      >
        Выйти
      </Button>
    </div>
  );
}
