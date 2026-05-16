import { SlideControls } from './SlideControls';
import { ObjectControls } from './ObjectControls';
import { BackgroundControls } from './BackgroundControls';
import { ExportControls } from './ExportControls';
import { UndoRedo } from './UndoRedo';
import { TextFormatToolbar } from './TextFormatToolbar'; 
import { Button } from '../../common/Button/Button';
import { useAppSelector } from '../../store/hooks';
import { selectSelectedObjects } from '../../store/selectors/presentationSelectors';
import styles from './Toolbar.module.css';

type ToolbarProps = {
  onLogout: () => void;
  onPreview: () => void;
  onOpenGallery: () => void;
}

export function Toolbar(props: ToolbarProps) {
  const selectedObjects = useAppSelector(selectSelectedObjects);
  
  const isTextSelected = selectedObjects.some(obj => 
    obj.typeElement === 'text'
  );

  return (
      <div className={styles.toolbar}>
        {!isTextSelected ? (
          <>
            <div className={styles.toolbarSection}>
              <SlideControls />
            </div>

            <div className={styles.toolbarSection}>
              <ObjectControls />
            </div>

            <div className={styles.toolbarSection}>
              <BackgroundControls />
            </div>

            <div className={styles.toolbarSection}>
              <ExportControls />
            </div>

            <div className={styles.toolbarSection}>
              <UndoRedo />
            </div>
          </>
        ) : (
          <TextFormatToolbar />
        )}

        <div className={styles.toolbarSection}>

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