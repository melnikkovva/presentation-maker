import React from 'react';
import { type JSONContent } from '@tiptap/react';
import type { TextObject as TextObjectType } from '../../store/types/types_of_presentation';
import { PREVIEW_SCALE, PLAYER_RATIO } from '../../store/data/const_for_presantation';

export type TextObjectViewProps = {
  object: TextObjectType;
  isPreview: boolean;
  isPlayer: boolean;
  style?: React.CSSProperties;
};

function getScale(isPreview: boolean, isPlayer: boolean) {
  if (isPlayer) return PLAYER_RATIO;
  if (isPreview) return PREVIEW_SCALE;
  return 1;
}

export const TextObjectView: React.FC<TextObjectViewProps> = ({
  object,
  isPreview,
  isPlayer,
  style,
}) => {
  const scale = getScale(isPreview, isPlayer);
  
const renderContent = () => {
    if (!object.content || !object.content.content) {
        return <div>Текст</div>;
    }

    const renderNode = (node: JSONContent, index: number): React.ReactNode => {
        if (node.type === 'paragraph') {
        const paragraphStyle: React.CSSProperties = {
            textAlign: object.textAlign || 'left',
            margin: 0,
            lineHeight: 'normal',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            whiteSpace: 'pre-wrap',
        };

        const children = node.content?.map((child, childIndex) => 
            renderNode(child, childIndex)
        ) || [];

        return (
            <p key={index} style={paragraphStyle}>
            {children}
            </p>
        );
        }

        if (node.type === 'text') {
        let element: React.ReactNode = node.text || '';
        
        const marks = node.marks || [];
        
        marks.forEach(mark => {
            const style: React.CSSProperties = {};
            
            if (mark.type === 'textStyle' && mark.attrs) {
            if (mark.attrs.color) style.color = mark.attrs.color;
            if (mark.attrs.fontSize) style.fontSize = mark.attrs.fontSize;
            if (mark.attrs.fontFamily) style.fontFamily = mark.attrs.fontFamily;
            if (mark.attrs.textShadow) style.textShadow = mark.attrs.textShadow;
            
            element = <span style={style}>{element}</span>;
            }
            
            if (mark.type === 'bold') {
            element = <strong>{element}</strong>;
            }
            if (mark.type === 'italic') {
            element = <em>{element}</em>;
            }
            if (mark.type === 'underline') {
            element = <u>{element}</u>;
            }
            if (mark.type === 'strike') {
            element = <s>{element}</s>;
            }
        });

        return element;
        }

        return null;
    };

    const content = object.content.content.map(renderNode);
    return content;
    };

  const textShadowStyle = object.shadow ? {
    textShadow: `${object.shadow.x}px ${object.shadow.y}px ${object.shadow.blur}px ${object.shadow.color}`
  } : {};

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    left: object.x * scale,
    top: object.y * scale,
    width: object.w * scale,
    height: object.h * scale,
    fontFamily: object.fontFamily,
    fontSize: object.fontSize,
    fontWeight: object.fontWeight,
    fontStyle: object.fontStyle,
    color: object.color,
    textDecoration: object.textDecoration,
    ...textShadowStyle,
    overflow: 'hidden',
    ...style,
  };

  return (
    <div style={containerStyle}>
      {renderContent()}
    </div>
  );
};

TextObjectView.displayName = 'TextObjectView';