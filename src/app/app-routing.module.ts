import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PatientsComponent } from './components/patients/patients.component';
import { DoctorsComponent } from './components/doctors/doctors.component';
import { RegisterComponent } from './components/register/register.component';


const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component:HomeComponent},
  {path:'register', component: RegisterComponent},
  {path:'patients', component: PatientsComponent},
  {path: 'doctors', component: DoctorsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
