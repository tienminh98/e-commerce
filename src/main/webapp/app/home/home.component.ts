import {Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import {AccountService} from 'app/core/auth/account.service';
import {Account} from 'app/core/auth/account.model';
import {NgOptimizedImage} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {NzButtonComponent, NzButtonSize} from 'ng-zorro-antd/button';
import {StateStorageService} from '../core/auth/state-storage.service';


@Component({
  standalone: true,
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [SharedModule, RouterModule, NgOptimizedImage, ReactiveFormsModule, NzButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export default class HomeComponent implements OnInit, OnDestroy {
  account: any = null;
  size: NzButtonSize = 'large';

  private readonly destroy$ = new Subject<void>();

  commodityList: any[] = [];
  memberList: any[] = [];
  memberImageList: any[] = [];
  annList = [
    { cardNumber: '[****2512]', money: '180,698.33' },
    { cardNumber: '[****2190]', money: '2,193.22' },
    { cardNumber: '[****4121]', money: '15,612.42' },
    { cardNumber: '[****7567]', money: '31,334.13' },
    { cardNumber: '[****9299]', money: '1,244.33' },
    { cardNumber: '[****0678]', money: '91,249.33' },
    { cardNumber: '[****0510]', money: '6,418.14' },
    { cardNumber: '[****1388]', money: '412.41' },
    { cardNumber: '[****5321]', money: '9,129.11' },
    { cardNumber: '[****3233]', money: '21,980.12' },
    { cardNumber: '[****7138]', money: '1,980.12' },
  ];
  levelList: any = [];

  public targetList = [
    {reqInvest: 300, commission: 0.5, order: 40},
    {reqInvest: 1000, commission: 0.6, order: 60},
    {reqInvest: 3000, commission: 0.7, order: 80},
    {reqInvest: 5000, commission: 0.8, order: 100},
    {reqInvest: 10000, commission: 0.9, order: 120},
    {reqInvest: 30000, commission: 1, order: 140},
    {reqInvest: 50000, commission: 1.2, order: 160},
    {reqInvest: 100000, commission: 1.4, order: 180},
    {reqInvest: 300000, commission: 1.6, order: 200},
    {reqInvest: 500000, commission: 2, order: 220}
  ]

  constructor(
    private accountService: AccountService,
    private router: Router,
    private stateStorageService: StateStorageService,
  ) {
    this.commodityList = this.fakeArray(12).map((_, index) => `content/images/g${index + 1}.jpg`);
    this.memberImageList = this.fakeArray(9).map((_, index) => `content/images/h${index + 1}.jpg`);
    this.memberList = this.fakeArray(10).map((_, index) => ({
      bgImg: `content/images/m${this.randomBetween1And4()}.jpg`,
      title: 'SAKS OFF 5TH',
      reqInvest: this.targetList[index].reqInvest,
      type: `VIP${index}`,
      val: this.targetList[index].commission,
      order: this.targetList[index].order,
    }));
 /*   this.annList = this.fakeArray(10).map((_, index) => ({
      cardNumber: '[****1806]',
      money: 251221,
    }));*/
    this.annList = this.shuffleArray(this.annList);

    // Randomize the money values
    this.annList.forEach(item => {
      item.money = this.randomMoney();
      item.cardNumber = this.randomCardNumber();
    });
    this.accountService.levels().subscribe(res => {
      if (res.status === 200) {
        this.levelList = res.body;
      }
    })
    this.account = this.stateStorageService.getUser();
    console.log('account', this.account);
  }

  randomBetween1And4() {
    return Math.floor(Math.random() * 4) + 1;
  }

  fakeArray(length: number): any[] {
    return new Array(length).fill(null);
  }

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  randomMoney(): string {
    const min = 100; // giá trị tối thiểu của money
    const max = 100000; // giá trị tối đa của money
    return this.numberFormat(Math.random() * (max - min) + min, 2, '.', ',');
  }

  private numberFormat(number: number, decimals: number, decPoint: string, thousandsSep: string): string {
    const fixedNumber = number.toFixed(decimals);
    const parts = fixedNumber.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);
    return parts.join(decPoint);
  }
  randomCardNumber(): string {
    const randomDigits = Math.floor(1000 + Math.random() * 9000).toString();
    return `[****${randomDigits}]`;
  }
  protected readonly Number = Number;
}
