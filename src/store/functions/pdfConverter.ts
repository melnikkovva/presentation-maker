import { jsPDF } from 'jspdf';
import type { Slide, Background, TextObject, ImageObject, SlideObject } from '../types/types_of_presentation';
import { loadImageFromAppwriteAsDataUrl } from './functions_for_DB'; // Импортируем функцию загрузки

const DPI = 96;
const toPt = (px: number): number => (px * 72) / DPI;


const renderBackground = async (
  background: Background,
  doc: jsPDF,
  slideSize: { width: number; height: number }
) => {
  if (background.type === 'color') {
    const color = background.color;
    doc.setFillColor(color);
    doc.rect(0, 0, toPt(slideSize.width), toPt(slideSize.height), 'F');
  } else if (background.type === 'image') {
    try {
      const dataUrl = await loadImageFromAppwriteAsDataUrl(background.src);
      doc.addImage(
        dataUrl,
        'PNG',
        0,
        0,
        toPt(slideSize.width),
        toPt(slideSize.height)
      );
    } catch (err) {
      console.error('Не удалось загрузить фон:', err);
      doc.setFillColor('#ffffff');
      doc.rect(0, 0, toPt(slideSize.width), toPt(slideSize.height), 'F');
    }
  }
};

const renderTextObject = (
  textObj: TextObject,
  doc: jsPDF,
  scaleConst: number
) => {
  const { x, y, w, h, text, fontSize, fontFamily, color, fontWeight } = textObj;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const canvasW = w * scaleConst;
  const canvasH = h * scaleConst;
  canvas.width = canvasW;
  canvas.height = canvasH;

  ctx.clearRect(0, 0, canvasW, canvasH);

  const weight = fontWeight === 'bold' ? 'bold' : 'normal';
  ctx.font = `${weight} ${fontSize * scaleConst}px ${fontFamily}`;
  ctx.fillStyle = color;
  ctx.textBaseline = 'top';

  const words = text.split(' ');
  let line = '';
  const lineHeight = fontSize * scaleConst * 1.2;
  let currentY = 0;

  for (const word of words) {
    const testLine = line + word + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > canvasW && line !== '') {
      ctx.fillText(line, 0, currentY);
      line = word + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) ctx.fillText(line, 0, currentY);

  const dataUrl = canvas.toDataURL('image/png');
  doc.addImage(
    dataUrl,
    'PNG',
    toPt(x * scaleConst),
    toPt(y * scaleConst),
    toPt(canvasW),
    toPt(canvasH)
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
      toPt(imgObj.x * scaleConst),
      toPt(imgObj.y * scaleConst),
      toPt(imgObj.w * scaleConst),
      toPt(imgObj.h * scaleConst)
    );
  } catch (err) {
    console.error('Не удалось загрузить изображение элемента:', err);
    doc.setFillColor('#cccccc');
    doc.rect(
      toPt(imgObj.x * scaleConst),
      toPt(imgObj.y * scaleConst),
      toPt(imgObj.w * scaleConst),
      toPt(imgObj.h * scaleConst),
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