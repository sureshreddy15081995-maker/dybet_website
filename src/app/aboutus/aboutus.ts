import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Slots } from '../core/services/slots';
import { environment } from '../../environments/environment';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-aboutus',
  imports: [CommonModule, TranslateModule,ReactiveFormsModule],
  templateUrl: './aboutus.html',
  styleUrl: './aboutus.css'
})
export class Aboutus {
  currentTag: string = '';
  popupTitle: string = '';
  popupContent: string = '';
  successvalue: boolean = false;

  showPopup = false;
  contactUsErrorMessage: any;
  form!: FormGroup;

  constructor(private route: ActivatedRoute,  private fb: FormBuilder, private slotservice:Slots) {}

  ngOnInit(): void {
    window.scroll(120,0)

    this.currentTag = this.route.snapshot.data['tag'];
console.log(this.currentTag)
this.form = this.fb.group({ 
  face: new FormControl(environment.skinId),
  ip: new FormControl(null),
  lang: new FormControl(localStorage.getItem('lang')),
  loginName: new FormControl(''),
  firstName: new FormControl(null, [Validators.required, Validators.minLength(3),Validators.maxLength(15), Validators.pattern('^[a-zA-Z ]*$')]),
  lastName: new FormControl(''),
  email: new FormControl(null, [Validators.required, Validators.email, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),

  subject: new FormControl(null, [Validators.required,]),
  userQuestion: new FormControl(null, [Validators.required,]), 
})
}
onFormSubmit() { 
  this.slotservice.onContactUsSendStats(this.form.value).subscribe(data => this.contactusresponsedata(data));
}
contactusresponsedata(data:any) {
  console.log(data); 
  if (data) {
    if (data.success == true) {
      this.successvalue = data.success; 
      this.form.reset();
      this.contactUsErrorMessage = 'Successfully sent. Our support team will revert back soon.';
    } else if (data.success == false) {
      this.successvalue = data.success;
      this.contactUsErrorMessage = data.description;
    }
  }
  setTimeout(() => {
    this.contactUsErrorMessage = '';
  }, 5000)
}
userNameValid(event:any){ 
  var k;  
   k = event.charCode;    
   return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || (k >= 48 && k <= 57)); 
} 
emailValid(event:any) {
  var k;
  k = event.charCode;  
  return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k >= 33 && k <= 47 || k >= 60 && k <= 64 || (k >= 48 && k <= 58) || k >= 91 && k <= 96 || k >= 123 && k <= 126);
}
}
