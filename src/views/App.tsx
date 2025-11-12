import { useState } from 'react';
import { BackgroundMenu } from './BackgroundMenu/BackgroundMenu';
import { PresentationTitle } from './PresentationTitle/PresentationTitle';
import { Workspace } from './Workspace/Workspace';
import { SlideList } from './SlideList/SlideList';
import { Toolbar } from './Toolbar/Toolbar';
import styles from './App.module.css';

export function App() {
    const [isBackgroundMenuOpen, setIsBackgroundMenuOpen] = useState(false);
    
    return (
        <div className={styles.app}>
            <PresentationTitle />

            <Toolbar />
            
            <div className={styles.mainContainer}>
                <SlideList />
                
                <Workspace />
                
                <BackgroundMenu 
                    isOpen={isBackgroundMenuOpen}
                    onClose={() => setIsBackgroundMenuOpen(false)}
                />
            </div>
        </div>
    );
}