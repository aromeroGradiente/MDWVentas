import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  loggedIn = false;

  constructor(
    private userService: UserService
  ) {
  }

  ngOnInit() {
    this.userService.isAuthenticated.subscribe(
        (isLogged) => {
          this.loggedIn = isLogged;
        }
    );
  }

}
