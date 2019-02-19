import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import {ActivatedRoute, Router} from '@angular/router';

declare var $: any;
declare var AOS: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
User: object = { email: '', password: '' };
  constructor( private _httpService: HttpService, private _redirect: Router, private _route: ActivatedRoute) { }

  ngOnInit() {
    // const observable = this._httpService.check();
    // observable.subscribe((data: any) => {
    //   console.log(data);
    //   if (data['logged_in'] === true) {
    //     this._redirect.navigate(['/dashboard']);
    //   }
    // });
    if (this._httpService.Session.id > 0) {
      this._redirect.navigate(['/dashboard']);
    }
    this._httpService.check();
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
    console.log('Adventure');
    const observable = this._httpService.loginUser(this.User);
    observable.subscribe((data: any) => {
      console.log(data);
      if (data['success'] === 'success') {
        // this._httpService.Session =
        this._httpService.Session = data;
        this._redirect.navigate(['/dashboard']);
      } else {
        this.User = {email: '', password: ''};
      }
    });
  }

}
