import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
declare var $: any;


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  User: object = {first_name: '', last_name: '', email: '', password: '', confirm: '' };
  inputs = { send: true, component: 'register', User: null };
  constructor( private _httpService: HttpService , private _redirect: Router ) { }

  ngOnInit() {
    const observable = this._httpService.check();
    observable.subscribe(data => {
      if (data['token'] > 0) {
        this._redirect.navigate(['/dashboard']);
      }
    });
    const self = this;
    let section = false;
    function action() {
      const preregister = self._httpService.createUser(self.User);
      preregister.subscribe((info: any) => {
        console.log(info);
        if (info['success'] === true) {
          console.log('Rick and Morty');
          self.inputs.User = self.User;
          console.log(self.inputs);
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
          $('.next1').attr('disabled', false);
        }
      });
    }
    $('#signup-form').on('submit', function(ev) {
      $('.next1').attr('disabled', true);
      ev.preventDefault();
      action();
    });
    $('.prev1').on('click', function(ev) {
      $('.next1').attr('disabled', false);
      self.User['precheck'] = true;
      ev.preventDefault();
      $('#accountS').removeClass('disabled');
      $('#socialP').addClass('disabled');
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
    const preregister = this._httpService.createUser(this.User);
    preregister.subscribe((info: any) => {
      if (info['precheck'] === true) {
        this.inputs.User = this.User;
      }
    });
  }
}
