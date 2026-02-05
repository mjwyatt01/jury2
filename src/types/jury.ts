// Enterprise Jury Selection Type Definitions

export type StrikeType = 'none' | 'peremptory' | 'for_cause';
export type Party = 'plaintiff' | 'defense';
export type JurorTag = 'green' | 'yellow' | 'red' | null;
export type JurorStatus = 'pool' | 'seated' | 'alternate' | 'struck';

export interface Juror {
  id: number;
  name: string;
  number: string;
  score: number; // 1-10 rating
  tag: JurorTag;
  status: JurorStatus;

  // Strike information
  struck: boolean;
  strikeType: StrikeType;
  strikeParty: Party | null;

  // Demographics
  occupation?: string;
  age?: number;
  gender?: string;
  education?: string;
  maritalStatus?: string;

  // Assessment
  notes?: string;
  biases?: string[];
  questioned?: boolean;

  // Grid position
  seatIndex?: number | null;
}

export interface Message {
  text: string;
  sender: string;
  type: 'normal' | 'alert' | 'flag';
  timestamp: number;
  jurorId?: number;
}

export interface StrikeTracker {
  plaintiff: {
    peremptory: number;
    maxPeremptory: number;
    cause: number;
  };
  defense: {
    peremptory: number;
    maxPeremptory: number;
    cause: number;
  };
}

export interface AppConfig {
  caseName: string;
  caseVenue: string;
  jurySize: number;
  alternateCount: number;
  gridRows: number;
  gridCols: number;
  teamMembers: TeamMember[];
}

export interface TeamMember {
  role: string;
  name: string;
  required: boolean;
}

export interface AppState {
  jurors: Juror[];
  messages: Record<number, Message[]>;
  strikes: StrikeTracker;
  config: AppConfig;
  grid: (number | null)[]; // Juror IDs in grid positions
}
