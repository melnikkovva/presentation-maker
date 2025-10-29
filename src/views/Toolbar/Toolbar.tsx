import { SlideControls } from './SlideControls';
import { ObjectControls } from './ObjectControls';
import { BackgroundControls } from './BackgroundControls';
import { ExportControls } from './ExportControls';
import styles from './Toolbar.module.css';

interface ToolbarProps {
  currentSlideId: string | null;
  selectedObjectId: string | null;
  onOpenBackgroundMenu: () => void;
}

export function Toolbar(props: ToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarSection}>
        <div className={styles.sectionTitle}>Слайды</div>
        <SlideControls 
          currentSlideId={props.currentSlideId}
        />
      </div>

      <div className={styles.toolbarSection}>
        <div className={styles.sectionTitle}>Объекты</div>
        <ObjectControls 
          currentSlideId={props.currentSlideId}
          selectedObjectId={props.selectedObjectId}
        />
      </div>

      <div className={styles.toolbarSection}>
        <div className={styles.sectionTitle}>Фон</div>
        <BackgroundControls onOpenBackgroundMenu={props.onOpenBackgroundMenu} />
      </div>

      <div className={styles.toolbarSection}>
        <div className={styles.sectionTitle}>Экспорт</div>
        <ExportControls />
      </div>
    </div>
  );
}