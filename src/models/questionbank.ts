// 
import { useState } from 'react';

// Interfaces for type safety
export interface Course {
    id: string;
    name: string;
    credits: number;
    knowledgeAreas: string[]; // lưu thành mảng các kiến thức
}

export interface Question {
    id: string;
    courseId: string;
    content: string;
    difficultyLevel: 'Easy' | 'Medium' | 'Hard' | 'Very Hard';
    knowledgeArea: string;
}

export interface TestPaper {
    id: string;
    courseName: string;
    questions: Question[];
    createdAt: string;
}

export default () => {
    const [courses, setCourses] = useState<Course[]>(() => {
        const storedCourses = localStorage.getItem('courses');
        return storedCourses ? JSON.parse(storedCourses) : [];
    });

    const [questions, setQuestions] = useState<Question[]>(() => {
        const storedQuestions = localStorage.getItem('questions');
        return storedQuestions ? JSON.parse(storedQuestions) : [];
    });

    const [testPapers, setTestPapers] = useState<TestPaper[]>(() => {
        const storedTestPapers = localStorage.getItem('testPapers');
        return storedTestPapers ? JSON.parse(storedTestPapers) : [];
    });

    // Course Management
    const addCourse = (course: Course) => {
        const updatedCourses = [...courses, course];
        setCourses(updatedCourses);
        localStorage.setItem('courses', JSON.stringify(updatedCourses));
    };
    
    const deleteCourse = (courseId: string) => {
        const updatedCourses = courses.filter(course => course.id !== courseId);
        setCourses(updatedCourses);
        localStorage.setItem('courses', JSON.stringify(updatedCourses));
    };
    
    const updateCourse = (updatedCourse: Course) => {
        const updatedCourses = courses.map(course =>
            course.id === updatedCourse.id ? updatedCourse : course
        );
        setCourses(updatedCourses);
        localStorage.setItem('courses', JSON.stringify(updatedCourses));
    };

    // Question Management
    const addQuestion = (question: Question) => {
        const updatedQuestions = [...questions, question];
        setQuestions(updatedQuestions);
        localStorage.setItem('questions', JSON.stringify(updatedQuestions));
    };
    const deleteQuestion = (questionId: string) => {
        const updatedQuestions = questions.filter(q => q.id !== questionId);
        setQuestions(updatedQuestions);
        localStorage.setItem('questions', JSON.stringify(updatedQuestions));
    };
    const updateQuestion = (updatedQuestion: Question) => {
        const updatedQuestions = questions.map(q => 
            q.id === updatedQuestion.id ? updatedQuestion : q
        );
        setQuestions(updatedQuestions);
        localStorage.setItem('questions', JSON.stringify(updatedQuestions));
    };
    
    // Question Statistics - Add this missing function
    const getQuestionStats = (courseId: string) => {
        const courseQuestions = questions.filter(q => q.courseId === courseId);
        
        // Calculate difficulty distribution
        const difficultyStats = {
            'Easy': 0,
            'Medium': 0,
            'Hard': 0,
            'Very Hard': 0
        };
        
        // Calculate knowledge area distribution
        const knowledgeAreaStats = {};
        
        courseQuestions.forEach(question => {
            // Count by difficulty
            difficultyStats[question.difficultyLevel]++;
            
            // Count by knowledge area
            if (knowledgeAreaStats[question.knowledgeArea]) {
                knowledgeAreaStats[question.knowledgeArea]++;
            } else {
                knowledgeAreaStats[question.knowledgeArea] = 1;
            }
        });
        
        return {
            difficultyStats,
            knowledgeAreaStats
        };
    };

    // Test Paper Generation
    const generateTestPaper = (
        courseId: string, 
        difficultyDistribution: {[key: string]: number},
        knowledgeAreaDistribution: {[key: string]: number}
    ) => {
        const course = courses.find(c => c.id === courseId);
        if (!course) throw new Error('Course not found');

        const selectedQuestions: Question[] = [];
        const courseQuestions = questions.filter(q => q.courseId === courseId);

        // Calculate total questions needed
        let totalQuestionsNeeded = 0;
        Object.values(difficultyDistribution).forEach(count => {
            totalQuestionsNeeded += count;
        });

        // For each difficulty level
        for (const [difficulty, count] of Object.entries(difficultyDistribution)) {
            // Filter questions by difficulty
            const difficultyQuestions = courseQuestions.filter(q => q.difficultyLevel === difficulty);
            
            // Determine how many questions to select from each knowledge area
            const totalKnowledgeAreaWeight = Object.values(knowledgeAreaDistribution).reduce((sum, val) => sum + val, 0) || 1;

            
            // For each knowledge area
            for (const [knowledgeArea, weight] of Object.entries(knowledgeAreaDistribution)) {
                // Calculate the number of questions to get from this knowledge area
                const areaCount = Math.round((weight / totalKnowledgeAreaWeight) * count);
                
                if (areaCount > 0) {
                    // Get matching questions
                    const matchingQuestions = difficultyQuestions.filter(q => q.knowledgeArea === knowledgeArea);
                    
                    // Randomly select questions
                    const selectedAreaQuestions = matchingQuestions
                        .sort(() => 0.5 - Math.random())
                        .slice(0, areaCount);
                    
                    selectedQuestions.push(...selectedAreaQuestions);
                }
            }
        }

        const newTestPaper: TestPaper = {
            id: `TEST_${Date.now()}`,
            courseName: course.name,
            questions: selectedQuestions,
            createdAt: new Date().toLocaleString()
        };

        const updatedTestPapers = [newTestPaper, ...testPapers];
        setTestPapers(updatedTestPapers);
        localStorage.setItem('testPapers', JSON.stringify(updatedTestPapers));

        return newTestPaper;
    };

    // Search and Filter
    const searchQuestions = (
        courseId?: string, 
        difficultyLevel?: string, 
        knowledgeArea?: string
    ) => {
        return questions.filter(q => 
            (!courseId || q.courseId === courseId) &&
            (!difficultyLevel || q.difficultyLevel === difficultyLevel) &&
            (!knowledgeArea || q.knowledgeArea === knowledgeArea)
        );
    };

    return {
        courses,
        questions,
        testPapers,
        addCourse,
        deleteCourse,
        updateCourse,
        addQuestion,
        updateQuestion,
        deleteQuestion, 
        generateTestPaper,
        setTestPapers,
        searchQuestions,
        getQuestionStats // Added this function to the return object
    };
};