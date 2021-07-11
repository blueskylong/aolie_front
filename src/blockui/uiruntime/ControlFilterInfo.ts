export interface ControlFilterInfo {
    columnId: number;
    fieldName: string;
    filter: string;
    isEditableFilter: boolean;
}

export interface ControlFilterResult {
    isEditableFilter: boolean;
    result: boolean;
}
