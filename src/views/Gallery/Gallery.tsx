import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRowsByEmail } from '../../store/functions_for_DB';
import { useAppSelector  } from '../../store/hooks';
import { selectUserEmail } from '../../store/selectors/presentationSelectors';
import { ROUTES } from '../../store/data/const_for_presantation';
import styles from './Gallery.module.css';

export function Gallery() {
  const email = useAppSelector(selectUserEmail);
  const navigate = useNavigate();
  const [presentations, setPresentations] = useState<any[]>([]);

  const handleOpenEditor = (presentationId: string) => {
    navigate(`${ROUTES.EDITOR}?id=${presentationId}`);
  };

  useEffect(() => {
    if (!email) return;
    getRowsByEmail(email).then(res => {
      const parsedPresentations = res.rows.map((row) => {
        try {
          const data = JSON.parse(row.json); 
          return {
            $id: row.$id,
            title: data.title || 'Без названия',
            email: row.email, 
          };
        } catch (e) {
          console.log(e);
          return {
            $id: row.$id,
            title: 'Ошибка загрузки',
            email: row.email,
          };
        }
      });
      setPresentations(parsedPresentations);
    });
  }, [email]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Мои презентации</h1>

      <div className={styles.grid}>
        {presentations.length === 0 ? (
          <p className={styles.empty}>У вас пока нет презентаций.</p>
        ) : (
          presentations.map(p => (
            <div
              key={p.$id}
              className={styles.card}
              onClick={() => handleOpenEditor(p.$id)}
            >
              <h3 className={styles.cardTitle}>{p.title}</h3>
              <p className={styles.cardEmail}>{p.email}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}