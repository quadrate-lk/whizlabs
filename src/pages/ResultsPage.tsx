import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getExam, getExamResult } from '../utils/indexedDB';
import { Exam, ExamResult } from '../types';

const ResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [exam, setExam] = useState<Exam | null>(null);
  const [result, setResult] = useState<ExamResult | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const fetchedExam = await getExam(parseInt(id));
        const fetchedResult = await getExamResult(parseInt(id));
        setExam(fetchedExam);
        setResult(fetchedResult);
      }
    };
    fetchData();
  }, [id]);

  if (!exam || !result) {
    return <div>Loading...</div>;
  }

  const score = (result.score / result.totalQuestions) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Exam Results</h2>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-2xl font-semibold mb-4">{exam.title}</h3>
        <p className="text-xl mb-4">
          Your Score: {result.score} / {result.totalQuestions} ({score.toFixed(2)}%)
        </p>
        <p className="text-lg mb-2">
          {score >= 70 ? (
            <span className="text-green-600 font-semibold">Congratulations! You passed the exam.</span>
          ) : (
            <span className="text-red-600 font-semibold">Unfortunately, you did not pass the exam. Keep practicing!</span>
          )}
        </p>
      </div>
      <h3 className="text-2xl font-semibold mb-4">Question Review</h3>
      {exam.questions.map((question, index) => (
        <div key={question.id} className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h4 className="text-xl font-semibold mb-2">Question {index + 1}</h4>
          <p className="mb-4">{question.text}</p>
          <div className="space-y-2">
            {question.options.map((option, optionIndex) => (
              <div
                key={optionIndex}
                className={`p-2 rounded ${
                  option === question.correctAnswer
                    ? 'bg-green-100'
                    : option === result.userAnswers[question.id]
                    ? 'bg-red-100'
                    : ''
                }`}
              >
                {option}
                {option === question.correctAnswer && (
                  <span className="ml-2 text-green-600 font-semibold">(Correct Answer)</span>
                )}
                {option === result.userAnswers[question.id] && option !== question.correctAnswer && (
                  <span className="ml-2 text-red-600 font-semibold">(Your Answer)</span>
                )}
              </div>
            ))}
          </div>
          {question.explanation && (
            <div className="mt-4">
              <h5 className="font-semibold">Explanation:</h5>
              <p>{question.explanation}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ResultsPage;