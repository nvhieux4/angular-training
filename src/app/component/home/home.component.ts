import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as faker from 'faker';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { Accounts } from '../../core/data/account';
import {
  Account,
  Column,
  createAccount,
  createParamSearch,
} from '../../core/model/account.model';
import { AccountService } from '../../core/services/account.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  listColumns: Column[] = [
    {
      field: 'stt',
      label: 'STT',
      width: '50px',
    },
    {
      field: 'name',
      label: 'Name',
      width: '150px',
    },
    {
      label: 'Age',
      field: 'age',
      width: '50px',
    },
    {
      field: 'balance',
      label: 'Balance',
      width: '80px',
    },
    {
      field: 'account_number',
      label: 'Account number',
      width: '80px',
    },
    {
      label: 'Address',
      field: 'address',
      width: '150px',
    },
    {
      label: 'Email',
      field: 'email',
      width: '230px',
    },
    {
      label: 'Employer',
      field: 'employer',
      width: '80px',
    },
    {
      field: 'gender',
      label: 'Gender',
      width: '40px',
    },
    {
      field: 'state',
      label: 'State',
      width: '40px',
    },
    {
      field: 'action',
      label: 'Action',
      width: '100px',
    },
  ];
  total = 25;
  genders: string[] = ['F', 'M'];
  isLoading = true;
  page: number = 0;
  account!: Account[];
  accountLength!: number;
  unSubscribeAll: Subject<any>;
  isOpenAddAccount = false;
  isOpenEditAccount = false;
  selectedAccount: Account | undefined;

  searchStr = '';
  first_name = '';
  gender = '';
  email = '';
  address = '';

  isAccount: Account | undefined;
  constructor(private accountService: AccountService) {
    this.unSubscribeAll = new Subject<any>();
    this.loadDataToLocal();
  }
  ngOnInit(): void {
    this.getAllAccount();
    this.getAllAccountFull();
  }

  handleClickPage(page) {
    this.page = page;
    this.getAllAccount();
  }

  onLoaded(load) {
    this.isLoading = load;
  }

  handleDeleteAccount(account: Account) {
    this.accountService.deleteAccount(account).subscribe((item) => {
      this.getAllAccount();
    });
  }

  loadDataToLocal(): void {
    localStorage.setItem('accounts', JSON.stringify(Accounts));
  }

  getAllAccount(): void {
    this.accountService
      .getAccounts(
        createParamSearch({
          last_name: this.searchStr,
          first_name: this.first_name,
          gender: this.gender,
          email: this.email,
          address: this.address,
          start: this.total * this.page,
          limit: this.total,
        })
      )
      .pipe(
        takeUntil(this.unSubscribeAll),
        tap(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (resp: Account[]) => {
          this.account = resp;
          console.log(resp);
        },
        (err: Error) => {
          this.account = [];
        }
      );
  }

  getAllAccountFull(): void {
    this.accountService
      .getAccounts(
        createParamSearch({
          last_name: this.searchStr,
          first_name: this.first_name,
          gender: this.gender,
          email: this.email,
          address: this.address,
          start: 0,
          limit: 10000,
        })
      )
      .pipe(takeUntil(this.unSubscribeAll))
      .subscribe(
        (resp: Account[]) => {
          this.accountLength = resp.length;
        },
        (err: Error) => {
          this.account = [];
        }
      );
  }

  openEdit(acc: Account): void {
    this.selectedAccount = acc;
    this.isOpenEditAccount = true;
  }

  handleAdd(ac: Account) {
    this.accountService
      .addAccount(ac)
      .pipe(takeUntil(this.unSubscribeAll))
      .subscribe(
        (resp: Account[]) => {
          this.getAllAccount();
          this.isOpenEditAccount = false;
        },
        (err: Error) => {
          this.account = [];
        }
      );
  }

  handleSaveEdit(ac: Account) {
    console.log(ac);
    this.accountService
      .editAccount(ac)
      .pipe(takeUntil(this.unSubscribeAll))
      .subscribe(
        (resp: Account[]) => {
          this.getAllAccount();
          this.isOpenEditAccount = false;
        },
        (err: Error) => {
          this.account = [];
        }
      );
  }

  handleClickBtnEdit(ac: Account) {
    this.isAccount = ac;
    console.log(ac);
    this.isOpenEditAccount = true;
  }
  openAddAccount() {
    this.isOpenEditAccount = true;
    this.isAccount = undefined;
  }

  handleClickClose(e) {
    this.isOpenEditAccount = e;
  }

  search(): void {
    this.getAllAccount();
  }
}
