import { createContext, ReactNode, useState } from 'react';

interface TitleContextType {
    title: string;
    setTitle: (title: string) => void;
}

export const TitleContext = createContext<TitleContextType | undefined>(undefined);

export function TitleProvider({ children }: { children: ReactNode }) {
    const [title, setTitle] = useState('MedTok');

    return (
        <TitleContext.Provider value={{ title, setTitle }}>
            {children}
        </TitleContext.Provider>
    );
}
