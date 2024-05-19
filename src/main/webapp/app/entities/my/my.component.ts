import {Component, ElementRef, ViewChild} from '@angular/core';
import {NzButtonComponent} from "ng-zorro-antd/button";
import { StateStorageService } from '../../core/auth/state-storage.service';
import { AuthServerProvider } from '../../core/auth/auth-jwt.service';
import { tap } from 'rxjs/operators';
import {Router, RouterLink} from '@angular/router';
import { LoginService } from '../../login/login.service';
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {DetailBillsService} from "./detail-bills/detail-bills.service";
import {HttpErrorResponse} from "@angular/common/http";
import {AccountService} from "../../core/auth/account.service";

@Component({
  selector: 'jhi-my',
  standalone: true,
  imports: [
    NzButtonComponent,
    NzIconDirective,
    RouterLink
  ],
  templateUrl: './my.component.html',
  styleUrl: './my.component.scss'
})
export class MyComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  hostBase = 'https\://lyst686.com/admin/storage/app/public/';
  account: any;
  featureList: any[] = [
    {img: this.handleImg('ft1'), title: 'Shipping Address', url: '/address'},
    {img: this.handleImg('ft2'), title: 'Detailed Bills', url: '/detail-bills'},
    {img: this.handleImg('ft3'), title: 'Top-up Record', url: '/deposit'},
    {img: this.handleImg('ft4'), title: 'Withdraw Record', url: '/withdraw'},
    {img: this.handleImg('ft5'), title: 'Payment Card', url: '/bank'},
    {img: this.handleImg('ft6'), title: 'Crypto', url: '/crypto'},
    {img: this.handleImg('ft7'), title: 'Platform Introduction', url: '/platform-intro'},
    {img: this.handleImg('ft8'), title: 'Language', url: '/language'},
    {img: this.handleImg('ft9'), title: 'Log out', url: null},
  ]

  avatar = '';
  constructor(
              private stateStorageService: StateStorageService,
              private loginService: LoginService,
              private router: Router,
              private notification: NzNotificationService,
              private detailBillsService: DetailBillsService,
              private accountService: AccountService,

  ) {
    this.account = stateStorageService.getUser();
    this.avatar =  this.account?.user?.avatar || '';
  }

  handleImg(name: string): string {
    return `content/images/${name}.png`
  }

  handleAction(item: any): void {
    switch (item.title) {
      case 'Log out':
        this.loginService.logout();
        break;
      default:
        this.router.navigate(['my' + item.url]).then();
        break;
    }
  }

  selectFile(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      // Xử lý file ảnh tại đây
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif']; // Các phần mở rộng file ảnh được phép
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      if (allowedExtensions.indexOf(extension) === -1) {
        this.createNotification('err', 'The uploaded files must be image files')
      } else {
        const formData = new FormData();
        formData.append('avatar', file);
        this.detailBillsService.changeImage(formData).subscribe(res => {
          if (res.status === 200) {
            this.accountService.fetch().subscribe();
            this.avatar = res.body.avatar;
            this.createNotification('success', res.body.message);
          }
        }, error => this.processError(error))
      }
    }

    if (!file) {
      this.createNotification('error', 'The uploaded files must be image files')
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

  private processError(response: HttpErrorResponse): void {
    const keyErrors = Object.keys(response.error);
    this.notification.create('error', response.error[keyErrors[0]], '', {
      nzStyle: {
        textAlign: 'left'
      },
    });
  }
}
