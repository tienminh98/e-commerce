import { Routes } from '@angular/router';
import { MyComponent } from './my.component';
import { AddressComponent } from './address/address.component';
import { DetailBillsComponent } from './detail-bills/detail-bills.component';
import { RuleComponent } from './rule/rule.component';
import { PlatformIntroComponent } from './platform-intro/platform-intro.component';
import { DepositComponent } from './deposit/deposit.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import {CryptoComponent} from "./crypto/crypto.component";
import {BankComponent} from "./bank/bank.component";
import {WithdawDetailComponent} from "./withdaw-detail/withdaw-detail.component";
import { LanguageComponent } from './language/language.component';

const myRoute: Routes = [
  {
  path: '',
  component: MyComponent,
  title: 'my.title'
  },
  {
    path: 'address',
    component: AddressComponent,
    title: 'my.address.title'
  },
  {
    path: 'detail-bills',
    component: DetailBillsComponent,
    title: 'my.detailBills.title'
  },
  {
    path: 'rule',
    component: RuleComponent,
    title: 'my.rule.title'
  },
  {
    path: 'platform-intro',
    component: PlatformIntroComponent,
    title: 'my.platformIntro.title'
  },
  {
    path: 'deposit',
    component: DepositComponent,
    title: 'my.deposit.title'
  },
  {
    path: 'withdraw',
    component: WithdrawComponent,
    title: 'my.withdraw.title'
  },
  {
    path: 'crypto',
    component: CryptoComponent,
    title: 'my.crypto.title'
  },
  {
    path: 'bank',
    component: BankComponent,
    title: 'my.bank.title'
  },
  {
    path: 'withdraw-detail',
    component: WithdawDetailComponent,
    title: 'my.withdrawDetail.title'
  },
  {
    path: 'language',
    component: LanguageComponent,
    title: 'my.language.title'
  }
  ];

export default myRoute;
