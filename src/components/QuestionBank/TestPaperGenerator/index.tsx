import React, { useState, useEffect } from 'react';
import { Form, Button, Divider, Typography, Alert } from 'antd';
import { useModel } from 'umi';
import CourseSelector from './CourseSelector';
import QuestionStatistics from './QuestionStatistics';
import DifficultyDistribution from './DifficultyDistribution';
import KnowledgeAreaSelector from './KnowledgeAreaSelector';
import GeneratedTestPaper from './GeneratedTestPaper';
import TestPaperHistory from './TestPaperHistory';
import TestPaperPreviewModal from './TestPaperPreviewModal';

const { Title } = Typography;

const TestPaperGenerator = () => {
    const { courses, questions, generateTestPaper, testPapers, setTestPapers, getQuestionStats } = useModel('questionbank');
    const [form] = Form.useForm();
    const [generatedTestPaper, setGeneratedTestPaper] = useState(null);
    const [courseId, setCourseId] = useState(null);
    const [availableQuestions, setAvailableQuestions] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [difficultyStats, setDifficultyStats] = useState({});
    const [knowledgeAreaStats, setKnowledgeAreaStats] = useState({});
    const [loading, setLoading] = useState(false);
    const [previewModalVisible, setPreviewModalVisible] = useState(false);
    const [previewTestPaper, setPreviewTestPaper] = useState(null);

    // Update question stats when courseId changes
    useEffect(() => {
        if (courseId) {
            const courseQuestions = questions.filter(q => q.courseId === courseId);
            setAvailableQuestions(courseQuestions);
            
            // Get detailed stats
            const stats = getQuestionStats(courseId);
            setDifficultyStats(stats.difficultyStats);
            setKnowledgeAreaStats(stats.knowledgeAreaStats);
            
            // Reset form fields related to knowledge areas
            form.setFieldsValue({
                knowledgeAreas: [],
                easyQuestions: 0,
                mediumQuestions: 0,
                hardQuestions: 0,
                veryHardQuestions: 0
            });
        } else {
            setAvailableQuestions([]);
            setDifficultyStats({});
            setKnowledgeAreaStats({});
        }
    }, [courseId, questions, getQuestionStats, form]);

    const handleCourseChange = (value) => {
        setCourseId(value);
    };

    const validateDistribution = (values) => {
        // Validate that some questions are requested
        const totalRequested = (values.easyQuestions || 0) + 
            (values.mediumQuestions || 0) + 
            (values.hardQuestions || 0) + 
            (values.veryHardQuestions || 0);
            
        if (totalRequested === 0) {
            throw new Error("Please specify at least one question to include in the test paper.");
        }
        
        // Validate sufficient questions exist
        if (availableQuestions.length === 0) {
            throw new Error("No questions available for the selected course. Please add questions first.");
        }
        
        // Check difficulty level availability
        const difficulties = ['Easy', 'Medium', 'Hard', 'Very Hard'];
        for (const difficulty of difficulties) {
            const fieldName = `${difficulty.toLowerCase().replace(' ', '')}Questions`;
            const requestedCount = values[fieldName] || 0;
            if (requestedCount > 0) {
                const availableCount = availableQuestions.filter(q => 
                    q.difficultyLevel === difficulty).length;
                
                if (availableCount < requestedCount) {
                    throw new Error(`Not enough ${difficulty} questions available. Requested: ${requestedCount}, Available: ${availableCount}`);
                }
            }
        }
        
        // Check knowledge area availability and build distribution
        const knowledgeAreaDistribution = {};
        (values.knowledgeAreas || []).forEach(area => {
            const count = values[`${area}_count`] || 0;
            knowledgeAreaDistribution[area] = count;
        });
        
        // If knowledge areas were selected, make sure they have counts
        if (values.knowledgeAreas?.length > 0) {
            let hasAreaCounts = false;
            for (const area of values.knowledgeAreas) {
                if (values[`${area}_count`] > 0) {
                    hasAreaCounts = true;
                    
                    // Validate we have enough questions for this area and each difficulty
                    for (const difficulty of difficulties) {
                        const requestedDiffCount = values[`${difficulty.toLowerCase().replace(' ', '')}Questions`] || 0;
                        if (requestedDiffCount > 0) {
                            const availableAreaDiffCount = availableQuestions.filter(q => 
                                q.knowledgeArea === area && q.difficultyLevel === difficulty
                            ).length;
                            
                            if (availableAreaDiffCount < 1) {
                                throw new Error(`No ${difficulty} questions available for knowledge area "${area}". Please select different criteria.`);
                            }
                        }
                    }
                }
            }
            
            if (!hasAreaCounts) {
                throw new Error("Please specify how many questions to include from each selected knowledge area.");
            }
        }
        
        return knowledgeAreaDistribution;
    };

    const handleSubmit = (values) => {
        setLoading(true);
        setErrorMessage('');
        
        try {
            // Validate distribution and get knowledge area counts
            const knowledgeAreaDistribution = validateDistribution(values);

            const difficultyDistribution = {
                'Easy': values.easyQuestions || 0,
                'Medium': values.mediumQuestions || 0,
                'Hard': values.hardQuestions || 0,
                'Very Hard': values.veryHardQuestions || 0
            };

            const testPaper = generateTestPaper(values.courseId, difficultyDistribution, knowledgeAreaDistribution);
            
            if (!testPaper || !testPaper.questions || testPaper.questions.length === 0) {
                throw new Error("Failed to generate test paper. Please check your selection criteria.");
            }

            setGeneratedTestPaper(testPaper);
        } catch (error) {
            console.error("Error generating test paper:", error);
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteTestPaper = (testPaperId) => {
        const updatedTestPapers = testPapers.filter(tp => tp.id !== testPaperId);
        setTestPapers(updatedTestPapers);
        localStorage.setItem('testPapers', JSON.stringify(updatedTestPapers));
    };

    const viewTestPaper = (testPaper) => {
        setPreviewTestPaper({ ...testPaper });
        setPreviewModalVisible(true);
    };

    return (
        <div>
            <Title level={3}>Generate Test Paper</Title>
            
            {errorMessage && (
                <Alert
                    message="Error"
                    description={errorMessage}
                    type="error"
                    showIcon
                    closable
                    style={{ marginBottom: 16 }}
                    onClose={() => setErrorMessage('')}
                />
            )}
            
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <CourseSelector 
                    courses={courses} 
                    onChange={handleCourseChange} 
                />

                {courseId && availableQuestions.length === 0 && (
                    <Alert
                        message="No questions available for this course"
                        description="Please add questions to this course before generating a test paper"
                        type="warning"
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                )}

                {courseId && availableQuestions.length > 0 && (
                    <>
                        <QuestionStatistics 
                            availableQuestions={availableQuestions}
                            difficultyStats={difficultyStats}
                            knowledgeAreaStats={knowledgeAreaStats}
                        />

                        <DifficultyDistribution form={form} />

                        <KnowledgeAreaSelector 
                            form={form}
                            knowledgeAreaStats={knowledgeAreaStats}
                        />

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Generate Test Paper
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form>

            {/* Display generated test paper */}
            {generatedTestPaper && (
                <GeneratedTestPaper testPaper={generatedTestPaper} />
            )}

            {/* Display test paper history */}
            <Divider />
            <TestPaperHistory 
                testPapers={testPapers}
                onView={viewTestPaper}
                onDelete={deleteTestPaper}
            />

            {/* Test Paper Preview Modal */}
            <TestPaperPreviewModal
                visible={previewModalVisible}
                testPaper={previewTestPaper}
                onClose={() => setPreviewModalVisible(false)}
            />
        </div>
    );
};

export default TestPaperGenerator;