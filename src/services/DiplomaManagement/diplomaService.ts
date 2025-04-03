import { 
    DiplomaBook, 
    GraduationDecision, 
    DiplomaInfo, 
    DiplomaField, 
    DiplomaSearchParams,
    ExtendedDiplomaInfo,
    DiplomaFieldDataType,
    DiplomaLookupLog
} from '../DiplomaManagement/types/typings';
import { LocalStorageService } from './localStorageService'


class DiplomaService {
    private diplomaBookService = new LocalStorageService<DiplomaBook>('diplomaBooks');
    private diplomaDecisionService = new LocalStorageService<GraduationDecision>('diplomaDecisions');
    private diplomaInfoService = new LocalStorageService<DiplomaInfo>('diplomaInfos');
    private diplomaFieldService = new LocalStorageService<DiplomaField>('diplomaFields');
    private diplomaLookupLogService = new LocalStorageService<DiplomaLookupLog>('diplomaLookupLogs');

    // Diploma Book Methods
    createDiplomaBook(year: number): DiplomaBook {
        const existingBooks = this.diplomaBookService.get();
        const existingBookForYear = existingBooks.find(book => book.year === year);
        
        if (existingBookForYear) {
            throw new Error(`Diploma book for ${year} already exists`);
        }

        return this.diplomaBookService.add({
            year,
            current_entry_num: 1,
            updated_at: new Date()
        });
    }

    getCurrentDiplomaBook(): DiplomaBook {
        const books = this.diplomaBookService.get();
        const currentYear = new Date().getFullYear();
        
        let currentBook = books.find(book => book.year === currentYear);
        
        if (!currentBook) {
            currentBook = this.createDiplomaBook(currentYear);
        }

        return currentBook;
    }

    // Graduation Decision Methods
    createGraduationDecision(
        decisionNumber: string, 
        issueDate: Date, 
        diplomaBookId: number,
        summary?: string
    ): GraduationDecision {
        return this.diplomaDecisionService.add({
            decision_number: decisionNumber,
            issue_date: issueDate,
            diploma_book_id: diplomaBookId,
            summary
        });
    }

    // Diploma Field Methods
    createDiplomaField(
        diplomaInfoId: number,
        fieldName: string,
        dataType: DiplomaFieldDataType,
        value?: string | number | Date
    ): DiplomaField {
        const fieldData: Partial<DiplomaField> = {
            diploma_info_id: diplomaInfoId,
            field_name: fieldName,
            data_type: dataType
        };

        switch (dataType) {
            case DiplomaFieldDataType.String:
                fieldData.value_string = value as string;
                break;
            case DiplomaFieldDataType.Number:
                fieldData.value_number = value as number;
                break;
            case DiplomaFieldDataType.Date:
                fieldData.value_date = value as Date;
                break;
        }

        return this.diplomaFieldService.add(fieldData as Omit<DiplomaField, 'id'>);
    }

    // Diploma Info Methods
    addDiplomaInfo(
        diplomaInfo: Omit<DiplomaInfo, 'id' | 'entry_number' | 'created_at'>,
        additionalFields?: Omit<DiplomaField, 'id' | 'created_at'>[]
    ): ExtendedDiplomaInfo {
        const currentBook = this.getCurrentDiplomaBook();
        
        // Increment entry number
        const updatedBook = this.diplomaBookService.update(currentBook.id!, {
            current_entry_num: (currentBook.current_entry_num || 0) + 1
        });

        const newDiplomaInfo = this.diplomaInfoService.add({
            ...diplomaInfo,
            entry_number: updatedBook!.current_entry_num,
            diploma_book_id: updatedBook!.id!
        });

        // Add additional fields if provided
        const diplomaFields = additionalFields?.map(field => 
            this.createDiplomaField(
                newDiplomaInfo.id!, 
                field.field_name, 
                field.data_type, 
                field.value_string || field.value_number || field.value_date
            )
        );

        return {
            ...newDiplomaInfo,
            additional_fields: diplomaFields,
            diploma_book: updatedBook,
            graduation_decision: this.diplomaDecisionService.get()
                .find(d => d.id === newDiplomaInfo.graduation_decision_id)
        };
    }

    // Diploma Lookup Methods
    searchDiplomas(params: DiplomaSearchParams): ExtendedDiplomaInfo[] {
        if (Object.keys(params).length < 2) {
            throw new Error('At least two search parameters are required');
        }

        const diplomas = this.diplomaInfoService.get().filter(diploma => 
            Object.entries(params).every(([key, value]) => 
                diploma[key as keyof DiplomaSearchParams] === value
            )
        );

        return diplomas.map(diploma => ({
            ...diploma,
            additional_fields: this.diplomaFieldService.get()
                .filter(field => field.diploma_info_id === diploma.id),
            graduation_decision: this.diplomaDecisionService.get()
                .find(decision => decision.id === diploma.graduation_decision_id),
            diploma_book: this.diplomaBookService.get()
                .find(book => book.id === diploma.diploma_book_id)
        }));
    }

    // Lookup Log Methods
    recordLookup(graduationDecisionId: number): DiplomaLookupLog {
        const existingLog = this.diplomaLookupLogService.get()
            .find(log => log.graduation_decision_id === graduationDecisionId);

        if (existingLog) {
            return this.diplomaLookupLogService.update(existingLog.id!, {
                lookup_count: (existingLog.lookup_count || 0) + 1,
                lookup_date: new Date()
            })!;
        }

        return this.diplomaLookupLogService.add({
            graduation_decision_id: graduationDecisionId,
            lookup_count: 1,
            lookup_date: new Date()
        });
    }
}

export default DiplomaService;