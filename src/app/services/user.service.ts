import { Injectable } from '@angular/core';
import { FeathersService } from '../shared/feathers.service';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userService;
  constructor(
    private feathers: FeathersService
  ) {
    this.userService = this.feathers.createService<User>('user');
   }

  public  getUsers$(): Observable<User[]> {
    return Observable.create(observer => {
      this.userService.find().then(res => {
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

  public getUser$(id: number): Observable<User> {
    return Observable.create(observer => {
      this.userService.get(id).then(res => {
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

  public createUser$(userData: User):  Observable<User> {
    return Observable.create(observer => {
      this.userService.create(userData).then(res => {
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

  public updateUser$(id: number, userData: User):  Observable<User> {
    return Observable.create(observer => {
      this.userService.update(id, userData).then(res => {
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

  public deleteUser$(id: number):  Observable<User> {
    return Observable.create(observer => {
      this.userService.remove(id).then(res => {
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
