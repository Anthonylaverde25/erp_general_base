import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/@axios';
import { useState, useCallback, useRef, useEffect } from 'react';
import { PartnerEntity } from '@/domain/entities/partners/PartnerEntity';
import { PartnerMapper } from '@/infrastructure/mappers/partners/PartnerMapper';

export function useSearchPartners(type?: string) {
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

    const { data, isLoading, isFetching } = useQuery<PartnerEntity[]>({
        queryKey: ['partners_search', debouncedTerm, type],
        queryFn: async () => {
            const { data } = await axiosInstance.get('partners', {
                params: {
                    q: debouncedTerm,
                    type: type, // 'customer' | 'supplier' | etc
                },
            });
            return PartnerMapper.fromDTOList(data.partners || []);
        },
        enabled: debouncedTerm.length >= 1,
    });

    // True if react-query is loading/fetching, OR if the user is typing and we're waiting for the debounce to finish.
    const isSearchLoading = isLoading || isFetching || searchTerm !== debouncedTerm;

    return {
        searchTerm,
        setQuery,
        results: data || [],
        isLoading: isSearchLoading,
    };
}
