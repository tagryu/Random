export interface Member {
  name: string;
  prevGroup: string;
}

export interface InputPayload {
  members: Member[];
  targetGroups: number;
}

export interface AllocationResult {
  groups: Record<string, Member[]>;
  unassigned: Member[];
  stats: {
    totalMembers: number;
    avgPerGroup: number;
    duplicateRate: number;
  };
}