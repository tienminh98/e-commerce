import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from "ng-zorro-antd/form";
import {NzInputDirective} from "ng-zorro-antd/input";
import {StateStorageService} from "../../../core/auth/state-storage.service";
import {MatchingService} from "../../matching/matching.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {AccountService} from "../../../core/auth/account.service";
import {left} from "@popperjs/core";
import {NzRadioComponent, NzRadioGroupComponent} from "ng-zorro-antd/radio";
import {tap} from "rxjs/operators";
import {Router} from "@angular/router";

@Component({
  selector: 'jhi-withdaw-detail',
  standalone: true,
  imports: [
    FormsModule,
    NzButtonComponent,
    NzColDirective,
    NzFormControlComponent,
    NzFormDirective,
    NzFormItemComponent,
    NzFormLabelComponent,
    NzInputDirective,
    NzRowDirective,
    ReactiveFormsModule,
    NzRadioGroupComponent,
    NzRadioComponent
  ],
  templateUrl: './withdaw-detail.component.html',
  styleUrl: './withdaw-detail.component.scss'
})
export class WithdawDetailComponent {
  @ViewChild('inputText') inputText!: ElementRef<HTMLInputElement>;

  withdrawForm!: FormGroup;
  account!: any;
  constructor(private fb: NonNullableFormBuilder,private stateStorageService: StateStorageService,
              private matchingService: MatchingService, private notification: NzNotificationService,private accountService: AccountService,
              private router: Router,

  ) {
    this.account = this.stateStorageService.getUser();
    this.withdrawForm = this.fb.group({
      type: ['', [Validators.required]],
      amount: ['', [Validators.required]],
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

  submitForm(): void {
    if (this.matchingService.isProceed()) {
      if (this.withdrawForm.valid) {
        const request = {
          ...this.withdrawForm.value,
          amount: this.withdrawForm.get('amount')?.value.toString()
        };
        this.matchingService.withdraw(request).subscribe(res => {
          if (res.status === 200) {
            this.createNotification('success', res.body.message);
            this.accountService.fetch().pipe(tap(_ => this.router.navigate(['/my']).then())).subscribe();
          }
        }, err => {
          this.createNotification('error', err.error.message);
        })
      } else {
        Object.values(this.withdrawForm.controls).forEach(control => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
      }
    }
    else {
      this.notification.create('warning',
        'Order tasks are currently being processed and ready for customers from 10:00 a.m. to 10:00 p.m. New York time.',
        '', {
          nzStyle: {
            textAlign: 'left',
            width: '500px'
          }})
    }

  }

  protected readonly left = left;
}
