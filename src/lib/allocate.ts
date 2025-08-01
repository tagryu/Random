import { Member, AllocationResult } from '@/types';

export function allocateMembers(members: Member[], targetGroups: number): AllocationResult {
  const totalMembers = members.length;
  const baseSize = Math.floor(totalMembers / targetGroups);
  const remainder = totalMembers % targetGroups;
  
  const groups: Record<string, Member[]> = {};
  for (let i = 1; i <= targetGroups; i++) {
    groups[`그룹 ${i}`] = [];
  }
  
  const groupNames = Object.keys(groups);
  const shuffledMembers = [...members];
  
  const prevGroupMap = new Map<string, Member[]>();
  for (const member of shuffledMembers) {
    if (member.prevGroup) {
      if (!prevGroupMap.has(member.prevGroup)) {
        prevGroupMap.set(member.prevGroup, []);
      }
      prevGroupMap.get(member.prevGroup)!.push(member);
    }
  }
  
  const membersWithPrevGroup: Member[] = [];
  const membersWithoutPrevGroup: Member[] = [];
  
  for (const member of shuffledMembers) {
    if (member.prevGroup) {
      membersWithPrevGroup.push(member);
    } else {
      membersWithoutPrevGroup.push(member);
    }
  }
  
  shuffleArray(membersWithPrevGroup);
  shuffleArray(membersWithoutPrevGroup);
  
  let currentGroupIndex = 0;
  const assigned = new Set<Member>();
  
  for (const [prevGroup, groupMembers] of prevGroupMap.entries()) {
    const shuffledGroupMembers = [...groupMembers];
    shuffleArray(shuffledGroupMembers);
    
    for (const member of shuffledGroupMembers) {
      let targetGroupIndex = currentGroupIndex;
      const targetSize = targetGroupIndex < remainder ? baseSize + 1 : baseSize;
      
      if (groups[groupNames[targetGroupIndex]].length < targetSize) {
        groups[groupNames[targetGroupIndex]].push(member);
        assigned.add(member);
        currentGroupIndex = (currentGroupIndex + 1) % targetGroups;
      }
    }
  }
  
  const remainingMembers = shuffledMembers.filter(m => !assigned.has(m));
  shuffleArray(remainingMembers);
  
  for (const member of remainingMembers) {
    let bestGroupIndex = -1;
    let minSize = Infinity;
    
    for (let i = 0; i < targetGroups; i++) {
      const targetSize = i < remainder ? baseSize + 1 : baseSize;
      const currentSize = groups[groupNames[i]].length;
      
      if (currentSize < targetSize && currentSize < minSize) {
        minSize = currentSize;
        bestGroupIndex = i;
      }
    }
    
    if (bestGroupIndex !== -1) {
      groups[groupNames[bestGroupIndex]].push(member);
      assigned.add(member);
    }
  }
  
  const unassigned = shuffledMembers.filter(m => !assigned.has(m));
  
  let duplicateCount = 0;
  for (const [groupName, groupMembers] of Object.entries(groups)) {
    const prevGroupCount = new Map<string, number>();
    for (const member of groupMembers) {
      if (member.prevGroup) {
        prevGroupCount.set(member.prevGroup, (prevGroupCount.get(member.prevGroup) || 0) + 1);
      }
    }
    
    for (const count of prevGroupCount.values()) {
      if (count > 1) {
        duplicateCount += count - 1;
      }
    }
  }
  
  const stats = {
    totalMembers: totalMembers,
    avgPerGroup: totalMembers / targetGroups,
    duplicateRate: totalMembers > 0 ? (duplicateCount / totalMembers) * 100 : 0
  };
  
  if (unassigned.length >= 5) {
    return reAllocate(members, targetGroups, 1);
  }
  
  return { groups, unassigned, stats };
}

function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function reAllocate(members: Member[], targetGroups: number, attempt: number): AllocationResult {
  if (attempt > 1) {
    return allocateMembers(members, targetGroups);
  }
  
  const shuffledMembers = [...members];
  shuffleArray(shuffledMembers);
  
  return allocateMembers(shuffledMembers, targetGroups);
}