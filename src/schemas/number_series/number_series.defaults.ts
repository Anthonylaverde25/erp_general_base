import { CreateNumberSeriesFormType, UpdateNumberSeriesFormType } from "./number_series.schema";

export const defaultCreateNumberSeriesValues: CreateNumberSeriesFormType = {
    document_type_id: 0,
    serie: "",
    year: new Date().getFullYear(),
    terms: "",
};

export const defaultUpdateNumberSeriesValues = (data?: any): UpdateNumberSeriesFormType => ({
    document_type_id: data?.document_type_id || 0,
    serie: data?.serie || "",
    year: data?.year || new Date().getFullYear(),
    terms: data?.terms || "",
});
