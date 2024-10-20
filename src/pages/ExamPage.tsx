import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExam, saveExamResult } from '../utils/indexedDB';
import { Exam, Question, ExamResult } from '../types';
import Timer from '../components/Timer';

const ExamPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const fetchExam = async () => {
      if (id) {
        const fetchedExam = await getExam(parseInt(id));
        setExam(fetchedExam);
        setTimeRemaining(fetchedExam.timeLimit * 60);
      }
    };
    fetchExam();
  }, [id]);

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNextQuestion = () => {
    if (exam && currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (exam) {
      const score = calculateScore(exam.questions, userAnswers);
      const result: ExamResult = {
        examId: exam.id,
        score,
        totalQuestions: exam.questions.length,
        date: new Date(),
        userAnswers,
      };
      await saveExamResult(result);
      navigate(`/results/${exam.id}`);
    }
  };

  const calculateScore = (questions: Question[], answers: Record<number, string>) => {
    return questions.reduce((score, question) => {
      return score + (answers[question.id] === question.correctAnswer ? 1 : 0);
    }, 0);
  };

  if (!exam) {
    return <div>Loading...</div>;
  }

  const currentQuestion = exam.questions[currentQuestionIndex];

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{exam.title}</h2>
      <Timer initialTime={timeRemaining} onTimeUp={handleSubmit} />
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">
          Question {currentQuestionIndex + 1} of {exam.questions.length}
        </h3>
        <p className="mb-4">{currentQuestion.text}</p>
        <div className="space-y-2">
          {currentQuestion.options.map((option, index) => (
            <label key={index} className="flex items-center space-x-2">
              <input
                type="radio"
                name={`question-${currentQuestion.id}`}
                value={option}
                checked={userAnswers[currentQuestion.id] === option}
                onChange={() => handleAnswerSelect(currentQuestion.id, option)}
                className="form-radio"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="flex justify-between">
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        {currentQuestionIndex === exam.questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default ExamPage;