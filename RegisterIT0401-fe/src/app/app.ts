import { Component, signal } from '@angular/core';
import { UserManagementComponent } from './components/user-management/user-management.component';

@Component({
  selector: 'app-root',
  imports: [UserManagementComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('RegisterIT0401-fe');
}

