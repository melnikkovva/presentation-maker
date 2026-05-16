import { createContext, useContext, useState, type ReactNode } from 'react';

type EditorContextType = {
  activeEditor: any | null;
  setActiveEditor: (editor: any) => void;
  clearActiveEditor: () => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [activeEditor, setActiveEditorState] = useState<any>(null);

  const setActiveEditor = (editor: any) => {
    setActiveEditorState(editor);
  };

  const clearActiveEditor = () => {
    setActiveEditorState(null);
  };

  return (
    <EditorContext.Provider value={{ activeEditor, setActiveEditor, clearActiveEditor }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditorContext() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditorContext must be used within an EditorProvider');
  }
  return context;
}