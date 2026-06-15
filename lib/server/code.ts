import 'server-only';

import { readFileSync } from 'fs';
import path from 'path';
import { getPattern, type Pattern } from '@/data/patterns';

export function readPatternCode(pattern: Pick<Pattern, 'codeFile'>) {
  const filePath = path.join(process.cwd(), 'data', 'java', pattern.codeFile);
  return readFileSync(filePath, 'utf8');
}

export function getPatternWithCode(slug: string) {
  const pattern = getPattern(slug);
  if (!pattern) return undefined;
  return { ...pattern, code: readPatternCode(pattern) };
}
