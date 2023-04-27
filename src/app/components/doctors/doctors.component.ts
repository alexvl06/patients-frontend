import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Person } from 'src/app/model/person';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css']
})
export class DoctorsComponent implements OnInit {

  doctors:Person[] = []
  constructor(
    private userService:UsersService,
    private router:Router

  ) { }

  ngOnInit(): void {
    this.userService.getAllDoctors().subscribe({
      next:(value:Person[])=> this.doctors = value,
      error:console.error
  })
  }

  delete(id:string){
    this.userService.deleteDoctor(id).subscribe({
      next:()=>{
        this.doctors = this.doctors.filter(
            doctor => doctor.id != id
        )
      },
      error:console.error
    })
  }

  details(id:string){
    this.userService.personDetails =this.doctors.filter(
      doctor=>doctor.id ===id
    )[0];
    this.router.navigate(['/register'])
  }
}
