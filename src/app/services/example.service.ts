import { Injectable, OnInit } from '@angular/core';
import { FeathersService } from '../shared/feathers.service';


interface JobModel {
  id?: number;
  title: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExampleService {

  constructor(
    private feathers: FeathersService
  ) {}

 
}
