import { TablesDB, Storage, Query } from "appwrite";
import { DatabaseID, TabelID, StoreID } from "../data/const_for_presantation";
import { client } from "../../views/LogIn";
import type { Presentation } from "../types/types_of_presentation";

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

const getFileBlob = async (fileId: string): Promise<Blob> => {
	const downloadUrl = storage.getFileDownload({
		bucketId: StoreID,
		fileId: fileId,
	});
	const response = await fetch(downloadUrl, { credentials: "include" });
	return await response.blob();
};

export const getImageUrl = (fileId: string): string => {
    return storage.getFileView({
        bucketId: StoreID,
        fileId: fileId,
    });
};

export const getDownloadUrl = (fileId: string): string => {
    return storage.getFileDownload({
        bucketId: StoreID,
        fileId: fileId,
    });
};

export const loadImageFromAppwriteAsDataUrl = async (fileId: string): Promise<string> => {
    try {
        const downloadUrl = storage.getFileDownload(StoreID, fileId);
        const response = await fetch(downloadUrl.toString(), { 
            credentials: "include" 
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.status}`);
        }
        
        const blob = await response.blob();
        const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
        
        return dataUrl;
    } catch (error) {
        console.error('Error in loadImageFromAppwriteAsDataUrl:', error);
        throw error;
    }
};

export const preloadImageForUI = async (fileId: string): Promise<string> => {
    const viewUrl = getImageUrl(fileId);
    
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = viewUrl;
    });
    
    return viewUrl;
};

export const loadImageAsDataUrl = async (fileId: string): Promise<string> => {
    try {
        const blob = await getFileBlob(fileId);
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error("Error loading image as data URL:", error);
        throw error;
    }
};

const fetchImageBlob = async (url: string): Promise<Blob> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to load image: ${url}`);
  return await response.blob();
};

async function getRowsByEmail(email: string) {
  const result = await tablesDB.listRows({
    databaseId: `${DatabaseID}`,
    tableId: `${TabelID}`,
    queries: [Query.equal("email", email)],
  });
  return result;
}

export const uploadImageToStorage = async (file: File): Promise<string> => {
  try {
    const fileId = generateId();
    
    await storage.createFile({
      bucketId: StoreID,
      fileId: fileId,
      file: file,
    });
    
    return fileId;
  } catch (error) {
    console.error("Error uploading image to storage:", error);
    throw error;
  }
};

export const uploadImageFromUrlToStorage = async (url: string): Promise<string> => {
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
    console.error("Error uploading image from URL:", error);
    throw error;
  }
};

export const deleteImageFromStorage = async (fileId: string): Promise<void> => {
  try {
    await storage.deleteFile({
      bucketId: StoreID,
      fileId: fileId,
    });
  } catch (error) {
    console.error("Error deleting image from storage:", error);
  }
};

async function saveToDB(data: Presentation, presentationID: string) {
  try {
    const result = await tablesDB.upsertRow({
      databaseId: DatabaseID,
      tableId: TabelID,
      rowId: presentationID,
      data: {
        title: data.title,
        email: data.email,
        json: `${JSON.stringify(data)}`,
      },
    });

    return result;
  } catch (error) {
    console.error("Error saving to DB:", error);
    throw error;
  }
}

export { 
  saveToDB, 
  getRowsByEmail, 
  getFileBlob, 
  fetchImageBlob, 
  getPresentationDB,
};