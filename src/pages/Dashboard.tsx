import React, { useState, useEffect } from 'react';
import { getExamResults, getExams } from '../utils/indexedDB';
import { ExamResult, Exam } from '../types';
import { BarChart, Calendar } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedResults = await getExamResults();
      const fetchedExams = await getExams();
      setResults(fetchedResults);
      setExams(fetchedExams);
    };
    fetchData();
  }, []);

  const getExamTitle = (examId: number) => {
    const exam = exams.find((e) => e.id === examId);
    return exam ? exam.title : 'Unknown Exam';
  };

  const calculateAverageScore = () => {
    if (results.length === 0) return 0;
    const totalScore = results.reduce((sum, result) => sum + (result.score / result.totalQuestions) * 100, 0);
    return totalScore / results.length;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Your Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <BarChart className="mr-2" />
            Average Score
          </h3>
          <p className="text-3xl font-bold text-blue-600">{calculateAverageScore().toFixed(2)}%</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Calendar className="mr-2" />
            Total Exams Taken
          </h3>
          <p className="text-3xl font-bold text-green-600">{results.length}</p>
        </div>
      </div>
      <h3 className="text-2xl font-semibold mb-4">Exam History</h3>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Exam</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Score</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                <td className="px-4 py-2">{getExamTitle(result.examId)}</td>
                <td className="px-4 py-2">{new Date(result.date).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  {((result.score / result.totalQuestions) * 100).toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;