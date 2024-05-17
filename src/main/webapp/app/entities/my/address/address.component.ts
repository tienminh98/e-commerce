import {ChangeDetectorRef, Component} from '@angular/core';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzColDirective, NzRowDirective } from 'ng-zorro-antd/grid';
import { NzFormControlComponent, NzFormDirective, NzFormItemComponent } from 'ng-zorro-antd/form';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzInputDirective, NzInputGroupComponent } from 'ng-zorro-antd/input';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RegisterService } from '../../../account/register/register.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpErrorResponse } from '@angular/common/http';
import { AccountService } from '../../../core/auth/account.service';
import { StateStorageService } from '../../../core/auth/state-storage.service';
import {ChangeDetection} from "@angular/cli/lib/config/workspace-schema";

@Component({
  selector: 'jhi-address',
  standalone: true,
  imports: [
    NzButtonComponent,
    NzColDirective,
    NzFormControlComponent,
    NzFormDirective,
    NzFormItemComponent,
    NzIconDirective,
    NzInputDirective,
    NzInputGroupComponent,
    NzRowDirective,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './address.component.html',
  styleUrl: './address.component.scss'
})
export class AddressComponent {
  account!: any;
  userForm!: FormGroup;

  constructor(
    private translateService: TranslateService,
    private registerService: RegisterService,
    private fb: NonNullableFormBuilder,
    private notification: NzNotificationService,
    private router: Router,
    private accountService: AccountService,
    private stateStorageService: StateStorageService,
    private changeDetectorRef: ChangeDetectorRef,

  ) {
    this.account = this.stateStorageService.getUser();
    this.userForm = this.fb.group({
      contact_phone: [this.account.user.phone, [Validators.required, Validators.pattern(/^\d+$/)]],
      address: [this.account.user.address, [Validators.required]],
      email: [this.account.user.email, [Validators.email, Validators.required]],
      recipient_name: [this.account.user.name, [Validators.required]],
    });
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

  updateInfo(): void {
    this.registerService
      .update(this.userForm.getRawValue())
      .subscribe({ next: (res: any) => {
          this.accountService.fetch().subscribe();
          this.createNotification('success', res.message)
        }, error: response => this.processError(response) });
  }

  submitForm(): void {
    if (this.userForm.valid) {
      // console.log('submit', this.loginForm.value);
      this.updateInfo();
    } else {
      Object.values(this.userForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  isShowTick(formControl: string): boolean {
    // this.changeDetectorRef.detectChanges();
    return Boolean(this.userForm.get(formControl)?.valid);
  }

  private processError(response: HttpErrorResponse): void {
    const keyErrors = Object.keys(response.error);
    this.createNotification('error', response.error[keyErrors[0]])
  }

}
