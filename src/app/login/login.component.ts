import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from '../shared/services/user.service';
import { Errors } from '../shared/models/error.model';

import { JwtService } from '../shared/services/jwt.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  errors: Errors = new Errors();
  isSubmitting = false;
  loginForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private jwtService: JwtService
  ) {
    this.loginForm = this.fb.group({
      'username': ['', [Validators.required, Validators.minLength(3)]],
      'password': ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit() {
    if (this.jwtService.getToken()) {
      this.router.navigate(['/trabajar-con-vendedores']);
    }
  }

  submitForm() {

    // if (this.loginForm.valid) {
      this.isSubmitting = true;
      this.errors = new Errors();
      const credentials = this.loginForm.value;

      this.userService
        .attemptAuth(credentials)
        .subscribe(
          data => this.router.navigateByUrl('/trabajar-con-vendedores'),
          err => {
            this.errors = err;
            this.isSubmitting = false;
          }
      );
    // }



  }
}
