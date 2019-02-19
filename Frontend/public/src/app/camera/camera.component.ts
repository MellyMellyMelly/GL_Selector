import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
declare var $: any;
declare var AOS: any;

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent implements OnInit {
  play = false;
  src_img: string;
  errors = null;
  face_shape = null;
  Object = Object;
  res_img: string;
  lebron = 0;

  constructor(private _httpService: HttpService, private _redirect: Router) { }

  ngOnInit() {
    console.log('Eric Cartman');
    AOS.init();
    const self = this;
    $('#take-picture').hide();
    $('#send').hide();
    $('#keep').hide();
    $('#cam').click(function () {
      // use MediaDevices API
      // docs: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
      if (navigator.mediaDevices) {
        console.log(navigator.mediaDevices);
        // access the web cam
        navigator.mediaDevices.getUserMedia({ video: true })
          // permission granted:
          .then(function (stream) {
            $('#take-picture').toggle();
            $(this).toggleClass('start');
            $('#cam i').toggleClass('play stop');
            video.srcObject = stream;
            const take_picture = document.getElementById('take-picture');
            take_picture.addEventListener('click', takeSnapshot);
            if (self.play) {
              stream.getTracks().forEach(track => track.stop());
              video.srcObject = null;
            }
            self.play = !self.play;
          })
          // permission denied:
          .catch(function (error) {
            document.body.textContent = 'Could not access the camera. Error: ' + error.name;
          });
      }

      function takeSnapshot() {
        let img: any;
        img = document.getElementById('capture');
        let context;
        const width = video.offsetWidth
          , height = video.offsetHeight;

        canvas = canvas || document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, width, height);
        self.src_img = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
        self.src_img = canvas.toDataURL('image/png');
        // console.log(self.src_img);
        const str = self.src_img;
        const newstr = str.substring(22);
        $('#send').show();
        // console.log(newstr);
      }
    });
    let video: any;
    video = document.querySelector('#videoElement');
    let canvas: any;
    $('#take-picture').on('click', function(ev) {
      ev.preventDefault();
      console.log('Fuck Tyler');
    });
    $('#send').on('click', function(ev) {
      ev.preventDefault();
      console.log('I hate this');
      self.sendImageFromService();
    });
    $('.fart').modal('attach events', '#close', 'hide');
    $('.fart').modal('attach events', '#send', 'show');
    $('#send').click(function () {
    });
    $('#close').click(function () {
    });
  }

  sendImageFromService() {
    const newstr = this.src_img.substring(22);
    console.log('cudder');
    const tempObservable = this._httpService.sendImage({demo: true, img_data: newstr});
    tempObservable.subscribe((res: any) => {
      // console.log('this is the error', res.error);
      this.res_img = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
      this.res_img = 'data:image/jpeg;base64,' + res.image;
      // console.log(this.src_img);
      if (Object.keys(res.error).length !== 0) {
        // console.log('response error', res.error);
        this.errors = res.error;
        this.face_shape = null;
        // console.log('there are some errors');
      } else {
        this.errors = null;
        this.face_shape = res.shape;
        // console.log('in if', res.shape);
        // console.log('no errors');
      }
    });
  }

  TestFunction() {
    this.lebron += 1000;
    console.log(this.lebron);
  }
}
