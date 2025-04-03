import React, { useState } from 'react';
import { Button, Modal, message } from 'antd';
import { useModel } from 'umi';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import DiplomaBookTable from '../../components/Diploma/Book/DiplomaBookTable';
import DiplomaFormModal from '../../components/Diploma/Book/DiplomaFormModal';
import DiplomasViewModal from '../../components/Diploma/Book/DiplomasViewModal';
import { Form } from 'antd';

const DiplomaBookManagement = () => {
  const { 
    diplomaBooks, 
    addDiplomaBook, 
    updateDiplomaBook, 
    deleteDiplomaBook,
    getDiplomaStatistics,
    exportDiplomaData,
    importDiplomaData,
    getDiplomasByBookId
  } = useModel('DiplomaManagement.diploma-model');

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDiplomasModalVisible, setIsDiplomasModalVisible] = useState(false);
  const [selectedBookDiplomas, setSelectedBookDiplomas] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [form] = Form.useForm();

  const handleViewDiplomas = (book) => {
    const diplomas = getDiplomasByBookId(book.id);
    setSelectedBookDiplomas(diplomas);
    setIsDiplomasModalVisible(true);
  };

  const handleSaveBook = (values) => {
    const bookData = {
      id: editingBook ? editingBook.id : uuidv4(),
      year: values.year.year(),
      startDate: values.startDate.format('YYYY-MM-DD'),
      endDate: values.endDate.format('YYYY-MM-DD'),
      currentEntryNumber: editingBook ? editingBook.currentEntryNumber : 0
    };

    try {
      if (editingBook) {
        updateDiplomaBook(bookData);
        message.success('Diploma Book Updated Successfully');
      } else {
        addDiplomaBook(bookData);
        message.success('Diploma Book Added Successfully');
      }
      setIsModalVisible(false);
      setEditingBook(null);
      form.resetFields();
    } catch (error) {
      if (error instanceof Error && error.message.includes('diploma book already exists')) {
        message.error(error.message);
      } else {
        message.error('Failed to save diploma book. Please try again.');
        console.error(error);
      }
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    form.setFieldsValue({
      year: moment().year(book.year),
      startDate: moment(book.startDate),
      endDate: moment(book.endDate)
    });
    setIsModalVisible(true);
  };

  const handleDelete = (bookId) => {
    deleteDiplomaBook(bookId);
    message.success('Diploma Book Deleted Successfully');
  };

  const showStatistics = () => {
    const stats = getDiplomaStatistics();
    Modal.info({
      title: 'Diploma Management Statistics',
      content: (
        <div>
          <p>Total Diplomas: {stats.totalDiplomas}</p>
          <p>Total Books: {stats.totalBooks}</p>
          <p>Total Graduation Decisions: {stats.totalDecisions}</p>
          <p>Total Lookups: {stats.totalLookups}</p>
          <h4>Diplomas by Year:</h4>
          {Object.entries(stats.diplomasByYear).map(([year, count]) => (
            <p key={year}>{year}: {count} diplomas</p>
          ))}
        </div>
      ),
      width: 520,
    });
  };

  const handleExport = () => {
    const data = exportDiplomaData();
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'diploma_data_export.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    message.success('Diploma Data Exported Successfully');
  };

  const handleImport = (event) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result);
        importDiplomaData(jsonData);
        message.success('Diploma Data Imported Successfully');
      } catch (error) {
        message.error('Failed to import diploma data');
      }
    };
    if (event.target.files && event.target.files.length > 0) {
      fileReader.readAsText(event.target.files[0]);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Button 
            type="primary" 
            style={{ marginRight: 8 }} 
            onClick={() => {
              setEditingBook(null);
              form.resetFields();
              setIsModalVisible(true);
            }}
          >
            Add Diploma Book
          </Button>
          <Button 
            type="default" 
            style={{ marginRight: 8 }} 
            onClick={showStatistics}
          >
            View Statistics
          </Button>
          <Button 
            type="default" 
            style={{ marginRight: 8 }} 
            onClick={handleExport}
          >
            Export Data
          </Button>
          <input 
            type="file" 
            accept=".json" 
            style={{ display: 'none' }} 
            id="import-file"
            onChange={handleImport}
          />
          <label htmlFor="import-file">
            <Button type="default" component="span">
              Import Data
            </Button>
          </label>
        </div>
      </div>

      <DiplomaBookTable 
        diplomaBooks={diplomaBooks}
        handleViewDiplomas={handleViewDiplomas}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      <DiplomasViewModal 
        isDiplomasModalVisible={isDiplomasModalVisible}
        setIsDiplomasModalVisible={setIsDiplomasModalVisible}
        selectedBookDiplomas={selectedBookDiplomas}
      />

      <DiplomaFormModal 
        isModalVisible={isModalVisible}
        editingBook={editingBook}
        form={form}
        handleSaveBook={handleSaveBook}
        setIsModalVisible={setIsModalVisible}
        setEditingBook={setEditingBook}
      />
    </div>
  );
};

export default DiplomaBookManagement;