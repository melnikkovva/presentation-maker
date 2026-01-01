import { convertToPdf } from '../../store/functions/pdfConverter';
import jsPDF from 'jspdf';
import { useAppSelector } from '../../store/hooks';
import { Button } from '../../common/Button/Button';
import saveIcon from '../../assets/icons/save.png';
import { selectAllObjects, selectSlides, selectTitle } from '../../store/selectors/presentationSelectors';

export function ExportControls() {
  const title = useAppSelector(selectTitle);
  const slides = useAppSelector(selectSlides);
  const objects = useAppSelector(selectAllObjects);

  const handleExportPdf = async () => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [800, 600],
  });

  try {
    await convertToPdf(doc, slides, objects, 1, { width: 800, height: 600 });
    doc.save(`${title || 'presentation'}.pdf`);
  } catch (error) {
    console.error('Ошибка при экспорте в PDF:', error);
  }
};

  return (
    <div>
      <Button 
        icon={saveIcon}
        onClick={handleExportPdf}
      />
    </div>
  );
}