import { Component } from '@angular/core';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import { MatchingService } from './matching.service';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import { StateStorageService } from '../../core/auth/state-storage.service';
import {tap} from "rxjs/operators";
import {NzNotificationService} from "ng-zorro-antd/notification";

@Component({
  selector: 'jhi-matching',
  standalone: true,
  imports: [
    NzButtonComponent,
    RouterLink
  ],
  templateUrl: './matching.component.html',
  styleUrl: './matching.component.scss'
})
export class MatchingComponent {
  account!: any;
  hostBase = 'https\://lyst686.com/admin/storage/app/public/';
  productList: any[] = [];
  numberOfPeople!: any;
  private intervalId: any;

  constructor(
    private matchingService: MatchingService,
    private stateStorageService: StateStorageService,
    private router: Router,
    private route: ActivatedRoute,
    private notification: NzNotificationService,
  ) {
    this.account = stateStorageService.getUser();
  }
  ngOnInit(): void {
    this.updateNumberOfPeople();
    this.intervalId = setInterval(() => {
      this.updateNumberOfPeople();
    }, 4000); // cập nhật mỗi 5 giây
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  getProducts(): void {
    this.router.navigate(['detail'], {relativeTo: this.route}).then();
  }
  getRandomNumber(min: number, max: number): string {
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber.toLocaleString();
  }
  updateNumberOfPeople(): void {
    this.numberOfPeople = this.getRandomNumber(10000, 150000);
  }
}
