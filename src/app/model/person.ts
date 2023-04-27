import { Patient } from "./patient";

export interface Person {
  id:string;
  firstnames:string;
  lastnames:string;
  birthdate:Date;
  id_type:string;
  genre:string;
  registered_At:string|Date;
  out_Date?:Date;
  address:string
  photo:string;
  landline:string;
  cellphone:string;
  email:string;
  person_Type:string;
}

export interface PartialPerson extends Partial<Person>, Partial<Omit<Patient, 'patient'|'doctor'>>{
  doctorId?:string;
}


