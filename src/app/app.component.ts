import { Component } from '@angular/core';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  providers: [ScreenOrientation]
})
export class AppComponent {
  constructor(private screenOrientation: ScreenOrientation, private platform: Platform) { 
    this.initializeApp()
  }

  initializeApp() {
    if(this.platform.is('cordova')){
      this.platform.ready().then(()=>{
       this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
      })
    }
  }

}
