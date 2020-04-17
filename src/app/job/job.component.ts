import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Job } from '../models/job.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { JobService } from '../services/job.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { filter, debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss']
})
export class JobComponent implements OnInit {
  public displayedColumns: string[] = [ 'title', 'description', 'actions'];

  public jobs$: Observable<Job[]>;
  public addJobForm: FormGroup;



  constructor(
    private jobService: JobService,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {
    this.addJobForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]]
  });
   }

  ngOnInit() {
    this.getJobs();
    this.addJobForm.valueChanges
    .pipe(
        filter(() => this.addJobForm.valid),
        debounceTime(2000),
        distinctUntilChanged(),
        switchMap(changes => this.jobService.createJob$(changes))
    ).subscribe(res => this.getJobs());
  }


  getJobs(){
    this.jobs$ = this.jobService.getJobs$();
  }

  editJob(job: Job){
    const dialogRef = this.dialog.open(JobUpdateDialog, {
      width: '400px',
      data: {job}
    });

    dialogRef.afterClosed().subscribe(result => {
        this.jobService.updateJob$(job.id, result).subscribe(res => {
          this.getJobs();
        });
    });
  }

  deleteJob(id: number){
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
        this.jobService.deleteJob$(id).subscribe(res => {
          Swal.fire(
            'Deleted!',
            'Job has been deleted.',
            'success'
          );
          this.getJobs();
        });
      }
    });
  }


}



/**
 * User Dialog
 */
@Component({
  selector: 'app-job-update-dialog',
  templateUrl: 'job-update-dialog.html'
 
})
export class JobUpdateDialog {

  constructor(
    public dialogRef: MatDialogRef<JobUpdateDialog>,
    @Inject(MAT_DIALOG_DATA) public data: JobUpdateDialog) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
