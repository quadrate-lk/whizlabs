import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getExams } from '../utils/indexedDB';
import { Exam } from '../types';

const ExamList: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);

  useEffect(() => {
    const fetchExams = async () => {
      const fetchedExams = await getExams();
      setExams(fetchedExams);
    };
    fetchExams();
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Available Exams</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <Link
            key={exam.id}
            to={`/exam/${exam.id}`}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300"
          >
            <h3 className="text-xl font-semibold mb-2">{exam.title}</h3>
            <p className="text-gray-600 mb-4">{exam.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{exam.questionCount} questions</span>
              <span className="text-sm text-gray-500">{exam.timeLimit} minutes</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ExamList;