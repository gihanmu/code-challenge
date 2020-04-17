import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, Inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { Observable, fromEvent } from 'rxjs';
import {map, tap, filter, debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import { User } from '../models/user.model';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import Swal from 'sweetalert2';




export interface DialogData {
  animal: string;
  name: string;
}
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  public displayedColumns: string[] = [ 'name', 'dateOfBirth', 'email', 'status', 'hourlyRate', 'actions'];

  public users$: Observable<User[]>;
  public addUserForm: FormGroup;
  public editUserForm: FormGroup;


  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {
    this.addUserForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      status: ['', [Validators.required]],
      hourlyRate: ['', [Validators.required]]
  });
   }

  ngOnInit() {
    this.getUsers();
    this.addUserForm.valueChanges
    .pipe(
        filter(() => this.addUserForm.valid),
        debounceTime(2000),
        distinctUntilChanged(),
        switchMap(changes => this.userService.createUser$(changes))
    ).subscribe(res => this.getUsers());
  }


  getUsers(){
    this.users$ = this.userService.getUsers$().pipe(
      map(users => {
        return users.map(user => {
          const modifiedUser = {... user};
          modifiedUser.hourlyRate = !modifiedUser.hourlyRate ? 0 : modifiedUser.hourlyRate;
          modifiedUser.dateOfBirth = new Date(modifiedUser.dateOfBirth).toDateString();
          return modifiedUser;
        });
      })
    );
  }
  editUser(user: User){
    const dialogRef = this.dialog.open(UserDialog, {
      width: '400px',
      data: {user}
    });

    dialogRef.afterClosed().subscribe(result => {
        this.userService.updateUser$(user.id, result).subscribe(res => {
          this.getUsers();
        });
    });
  }

  deleteUser(id: number){
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.userService.deleteUser$(id).subscribe(res => {
          Swal.fire(
            'Deleted!',
            'User has been deleted.',
            'success'
          );
          this.getUsers();
        });
      }
    });
  }


}



/**
 * User Dialog
 */
@Component({
  selector: 'app-user-dialog',
  templateUrl: 'user-dialog.html'
 
})
export class UserDialog {

  constructor(
    public dialogRef: MatDialogRef<UserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
