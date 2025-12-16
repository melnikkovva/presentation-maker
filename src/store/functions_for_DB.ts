import { TablesDB, Storage, Query } from "appwrite";
import { DatabaseID, ProjectID, TabelID, StoreID } from "./data/const_for_presantation";
import { client } from "../views/LogIn";

const tablesDB = new TablesDB(client);
const storage = new Storage(client);

function generateId(): string {
  return crypto.randomUUID();
}

async function getPresentationDB(rowId: string) {
  const result = await tablesDB.getRow({
    databaseId: `${DatabaseID}`,
    tableId: `${TabelID}`,
    rowId: rowId,
  });
  return result;
}

async function getRowsByEmail(email: string) {
  const result = await tablesDB.listRows({
    databaseId: `${DatabaseID}`,
    tableId: `${TabelID}`,
    queries: [Query.equal("email", email)],
  });
  return result;
}

async function uploadImageToStorage(file: File): Promise<string> {
  try {
    const fileId = generateId();
    
    const result = await storage.createFile({
      bucketId: StoreID,
      fileId: fileId,
      file: file,
    });
    
    const fileUrl = `https://cloud.appwrite.io/v1/storage/buckets/${StoreID}/files/${result.$id}/view?project=${ProjectID}`;
    
    return fileUrl;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function uploadImageFromUrlToStorage(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Не удалось скачать изображение: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    const fileName = url.split('/').pop() || generateId();
    const fileExtension = fileName.split('.').pop() || 'png';
    const finalFileName = `${generateId()}.${fileExtension}`;
    
    const file = new File([blob], finalFileName, {
      type: blob.type,
      lastModified: Date.now(),
    });
    
    return await uploadImageToStorage(file);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function saveToDB(data: any, presentationID: string) {
  try {
    const processedData = await processImagesForStorage(data);
    
    const result = await tablesDB.upsertRow({
      databaseId: DatabaseID,
      tableId: TabelID,
      rowId: presentationID,
      data: {
        email: data.email,
        title: data.title,
        json: JSON.stringify(processedData),
      },
    });
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function processImagesForStorage(presentation: any): Promise<any> {
  const processedPresentation = { ...presentation };
  
  if (processedPresentation.slides && Array.isArray(processedPresentation.slides)) {
    for (const slide of processedPresentation.slides) {
      if (slide.elements && Array.isArray(slide.elements)) {
        for (const element of slide.elements) {
          if (element.type === 'image' && element.src.startsWith('data:')) {
            try {
              const file = dataURLtoFile(element.src, `image_${generateId()}.png`);
              const storageUrl = await uploadImageToStorage(file);
              element.src = storageUrl; 
            } catch (error) {
              console.log(error);
            }
          }
        }
      }
    }
  }
  
  return processedPresentation;
}

function dataURLtoFile(dataurl: string, filename: string): File {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mime });
}

export { saveToDB, getRowsByEmail, getPresentationDB, uploadImageToStorage, uploadImageFromUrlToStorage };