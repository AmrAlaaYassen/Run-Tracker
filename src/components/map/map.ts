import { Component,OnInit, ViewChild } from '@angular/core';


/**
 * Generated class for the MapComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */

declare var google;
@Component({
  selector: 'map',
  templateUrl: 'map.html'
})
export class MapComponent {



  @ViewChild("map") mapElement;
  public map:any;

  constructor() {
  }

 ngOnInit(){
    this.createMap() ;
 }

  createMap(){
    let location=new google.maps.LatLng(45,100);
    let mapOptions = {
      center:location,
      zoom:15,
      mapTypeID : google.maps.MapTypeId.ROADMAP,
      disableDefaultUI:true
    };


    let map = new google.maps.Map(this.mapElement.nativeElement,mapOptions);
    return map;
  }

}
