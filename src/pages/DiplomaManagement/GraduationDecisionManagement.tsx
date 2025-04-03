import React, { useState } from 'react';
import { Form, message } from 'antd';
import { useModel } from 'umi';
import { v4 as uuidv4 } from 'uuid';
import DecisionTable from '@/components/Diploma/Decisions/DecisionsTable';
import DecisionFormModal from '@/components/Diploma/Decisions/DecisionFormModal';
import StatsModal from '@/components/Diploma/Decisions/StartsModal';
import ActionButtons from '@/components/Diploma/ActionButtons';

const GraduationDecisionManagement: React.FC = () => {
  const { 
    diplomaBooks, 
    graduationDecisions, 
    addGraduationDecision,
    deleteGraduationDecision,
    getDiplomaStatistics
  } = useModel('DiplomaManagement.diploma-model');
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewStatsModalVisible, setIsViewStatsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const diplomaStats = getDiplomaStatistics();

  const handleSaveDecision = (values: any) => {
    const decisionData = {
      id: uuidv4(),
      decisionNumber: values.decisionNumber,
      issuanceDate: values.issuanceDate.format('YYYY-MM-DD'),
      summary: values.summary,
      diplomaBookId: values.diplomaBookId,
      totalLookups: 0
    };

    addGraduationDecision(decisionData);
    setIsModalVisible(false);
    form.resetFields();
    message.success('Graduation Decision Added Successfully');
  };

  const handleDeleteDecision = (decisionId: string) => {
    deleteGraduationDecision(decisionId);
    message.success('Graduation Decision Deleted Successfully');
  };

  return (
    <div>
      <ActionButtons
        onAdd={() => {
          form.resetFields();
          setIsModalVisible(true);
        }}
        onViewStats={() => setIsViewStatsModalVisible(true)}
      />
      <DecisionTable
        graduationDecisions={graduationDecisions}
        diplomaBooks={diplomaBooks}
        onDelete={handleDeleteDecision}
      />
      <DecisionFormModal
        visible={isModalVisible}
        form={form}
        diplomaBooks={diplomaBooks}
        onSave={handleSaveDecision}
        onCancel={() => setIsModalVisible(false)}
      />
      <StatsModal
        visible={isViewStatsModalVisible}
        stats={diplomaStats}
        onCancel={() => setIsViewStatsModalVisible(false)}
      />
    </div>
  );
};

export default GraduationDecisionManagement;