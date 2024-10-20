import { openDB, DBSchema } from 'idb';
import { Exam, ExamResult } from '../types';

interface AzureCertPrepDB extends DBSchema {
  exams: {
    key: number;
    value: Exam;
  };
  examResults: {
    key: number;
    value: ExamResult;
    indexes: { 'by-date': Date };
  };
}

const dbPromise = openDB<AzureCertPrepDB>('azure-cert-prep-db', 1, {
  upgrade(db) {
    db.createObjectStore('exams', { keyPath: 'id' });
    const examResultsStore = db.createObjectStore('examResults', { keyPath: 'examId', autoIncrement: true });
    examResultsStore.createIndex('by-date', 'date');
  },
});

export async function getExams(): Promise<Exam[]> {
  return (await dbPromise).getAll('exams');
}

export async function getExam(id: number): Promise<Exam | undefined> {
  return (await dbPromise).get('exams', id);
}

export async function saveExam(exam: Exam): Promise<void> {
  return (await dbPromise).put('exams', exam);
}

export async function getExamResults(): Promise<ExamResult[]> {
  return (await dbPromise).getAllFromIndex('examResults', 'by-date');
}

export async function getExamResult(examId: number): Promise<ExamResult | undefined> {
  return (await dbPromise).get('examResults', examId);
}

export async function saveExamResult(result: ExamResult): Promise<void> {
  return (await dbPromise).put('examResults', result);
}

// Function to initialize the database with sample data
export async function initializeDatabase() {
  const db = await dbPromise;
  const exams = await db.getAll('exams');

  if (exams.length === 0) {
    const sampleExams: Exam[] = [
      {
        id: 1,
        title: 'AZ-900: Microsoft Azure Fundamentals',
        description: 'Prove your knowledge of cloud concepts, Azure services, Azure workloads, security and privacy in Azure, as well as Azure pricing and support.',
        questionCount: 5,
        timeLimit: 60,
        questions: [
          {
            id: 1,
            text: 'What is Azure Resource Manager?',
            options: [
              'A tool for managing virtual machines',
              'The deployment and management service for Azure',
              'A service for storing data in the cloud',
              'A networking service in Azure'
            ],
            correctAnswer: 'The deployment and management service for Azure',
            explanation: 'Azure Resource Manager is the deployment and management service for Azure. It provides a management layer that enables you to create, update, and delete resources in your Azure account.'
          },
          {
            id: 2,
            text: 'Which of the following is not a benefit of using cloud services?',
            options: [
              'Scalability',
              'High availability',
              'Reduced costs',
              'Increased security risks'
            ],
            correctAnswer: 'Increased security risks',
            explanation: 'Cloud services typically enhance security, not increase risks. The other options are all benefits of using cloud services.'
          },
          {
            id: 3,
            text: 'What is the purpose of Azure Availability Zones?',
            options: [
              'To provide low-latency network connectivity',
              'To protect applications and data from datacenter failures',
              'To store data across multiple geographic regions',
              'To manage user access and permissions'
            ],
            correctAnswer: 'To protect applications and data from datacenter failures',
            explanation: 'Azure Availability Zones are physically separate datacenters within an Azure region, designed to protect applications and data from datacenter failures.'
          },
          {
            id: 4,
            text: 'Which Azure service would you use to store unstructured data?',
            options: [
              'Azure SQL Database',
              'Azure Cosmos DB',
              'Azure Blob Storage',
              'Azure Table Storage'
            ],
            correctAnswer: 'Azure Blob Storage',
            explanation: 'Azure Blob Storage is optimized for storing massive amounts of unstructured data, such as text or binary data.'
          },
          {
            id: 5,
            text: 'What is the primary purpose of Azure Active Directory?',
            options: [
              'To manage virtual networks',
              'To provide identity and access management',
              'To store and process big data',
              'To host web applications'
            ],
            correctAnswer: 'To provide identity and access management',
            explanation: 'Azure Active Directory (Azure AD) is Microsoft\'s cloud-based identity and access management service, which helps your employees sign in and access resources.'
          }
        ]
      },
      // Add more sample exams here
    ];

    for (const exam of sampleExams) {
      await db.put('exams', exam);
    }
  }
}