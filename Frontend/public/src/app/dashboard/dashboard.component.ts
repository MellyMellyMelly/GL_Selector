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
  constructor( private _httpService: HttpService , private _redirect: Router , private _route: ActivatedRoute ) { }

  ngOnInit() {
    if (this._httpService.Session.id === 0) {
      this._redirect.navigate(['/login']);
    }
    this.User = this._httpService.Session;
    $('.camera').css('display', 'none');
    $('.newpic').on('click', function(ev) {
      ev.preventDefault();
        $('#main').fadeOut(400, function() {
          console.log('You a real wavy dude');
          $('.camera').fadeIn(400, function() {
        });
      });
    });
    $('#back').on('click', function(ev) {
      ev.preventDefault();
        $('.camera').fadeOut(400, function() {
          console.log('Earl Sweatshirt');
        $('#main').fadeIn(400, function() {
        });
      });
    });
    AOS.init();
  }

  Logout() {
    this._httpService.logout();
    this._redirect.navigate(['/login']);
  }

}
