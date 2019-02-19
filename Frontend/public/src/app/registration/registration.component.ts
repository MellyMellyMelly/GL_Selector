import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import {ActivatedRoute, Router } from '@angular/router';
declare var $: any;
declare var AOS: any;


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  newUser: object = {first_name: '', last_name: '', email: '', password: '', confirm: '', precheck: true };
  constructor( private _httpService: HttpService , private _redirect: Router ) { }

  ngOnInit() {
    const self = this;
    console.log('Michael Strahan');
    if (this._httpService.Session.id > 0) {
      console.log(this._httpService.Session);
      this._redirect.navigate(['/dashboard']);
    }
    let section = false;
    $('.next1').on('click', function(ev) {
      ev.preventDefault();
      const preregister = self._httpService.createUser(self.newUser);
      preregister.subscribe((info: any) => {
        console.log(info);
        if (info['precheck'] === true) {
          console.log('Rick and Morty');
          self.newUser['precheck'] = false;
          if (section) {
            $('#account').removeClass('transition visible');
            $('#account').addClass('transition hidden');
          }
          $('#account').css('display', 'none');
          $('#accountS').addClass('disabled');
          $('#socialP').removeClass('disabled');
          $('#social').transition('fly right');
          $('#social button').removeClass('inverted violet');
          $('#social button').addClass('inverted blue');
          section = true;
        } else {
          console.log('Eagle');
        }
        console.log(self.newUser['precheck']);
      });
    });
    $('.prev1').on('click', function(ev) {
      self.newUser['precheck'] = true;
      console.log('Earl Sweatshirt');
      ev.preventDefault();
      $('#accountS').removeClass('disabled');
      $('#socialP').addClass('disabled');
      console.log('Birdy');
      $('#social').transition('hide');
      $('#account').transition('fly right');
    });
  $('.ui.form')
    .form({
      fields: {
        name: {
          identifier: 'name',
          rules: [
            {
              type   : 'empty',
              prompt : 'Please enter your name'
            }
          ]
        },
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
              prompt: 'Please create a password'
            }
          ]
        }
      }
    });
  }

  createUser() {
    const observable = this._httpService.createUser(this.newUser);
    observable.subscribe((data: any) => {
      console.log(data);
      this.newUser = {firstname: '', lastname: '', email: '', password: ''};
    });

  }
}
