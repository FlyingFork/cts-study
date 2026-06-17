import { patterns } from '../../../data/patterns';
import { getTaggedQuestions } from '@/lib/questionTags';
import ExamClient from './ExamClient';

export const metadata = {
  title: 'Exam Mode | CTS Study Tool',
  description: 'Take an untimed mock exam and see your weakest design pattern and software quality topics.',
};

export default function ExamPage() {
  return (
    <ExamClient
      questions={getTaggedQuestions()}
      patterns={patterns.map((pattern) => ({
        slug: pattern.slug,
        name: pattern.name,
        category: pattern.category,
      }))}
    />
  );
}
