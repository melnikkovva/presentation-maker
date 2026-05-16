import { type JSONContent } from '@tiptap/react';
import { jsPDF } from 'jspdf';
import type { Slide, Background, TextObject, ImageObject, SlideObject } from '../types/types_of_presentation';
import { loadImageFromAppwriteAsDataUrl } from './functions_for_DB'; 

const renderBackground = async (
  background: Background,
  doc: jsPDF,
  slideSize: { width: number; height: number }
) => {
  if (background.type === 'color') {
    const color = background.color;
    doc.setFillColor(color);
    doc.rect(0, 0, (slideSize.width), (slideSize.height), 'F');
  } else if (background.type === 'image') {
    try {
      const dataUrl = await loadImageFromAppwriteAsDataUrl(background.src);
      doc.addImage(
        dataUrl,
        'PNG',
        0,
        0,
        (slideSize.width),
        (slideSize.height)
      );
    } catch (err) {
      console.error('Не удалось загрузить фон:', err);
      doc.setFillColor('#ffffff');
      doc.rect(0, 0, (slideSize.width), (slideSize.height), 'F');
    }
  }
};

const renderTextObject = async (
  textObj: TextObject,
  doc: jsPDF,
  scaleConst: number
) => {
  const x = textObj.x ?? 0;
  const y = textObj.y ?? 0;
  const w = textObj.w ?? 100;
  const h = textObj.h ?? 50;

  const DPI_MULTIPLIER = 2;
  const canvasW = Math.max(1, w * scaleConst * DPI_MULTIPLIER);
  const canvasH = Math.max(1, h * scaleConst * DPI_MULTIPLIER);
  
  const canvas = document.createElement('canvas');
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return;

  ctx.clearRect(0, 0, canvasW, canvasH);
  
  if (textObj.shadow) {
    const shadowX = (textObj.shadow.x || 0) * scaleConst * DPI_MULTIPLIER;
    const shadowY = (textObj.shadow.y || 0) * scaleConst * DPI_MULTIPLIER;
    const shadowBlur = (textObj.shadow.blur || 0) * scaleConst * DPI_MULTIPLIER;
    const shadowColor = textObj.shadow.color || 'rgba(0,0,0,0.5)';
    
    ctx.shadowColor = shadowColor;
    ctx.shadowOffsetX = shadowX;
    ctx.shadowOffsetY = shadowY;
    ctx.shadowBlur = shadowBlur;
  }

  const renderTextContent = async () => {
    if (!textObj.content?.content) return;
    
    const fontSize = (textObj.fontSize || 16) * scaleConst * DPI_MULTIPLIER;
    const fontFamily = textObj.fontFamily || 'Arial';
    const color = textObj.color || '#000000';
    const fontWeight = textObj.fontWeight || 'normal';
    const fontStyle = textObj.fontStyle || 'normal';
    
    ctx.font = `${fontStyle === 'italic' ? 'italic' : ''} ${
      fontWeight === 'bold' ? 'bold' : 'normal'
    } ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textBaseline = 'top';
    ctx.textAlign = textObj.textAlign || 'left';
    
    const lineHeight = fontSize * 1.2;
    let currentY = 0;
    
    for (const node of textObj.content.content) {
      if (node.type !== 'paragraph') continue;
      
      let paragraphY = currentY;
      
      if (node.content) {
        let lineTexts: Array<{text: string, styles: any, width: number}> = [];
        let currentLine = '';
        let currentStyles: any = {};
        
        const collectText = (contentNode: JSONContent, inheritedStyles: any = {}) => {
          if (!contentNode) return;
          
          if (contentNode.type === 'text' && contentNode.text) {
            const marks = contentNode.marks || [];
            const styles = { ...inheritedStyles };
            
            marks.forEach(mark => {
              if (mark.type === 'textStyle' && mark.attrs) {
                Object.assign(styles, mark.attrs);
              }
              if (mark.type === 'bold') {
                styles.fontWeight = 'bold';
              }
              if (mark.type === 'italic') {
                styles.fontStyle = 'italic';
              }
              if (mark.type === 'underline') {
                styles.textDecoration = (styles.textDecoration || '') + ' underline';
              }
              if (mark.type === 'strike') {
                styles.textDecoration = (styles.textDecoration || '') + ' line-through';
              }
            });
            
            const words = contentNode.text.split(' ');
            for (const word of words) {
              const wordWithSpace = word + ' ';
              const testLine = currentLine + wordWithSpace;
              
              applyStyles(ctx, currentStyles);
              const metrics = ctx.measureText(testLine);
              
              if (metrics.width > canvasW && currentLine !== '') {
                lineTexts.push({
                  text: currentLine.trim(),
                  styles: { ...currentStyles },
                  width: ctx.measureText(currentLine.trim()).width
                });
                currentLine = wordWithSpace;
                currentStyles = styles;
              } else {
                currentLine = testLine;
                if (lineTexts.length === 0 || JSON.stringify(currentStyles) !== JSON.stringify(lineTexts[lineTexts.length-1]?.styles)) {
                  currentStyles = styles;
                }
              }
            }
          }
          
          if (contentNode.content) {
            contentNode.content.forEach(child => collectText(child, { ...inheritedStyles }));
          }
        };
        
        collectText(node, {
          fontSize: fontSize / DPI_MULTIPLIER,
          fontFamily,
          fontWeight,
          fontStyle,
          color
        });
        
        if (currentLine.trim()) {
          lineTexts.push({
            text: currentLine.trim(),
            styles: { ...currentStyles },
            width: ctx.measureText(currentLine.trim()).width
          });
        }
        
        let lineStartY = paragraphY;
        for (const lineInfo of lineTexts) {
          if (lineStartY + lineHeight > canvasH) break;
          
          applyStyles(ctx, lineInfo.styles);
          
          let xPos = 0;
          switch (textObj.textAlign) {
            case 'center':
              xPos = (canvasW - lineInfo.width) / 2;
              break;
            case 'right':
              xPos = canvasW - lineInfo.width;
              break;
            default:
              xPos = 0;
          }
          
          ctx.fillText(lineInfo.text, xPos, lineStartY);
          
          if (lineInfo.styles.textDecoration) {
            const decorations = lineInfo.styles.textDecoration.split(' ');
            const textHeight = lineInfo.styles.fontSize || fontSize;
            const textY = lineStartY + textHeight;
            
            ctx.strokeStyle = lineInfo.styles.color || color;
            ctx.lineWidth = Math.max(1, textHeight * 0.05);
            
            if (decorations.includes('underline')) {
              const underlineY = textY - textHeight * 0.1;
              ctx.beginPath();
              ctx.moveTo(xPos, underlineY);
              ctx.lineTo(xPos + lineInfo.width, underlineY);
              ctx.stroke();
            }
            
            if (decorations.includes('line-through')) {
              const lineThroughY = textY - textHeight * 0.6;
              ctx.beginPath();
              ctx.moveTo(xPos, lineThroughY);
              ctx.lineTo(xPos + lineInfo.width, lineThroughY);
              ctx.stroke();
            }
          }
          
          lineStartY += lineHeight;
        }
        
        currentY = lineStartY + lineHeight * 0.5; 
      }
    }
  };

  const applyStyles = (context: CanvasRenderingContext2D, styles: any) => {
    const fontSize = (styles.fontSize || textObj.fontSize || 16) * scaleConst * DPI_MULTIPLIER;
    const fontFamily = styles.fontFamily || textObj.fontFamily || 'Arial';
    const fontWeight = styles.fontWeight || textObj.fontWeight || 'normal';
    const fontStyle = styles.fontStyle || textObj.fontStyle || 'normal';
    
    context.font = `${fontStyle === 'italic' ? 'italic' : ''} ${
      fontWeight === 'bold' ? 'bold' : 'normal'
    } ${fontSize}px ${fontFamily}`;
    
    context.fillStyle = styles.color || textObj.color || '#000000';
  };

  await renderTextContent();
  
  ctx.shadowColor = 'transparent';
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur = 0;

  const dataUrl = canvas.toDataURL('image/png');
  doc.addImage(
    dataUrl,
    'PNG',
    x * scaleConst,
    y * scaleConst,
    w * scaleConst,
    h * scaleConst
  );
};

const renderImageObject = async (
  imgObj: ImageObject,
  doc: jsPDF,
  scaleConst: number
) => {
  try {
    const dataUrl = await loadImageFromAppwriteAsDataUrl(imgObj.src);
    doc.addImage(
      dataUrl,
      'PNG',
      (imgObj.x * scaleConst),
      (imgObj.y * scaleConst),
      (imgObj.w * scaleConst),
      (imgObj.h * scaleConst)
    );
  } catch (err) {
    console.error('Не удалось загрузить изображение элемента:', err);
    doc.setFillColor('#cccccc');
    doc.rect(
      (imgObj.x * scaleConst),
      (imgObj.y * scaleConst),
      (imgObj.w * scaleConst),
      (imgObj.h * scaleConst),
      'F'
    );
  }
};

export const convertToPdf = async (
  doc: jsPDF,
  slides: Slide[],
  objects: SlideObject[],
  scaleConst: number,
  slideSize: { width: number; height: number }
) => {
  for (const slide of slides) {
    await renderBackground(slide.background, doc, slideSize);

    const slideObjects = objects.filter(obj => obj.slideId === slide.id);
    for (const obj of slideObjects) {
      if (obj.type === 'text') {
        renderTextObject(obj, doc, scaleConst);
      } else if (obj.type === 'image') {
        await renderImageObject(obj, doc, scaleConst);
      }
    }

    doc.addPage();
  }

  if (slides.length > 0) {
    doc.deletePage(slides.length + 1);
  }
};