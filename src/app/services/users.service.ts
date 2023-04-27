import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PartialPerson, Person } from '../model/person';
import { environment } from 'src/environments/environment';
import { Patient, PatientDTO } from '../model/patient';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http:HttpClient
  ) { }

  personDetails:PartialPerson|null = null

  createDoctor(dto:Person){
    return this.http.post(`${environment.API_URL}/doctors`, dto);
  }

  createPatient(dto:PatientDTO){
    return this.http.post(`${environment.API_URL}/patients`, dto);
  }

  getAllDoctors(){
      return this.http.get<Person[]>(`${environment.API_URL}/doctors`);
    }

    getAllPatients(){
      return this.http.get<Patient[]>(`${environment.API_URL}/patients`);
    }

    deleteDoctor(id:string){
      return this.http.delete(`${environment.API_URL}/doctors/${id}`);
    }

    deletePatient(id:string){
      return this.http.delete(`${environment.API_URL}/patients/${id}`);
    }
}
