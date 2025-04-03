export interface DiplomaBook {
    id?: number;
    year: number;
    current_entry_num: number;
    updated_at: Date;
  }
  
  export interface GraduationDecision {
    id?: number;
    decision_number: string;
    issue_date: Date;
    diploma_book_id: number;
    summary?: string;
  }
  
  export interface DiplomaInfo {
    id?: number;
    entry_number: number;
    diploma_book_id: number;
    graduation_decision_id?: number;
  }
  
  export interface DiplomaField {
    id?: number;
    diploma_info_id: number;
    field_name: string;
    data_type: DiplomaFieldDataType;
    value_string?: string;
    value_number?: number;
    value_date?: Date;
  }
  
  export interface DiplomaSearchParams {
    [key: string]: string | number | Date;
  }
  
  export interface ExtendedDiplomaInfo extends DiplomaInfo {
    additional_fields?: DiplomaField[];
    diploma_book?: DiplomaBook;
    graduation_decision?: GraduationDecision;
  }
  
  export enum DiplomaFieldDataType {
    String = 'string',
    Number = 'number',
    Date = 'date',
  }
  
  export interface DiplomaLookupLog {
    id?: number;
    graduation_decision_id: number;
    lookup_count: number;
    lookup_date: Date;
  }