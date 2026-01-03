export async function getImageDimensions(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; 
    
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    
    img.onerror = (error) => {
      reject(new Error(`Не удалось загрузить изображение: ${error}`));
    };
    
    img.src = src;
  });
}

export async function getImageDimensionsFromFile(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      };
      
      img.onerror = () => {
        reject(new Error('Не удалось определить размеры изображения'));
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Не удалось прочитать файл'));
    };
    
    reader.readAsDataURL(file);
  });
}

export function scaleToFitSlide(
  width: number, 
  height: number, 
  maxWidth: number = 1200, 
  maxHeight: number = 675
): { width: number; height: number } {
  if (width <= maxWidth && height <= maxHeight) {
    return { width, height };
  }
  
  const scale = Math.min(maxWidth / width, maxHeight / height);
  
  return {
    width: Math.floor(width * scale),
    height: Math.floor(height * scale)
  };
}