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

  constructor(
    private matchingService: MatchingService,
    private stateStorageService: StateStorageService,
    private router: Router,
    private route: ActivatedRoute,
    private notification: NzNotificationService,
  ) {
    this.account = stateStorageService.getUser();
  }

  getProducts(): void {
    this.router.navigate(['detail'], {relativeTo: this.route}).then();
  }
}
