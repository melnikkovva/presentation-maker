import { PresentationTitle } from './PresentationTitle/PresentationTitle';
import { Workspace } from './Workspace/Workspace';
import { SlideList } from './SlideList/SlideList';
import { Toolbar } from './Toolbar/Toolbar';
import styles from './App.module.css';
import { useHotKeys } from '../hooks/useHotKeys';

export function App() {
    useHotKeys();
    return (
        <div className={styles.app}>
            <PresentationTitle />
            <Toolbar />
            <div className={styles.mainContainer}>
                <SlideList />
                <Workspace />
            </div>
        </div>
    );
}