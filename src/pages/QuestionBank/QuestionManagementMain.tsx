import React, { useState } from 'react';
import { Button, Tabs, Modal } from 'antd';
import { useModel } from 'umi';
import CourseManagement from '../../components/QuestionBank/CourseManagement';
import QuestionManagement from '../../components/QuestionBank/QuestionManagement/QuestionManagement';
import TestPaperGenerator from '../../components/QuestionBank/TestPaperGenerator';
import QuestionSearch from '../../components/QuestionBank/QuestionSearch';
import QuestionForm from '../../components/Form/CourseForm';


const { TabPane } = Tabs;

const QuestionBankSystem = () => {
    const [activeTab, setActiveTab] = useState('courses');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState<React.ReactNode>(null);

    // const { courses, questions, testPapers } = useModel('questionbank');

    // const handleAddButtonClick = () => {
    //     switch(activeTab) {
    //         case 'courses':
    //             setModalContent(<CourseManagement isModal={true} onClose={() => setModalVisible(false)} />);
    //             break;
    //         case 'questions':
    //             setModalContent(<QuestionManagement isModal={true} onClose={() => setModalVisible(false)} />);
    //             break;
    //         case 'test-papers':
    //             setModalContent(<TestPaperGenerator isModal={true} onClose={() => setModalVisible(false)} />);
    //             break;
    //     }
    //     setModalVisible(true);
    // };

    return (
        <div style={{ padding: 20 }}>
            <h1>Question Bank Management System</h1>
            
            {/* <Button 
                type="primary" 
                style={{ marginBottom: 16 }}
                onClick={handleAddButtonClick}
            >
                Add {activeTab === 'courses' ? 'Course' : 
                     activeTab === 'questions' ? 'Question' : 
                     'Test Paper'}
            </Button> */}

            <Tabs 
                defaultActiveKey="courses" 
                onChange={(key) => setActiveTab(key)}
            >
                <TabPane tab="Courses" key="courses">
                    <CourseManagement />
                </TabPane>
                <TabPane tab="Questions" key="questions">
                    <QuestionManagement />
                </TabPane>
                <TabPane tab="Test Papers" key="test-papers">
                    <TestPaperGenerator />
                </TabPane>
                <TabPane tab="Question Search" key="search">
                    <QuestionSearch />
                </TabPane>
            </Tabs>

            <Modal
                title={`Add ${activeTab === 'courses' ? 'Course' : 
                          activeTab === 'questions' ? 'Question' : 
                          'Test Paper'}`}
                visible={modalVisible}
                footer={null}
                onCancel={() => setModalVisible(false)}
            >
                {modalContent}
            </Modal>
        </div>
    );
};

export default QuestionBankSystem;