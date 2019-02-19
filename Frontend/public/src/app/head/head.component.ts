import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
declare var $: any;
declare var AOS: any;

@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.css']
})
export class HeadComponent implements OnInit {
  play = false;
  src_img = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  errors = null;
  face_shape = null;
  Object = Object;
  res_img = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

  constructor(private _httpService: HttpService) { }

  ngOnInit() {
    let show = false;
    $('.body').hide();
    $('#demo').click(function () {
      const rate = 700;
      if (!show) {
        $('.body').slideDown(rate);
      } else {
        $('.body').slideUp(rate);
      }
      show = !show;
    });
  }
}
