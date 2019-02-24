import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import {ActivatedRoute, Router } from '@angular/router';
import { e } from '@angular/core/src/render3';
declare var $: any;
declare var AOS: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  User: object = { first_name: '', last_name: '', email: '', created: '' };
  send: boolean;
  constructor( private _httpService: HttpService , private _redirect: Router , private _route: ActivatedRoute ) { }

  ngOnInit() {
    const observable = this._httpService.check();
    observable.subscribe(data => {
      if (data['token'] === 0) {
        this._redirect.navigate(['/login']);
      } else {
        this.send = true;
        const retrieve = this._httpService.retrieve(data['token']);
        retrieve.subscribe((letter) => {
          this.User = letter;
          console.log(letter);
        });
      }
    });
    $('.camera').css('display', 'none');
    $('.newpic').on('click', function(ev) {
      ev.preventDefault();
        $('#main').fadeOut(400, function() {
          $('.camera').fadeIn(400, function() {
        });
      });
    });
    $('#back').on('click', function(ev) {
      ev.preventDefault();
      $('.camera').fadeOut(400, function() {
        $('#main').fadeIn(400, function() {
        });
      });
    });
    AOS.init();
  }

  Logout() {
    const observable = this._httpService.logout();
    observable.subscribe((data) => {
      console.log(data);
      this._redirect.navigate(['/login']);
    });
  }

}
