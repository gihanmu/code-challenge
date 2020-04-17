import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user/user.component';
import { JobComponent } from './job/job.component';


const routes: Routes = [
  {path: '', redirectTo: 'users', pathMatch : 'full'},
  {path: 'users' , component: UserComponent},
  {path: 'jobs' , component: JobComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
