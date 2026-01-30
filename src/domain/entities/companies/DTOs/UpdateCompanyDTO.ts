export interface UpdateCompanyDTO {
    id?: number;
    name?: string;
    cif?: string;
    website?: string;
    brandColor?: string;
    design_type?: string;
    max_users?: number;
    logo?: File | string | null;
    favicon?: File | string | null;
}
