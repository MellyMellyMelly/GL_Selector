import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor( private _http: HttpClient) {

  }

  Session = {id: 0, first_name: '', last_name: '', email: '', created: '' };

  logout() {
    this.Session.id = 0;
    this.Session.first_name = '';
    this.Session.last_name = '';
    this.Session.email = '';
    this.Session.created = '';
  }

  check() {
    console.log(this.Session);
  }

  createUser(userObj) {
    console.log('in server createUser', userObj);
    return this._http.post('http://localhost:8000/register', userObj);
  }

  loginUser(userObj) {
    console.log('in server loginUser', userObj);
    return this._http.post('http://localhost:8000/login', userObj);
  }

  sendImage(imgObject) {
    return this._http.post('http://localhost:8000/capture', imgObject);
  }
}

