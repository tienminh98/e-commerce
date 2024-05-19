import {Component, ElementRef, ViewChild} from '@angular/core';
import {left} from "@popperjs/core";
import {FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from "ng-zorro-antd/form";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {StateStorageService} from "../../../core/auth/state-storage.service";
import {MatchingService} from "../../matching/matching.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {AccountService} from "../../../core/auth/account.service";
import {COUNTRY_CODE} from "../../../app.constants";

@Component({
  selector: 'jhi-bank',
  standalone: true,
    imports: [
        FormsModule,
        NzButtonComponent,
        NzColDirective,
        NzFormControlComponent,
        NzFormDirective,
        NzFormItemComponent,
        NzFormLabelComponent,
        NzIconDirective,
        NzInputDirective,
        NzInputGroupComponent,
        NzOptionComponent,
        NzRowDirective,
        NzSelectComponent,
        ReactiveFormsModule
    ],
  templateUrl: './bank.component.html',
  styleUrl: './bank.component.scss'
})
export class BankComponent {
  @ViewChild('inputText') inputText!: ElementRef<HTMLInputElement>;

  bankForm!: FormGroup;
  account!: any;
  constructor(private fb: NonNullableFormBuilder,private stateStorageService: StateStorageService,
              private matchingService: MatchingService, private notification: NzNotificationService,private accountService: AccountService,

  ) {
    this.account = this.stateStorageService.getUser();
    this.bankForm = this.fb.group({
      bank: [this.account?.user?.bank || '', [Validators.required]],
      account_number: [this.account?.user?.account_number || '', [Validators.required]],
      account_name: [this.account?.user?.account_name || '', [Validators.required]],
      routing_number: [this.account?.user?.routing_number || '', [Validators.required]],
    });
  }

  copyText() {
    const inputElement = this.inputText.nativeElement;

    const currentSelection = document.getSelection()?.rangeCount && document.getSelection()?.getRangeAt(0);

    inputElement.select();

    document.execCommand('copy');

    if (currentSelection) {
      document.getSelection()?.removeAllRanges();
      document.getSelection()?.addRange(currentSelection);
      this.createNotification('success', 'Copied to clipboard')
    }
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
    if (this.bankForm.valid) {
      const request = {
        ...this.bankForm.value
      }
      this.matchingService.updateBank(request).subscribe(res => {
        if (res.status === 200) {
          this.createNotification('success', res.body.message);
          this.accountService.fetch().subscribe();
        }
      }, err => {
        this.createNotification('error', err.message);
      })
    } else {
      Object.values(this.bankForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  protected readonly left = left;
  protected readonly countryCodeList = COUNTRY_CODE;
}
