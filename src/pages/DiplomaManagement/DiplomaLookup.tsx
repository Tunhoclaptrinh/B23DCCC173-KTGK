import React, { useState } from 'react';
import { Card, Form, message } from 'antd';
import { useModel } from 'umi';
import SearchForm from '@/components/Diploma/Lookup/SearchForm';
import ResultsTable from '@/components/Diploma/Lookup/ResultsTable';
import DiplomaDetailsLookup from '@/components/Diploma/DiplomaDetailsModal';

const DiplomaLookup: React.FC = () => {
  const { 
    searchDiplomas, 
    diplomaBooks,
    graduationDecisions,
    diplomaFieldTemplates,
    diplomaLookupRecords,
    recordDiplomaLookup 
  } = useModel('DiplomaManagement.diploma-model');
  
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedDiploma, setSelectedDiploma] = useState<any>(null);
  const [form] = Form.useForm();

  const handleSearch = () => {
    form.validateFields()
      .then(values => {
        try {
          const results = searchDiplomas(
            values.diplomaSerialNumber,
            values.bookEntryNumber ? parseInt(values.bookEntryNumber) : undefined,
            values.studentId,
            values.fullName,
            values.dateOfBirth?.format('YYYY-MM-DD')
          ).map(diploma => {
            const diplomaLookups = diplomaLookupRecords.filter(
              record => record.diplomaId === diploma.id
            ).length;

            const graduationDecision = graduationDecisions.find(
              decision => decision.id === diploma.decisionId
            );

            return {
              ...diploma,
              diplomaLookups,
              graduationDecisionLookups: graduationDecision?.totalLookups || 0
            };
          });
          
          if (results.length === 0) {
            message.info('No diplomas found matching your search criteria.');
          }
          
          setSearchResults(results);
          setSelectedDiploma(null);
        } catch (error) {
          message.error(error.message);
        }
      })
      .catch(errorInfo => {
        message.error('Please fill in at least two search parameters');
      });
  };

  const handleViewDetails = (originalDiploma: any) => {
    const diplomaBook = diplomaBooks.find(book => book.id === originalDiploma.diplomaBookId);
    const graduationDecision = graduationDecisions.find(decision => decision.id === originalDiploma.decisionId);
    
    const enhancedDiploma = {
      ...originalDiploma,
      diplomaBook: diplomaBook || null,
      graduationDecision: {
        ...graduationDecision,
        totalLookups: graduationDecision?.totalLookups || 0
      },
      diplomaFieldTemplates: diplomaFieldTemplates,
      lookupRecords: diplomaLookupRecords.filter(record => record.diplomaId === originalDiploma.id)
    };

    recordDiplomaLookup(originalDiploma.id, 'Diploma Lookup Page');
    setSelectedDiploma(enhancedDiploma);
  };

  return (
    <Card title="Diploma Lookup">
      <SearchForm form={form} onSearch={handleSearch} />
      <ResultsTable 
        searchResults={searchResults} 
        onViewDetails={handleViewDetails} 
      />
      {selectedDiploma && (
        <DiplomaDetailsLookup
          diploma={selectedDiploma} 
          onClose={() => setSelectedDiploma(null)} 
        />
      )}
    </Card>
  );
};

export default DiplomaLookup;