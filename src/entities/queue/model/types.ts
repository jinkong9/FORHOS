export type QueueStatus = "waiting" | "called" | "completed";

export type QueueTicket = {
  id: string;
  hospitalName: string;
  patientName: string;
  department: string;
  order: number;
  aheadCount: number;
  estimatedMinutes: number;
  status: QueueStatus;
  createdAt: string;
};
