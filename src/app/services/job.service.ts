import { Injectable } from '@angular/core';
import { FeathersService } from '../shared/feathers.service';
import { Job } from '../models/job.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  private jobService;
  constructor(
    private feathers: FeathersService
  ) {
    this.jobService = this.feathers.createService<Job>('job');
   }

  public  getJobs$(): Observable<Job[]> {
    return Observable.create(observer => {
      this.jobService.find().then(res => {
        return res.data;
      })
      .then(res => {
        observer.next(res);
        observer.complete();
      }).catch(err => {
        observer.error(err);
      });
    });
  }



  public createJob$(jobData: Job):  Observable<Job> {
    return Observable.create(observer => {
      this.jobService.create(jobData).then(res => {
        return res.data;
      })
      .then(res => {
        observer.next(res);
        observer.complete();
      }).catch(err => {
        observer.error(err);
      });
    });
  }

  public updateJob$(id: number, jobData: Job):  Observable<Job> {
    return Observable.create(observer => {
      this.jobService.update(id, jobData).then(res => {
        return res.data;
      })
      .then(res => {
        observer.next(res);
        observer.complete();
      }).catch(err => {
        observer.error(err);
      });
    });
  }

  public deleteJob$(id: number):  Observable<Job> {
    return Observable.create(observer => {
      this.jobService.remove(id).then(res => {
        return res.data;
      })
      .then(res => {
        observer.next(res);
        observer.complete();
      }).catch(err => {
        observer.error(err);
      });
    });
  }
}
