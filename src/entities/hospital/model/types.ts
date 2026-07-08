export type Hospital = {
  id: number;
  name: string;
  addr: string;
  number: string;
  openStatus: boolean;
  openTime: string | null;
  closeTime: string | null;
  lunchStartTime: string | null;
  lunchEndTime: string | null;
  closedDays: string | null;
  waitingPeople: number;
  waitingTime: number;
  rating: number;
};
