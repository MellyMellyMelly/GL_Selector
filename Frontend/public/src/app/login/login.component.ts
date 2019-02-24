import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';

declare var $: any;
declare var AOS: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  send: boolean;
  User: object = { email: '', password: '' };
  error: string;
  constructor( private _httpService: HttpService, private _redirect: Router ) { }

  ngOnInit() {
    this.send = true;
    const observable = this._httpService.check();
    observable.subscribe(data => {
      if (data['token'] > 0) {
        this._redirect.navigate(['/dashboard']);
      }
    });
    AOS.init();
    $('.ui.form')
      .form({
        fields: {
          email: {
            identifier: 'email',
            rules: [
              {
                type   : 'empty',
                prompt : 'Please enter your email'
              }
            ]
          },
          password: {
            identifier: 'password',
            rules: [
              {
                type: 'empty',
                prompt: 'Please enter your password'
              }
            ]
          }
        }
    });
  }
  loginUser() {
    const observable = this._httpService.loginUser(this.User);
    observable.subscribe((data: any) => {
      if (data['success'] === 'success') {
        const mario = this._httpService.loginPost(data['id']);
        mario.subscribe(() => {
          this._redirect.navigate(['/dashboard']);
        });
      } else {
        this.error = data['success'];
      }
    });
  }

}
