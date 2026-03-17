import { Component, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);

  userForm: FormGroup;
  profileBase64: string = '';
  profileFileName: string = '';
  occupations: string[] = ['Software Engineer', 'Data Scientist', 'IT Support', 'Manager', 'Other'];
  successMessage: string = '';
  profileSizeError: boolean = false;
  profileTypeError: boolean = false;
  private timeoutId: any;

  constructor() {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email], [this.emailValidator()]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9,10}$/)]],
      birthDay: ['', [Validators.required]],
      occupation: ['', [Validators.required]],
      sex: ['', [Validators.required]]
    });
  }

  emailValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
      return timer(500).pipe( // Add a small debounce
        switchMap(() => this.userService.checkEmailExists(control.value)),
        map(exists => (exists ? { emailExists: true } : null)),
        catchError(() => of(null)) // Handle HTTP errors gracefully
      );
    };
  }

  get isProfileInvalid(): boolean {
    return this.userForm.touched && !this.profileBase64 && !this.profileSizeError && !this.profileTypeError;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.profileSizeError = false; 
    this.profileTypeError = false;

    if (!file) {
      this.clearFileInput();
      return;
    }

    // Validate file type: must be an image
    if (!file.type.startsWith('image/')) {
      this.profileTypeError = true;
      this.clearFileInput();
      return;
    }

    // Validate file size: limit to 5MB (5 * 1024 * 1024 bytes)
    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      this.profileSizeError = true;
      this.clearFileInput();
      return;
    }

    this.profileFileName = file.name;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.profileBase64 = reader.result as string;
      this.cdr.detectChanges();
    };
  }

  private clearFileInput() {
    this.profileFileName = '';
    this.profileBase64 = '';
    const fileInput = document.getElementById('profileInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  onSave() {
    this.userForm.markAllAsTouched();
    if (this.userForm.valid && this.profileBase64) {
      const userData = { ...this.userForm.value, profileBase64: this.profileBase64 };
      this.userService.saveUser(userData).subscribe({
        next: (res) => {
          this.showSuccess(res.message);
          this.formReset();
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }

  showSuccess(message: string) {
    this.successMessage = message;
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
    }
    
    // Use NgZone to guarantee the UI updates perfectly after the 5s delay
    this.ngZone.runOutsideAngular(() => {
      this.timeoutId = window.setTimeout(() => {
        this.ngZone.run(() => {
          this.successMessage = '';
          this.cdr.markForCheck();
          this.cdr.detectChanges();
        });
      }, 5000);
    });
  }

  formReset() {
    this.userForm.reset();
    this.userForm.markAsUntouched();
    this.profileBase64 = '';
    this.profileFileName = '';
    const fileInput = document.getElementById('profileInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
    // select value is handled by form.reset()
  }

  onClear() {
    this.formReset();
    this.successMessage = '';
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
