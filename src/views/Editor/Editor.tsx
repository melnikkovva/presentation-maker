import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PresentationTitle } from '../PresentationTitle/PresentationTitle';
import { Workspace } from '../Workspace/Workspace';
import { SlideList } from '../SlideList/SlideList';
import { Toolbar } from '../Toolbar/Toolbar';
import styles from '../App.module.css';
import { useHotKeys } from '../../hooks/useHotKeys';
import { loginOut, getUserEmail } from '../LogIn';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectPresentationTitle, selectSlides, selectAllObjects, selectPresentationId } from '../../store/selectors/presentationSelectors';
import { resetPresentation } from '../../store/slices/presentationSlice';
import { generateNewPresentationId, clearPresentationId } from '../../store/slices/idSlice';
import { ROUTES } from '../../store/data/const_for_presantation';
import { loadPresentation, savePresentation } from '../../store/thunk/presentationThunks';


type EditorProps = {
  onLogout: () => void;
};

export function Editor({ onLogout }: EditorProps) {
  useHotKeys();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();

  const title = useAppSelector(selectPresentationTitle);
  const slides = useAppSelector(selectSlides);
  const objects = useAppSelector(selectAllObjects);
  const presentationId = useAppSelector(selectPresentationId);

  useEffect(() => {
    getUserEmail().then(setEmail);
  }, []);

  useEffect(() => {
    const idFromUrl = searchParams.get('id');
    if (!idFromUrl) {
      dispatch(resetPresentation());
      dispatch(generateNewPresentationId());
    } else {
      dispatch(loadPresentation(idFromUrl)).unwrap().catch(() => {
        navigate(ROUTES.HOME);
      });
    }
  }, [searchParams, dispatch, navigate]);

  useEffect(() => {
    if (!email || !presentationId || !title) return;

    const timer = setTimeout(async () => {
      const presentation = buildPresentation();
      dispatch(savePresentation(presentation));
    }, 3000);

    return () => clearTimeout(timer);
  }, [title, slides, objects, presentationId]);

  const buildPresentation = (): any => {
    if (!email || !presentationId) throw new Error('Missing email or ID');
    return {
      id: presentationId,
      title: title || 'Без названия',
      email,
      slides: slides.map(slide => ({
        id: slide.id,
        background: slide.background,
        elements: objects
          .filter(obj => obj.slideId === slide.id)
          .map(obj =>
            obj.type === 'text'
              ? {
                  id: obj.id,
                  type: 'text',
                  x: obj.x,
                  y: obj.y,
                  w: obj.w,
                  h: obj.h,
                  text: obj.text || '',
                  fontSize: obj.fontSize,
                  fontFamily: obj.fontFamily,
                  fontWeight: obj.fontWeight,
                  textDecoration: obj.textDecoration,
                  textAlign: obj.textAlign,
                  color: obj.color,
                  shadow: obj.shadow,
                }
              : {
                  id: obj.id,
                  type: 'image',
                  x: obj.x,
                  y: obj.y,
                  w: obj.w,
                  h: obj.h,
                  src: obj.src || '',
                }
          ),
      })),
    };
  };

  const handlePreview = async () => {
    if (email && presentationId) {
      const presentation = buildPresentation();
      await dispatch(savePresentation(presentation));
    }
    navigate(`${ROUTES.PLAYER}?id=${presentationId}`);
  };

  const handleOpenGallery = () => {
    navigate(ROUTES.GALLERY);
  };

  const handleLogout = async () => {
    await loginOut();
    dispatch(clearPresentationId());
    onLogout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const [email, setEmail] = useState<string | null>(null);

  return (
    <div className={styles.app}>
      <div className={styles.header}>
        <PresentationTitle />
      </div>
      <Toolbar
        onLogout={handleLogout}
        onPreview={handlePreview}
        onOpenGallery={handleOpenGallery}
      />
      <div className={styles.mainContainer}>
        <SlideList />
        <Workspace />
      </div>
    </div>
  );
}