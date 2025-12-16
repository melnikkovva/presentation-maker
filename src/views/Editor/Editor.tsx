import { useEffect, useCallback, useState } from 'react';
import { PresentationTitle } from '../PresentationTitle/PresentationTitle';
import { Workspace } from '../Workspace/Workspace';
import { SlideList } from '../SlideList/SlideList';
import { Toolbar } from '../Toolbar/Toolbar';
import styles from '../App.module.css';
import { useHotKeys } from '../../hooks/useHotKeys';
import { saveToDB } from '../../store/functions_for_DB';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectPresentationTitle, selectSlides, selectAllObjects, selectPresentationId, selectUserEmail } from '../../store/selectors/presentationSelectors';
import { generateNewPresentationId } from '../../store/slices/idSlice';
import { updateEmailFromSession } from '../../store/slices/emailSlice';

interface EditorProps {
  onLogout: () => void;
}

export function Editor({ onLogout }: EditorProps) {
  useHotKeys();

  const title = useAppSelector(selectPresentationTitle);
  const slides = useAppSelector(selectSlides);
  const objects = useAppSelector(selectAllObjects);
  const presentationId = useAppSelector(selectPresentationId);
  const email = useAppSelector(selectUserEmail);
  const dispatch = useAppDispatch(); 
  
  const [lastSavedHash, setLastSavedHash] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!presentationId) {
      dispatch(generateNewPresentationId());
    }
  }, [presentationId, dispatch]);

  useEffect(() => {
    console.log(email);
    if (!email) {
      dispatch(updateEmailFromSession());
    }
  }, [email, dispatch]);

  const buildPresentation = useCallback(() => {    
    if (!presentationId) {
      return null;
    }
    
    return {
      id: presentationId,
      title,
      email: email || 'unknown@example.com', 
      slides: slides.map(slide => ({
        id: slide.id,
        background: slide.background,
        elements: objects
          .filter(obj => obj.slideId === slide.id)
          .map(obj => {
            if (obj.type === 'text') {
              return {
                id: obj.id,
                type: 'text',
                x: obj.x,
                y: obj.y,
                width: obj.w,
                height: obj.h,
                text: obj.text,
                fontSize: obj.fontSize,
                fontFamily: obj.fontFamily,
                fontWeight: obj.fontWeight,
                textDecoration: obj.textDecoration,
                textAlign: obj.textAlign,
                color: obj.color,
                shadow: obj.shadow,
              };
            } else if (obj.type === 'image') {
              return {
                id: obj.id,
                type: 'image',
                x: obj.x,
                y: obj.y,
                width: obj.w,
                height: obj.h,
                src: obj.src, 
              };
            }
            return null;
          }).filter(Boolean),
      })),
    };
  }, [title, slides, objects, presentationId, email]);

  const createStateHash = useCallback(() => {
    return JSON.stringify({
      title,
      slidesCount: slides.length,
      objectsCount: objects.length,
      lastModified: Date.now()
    });
  }, [title, slides.length, objects.length]);

  useEffect(() => {
    if (!presentationId || !title || !email) {
      return;
    }

    const currentHash = createStateHash();
    
    if (currentHash === lastSavedHash) {
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSaving(true);
        const presentation = buildPresentation();
        
        if (!presentation) {
          return;
        }
        
        await saveToDB(presentation, presentationId);
        setLastSavedHash(currentHash);
        console.log('Презентация автосохранена');
      } catch (error) {
        console.log(error);
      } finally {
        setIsSaving(false);
      }
    }, 3000); 

    return () => {
      clearTimeout(timer);
    };
  }, [buildPresentation, presentationId, title, email, createStateHash, lastSavedHash]);

  return (
    <div className={styles.app}>
      <div className={styles.header}>
        <PresentationTitle />
        <div className={styles.saveStatus}>
          {isSaving ? 'Сохраняется' : 'Сохранено'}
        </div>
      </div>
      <Toolbar onLogout={onLogout} />
      <div className={styles.mainContainer}>
        <SlideList />
        <Workspace />
      </div>
    </div>
  );
}