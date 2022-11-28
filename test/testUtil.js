import { readFileSync } from 'node:fs';

export function readFile(filePath) {
  return readFileSync(filePath, 'utf8');
}
