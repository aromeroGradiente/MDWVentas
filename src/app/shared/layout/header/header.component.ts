import { Component, OnInit } from '@angular/core';


import { UserService } from '../../services/user.service';
import { JwtService } from '../../services/jwt.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  loggedIn = false;

  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {
  }

  ngOnInit() {
    console.log('asd');
    // this.userService.isAuthenticated.subscribe(
    //     (isLogged) => {
    //       console.log('logueado', isLogged);
    //       this.loggedIn = isLogged;
    //     }
    // );
    if (this.jwtService.getToken()) {
      this.loggedIn = true;
    }
  }

}
