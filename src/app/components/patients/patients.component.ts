import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Patient,} from 'src/app/model/patient';
import { PartialPerson} from 'src/app/model/person';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {
  patients:Patient[] = []
  constructor(
    private userService:UsersService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.userService.getAllPatients().subscribe({
      next:(value:Patient[])=> this.patients = value,
      error:console.error
  })
  }

  delete(id:string){
    this.userService.deletePatient(id).subscribe({
      next:()=>{
        this.patients = this.patients.filter(
            patient => patient.patient.id != id
        )
      },
      error:console.error
    })
  }

  details(id:string){
    const patientData:Patient = this.patients.filter(
      patient=>patient.patient.id ===id
    )[0]
    const patientDetails:PartialPerson ={
      address: patientData.patient.address,
      birthdate:patientData.patient.birthdate,
      cellphone:patientData.patient.cellphone,
      email:patientData.patient.email,
      firstnames:patientData.patient.firstnames,
      lastnames: patientData.patient.lastnames,
      genre:patientData.patient.genre,
      id: patientData.patient.id,
      id_type:patientData.patient.id_type,
      landline:patientData.patient.landline,
      photo:patientData.patient.photo,
      registered_At:patientData.patient.registered_At,
      person_Type:patientData.patient.person_Type,
      doctorId: patientData.doctor.id,
      eps:patientData.eps,
      arl:patientData.arl,
      condition:patientData.condition
    }
    this.userService.personDetails =patientDetails
    this.router.navigate(['/register'])
  }
}
