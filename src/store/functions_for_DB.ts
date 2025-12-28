import { TablesDB, Storage, Query } from "appwrite";
import { DatabaseID, TabelID, StoreID } from "./data/const_for_presantation";
import { client } from "../views/LogIn";
import type { Presentation } from "./types/types_of_presentation";

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
    
    await storage.createFile({
      bucketId: StoreID,
      fileId: fileId,
      file: file,
    });
    
    const fileUrl = storage.getFileView({
      bucketId: StoreID,
      fileId: fileId,
    });
    
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
    console.log(error);
    throw error;
  }
}

export { saveToDB, getRowsByEmail, getPresentationDB, uploadImageToStorage, uploadImageFromUrlToStorage };