import { Component } from '@angular/core';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import {NzCellBreakWordDirective, NzCellFixedDirective, NzTableComponent} from 'ng-zorro-antd/table';
import { NzTagComponent } from 'ng-zorro-antd/tag';
import { DetailBillsService } from '../detail-bills/detail-bills.service';
import { finalize } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'jhi-withdraw',
  standalone: true,
  imports: [
    NzIconDirective,
    NzTableComponent,
    NzTagComponent,
    DatePipe,
    NzCellBreakWordDirective,
    NzCellFixedDirective
  ],
  templateUrl: './withdraw.component.html',
  styleUrl: './withdraw.component.scss'
})
export class WithdrawComponent {
  listOfData: any;
  isLoading = true;

  constructor(private detailBillsService: DetailBillsService) {
    detailBillsService.getWithdrawals().pipe(finalize(() => (this.isLoading = false))).subscribe((res: any) => {
      if (res.status === 200) {
        this.listOfData = res.body || [];
      }
    })
  }
}
