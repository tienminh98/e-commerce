import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchingService } from '../matching.service';
import { pluck, switchMap, tap } from 'rxjs/operators';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzTabComponent, NzTabSetComponent } from 'ng-zorro-antd/tabs';
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import { NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { NzColDirective, NzRowDirective } from 'ng-zorro-antd/grid';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { left, right } from '@popperjs/core';
import { NgIf } from '@angular/common';
import { StateStorageService } from '../../../core/auth/state-storage.service';
import { NzNotificationComponent, NzNotificationService } from 'ng-zorro-antd/notification';
import { AccountService } from '../../../core/auth/account.service';

@Component({
  selector: 'jhi-item-detail',
  standalone: true,
  imports: [
    NzButtonComponent,
    NzTabSetComponent,
    NzTabComponent,
    NzTooltipDirective,
    NzFormDirective,
    NzFormItemComponent,
    NzFormLabelComponent,
    NzFormControlComponent,
    NzColDirective,
    ReactiveFormsModule,
    NzInputDirective,
    NzRowDirective,
    NgIf
  ],
  templateUrl: './item-detail.component.html',
  styleUrl: './item-detail.component.scss'
})
export class ItemDetailComponent {
  @ViewChild('notificationBtnTpl', { static: true }) btnTemplate!: TemplateRef<{ $implicit: NzNotificationComponent }>;

  hostBase = 'https\://lyst686.com/admin/storage/app/public/';
  account!: any;
  id!: number;
  data: any;
  isChecked = false;
  deliveryForm!: FormGroup;
  commissionList = [0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.2, 1.4, 1.6, 2];
  isTimeToBuy = true;

  commission = 0;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matchingService: MatchingService,
    private fb: NonNullableFormBuilder,
    private stateStorageService: StateStorageService,
    private notification: NzNotificationService,
    private accountService: AccountService,

  ) {
    this.matchingService.getDetailItem().subscribe(res => {
      if (res.status === 200) {
        this.data = res.body;
      }
    }, err => {
      console.log('err.status');
      if (err.status === 400) {
        this.isTimeToBuy = false;
        this.notification.create('warning',
          err.error.message,
          '', {
            nzStyle: {
              textAlign: 'left',
              width: '500px'
            }}
        )
      }

    });
    this.account = this.stateStorageService.getUser();

    this.deliveryForm = this.fb.group({
      recipient_name: [this.account.user.name, [Validators.required]],
      address: [this.account.user.address, [Validators.required]],
      contact_phone: [this.account.user.phone, [Validators.required, Validators.pattern(/^\d+$/)]],
      email: [this.account.user.email, [Validators.email, Validators.required]],
    });
    this.commission = this.commissionList[this.account.user.level-1];
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

  showConfirm(): void {
    /*this.modal.confirm({
      nzTitle: '<i>Your current account balance is insufficient for payment. Would you like to top up your balance?</i>',
      nzContent: '<b>Some descriptions</b>',
      nzOnOk: () => console.log('OK')
    });*/
    this.notification.create(
      'warning',
      'Your current account balance is insufficient for payment. Would you like to top up your balance?',
      '',
      {
        nzButton: this.btnTemplate,
        nzDuration: 5000,
        nzPlacement: 'top',
        nzPauseOnHover: true,
        nzStyle: {
          textAlign: 'left'
        },
      }
    );
  }

  submitForm(): void {
    if (this.matchingService.isProceed()) {
      const walletAmount = Number(this.account.user.wallet); // Chuyển đổi ví thành số
      const totalCost = Number(this.data.price) + 15; // Chuyển đổi giá và tính tổng chi phí
      if (walletAmount < totalCost) {
      this.showConfirm();
    } else {
      if (this.deliveryForm.valid) {
        const request = {
          product_id: this.data.id,
          ...this.deliveryForm.value
        }
        this.matchingService.order(request).subscribe(res => {
          if (res.status === 201) {
            this.createNotification('success', 'Order placed successfully. The order is being processed');
            this.accountService.fetch().pipe(tap(_ => this.router.navigate(['/matching']).then())).subscribe();
          }
        })
      } else {
        Object.values(this.deliveryForm.controls).forEach(control => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
      }
    }
    }
    else {
      this.notification.create('error',
        'Order tasks are currently being processed and ready for customers from 10:00 a.m to 10:00 p.m New York time',
        '', {
        nzStyle: {
          textAlign: 'left'
        }})
    }
  }

  protected readonly right = right;
  protected readonly left = left;
  protected readonly Number = Number;
}
