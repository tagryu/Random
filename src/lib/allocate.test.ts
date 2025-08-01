import { describe, it, expect } from 'vitest';
import { allocateMembers } from './allocate';
import { Member } from '@/types';

describe('allocateMembers', () => {
  it('should distribute members evenly across groups', () => {
    const members: Member[] = [
      { name: 'A', prevGroup: '1' },
      { name: 'B', prevGroup: '1' },
      { name: 'C', prevGroup: '2' },
      { name: 'D', prevGroup: '2' },
      { name: 'E', prevGroup: '3' },
      { name: 'F', prevGroup: '3' },
      { name: 'G', prevGroup: '4' },
      { name: 'H', prevGroup: '4' },
    ];
    
    const result = allocateMembers(members, 4);
    
    const groupSizes = Object.values(result.groups).map(g => g.length);
    expect(Math.max(...groupSizes) - Math.min(...groupSizes)).toBeLessThanOrEqual(1);
    expect(result.unassigned).toHaveLength(0);
  });

  it('should minimize previous group overlaps', () => {
    const members: Member[] = [
      { name: 'A', prevGroup: 'X' },
      { name: 'B', prevGroup: 'X' },
      { name: 'C', prevGroup: 'X' },
      { name: 'D', prevGroup: 'Y' },
      { name: 'E', prevGroup: 'Y' },
      { name: 'F', prevGroup: 'Y' },
    ];
    
    const result = allocateMembers(members, 3);
    
    let maxOverlap = 0;
    for (const group of Object.values(result.groups)) {
      const prevGroupCount = new Map<string, number>();
      for (const member of group) {
        if (member.prevGroup) {
          prevGroupCount.set(member.prevGroup, (prevGroupCount.get(member.prevGroup) || 0) + 1);
        }
      }
      const overlap = Math.max(...prevGroupCount.values(), 0);
      maxOverlap = Math.max(maxOverlap, overlap);
    }
    
    expect(maxOverlap).toBeLessThanOrEqual(2);
  });

  it('should handle members without previous groups', () => {
    const members: Member[] = [
      { name: 'A', prevGroup: '' },
      { name: 'B', prevGroup: '' },
      { name: 'C', prevGroup: '' },
      { name: 'D', prevGroup: '' },
    ];
    
    const result = allocateMembers(members, 2);
    
    expect(Object.keys(result.groups)).toHaveLength(2);
    const totalAssigned = Object.values(result.groups).reduce((sum, g) => sum + g.length, 0);
    expect(totalAssigned).toBe(4);
  });

  it('should calculate correct statistics', () => {
    const members: Member[] = Array.from({ length: 10 }, (_, i) => ({
      name: `Member${i}`,
      prevGroup: `Group${i % 3}`
    }));
    
    const result = allocateMembers(members, 3);
    
    expect(result.stats.totalMembers).toBe(10);
    expect(result.stats.avgPerGroup).toBeCloseTo(10 / 3, 1);
    expect(result.stats.duplicateRate).toBeGreaterThanOrEqual(0);
    expect(result.stats.duplicateRate).toBeLessThanOrEqual(100);
  });

  it('should handle edge case with more groups than members', () => {
    const members: Member[] = [
      { name: 'A', prevGroup: '1' },
      { name: 'B', prevGroup: '2' },
    ];
    
    const result = allocateMembers(members, 5);
    
    expect(Object.keys(result.groups)).toHaveLength(5);
    const nonEmptyGroups = Object.values(result.groups).filter(g => g.length > 0).length;
    expect(nonEmptyGroups).toBe(2);
  });

  it('should handle large dataset (1000 members)', () => {
    const members: Member[] = Array.from({ length: 1000 }, (_, i) => ({
      name: `Member${i}`,
      prevGroup: `Group${i % 50}`
    }));
    
    const startTime = Date.now();
    const result = allocateMembers(members, 50);
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(10000);
    
    const totalAssigned = Object.values(result.groups).reduce((sum, g) => sum + g.length, 0);
    expect(totalAssigned + result.unassigned.length).toBe(1000);
    
    const groupSizes = Object.values(result.groups).map(g => g.length);
    expect(Math.max(...groupSizes) - Math.min(...groupSizes)).toBeLessThanOrEqual(1);
  });

  it('should attempt reallocation when many unassigned', () => {
    const members: Member[] = Array.from({ length: 100 }, (_, i) => ({
      name: `Member${i}`,
      prevGroup: `Group${i % 10}`
    }));
    
    const result = allocateMembers(members, 19);
    
    expect(result.unassigned.length).toBeLessThan(5);
  });
});