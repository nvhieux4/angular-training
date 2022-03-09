import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Observable, Subject, timer } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import {
  Account,
  createAccount,
  createParamSearch,
} from '../../core/model/account.model';
import { AccountService } from '../../core/services/account.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  genders: string[] = ['F', 'M'];
  form!: FormGroup;
  isOpenEditAccount: boolean = true;
  listAccount!: Account[];
  unSubscribeAll: Subject<any>;
  
  @Input() isAccount: Account | undefined;

  @Output() close = new EventEmitter<boolean>();
  @Output() saveEdit = new EventEmitter<Account>();
  @Output() add = new EventEmitter<Account>();

  constructor(private fb: FormBuilder, private accountService: AccountService) {
    this.unSubscribeAll = new Subject<any>();
  }

  ngOnInit(): void {
    this.accountService
      .getAccounts(
        createParamSearch({
          start: 0,
          limit: 10000,
        })
      )
      .subscribe((acc: Account[]) => {
        this.listAccount = acc;
      });
    this.form = this.fb.group({
      balance: ['', this.BalanceValidator()],
      age: ['', this.AgeValidator()],
      lastname: [''],
      firstname: [''],
      city: [''],
      account_number: ['', , this.validateAccountNumberFromAPI.bind(this)],
      address: [''],
      email: ['', Validators.email, this.validateEmailFromAPI.bind(this)],
      employer: [''],
      gender: ['F'],
      state: [''],
    });

    if (this.isAccount) {
      this.form.patchValue({
        balance: this.isAccount.balance,
        age: this.isAccount.age,
        lastname: this.isAccount.lastname,
        firstname: this.isAccount.firstname,
        city: this.isAccount.city,
        account_number: this.isAccount.account_number,
        address: this.isAccount.address,
        email: this.isAccount.email,
        employer: this.isAccount.employer,
        gender: this.isAccount.gender,
        state: this.isAccount.state,
      });
    }
  }

  onSubmit() {
    if (this.isAccount) {
      const editedAccount = createAccount({
        balance: this.form.value.balance,
        age: this.form.value?.age,
        lastname: this.form.value?.lastname,
        firstname: this.form.value?.firstname,
        city: this.form.value?.city,
        account_number: this.form.value?.account_number,
        address: this.form.value?.address,
        email: this.form.value?.email,
        employer: this.form.value?.employer,
        gender: this.form.value?.gender,
        state: this.form.value?.state,
        _id: this.isAccount._id,
      });
      this.saveEdit.emit(editedAccount);
    } else {
      const newAccount = createAccount({
        ...this.form.value,
      });
      this.add.emit(newAccount);
    }
  }

  handleClose() {
    this.close.emit(false);
  }

  AgeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let isValid = false;
      if (control.value > 0) {
        isValid = true;
      }
      return isValid ? null : { age: 'value is only whitespace' };
    };
  }
  BalanceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let isValid = false;
      if (control.value >= 0) {
        isValid = true;
      }
      return isValid ? null : { balance: 'value is only whitespace' };
    };
  }
  validateAccountNumberFromAPI(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    return timer(300).pipe(
      map((i) => {
        const isValid = this.listAccount?.find(
          (item: Account) => item.account_number === control.value
        );
        console.log(isValid);
        if (isValid) {
          return {
            accountNumberExists: true,
          };
        }
        return null;
      })
    );
  }
  validateEmailFromAPI(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    return timer(300).pipe(
      map((i) => {
        const isValid = this.listAccount?.find(
          (item: Account) => item.email === control.value
        );
        console.log(isValid);
        if (isValid) {
          return {
            emailExists: true,
          };
        }
        return null;
      })
    );
  }
}
