import { Client, Account, ID } from "appwrite";
import { Endpoint, ProjectID } from "../store/data/const_for_presantation";

export const client = new Client()
                        .setProject(ProjectID)
                        .setEndpoint(Endpoint);
                        
const account = new Account(client);

async function createAccount(email: string, password: string, name: string) {
  const result = await account.create({
    userId: `${ID.unique()}`,
    email: `${email}`,
    password: `${password}`,
    name: `${name}`,
  });
  console.log(result);
}

export async function getUserEmail() {
  try {
    const user = await account.get();
    return user.email;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function getAccountStatus() {
  const user = await account.get();
  return user.email;
}

async function loginAccount(email: string, password: string) {
  await account.createEmailPasswordSession({
    email,
    password,
  });
  
  try {
    const user = await account.get();
    return user.email;
  } catch (error) {
    console.log(error);
    return email; 
  }
}

async function loginOut(setIsLogged: React.Dispatch<React.SetStateAction<boolean>>) {
  try {
    const sessions = await getCurrentSession();
    
    if (!sessions || sessions.length === 0) {
      setIsLogged(false); 
      return;
    }

    const sessionId = sessions[0].$id;
    await account.deleteSession({ sessionId });

    setIsLogged(false);
  } catch (error) {
    console.log(error);
  }
}

export async function getCurrentSession() {
  try {
    const sessions = await account.listSessions();
    return sessions.sessions;
  } catch (error) {
    return null;
  }
}

export { createAccount, loginAccount, loginOut, getAccountStatus as checkAuthStatus };