import { Member } from '@/types';

export function parsePasteData(pasteText: string): Member[] {
  const lines = pasteText.trim().split('\n');
  const members: Member[] = [];
  
  for (const line of lines) {
    if (!line.trim()) continue;
    
    const parts = line.split(/\t|,/).map(part => part.trim());
    
    if (parts.length >= 2) {
      members.push({
        name: parts[0],
        prevGroup: parts[1] || ''
      });
    } else if (parts.length === 1 && parts[0]) {
      members.push({
        name: parts[0],
        prevGroup: ''
      });
    }
  }
  
  return members;
}