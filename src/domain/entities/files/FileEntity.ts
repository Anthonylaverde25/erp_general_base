export interface FileModel {
    id: number;
    company_id: number;
    file_type_id: number | null;
    file_name: string;
    file_path: string;
    mime_type: string;
    size: number;
    uploaded_by: number | null;
    fileable_id: number;
    fileable_type: string;
    created_at: string;
    file_type?: {
        id: number;
        name: string;
    };
    uploader?: {
        id: number;
        name: string;
    };
}

export class FileEntity implements FileModel {
    constructor(
        public id: number,
        public company_id: number,
        public file_type_id: number | null,
        public file_name: string,
        public file_path: string,
        public mime_type: string,
        public size: number,
        public uploaded_by: number | null,
        public fileable_id: number,
        public fileable_type: string,
        public created_at: string,
        public file_type?: { id: number; name: string },
        public uploader?: { id: number; name: string }
    ) { }

    static fromPrimitives(data: FileModel): FileEntity {
        return new FileEntity(
            data.id,
            data.company_id,
            data.file_type_id,
            data.file_name,
            data.file_path,
            data.mime_type,
            data.size,
            data.uploaded_by,
            data.fileable_id,
            data.fileable_type,
            data.created_at,
            data.file_type,
            data.uploader
        );
    }

    toPlainObject(): FileModel {
        return {
            id: this.id,
            company_id: this.company_id,
            file_type_id: this.file_type_id,
            file_name: this.file_name,
            file_path: this.file_path,
            mime_type: this.mime_type,
            size: this.size,
            uploaded_by: this.uploaded_by,
            fileable_id: this.fileable_id,
            fileable_type: this.fileable_type,
            created_at: this.created_at,
            file_type: this.file_type,
            uploader: this.uploader
        };
    }
}
