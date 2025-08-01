import { describe, it, expect } from 'vitest';
import { parsePasteData } from './parsePaste';

describe('parsePasteData', () => {
  it('should parse TSV data correctly', () => {
    const input = `홍길동	A조
김철수	B조
이영희	A조`;
    
    const result = parsePasteData(input);
    
    expect(result).toEqual([
      { name: '홍길동', prevGroup: 'A조' },
      { name: '김철수', prevGroup: 'B조' },
      { name: '이영희', prevGroup: 'A조' }
    ]);
  });

  it('should parse CSV data correctly', () => {
    const input = `홍길동,A조
김철수,B조
이영희,A조`;
    
    const result = parsePasteData(input);
    
    expect(result).toEqual([
      { name: '홍길동', prevGroup: 'A조' },
      { name: '김철수', prevGroup: 'B조' },
      { name: '이영희', prevGroup: 'A조' }
    ]);
  });

  it('should handle names without groups', () => {
    const input = `홍길동
김철수	
이영희`;
    
    const result = parsePasteData(input);
    
    expect(result).toEqual([
      { name: '홍길동', prevGroup: '' },
      { name: '김철수', prevGroup: '' },
      { name: '이영희', prevGroup: '' }
    ]);
  });

  it('should skip empty lines', () => {
    const input = `홍길동	A조

김철수	B조

이영희	A조`;
    
    const result = parsePasteData(input);
    
    expect(result).toEqual([
      { name: '홍길동', prevGroup: 'A조' },
      { name: '김철수', prevGroup: 'B조' },
      { name: '이영희', prevGroup: 'A조' }
    ]);
  });

  it('should trim whitespace', () => {
    const input = `  홍길동  	  A조  
  김철수  	  B조  `;
    
    const result = parsePasteData(input);
    
    expect(result).toEqual([
      { name: '홍길동', prevGroup: 'A조' },
      { name: '김철수', prevGroup: 'B조' }
    ]);
  });

  it('should handle empty input', () => {
    const input = '';
    const result = parsePasteData(input);
    expect(result).toEqual([]);
  });

  it('should handle large datasets (1000 members)', () => {
    const lines: string[] = [];
    for (let i = 1; i <= 1000; i++) {
      lines.push(`Member${i}\tGroup${i % 10}`);
    }
    const input = lines.join('\n');
    
    const result = parsePasteData(input);
    
    expect(result).toHaveLength(1000);
    expect(result[0]).toEqual({ name: 'Member1', prevGroup: 'Group1' });
    expect(result[999]).toEqual({ name: 'Member1000', prevGroup: 'Group0' });
  });
});