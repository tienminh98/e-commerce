import {ChangeDetectorRef, Component, ElementRef, QueryList, ViewChild, ViewChildren} from '@angular/core';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzColDirective, NzRowDirective } from 'ng-zorro-antd/grid';
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from 'ng-zorro-antd/form';
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
import {left} from "@popperjs/core";

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
        RouterLink,
        NzFormLabelComponent
    ],
  templateUrl: './address.component.html',
  styleUrl: './address.component.scss'
})
export class AddressComponent {
  @ViewChildren('inputText') inputText!: QueryList<any>;

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
      city: [this.account.user.city, [Validators.required]],
      stage: [this.account.user.stage, [Validators.required]],
      zip_code: [this.account.user.zip_code, [Validators.required]],
      nation : [this.account.user.nation , [Validators.required]],
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

  copyText(idx: number) {
    const inputElement = this.inputText.get(idx).nativeElement;
    console.log('inputElement',idx, this.inputText.get(idx))

    const currentSelection = document.getSelection()?.rangeCount && document.getSelection()?.getRangeAt(0);

    inputElement.select();

    document.execCommand('copy');

    if (currentSelection) {
      document.getSelection()?.removeAllRanges();
      document.getSelection()?.addRange(currentSelection);
      this.createNotification('success', 'Copied to clipboard')
    }
  }

  private processError(response: HttpErrorResponse): void {
    const keyErrors = Object.keys(response.error);
    this.createNotification('error', response.error[keyErrors[0]])
  }

  protected readonly left = left;


}
