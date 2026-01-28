import { injectable } from 'inversify';
import axiosInstance from '@/lib/@axios';
import { ICompanyCrudRepository } from '@/domain/entities/companies/repositories/company.interface.crud';
import { Company } from '@/domain/entities/companies/Company';
import { CompanyMapper } from '@/domain/entities/companies/Mappers/CompanyMapper';
import { UpdateCompanyDTO } from '@/domain/entities/companies/DTOs/UpdateCompanyDTO';

@injectable()
export class CompanyRepositoryCrud implements ICompanyCrudRepository {
    async index(): Promise<Company[]> {
        const {
            data: { companies }
        } = await axiosInstance.get(`companies`);
        return CompanyMapper.fromDetailDTOList(companies);
    }

    async show(id: number): Promise<Company> {
        const {
            data: { company }
        } = await axiosInstance.get(`companies/${id}`);
        return CompanyMapper.fromDetailDTO(company);
    }

    async update(id: number, data: UpdateCompanyDTO): Promise<{ company: Company; message: string }> {
        // Check if data contains files
        const hasFiles = (data.logo instanceof File) || (data.favicon instanceof File);

        let response;

        if (hasFiles) {
            const formData = new FormData();
            formData.append('_method', 'PUT');

            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    if (key === 'logo' || key === 'favicon') {
                        if (value instanceof File) {
                            formData.append(key, value);
                        }
                        // If it's a string (URL) or null and we want to remove, handle accordingly?
                        // Usually if we want to remove, we might send null. 
                        // But FormData string "null" is weird. 
                        // Let's assume File means upload.
                    } else {
                        formData.append(key, String(value));
                    }
                }
            });

            // Handling explicit nulls for removal if needed, but for now assuming File upload focus
            if (data.logo === null) formData.append('logo', ''); // Trigger removal if backend supports empty string as null
            if (data.favicon === null) formData.append('favicon', '');

            response = await axiosInstance.post(`/companies/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        } else {
            response = await axiosInstance.put(`/companies/${id}`, data);
        }

        const { company, message } = response.data;

        return {
            company: CompanyMapper.fromDetailDTO(company),
            message: message || "Empresa actualizada correctamente",
        };
    }
}
