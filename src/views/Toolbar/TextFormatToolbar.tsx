import { useAppSelector } from '../../store/hooks';
import { selectSelectedObjects } from '../../store/selectors/presentationSelectors';
import { useEditorContext } from './EditorContext';
import styles from './TextFormatToolbar.module.css';

export function TextFormatToolbar() {
  const selectedObjects = useAppSelector(selectSelectedObjects);
  const { activeEditor } = useEditorContext();
  
  const isTextSelected = selectedObjects.some(obj => 
    obj.typeElement === 'text'
  );
  
  const isSingleTextSelected = selectedObjects.length === 1 && 
    selectedObjects[0].typeElement === 'text';

  if (!isTextSelected || !activeEditor) {
    return null;
  }

  const currentFontFamily = activeEditor.getAttributes('textStyle').fontFamily || 'Arial';
  const currentFontSize = activeEditor.getAttributes('textStyle').fontSize || '16px';
  const currentColor = activeEditor.getAttributes('textStyle').color || '#000000';

  const applyShadow = (shadowValue: string) => {
    if (activeEditor) {
      if (shadowValue === 'none') {
        activeEditor.chain().focus().unsetMark('textStyle').run();
      } else {
        activeEditor.chain().focus().setMark('textStyle', {
          textShadow: shadowValue,
        }).run();
      }
    }
  };

  return (
    <div className={styles.textFormatToolbar}>
      <div className={styles.formatGroup}>
        <button
          onClick={() => activeEditor.chain().focus().toggleBold().run()}
          className={`${styles.toolbarButton} ${activeEditor.isActive('bold') ? styles.active : ''}`}
          title="Жирный"
        >
          <span className={styles.buttonText}>B</span>
        </button>
        
        <button
          onClick={() => activeEditor.chain().focus().toggleItalic().run()}
          className={`${styles.toolbarButton} ${activeEditor.isActive('italic') ? styles.active : ''}`}
          title="Курсив"
        >
          <span className={styles.buttonText}>I</span>
        </button>
        
        <button
          onClick={() => activeEditor.chain().focus().toggleUnderline().run()}
          className={`${styles.toolbarButton} ${activeEditor.isActive('underline') ? styles.active : ''}`}
          title="Подчеркнутый"
        >
          <span className={styles.buttonText}>U</span>
        </button>
        
        <button
          onClick={() => activeEditor.chain().focus().toggleStrike().run()}
          className={`${styles.toolbarButton} ${activeEditor.isActive('strike') ? styles.active : ''}`}
          title="Зачеркнутый"
        >
          <span className={styles.buttonText}>S</span>
        </button>
      </div>

      <div className={styles.formatGroup}>
        <button
          onClick={() => activeEditor.chain().focus().setTextAlign('left').run()}
          className={`${styles.toolbarButton} ${activeEditor.isActive({ textAlign: 'left' }) ? styles.active : ''}`}
          title="Выровнять по левому краю"
        >
          <span className={styles.icon}>←</span>
        </button>
        
        <button
          onClick={() => activeEditor.chain().focus().setTextAlign('center').run()}
          className={`${styles.toolbarButton} ${activeEditor.isActive({ textAlign: 'center' }) ? styles.active : ''}`}
          title="Выровнять по центру"
        >
          <span className={styles.icon}>↔</span>
        </button>
        
        <button
          onClick={() => activeEditor.chain().focus().setTextAlign('right').run()}
          className={`${styles.toolbarButton} ${activeEditor.isActive({ textAlign: 'right' }) ? styles.active : ''}`}
          title="Выровнять по правому краю"
        >
          <span className={styles.icon}>→</span>
        </button>
      </div>

      <div className={styles.formatGroup}>
         <select
          value={currentFontFamily}
          onChange={e => activeEditor.chain().focus().setFontFamily(e.target.value).run()}
          className={styles.fontSelect}
          title="Шрифт"
        >
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Verdana">Verdana</option>
          <option value="Georgia">Georgia</option>
          <option value="Courier New">Courier New</option>
          <option value="Comic Sans MS">Comic Sans MS</option>
          <option value="Tahoma">Tahoma</option>
        </select>
        
        <select
          value={currentFontSize}
          onChange={e => activeEditor.chain().focus().setFontSize(e.target.value).run()}
          className={styles.fontSizeSelect}
          title="Размер шрифта"
        >
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
          <option value="24px">24px</option>
          <option value="28px">28px</option>
          <option value="32px">32px</option>
          <option value="36px">36px</option>
          <option value="40px">40px</option>
          <option value="48px">48px</option>
        </select>
      </div>

      <div className={styles.formatGroup}>
        <input
          type="color"
          value={currentColor}
          onChange={e => activeEditor.chain().focus().setColor(e.target.value).run()}
          className={styles.colorPicker}
          title="Цвет текста"
        />
        
      </div>

      {isSingleTextSelected && (
        <div className={styles.formatGroup}>
          <button
            onClick={() => applyShadow('2px 2px 4px rgba(0,0,0,0.5)')}
            className={styles.toolbarButton}
            title="Добавить тень"
          >
            <span className={styles.icon}>🔆</span>
          </button>
          
          <button
            onClick={() => applyShadow('none')}
            className={styles.toolbarButton}
            title="Убрать тень"
          >
            <span className={styles.icon}>×</span>
          </button>
        </div>
        
      )}

    </div>
  );
}