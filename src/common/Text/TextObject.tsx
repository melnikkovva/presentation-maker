import React, { useEffect, useRef } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { FontFamily } from '@tiptap/extension-font-family';
import { FontSize } from './extensions/FontSize';
import { TextShadow } from './extensions/TextShadow';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { changeObjectPosition, changeObjectSize, updateObjectTextContent, updateTextObjectStyles, } from '../../store/slices/objectsSlice';
import { selectSelectedObjects, selectTextObjectById } from '../../store/selectors/presentationSelectors';
import { useResize } from '../../hooks/useResize';
import { ResizeHandles } from '../../hooks/ResizeHandle';
import { useEditorContext } from '../../views/Toolbar/EditorContext';
import { MIN_DIV_HEIGHT, MIN_DIV_WIDTH, PREVIEW_SCALE, PLAYER_RATIO, } from '../../store/data/const_for_presantation';
import styles from './TextObject.module.css';
import type { JSONContent } from '@tiptap/react';
import type { TextObject as TextObjectType } from '../../store/types/types_of_presentation';

const FALLBACK_CONTENT: JSONContent = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [{ type: 'text', text: 'Текст' }],
    },
  ],
};

function getScale(isPreview: boolean, isPlayer: boolean) {
  if (isPlayer) return PLAYER_RATIO;
  if (isPreview) return PREVIEW_SCALE;
  return 1;
}

export type TextObjectProps = {
  objectId: string;
  isPreview: boolean;
  isPlayer: boolean;
  isSelected: boolean;
  onMouseDown?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
};

export const TextObject: React.FC<TextObjectProps> = (props) => {
  const dispatch = useAppDispatch();
  const object = useAppSelector((s) => selectTextObjectById(s, props.objectId)) as TextObjectType | undefined;
  const selectedObjects = useAppSelector(selectSelectedObjects);
  const { setActiveEditor } = useEditorContext();
  const containerRef = useRef<HTMLDivElement>(null);

  const scale = getScale(props.isPreview, props.isPlayer);
  const isInteractive = !props.isPreview && !props.isPlayer;
  const hasMultipleSelection = selectedObjects.length > 1;

  const editor = useEditor({
    editable: isInteractive,
    content: object?.content ?? FALLBACK_CONTENT,
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      FontFamily,
      FontSize,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextShadow,
    ],
    editorProps: {
      attributes: {
        class: styles.editorContent,
        style: `
          width: 100%;
          height: 100%;
          overflow: hidden;
          box-sizing: border-box;
        `
      },
    },
    onUpdate: ({ editor }) => {
      if (!object) return;

      dispatch(
        updateObjectTextContent({
          objectId: object.id,
          content: editor.getJSON(),
        }),
      );

      dispatch(
        updateTextObjectStyles({
          objectId: object.id,
          fontSize: parseFloat(editor.getAttributes('textStyle').fontSize),
          fontFamily: editor.getAttributes('textStyle').fontFamily,
          color: editor.getAttributes('textStyle').color,
          fontWeight: editor.isActive('bold') ? 'bold' : 'normal',
          fontStyle: editor.isActive('italic') ? 'italic' : 'normal',
          textAlign: editor.getAttributes('paragraph').textAlign ?? 'left',
        }),
      );
    },
  });

  useEffect(() => {
    if (!editor || !object?.content) return;

    const current = JSON.stringify(editor.getJSON());
    const incoming = JSON.stringify(object.content);

    if (current !== incoming) {
      editor.commands.setContent(object.content);
    }
  }, [editor, object?.content]);

  useEffect(() => {
    if (!containerRef.current || !object) return;
    
    const container = containerRef.current;
    container.style.setProperty('--container-width', `${object.w * scale}px`);
    container.style.setProperty('--container-height', `${object.h * scale}px`);
    
    if (editor && editor.view) {
      requestAnimationFrame(() => {
        editor.view.dispatch(editor.view.state.tr);
      });
    }
  }, [object?.w, object?.h, scale, editor]);

  const resize = useResize({
    width: (object?.w ?? 100) * scale,
    height: (object?.h ?? 100) * scale,
    x: (object?.x ?? 0) * scale,
    y: (object?.y ?? 0) * scale,
    enabled: isInteractive && props.isSelected && !hasMultipleSelection,
    minWidth: MIN_DIV_WIDTH * scale,
    minHeight: MIN_DIV_HEIGHT * scale,
    preserveAspectRatio: false,
    onResize: (w, h, x, y) => {
      if (!object) return;
      
      if (containerRef.current) {
        containerRef.current.style.setProperty('--container-width', `${w}px`);
        containerRef.current.style.setProperty('--container-height', `${h}px`);
      }

      dispatch(
        changeObjectSize({
          objectId: object.id,
          width: w / scale,
          height: h / scale,
        }),
      );

      dispatch(
        changeObjectPosition({
          objectId: object.id,
          x: x / scale,
          y: y / scale,
        }),
      );
    },
    onResizeEnd: (w, h, x, y) => {
      if (!object) return;

      dispatch(
        changeObjectSize({
          objectId: object.id,
          width: w / scale,
          height: h / scale,
        }),
      );

      dispatch(
        changeObjectPosition({
          objectId: object.id,
          x: x / scale,
          y: y / scale,
        }),
      );
    },
  });

  if (!object || !editor) return null;

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    left: object.x * scale,
    top: object.y * scale,
    width: object.w * scale,
    height: object.h * scale,
    ...props.style,
  };

  const handleDragMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    props.onMouseDown?.(e);
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${
        props.isSelected ? styles.selected : ''
      }`}
      style={containerStyle}
      onMouseDown={(e) => {
        if (isInteractive && !props.isSelected) {
          e.stopPropagation();
          props.onMouseDown?.(e);
        }
      }}
      data-text-object="true"
    >
      {isInteractive && (
        <div
          className={styles.dragHandle}
          onMouseDown={handleDragMouseDown}
        />
      )}

      <div className={styles.textWrapper}>
        <EditorContent
          editor={editor}
          onMouseDown={(e) => {
            e.stopPropagation();
            setActiveEditor(editor);
            editor.commands.focus();
          }}
        />
      </div>
      
      {props.isSelected && isInteractive && !hasMultipleSelection && (
        <ResizeHandles
          onMouseDown={resize.onResizeHandleMouseDown}
        />
      )}
    </div>
  );
};
