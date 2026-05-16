import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRowsByEmail } from '../../store/functions/functions_for_DB';
import { getUserEmail } from '../LogIn';
import { generateNewPresentationId } from '../../store/slices/idSlice';
import { ROUTES } from '../../store/data/const_for_presantation';
import styles from './Gallery.module.css';

export function Gallery() {
  const [email, setEmail] = useState<string | null>(null);
  const navigate = useNavigate();
  const [presentations, setPresentations] = useState<Array<{
    $id: string;
    title: string;
    email: string;
    updatedAt: string; 
  }>>([]);

  useEffect(() => {
    getUserEmail().then(setEmail);
  }, []);

  const handleOpenEditor = (presentationId: string) => {
    navigate(`${ROUTES.EDITOR}?id=${presentationId}`);
  };

  useEffect(() => {
    if (!email) return;

    getRowsByEmail(email)
      .then(res => {
        const parsed = res.rows.map(row => {
          try {
            let data;
            if (typeof row.json === 'string') {
              data = JSON.parse(row.json);
            } else if (row.json && typeof row.json === 'object') {
              data = row.json;
            } else if (row.data) {
              data = row.data;
            } else {
              data = {};
            }

            let updatedAt = row.updatedAt || row.$updatedAt || data.updatedAt;
            if (!updatedAt) {
              updatedAt = row.$createdAt || new Date().toISOString();
            }

            const date = new Date(updatedAt);
            const formattedDate = date.toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });

            return {
              $id: row.$id || row.id || generateNewPresentationId(),
              title: data.title || 'Без названия',
              email: row.email || email,
              updatedAt: formattedDate,
            };
          } catch (e) {
            return {
              $id: row.$id || generateNewPresentationId(),
              title: 'Ошибка загрузки',
              email: row.email || email,
              updatedAt: '—',
            };
          }
        });

        setPresentations(parsed);
      })
      .catch(() => {});
  }, [email]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Мои презентации</h1>

      <div className={styles.tableHeader}>
        <div></div> 
        <div>Название</div>
        <div>Изменено</div>
        <div>Владелец</div>
      </div>

      <div className={styles.tableBody}>
        {presentations.length === 0 ? (
          <div className={styles.emptyRow}>
            У вас пока нет презентаций.
          </div>
        ) : (
          presentations.map(p => (
            <div
              key={p.$id}
              className={styles.tableRow}
              onClick={() => handleOpenEditor(p.$id)}
            >
              <div className={styles.iconCell}>
                <div className={styles.presentationIcon} />
              </div>
              <div className={styles.titleCell}>{p.title}</div>
              <div className={styles.dateCell}>{p.updatedAt}</div>
              <div className={styles.ownerCell}>{p.email}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}