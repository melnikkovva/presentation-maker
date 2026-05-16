import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { generateNewPresentationId } from '../../store/slices/idSlice';
import { ROUTES } from '../../store/data/const_for_presantation';
import styles from './HomePage.module.css'; 

export function HomePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCreateNew = () => {
    dispatch(generateNewPresentationId()); 
    navigate(ROUTES.EDITOR);
  };

  return (
    <div className={styles.container}>
      <h1>Добро пожаловать!</h1>
      <button onClick={handleCreateNew} className={styles.createButton}>
        Создать новую презентацию
      </button>
      <button onClick={() => navigate(ROUTES.GALLERY)} className={styles.createButton}>
        Открыть галерею
      </button>
    </div>
  );
}