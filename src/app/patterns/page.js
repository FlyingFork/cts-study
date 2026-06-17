import { patterns } from '../../../data/patterns';
import PatternIndexClient from './PatternIndexClient';

export const metadata = {
  title: 'Patterns | CTS Study Tool',
  description: 'Browse design patterns by category with fast filtering.',
};

export default function PatternsPage() {
  return <PatternIndexClient patterns={patterns} />;
}
