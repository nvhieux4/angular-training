import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Account, Column } from '../../core/model/account.model';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements OnInit {
  @Input() columns!: Column[];
  @Input() account!: Account[];
  @Input() total!: number;
  @Input() length!: number;

  startPage: number = 0;
  isOpenEditAccount = false;

  @Output() isLoaded = new EventEmitter<boolean>();
  @Output() newPage = new EventEmitter<number>();
  @Output() accountDelete = new EventEmitter<Account>();
  @Output() clickEdit = new EventEmitter<Account>();
  constructor() {}

  ngOnInit(): void {}
  pageEvent(event) {
    this.startPage = event.pageIndex;
    this.newPage.emit(event.pageIndex);
    this.isLoaded.emit(true);
  }

  handleClickDelete(a: Account) {
    if (confirm('you may want to delete!!!') === true) {
      this.accountDelete.emit(a);
    }
  }

  handleClickClose(event) {
    this.isOpenEditAccount = event;
  }

  handleEditAccount(a: Account) {
    console.log(a);
    this.clickEdit.emit(a);
  }
}
