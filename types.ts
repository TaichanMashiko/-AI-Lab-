export interface Student {
  name: string;
  email: string;
  studentNumber: string;
  id: string;
  pw: string;
}

export interface SheetRow {
  c: { v: string | number | null }[];
}

export enum AppState {
  IDLE,
  LOADING,
  SUCCESS,
  NOT_FOUND,
  ERROR
}