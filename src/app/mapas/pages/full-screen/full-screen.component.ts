import { Component, OnInit } from '@angular/core';
import * as mapboxgl  from 'mapbox-gl';

@Component({
  selector: 'app-full-screen',
  templateUrl: './full-screen.component.html',
  styles: [
    `
    #mapa{
      width: 100%;
      height: 100%;
    }
    `
  ]
})
export class FullScreenComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // (mapboxgl as any).accessToken = environment.mapboxToken; // se movio al appComponent
    var map = new mapboxgl.Map({
    container: 'mapa',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-103.29122857273514, 20.61611944608197],
    zoom: 15
    });
  }

}
