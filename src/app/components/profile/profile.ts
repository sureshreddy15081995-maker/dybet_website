import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PlayerService } from '../../core/services/player/player.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
// import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from '../../reusables/message/message.service';
import { TranslateModule } from '@ngx-translate/core';
import * as cashierActions from '../../core/appstates/cashierstates/cashierActions';
import * as loginActions from '../../core/appstates/loginstates/loginActions';
import { Store } from '@ngrx/store';
import * as appState from '../../core/appstates/appState';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule , TranslateModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  playerDetails: any = null;
  showPasswordModal: boolean = false;
  passwordForm: FormGroup;
  isLoading: boolean = false;
 
  additionalFields = [ 
    { label: 'Phone', value: this.playerDetails?.address?.phone, icon: 'fas fa-phone' }
  ];

  constructor(
    private playerService: PlayerService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef, 
    private messageService: MessageService,
    private store: Store<appState.AppState>,
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]] });
  }

  ngOnInit(): void {
    this.loadPlayerProfile();
  }

  loadPlayerProfile(): void {
    this.playerService.onPlayerGetProfile().subscribe((res) => {
      if (res.success) {
        this.isLoading = false;
        this.playerDetails = res; 
        this.additionalFields[0].value = res.address['phone'] 
        this.cdr.detectChanges();
      }
    });
  }

  getInitials(): string {
    if (!this.playerDetails) return '';
    const firstInitial = this.playerDetails.firstName?.charAt(0) || '';
    const lastInitial = this.playerDetails.lastName?.charAt(0) || '';
    return firstInitial + lastInitial;
  }

  togglePasswordModal(): void {
    this.showPasswordModal = !this.showPasswordModal;
    if (!this.showPasswordModal) {
      this.passwordForm.reset();
    }
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  get currentPassword() { return this.passwordForm.get('currentPassword'); }
  get newPassword() { return this.passwordForm.get('newPassword'); }

  updatePassword(): void {
    if (this.passwordForm.valid) {
      this.isLoading = true;
      const { currentPassword, newPassword } = this.passwordForm.value;


      let body = {
        "oldPassword": currentPassword,
        "newPassword": newPassword
      }
      this.playerService.onPlayerUpdatePassword(body).subscribe((res) => {
        this.isLoading = false;
        let responseMessage: string = "";
        if (res.success) {
          console.log(res)
          this.messageService.success("Password Update", "Your Password Updated Successfully.Please Login With New Password..",5000);

          setTimeout(()=>{
            this.store.dispatch(new cashierActions.ResetState());
            this.store.dispatch(new loginActions.LogoutStart());
          }, 5100)
        } else {
          responseMessage = String(res.description);
          this.messageService.warning("Password Update Failed", responseMessage);
        }
      });

      this.togglePasswordModal();
      this.passwordForm.reset();
    }
  }
}
