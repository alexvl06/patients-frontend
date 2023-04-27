import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientDTO } from 'src/app/model/patient';
import { PartialPerson, Person } from 'src/app/model/person';
import { UsersService } from 'src/app/services/users.service';

const defaultImageButtonTitle = 'Añadir foto de perfil';
const ChangeImageTitle = 'Cambiar Imagen';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  isPatient:boolean = false;
  isClearButtonAvailable:boolean = false;
  isImageSelected:boolean = false;
  form!: FormGroup;
  imgSrc:string = ''
  imageTitle:string|undefined
  fileButtonTitle:string = defaultImageButtonTitle
  doctors:Person[] = []


  constructor(
    private formBuilder: FormBuilder,
    private userService:UsersService,
    private router:Router
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.clearForm();
    this.loadPersonDetails();

  }

  loadPersonDetails(){
    if(this.userService.personDetails != null){
      this.isClearButtonAvailable = true;
      this.form.get('id')?.setValue(this.userService.personDetails.id);
      this.form.get('firstnames')?.setValue(this.userService.personDetails.firstnames);
      this.form.get('lastnames')?.setValue(this.userService.personDetails.lastnames);
      this.form.get('type_id')?.setValue(this.userService.personDetails.id_type);
      if(this.userService.personDetails.birthdate != undefined){
        this.form.get('birthdate')?.setValue(formatDate(this.userService.personDetails.birthdate, 'yyyy-MM-dd', 'en'));
      }
      this.form.get('genre')?.setValue(this.userService.personDetails.genre);
      this.form.get('address')?.setValue(this.userService.personDetails.address);
      if(this.userService.personDetails.photo != undefined){
        this.imgSrc = this.userService.personDetails.photo;
        this.fileButtonTitle = ChangeImageTitle
      }
      this.form.get('landline')?.setValue(this.userService.personDetails.landline);
      this.form.get('cellphone')?.setValue(this.userService.personDetails.cellphone);
      this.form.get('email')?.setValue(this.userService.personDetails.email);
      const personType = this.userService.personDetails.person_Type
      this.form.get('person_type')?.setValue(personType,{onlySelf:true});
      this.isPatient=false;

      if(personType == 'patient'){
        this.form.get('doctor_id')?.setValue(this.userService.personDetails.doctorId);
        this.form.get('eps')?.setValue(this.userService.personDetails.eps);
        this.form.get('arl')?.setValue(this.userService.personDetails.arl);
        this.form.get('condition')?.setValue(this.userService.personDetails.condition);
        this.isPatient=true;
        this.onRoleChanges()
      }
    }

  }
  private buildForm() {
    this.form = this.formBuilder.group({
      id: ['', [Validators.required]],
      firstnames: ['', [Validators.required]],
      lastnames: ['', [Validators.required]],
      type_id: ['', [Validators.required]],
      birthdate: ['', [Validators.required]],
      genre: ['', [Validators.required]],
      address: ['', [Validators.required]],
      photo: [''],
      landline: ['', [ Validators.minLength(7), Validators.maxLength(13), Validators.pattern("[0-9]+")]],
      cellphone: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(10), Validators.pattern("[0-9]+")]],
      email: ['', [Validators.required,Validators.pattern("^[a-zA-Z0-9.!#$%&'*+=?^_`{|}~-]+@[a-zA-Z0-9\.]+\.[a-zA-Z0-9]+$")]],
      person_type: ['', [Validators.required]],
      doctor_id:[''],
      eps:[''],
      arl:[''],
      condition:['']
    });
  }

  onRoleChanges(){
    if(this.form.get('person_type')?.value=='patient'){
      this.isPatient = true;
      this.form.get('doctor_id')?.setValidators([Validators.required])
      this.form.get('eps')?.setValidators([Validators.required])
      this.form.get('arl')?.setValidators([Validators.required])
      this.form.get('condition')?.setValidators([Validators.required])
      this.form.updateValueAndValidity();
      this.userService.getAllDoctors().subscribe({
        next:(doctors)=>this.doctors = doctors,
        error: console.error
      })
    }else{
      this.isPatient = false;
      this.form.get('doctor_id')?.clearValidators()
      this.form.get('eps')?.clearValidators()
      this.form.get('arl')?.clearValidators()
      this.form.get('condition')?.clearValidators()
      this.form.updateValueAndValidity();
    }

  }

  onFormChanges(){
     this.isClearButtonAvailable = (Object.values(this.form.controls).some(
        control=>(
          control.value !='' &&
          control.value != undefined
          )))
  }
  createUser(){
    const person:Person ={
      id: this.form.get('id')?.value,
      firstnames:this.form.get('firstnames')?.value,
      lastnames:this.form.get('lastnames')?.value,
      birthdate:this.form.get('birthdate')?.value,
      id_type:this.form.get('type_id')?.value,
      genre:this.form.get('genre')?.value,
      registered_At:new Date().toISOString(),
      address:this.form.get('address')?.value,
      photo:this.imgSrc,
      landline:this.form.get('landline')?.value,
      cellphone:this.form.get('cellphone')?.value,
      email:this.form.get('email')?.value,
      person_Type:this.form.get('person_type')?.value
    }
    if(this.form.get('person_type')?.value == 'doctor'){
      this.userService.createDoctor(person).subscribe({
        next:()=>this.router.navigate(['/doctors']),
        error:console.error
      })
    }else{
      const patient:PatientDTO ={
        patient:person,
        doctorId:this.form.get('doctor_id')?.value,
        eps:this.form.get('eps')?.value,
        arl:this.form.get('arl')?.value,
        condition:this.form.get('condition')?.value
      }
      this.userService.createPatient(patient).subscribe({
        next:()=>this.router.navigate(['/patients']),
        error:console.error
      })
    }
  }

  clearForm(){
    this.form.reset()
    this.isClearButtonAvailable = false;
    this.imgSrc = '';
    this.imageTitle = undefined;
    this.isImageSelected = false;
    this.fileButtonTitle = defaultImageButtonTitle
    this.isPatient = false
  }

  uploadImage(event:any){
    const image = event.target.files[0];
    if(image !=null){
      this.imageTitle =image.name;
      const newLocal = ChangeImageTitle;
      this.fileButtonTitle = newLocal
      this.isImageSelected = true;
      this.renderImage(image)
    }
  }

  renderImage(file:File){
    const reader = new FileReader();
    reader.onload = ()=>{
      this.imgSrc = reader.result as string;
    }
    reader.readAsDataURL(file)
  }

  get idField(){return this.form.get('id')}
  get type_idField(){return this.form.get('type_id')}
  get birthdateField(){return this.form.get('birthdate')}
  get genreField(){return this.form.get('genre')}
  get addressField(){return this.form.get('address')}
  get photoField(){return this.form.get('photo')}
  get landlineField(){return this.form.get('landline')}
  get cellphoneField(){return this.form.get('cellphone')}
  get emailField(){return this.form.get('email')}
  get person_typeField(){return this.form.get('person_type')}
  get doctor_idField(){return this.form.get('doctor_id')}
  get epsField(){return this.form.get('eps')}
  get arlField(){return this.form.get('arl')}
  get conditionField(){return this.form.get('condition')}
  get firstnamesField(){return this.form.get('firstnames')}
  get lastnamesField(){return this.form.get('lastnames')}

}
