import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/@axios';
import { useState, useCallback, useRef, useEffect } from 'react';
import type { ItemSearchResult } from '@/ui/documents/components/create-document/types';

export function useSearchItems(type?: string) {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedTerm, setDebouncedTerm] = useState('');
    const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const setQuery = useCallback((term: string) => {
        setSearchTerm(term);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setDebouncedTerm(term);
        }, 300);
    }, []);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    const { data, isLoading } = useQuery<ItemSearchResult[]>({
        queryKey: ['items_search', debouncedTerm, type],
        queryFn: async () => {
            const { data } = await axiosInstance.get('items/search', {
                params: {
                    q: debouncedTerm,
                    type: type === 'item' ? 'physical' : type === 'service' ? 'service' : undefined,
                },
            });
            return data.items;
        },
        enabled: debouncedTerm.length >= 1,
    });

    return {
        searchTerm,
        setQuery,
        results: data || [],
        isLoading,
    };
}
