export type HospitalSpecialty = "내과" | "소아청소년과" | "정형외과" | "이비인후과" | "치과" | "피부과";

export type Hospital = {
  id: string;
  name: string;
  specialty: HospitalSpecialty;
  address: string;
  phone: string;
  waitingCount: number;
  estimatedMinutes: number;
  openStatus: "진료중" | "접수마감";
  rating: number;
  accentColor: string;
};
