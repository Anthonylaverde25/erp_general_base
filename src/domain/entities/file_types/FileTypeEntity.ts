export interface FileType {
    id: number;
    company_id: number;
    name: string;
    description: string;
    is_active: boolean;
}

export class FileTypeEntity implements FileType {
    constructor(
        public id: number,
        public company_id: number,
        public name: string,
        public description: string,
        public is_active: boolean
    ) { }

    static fromPrimitives(data: FileType): FileTypeEntity {
        return new FileTypeEntity(
            data.id,
            data.company_id,
            data.name,
            data.description ?? '',
            data.is_active
        );
    }

    toPlainObject(): FileType {
        return {
            id: this.id,
            company_id: this.company_id,
            name: this.name,
            description: this.description,
            is_active: this.is_active
        };
    }
}
