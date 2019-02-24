import { Component, OnInit } from '@angular/core';
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
  show: boolean;
  send: boolean;
  res_img = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

  constructor() { }

  ngOnInit() {
    this.show = true;
    this.send = false;
    $('.body').hide();
    $('#demo').click(function () {
      console.log('Take Care');
      const rate = 700;
      if (!this.show) {
        $('.body').slideDown(rate);
      } else {
        $('.body').slideUp(rate);
      }
      this.show = !this.show;
    });
  }
}
