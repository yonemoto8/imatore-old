import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  GoogleMapsAnimation,
  MyLocation
} from '@ionic-native/google-maps';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  map: GoogleMap;

  // このHomePageクラスが作成されるときに実行され
  constructor(private platform: Platform) {}

  // ngOnInitは、AngularJSの準備が完了したら実行される
  async ngOnInit() {

    // Apache Cordovaから 'deviceready'イベントが発行されるのを待つ
    await this.platform.ready();

    // platform.ready()が完了したら、地図を作成する
    await this.loadMap();
  }

  async loadMap() {

    // Googleマップを作成
    this.map = GoogleMaps.create('map_canvas', {
      camera: {
        target: {
          lat: 33.5920561,
          lng: 130.40209199999998
        },
        zoom: 18,
        tilt: 30
      }
    });

  }

  // ボタンが押された時の処理
  onButtonClick() {

    // 現在位置を取得
    this.map.getMyLocation().then((location: MyLocation) => {
      // アニメーションで指定の位置にズームイン
      this.map.animateCamera({
        target: location.latLng,
        zoom: 17,
        tilt: 30
      });

      // アニメーションが終了したらマーカーを追加
      const marker: Marker = this.map.addMarkerSync({
        title: '@ionic-native/google-maps plugin!',
        snippet: 'This plugin is awesome!',
        position: location.latLng,
        animation: GoogleMapsAnimation.BOUNCE
      });

      // 情報ウィンドウの表示
      marker.showInfoWindow();

      // もし情報ウィンドウがクリックされたら、アラートを表示
      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        alert('clicked!');
      });
    })
    .catch(err => {
      // getMyLocationでエラーが発生したら、メッセージを表示
      alert(err.error_message);
    });
  }
}
