import { Person } from "./person";

export interface Patient {
  patient:Person;
  doctor:Person;
  eps:string;
  arl:string;
  condition:string
}
export interface PatientDTO extends Omit<Patient, 'doctor'>{
  doctorId:string;
}
