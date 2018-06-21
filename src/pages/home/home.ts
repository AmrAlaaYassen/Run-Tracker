
import { MapComponent } from './../../components/map/map';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform, AlertController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
import {filter} from 'rxjs/operators';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',

})
export class HomePage {


  @ViewChild('map') mapElement:ElementRef;

  map:any;
  currentMapTrack = null ;
  isTracking = false;
  trackedRoute=[];
  perviousTricks = [];

  positionSubscription:Subscription;


  constructor(public navCtrl: NavController , private plt:Platform , private geolocation:Geolocation,private storage:Storage,
  private alertCtrl:AlertController) {

  }

  ionViewDidLoad(){
    this.plt.ready().then(()=>{
      this.loadHistoryRoutes();

      let mapOptions = {
        zoom : 13,
        mapTypeId : google.maps.MapTypeId.ROADMAP,
        mapTypeControl:false,
        streetViewControl:false,
        fullScreenControl:false
      };
      this.map = new google.maps.Map(this.mapElement.nativeElement,mapOptions);

      this.geolocation.getCurrentPosition().then(pos=>{
        let latLng = new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude);
        this.map.setCenter(latLng);
        this.map.setZoom(15);
      })
    });
  }

  loadHistoryRoutes(){
     this.storage.get('routes').then(data =>{
      this.perviousTricks = data;

     });
  }

  startTracking () {
    this.isTracking = true;
    this.trackedRoute = [] ;

    this.positionSubscription= this.geolocation.watchPosition().pipe(filter(p=>p.coords !== undefined))
    .subscribe(data => {

      setTimeout(()=>{
        this.trackedRoute.push({lat:data.coords.latitude , lng:data.coords.longitude});
        this.redrawPath(this.trackedRoute);
      });

    });
  }

  redrawPath(path) {
      if(this.currentMapTrack){
        this.currentMapTrack.setMap(null);
      }

      if(path.length>1) {
        this.currentMapTrack = new google.maps.Polyline( {
          path:path,
          geodesic:true,
          strokeColor:'#ff00ff',
          strokeOpacity:1.0,
          strokeWeight:3
        });

        this.currentMapTrack.setMap(this.map);
      }
  }

  stopTracking(){
    let newRoute = {finished : new Date().getTime , path:this.trackedRoute};
    this.perviousTricks.push(newRoute);
    this.storage.set('routes',this.perviousTricks);

    this.isTracking = false ;
    this.positionSubscription.unsubscribe();
    this.currentMapTrack.setMap(null);
  }


  showHistoryRoute(route) {
    this.redrawPath(route);
  }

}
