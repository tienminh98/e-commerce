import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  NonNullableFormBuilder
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { EMAIL_ALREADY_USED_TYPE, LOGIN_ALREADY_USED_TYPE } from 'app/config/error.constants';
import SharedModule from 'app/shared/shared.module';
import PasswordStrengthBarComponent from '../password/password-strength-bar/password-strength-bar.component';
import { RegisterService } from './register.service';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzColDirective, NzRowDirective } from 'ng-zorro-antd/grid';
import { NzFormControlComponent, NzFormDirective, NzFormItemComponent } from 'ng-zorro-antd/form';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzInputDirective, NzInputGroupComponent } from 'ng-zorro-antd/input';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {COUNTRY_CODE} from "../../app.constants";

@Component({
  selector: 'jhi-register',
  standalone: true,
  imports: [SharedModule, RouterModule, FormsModule, ReactiveFormsModule, PasswordStrengthBarComponent, NzButtonComponent, NzColDirective, NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzIconDirective, NzInputDirective, NzInputGroupComponent, NzRowDirective, NzSelectComponent, NzOptionComponent],
  templateUrl: './register.component.html',
  styleUrl: '../../home/home.component.scss',

})
export default class RegisterComponent implements AfterViewInit {
  @ViewChild('login', { static: false })

  isShowPassword = false;
  isShowConfirmPassword = false;
  login?: ElementRef;

  doNotMatch = false;
  error = false;
  errorEmailExists = false;
  errorUserExists = false;
  success = false;

  registerForm!: FormGroup;

  countryCodeList: any[] = COUNTRY_CODE;


  constructor(
    private translateService: TranslateService,
    private registerService: RegisterService,
    private fb: NonNullableFormBuilder,
    private notification: NzNotificationService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group({
      countryCode: ['+1'],
      phone: [null, [Validators.required, Validators.pattern(/^\d+$/)]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      pinCode: [null, [Validators.required, Validators.pattern(/^\d+$/)]],
      name: ['', [Validators.required]],
    });
  }

  ngAfterViewInit(): void {
  }

  createNotification(type: string, title: string): void {
    this.notification.create(
      type,
      title,
      '',
      {
        nzStyle: {
          textAlign: 'left'
        },
      }

    );
  }

  register(): void {
    const { password, confirmPassword } = this.registerForm.getRawValue();
    if (password !== confirmPassword) {
      this.createNotification('error', 'The password and its confirmation do not match!')
    } else {
      this.registerService
        .save(this.registerForm.getRawValue())
        .subscribe({ next: () => {
            if (!this.router.getCurrentNavigation()) {
              // There were no routing during login (eg from navigationToStoredUrl)
              this.router.navigate(['']);
            }
          }, error: response => this.processError(response) });
    }
  }

  submitForm(): void {
    if (this.registerForm.valid) {
      // console.log('submit', this.loginForm.value);
      this.register();
    } else {
      Object.values(this.registerForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  private processError(response: HttpErrorResponse): void {
    const keyErrors = Object.keys(response.error);
    this.createNotification('error', response.error[keyErrors[0]])
  }
}
