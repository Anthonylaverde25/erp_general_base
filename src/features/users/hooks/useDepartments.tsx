import axiosInstance from "@/lib/@axios";
import { useQuery } from "@tanstack/react-query";

interface Department {
    id: number;
    name: string;
}

export default function useDepartments() {
    return useQuery({
        queryKey: ['departments'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/departments');
            return (data.data || data) as Department[];
        }
    });
}
