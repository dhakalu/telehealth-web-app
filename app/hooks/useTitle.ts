import { useContext, useEffect } from 'react';
import { TitleContext } from '~/context/TitleContext';

export function useTitle() {
    const context = useContext(TitleContext);
    if (context === undefined) {
        throw new Error('useTitle must be used within a TitleProvider');
    }
    return context;
}

// Hook to set title with optional suffix
export function usePageTitle(pageTitle?: string) {
    const { setTitle } = useTitle();

    useEffect(() => {
        if (pageTitle) {
            setTitle(`${pageTitle} - MedTok`);
        } else {
            setTitle('MedTok');
        }
    }, [pageTitle, setTitle]);
}
