import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Enhanced interfaces with better type safety
export interface DiplomaBook {
    id: string; 
    year: number;
    startDate: string;
    endDate: string;
    currentEntryNumber: number;
}

export interface GraduationDecision {
    id: string;
    decisionNumber: string;
    issuanceDate: string;
    summary: string;
    diplomaBookId: string;
    totalLookups: number;
}

export interface DiplomaFieldTemplate {
    id: string;
    name: string;
    dataType: 'String' | 'Number' | 'Date';
    isRequired: boolean;
    defaultValue?: string | number | Date;
    validation?: {
        minLength?: number;
        maxLength?: number;
        min?: number;
        max?: number;
        pattern?: string;
    };
}

export interface DiplomaInformation {
    id: string;
    diplomaBookId: string;
    decisionId: string;
    bookEntryNumber: number;
    diplomaSerialNumber: string;
    studentId: string;
    fullName: string;
    dateOfBirth: string;
    additionalFields: Record<string, string | number | Date | undefined>;
}

export interface DiplomaLookupRecord {
    id: string;
    diplomaId: string;
    lookupDate: string;
    lookupSource: string;
}

export default () => {
    // State management for diploma-related entities
    const [diplomaBooks, setDiplomaBooks] = useState<DiplomaBook[]>(() => {
        const storedBooks = localStorage.getItem('diplomaBooks');
        return storedBooks ? JSON.parse(storedBooks) : [];
    });

    const [graduationDecisions, setGraduationDecisions] = useState<GraduationDecision[]>(() => {
        const storedDecisions = localStorage.getItem('graduationDecisions');
        return storedDecisions ? JSON.parse(storedDecisions) : [];
    });

    const [diplomaFieldTemplates, setDiplomaFieldTemplates] = useState<DiplomaFieldTemplate[]>(() => {
        const storedTemplates = localStorage.getItem('diplomaFieldTemplates');
        return storedTemplates ? JSON.parse(storedTemplates) : [];
    });

    const [diplomaInformations, setDiplomaInformations] = useState<DiplomaInformation[]>(() => {
        const storedDiplomas = localStorage.getItem('diplomaInformations');
        return storedDiplomas ? JSON.parse(storedDiplomas) : [];
    });

    const [diplomaLookupRecords, setDiplomaLookupRecords] = useState<DiplomaLookupRecord[]>(() => {
        const storedLookups = localStorage.getItem('diplomaLookupRecords');
        return storedLookups ? JSON.parse(storedLookups) : [];
    });

    // Enhanced field validation method
    const validateAdditionalFields = (
        additionalFields: Record<string, string | number | Date | undefined>, 
        templates: DiplomaFieldTemplate[]
    ): { isValid: boolean; errors: Record<string, string> } => {
        const errors: Record<string, string> = {};

        templates.forEach(template => {
            const value = additionalFields[template.name];
            
            // Check if required field is missing
            if (template.isRequired && (value === undefined || value === null || value === '')) {
                errors[template.name] = `${template.name} is required`;
            }

            // Type-specific validations
            if (value !== undefined && value !== null) {
                switch (template.dataType) {
                    case 'String':
                        const stringValue = String(value);
                        if (template.validation?.minLength && stringValue.length < template.validation.minLength) {
                            errors[template.name] = `${template.name} must be at least ${template.validation.minLength} characters`;
                        }
                        if (template.validation?.maxLength && stringValue.length > template.validation.maxLength) {
                            errors[template.name] = `${template.name} must be no more than ${template.validation.maxLength} characters`;
                        }
                        if (template.validation?.pattern) {
                            const regex = new RegExp(template.validation.pattern);
                            if (!regex.test(stringValue)) {
                                errors[template.name] = `${template.name} does not match the required pattern`;
                            }
                        }
                        break;
                    
                    case 'Number':
                        const numberValue = Number(value);
                        if (isNaN(numberValue)) {
                            errors[template.name] = `${template.name} must be a valid number`;
                        }
                        if (template.validation?.min !== undefined && numberValue < template.validation.min) {
                            errors[template.name] = `${template.name} must be at least ${template.validation.min}`;
                        }
                        if (template.validation?.max !== undefined && numberValue > template.validation.max) {
                            errors[template.name] = `${template.name} must be no more than ${template.validation.max}`;
                        }
                        break;
                    
                    case 'Date':
                        const dateValue = new Date(String(value));
                        if (isNaN(dateValue.getTime())) {
                            errors[template.name] = `${template.name} must be a valid date`;
                        }
                        break;
                }
            }
        });

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    };

    // Modify addDiplomaInformation to handle additionalFields correctly
    const addDiplomaInformation = (diplomaInfo: DiplomaInformation) => {
        // Validate additional fields against templates
        const validationResult = validateAdditionalFields(
            diplomaInfo.additionalFields, 
            diplomaFieldTemplates
        );

        if (!validationResult.isValid) {
            throw new Error(
                'Invalid additional fields: ' + 
                JSON.stringify(validationResult.errors, null, 2)
            );
        }

        const book = diplomaBooks.find(b => b.id === diplomaInfo.diplomaBookId);
        if (book) {
            const nextEntryNumber = book.currentEntryNumber + 1;
            book.currentEntryNumber = nextEntryNumber;
            updateDiplomaBook(book);

            const updatedDiplomas = [...diplomaInformations, {
                ...diplomaInfo,
                bookEntryNumber: nextEntryNumber,
                // Ensure additionalFields is correctly handled
                additionalFields: diplomaInfo.additionalFields || {}
            }];
            setDiplomaInformations(updatedDiplomas);
            localStorage.setItem('diplomaInformations', JSON.stringify(updatedDiplomas));
        }
    };

    // Modify updateDiplomaInformation to handle additionalFields correctly
    const updateDiplomaInformation = (updatedDiplomaInfo: DiplomaInformation) => {
        // Validate additional fields against templates
        const validationResult = validateAdditionalFields(
            updatedDiplomaInfo.additionalFields, 
            diplomaFieldTemplates
        );

        if (!validationResult.isValid) {
            throw new Error(
                'Invalid additional fields: ' + 
                JSON.stringify(validationResult.errors, null, 2)
            );
        }

        const updatedDiplomas = diplomaInformations.map(diploma => 
            diploma.id === updatedDiplomaInfo.id 
                ? {
                    ...updatedDiplomaInfo,
                    // Ensure additionalFields is correctly handled
                    additionalFields: updatedDiplomaInfo.additionalFields || {}
                } 
                : diploma
        );
        setDiplomaInformations(updatedDiplomas);
        localStorage.setItem('diplomaInformations', JSON.stringify(updatedDiplomas));
    };


    const addDiplomaBook = (book: DiplomaBook) => {
        const existingBookForYear = diplomaBooks.find(b => b.year === book.year);
        
        if (existingBookForYear) {
            throw new Error(`A diploma book already exists for the year ${book.year}. Only one book is allowed per year.`);
        }
    
        const updatedBooks = [...diplomaBooks, book];
        setDiplomaBooks(updatedBooks);
        localStorage.setItem('diplomaBooks', JSON.stringify(updatedBooks));
    };

    const updateDiplomaBook = (updatedBook: DiplomaBook) => {
        const updatedBooks = diplomaBooks.map(book => 
            book.id === updatedBook.id ? updatedBook : book
        );
        setDiplomaBooks(updatedBooks);
        localStorage.setItem('diplomaBooks', JSON.stringify(updatedBooks));
    };

    const addGraduationDecision = (decision: GraduationDecision) => {
        const updatedDecisions = [...graduationDecisions, decision];
        setGraduationDecisions(updatedDecisions);
        localStorage.setItem('graduationDecisions', JSON.stringify(updatedDecisions));
    };

    const addDiplomaFieldTemplate = (template: DiplomaFieldTemplate) => {
        if (!template.name.trim()) {
            throw new Error('Template name cannot be empty');
        }

        const updatedTemplates = [...diplomaFieldTemplates, template];
        setDiplomaFieldTemplates(updatedTemplates);
        localStorage.setItem('diplomaFieldTemplates', JSON.stringify(updatedTemplates));
    };

    const updateDiplomaFieldTemplate = (updatedTemplate: DiplomaFieldTemplate) => {
        const updatedTemplates = diplomaFieldTemplates.map(template => 
            template.id === updatedTemplate.id ? updatedTemplate : template
        );
        setDiplomaFieldTemplates(updatedTemplates);
        localStorage.setItem('diplomaFieldTemplates', JSON.stringify(updatedTemplates));
    };

    const searchDiplomas = (
        diplomaSerialNumber?: string, 
        bookEntryNumber?: number, 
        studentId?: string, 
        fullName?: string, 
        dateOfBirth?: string
    ) => {
        const providedParams = [
            diplomaSerialNumber, 
            bookEntryNumber, 
            studentId, 
            fullName, 
            dateOfBirth
        ].filter(param => param !== undefined && param !== null);

        if (providedParams.length < 2) {
            throw new Error('Please provide at least two search parameters');
        }

        return diplomaInformations.filter(diploma => 
            (!diplomaSerialNumber || diploma.diplomaSerialNumber === diplomaSerialNumber) &&
            (!bookEntryNumber || diploma.bookEntryNumber === bookEntryNumber) &&
            (!studentId || diploma.studentId === studentId) &&
            (!fullName || diploma.fullName.toLowerCase().includes(fullName.toLowerCase())) &&
            (!dateOfBirth || diploma.dateOfBirth === dateOfBirth)
        );
    };


    // Delete Methods
    const deleteDiplomaBook = (bookId: string) => {
        const updatedBooks = diplomaBooks.filter(book => book.id !== bookId);
        setDiplomaBooks(updatedBooks);
        localStorage.setItem('diplomaBooks', JSON.stringify(updatedBooks));
    };

    const deleteGraduationDecision = (decisionId: string) => {
        const updatedDecisions = graduationDecisions.filter(decision => decision.id !== decisionId);
        setGraduationDecisions(updatedDecisions);
        localStorage.setItem('graduationDecisions', JSON.stringify(updatedDecisions));
    };

    const deleteDiplomaFieldTemplate = (templateId: string) => {
        const updatedTemplates = diplomaFieldTemplates.filter(template => template.id !== templateId);
        setDiplomaFieldTemplates(updatedTemplates);
        localStorage.setItem('diplomaFieldTemplates', JSON.stringify(updatedTemplates));
    };

    const deleteDiplomaInformation = (diplomaId: string) => {
        const updatedDiplomas = diplomaInformations.filter(diploma => diploma.id !== diplomaId);
        setDiplomaInformations(updatedDiplomas);
        localStorage.setItem('diplomaInformations', JSON.stringify(updatedDiplomas));
    };

    // Advanced Search Methods
    const advancedDiplomaSearch = (
        criteria: Partial<DiplomaInformation>,
        startDate?: string,
        endDate?: string
    ) => {
        return diplomaInformations.filter(diploma => {
            const matchesCriteria = Object.entries(criteria).every(([key, value]) => 
                diploma[key as keyof DiplomaInformation] === value
            );

            const withinDateRange = (!startDate || diploma.dateOfBirth >= startDate) &&
                                    (!endDate || diploma.dateOfBirth <= endDate);

            return matchesCriteria && withinDateRange;
        });
    };

    // Aggregation Methods
    const getDiplomaStatistics = () => {
        return {
            totalDiplomas: diplomaInformations.length,
            totalBooks: diplomaBooks.length,
            totalDecisions: graduationDecisions.length,
            totalLookups: diplomaLookupRecords.length,
            diplomasByYear: diplomaInformations.reduce((acc, diploma) => {
                const book = diplomaBooks.find(b => b.id === diploma.diplomaBookId);
                if (book) {
                    acc[book.year] = (acc[book.year] || 0) + 1;
                }
                return acc;
            }, {} as Record<number, number>)
        };
    };

    // Bulk Import Methods
    const bulkImportDiplomas = (diplomas: DiplomaInformation[]) => {
        const updatedDiplomas = [...diplomaInformations, ...diplomas];
        setDiplomaInformations(updatedDiplomas);
        localStorage.setItem('diplomaInformations', JSON.stringify(updatedDiplomas));
    };

    const bulkImportGraduationDecisions = (decisions: GraduationDecision[]) => {
        const updatedDecisions = [...graduationDecisions, ...decisions];
        setGraduationDecisions(updatedDecisions);
        localStorage.setItem('graduationDecisions', JSON.stringify(updatedDecisions));
    };

    // Export Methods
    const exportDiplomaData = () => {
        return {
            diplomaBooks,
            graduationDecisions,
            diplomaFieldTemplates,
            diplomaInformations,
            diplomaLookupRecords
        };
    };

    const importDiplomaData = (data: ReturnType<typeof exportDiplomaData>) => {
        setDiplomaBooks(data.diplomaBooks);
        setGraduationDecisions(data.graduationDecisions);
        setDiplomaFieldTemplates(data.diplomaFieldTemplates);
        setDiplomaInformations(data.diplomaInformations);
        setDiplomaLookupRecords(data.diplomaLookupRecords);

        // Update localStorage
        localStorage.setItem('diplomaBooks', JSON.stringify(data.diplomaBooks));
        localStorage.setItem('graduationDecisions', JSON.stringify(data.graduationDecisions));
        localStorage.setItem('diplomaFieldTemplates', JSON.stringify(data.diplomaFieldTemplates));
        localStorage.setItem('diplomaInformations', JSON.stringify(data.diplomaInformations));
        localStorage.setItem('diplomaLookupRecords', JSON.stringify(data.diplomaLookupRecords));
    };
    
    // New method to get diplomas for a specific diploma book
    const getDiplomasByBookId = (bookId: string) => {
        return diplomaInformations.filter(diploma => 
            diploma.diplomaBookId === bookId
        );
    };
    // New method to get graduation decisions for a specific diploma book
    const getGraduationDecisionsByBookId = (bookId: string) => {
        return graduationDecisions.filter(decision => 
            decision.diplomaBookId === bookId
        );
    };



    // New method to increment lookup count for a graduation decision
    const incrementDecisionLookup = (decisionId: string) => {
        const updatedDecisions = graduationDecisions.map(decision => 
            decision.id === decisionId 
                ? { ...decision, totalLookups: (decision.totalLookups || 0) + 1 } 
                : decision
        );
        
        setGraduationDecisions(updatedDecisions);
        localStorage.setItem('graduationDecisions', JSON.stringify(updatedDecisions));
    };

    const recordDiplomaLookup = (diplomaId: string, source: string) => {
        const diplomaToLookup = diplomaInformations.find(d => d.id === diplomaId);
        if (diplomaToLookup) {
            const lookupRecord: DiplomaLookupRecord = {
                id: `LOOKUP_${Date.now()}`,
                diplomaId,
                lookupDate: new Date().toISOString(),
                lookupSource: source
            };

            const updatedLookups = [...diplomaLookupRecords, lookupRecord];
            setDiplomaLookupRecords(updatedLookups);
            localStorage.setItem('diplomaLookupRecords', JSON.stringify(updatedLookups));

            // Increment lookup count for the associated graduation decision
            incrementDecisionLookup(diplomaToLookup.decisionId);
        }
    };

    return {
        // Existing exports
        diplomaBooks,
        graduationDecisions,
        diplomaFieldTemplates,
        diplomaInformations,
        diplomaLookupRecords,

        
        // Existing methods
        addDiplomaBook,
        updateDiplomaBook,
        addGraduationDecision,
        addDiplomaFieldTemplate,
        updateDiplomaFieldTemplate,
        addDiplomaInformation,
        searchDiplomas,
        recordDiplomaLookup,
        updateDiplomaInformation,

        // get methods for new features
        getDiplomasByBookId,
        getGraduationDecisionsByBookId,

        // New delete methods
        deleteDiplomaBook,
        deleteGraduationDecision,
        deleteDiplomaFieldTemplate,
        deleteDiplomaInformation,

        // New search and aggregation methods
        advancedDiplomaSearch,
        getDiplomaStatistics,

        // Bulk import/export methods
        bulkImportDiplomas,
        bulkImportGraduationDecisions,
        exportDiplomaData,
        importDiplomaData,

        // Add the new method to the exports
        incrementDecisionLookup,


    };
    
};