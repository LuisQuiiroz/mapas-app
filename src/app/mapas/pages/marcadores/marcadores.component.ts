import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarcadorColor {
  color: string;
  marker?: mapboxgl.Marker;
  centro?: [number, number];
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
    .mapa-container{
      width: 100%;
      height: 100%;
    }
    .list-group{
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 99;
    }
    li{
      cursor: pointer;
    }
    `
  ]
})
export class MarcadoresComponent implements AfterViewInit {

  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 15;
  center: [number, number] = [-103.29122857273514, 20.61611944608197];

  // Arreglo de marcadores
  marcadores: MarcadorColor[] = [];

  constructor() { }

  ngAfterViewInit(): void {

    //Inicialización del mapa
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement, 
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
      });

      this.leerLocalStorage();

      // Marcadores
      // const maker = new mapboxgl.Marker()
      //   .setLngLat( this.center )
      //   .addTo( this.mapa );

      // Modificar la apariencia de los marcadores
      // const makerHtml: HTMLElement = document.createElement('div');
      // makerHtml.innerHTML = 'Usted está aquí'
      // new mapboxgl.Marker({
      //   element: makerHtml
      // })
      //   .setLngLat( this.center )
      //   .addTo( this.mapa );

  }

  agregarMarcador(){

    // Color random asignable a los marcadores
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));

    const nuevoMarcador = new mapboxgl.Marker({
      draggable: true,
      color
    })
      .setLngLat( this.center )
      .addTo( this.mapa );

      this.marcadores.push({
        color,
        marker: nuevoMarcador
      });
      // console.log('marcadores', this.marcadores);
      this.guardarMarcadoresLocalStorage();

      nuevoMarcador.on('dragend', () => {
        // console.log('drag');
        this.guardarMarcadoresLocalStorage();
      });
  }

  irMarcador( marker: mapboxgl.Marker){
    // console.log( marker );
    this.mapa.flyTo({
      center: marker.getLngLat()
    })
  }

  guardarMarcadoresLocalStorage(){
    const lngLatArr : MarcadorColor [] = [];

    this.marcadores.forEach( m => {
      
      const color = m.color;
      const { lng, lat } = m.marker!.getLngLat();

      // Obtiene la longitud y la latitud del marcador y la guarda en el arreglo de lngLatArr, esto se hace para no guardar todo el marcador con todas sus propiedades dentro del localstorage. guardando asi solo la informacion importante (longitud y latitud, el marcador se puede reconstruir con esta información)

      lngLatArr.push({
        color: color,
        centro: [lng, lat]
      });
    })

    // console.log('lngLatArr', lngLatArr);

    localStorage.setItem( 'marcadores', JSON.stringify(lngLatArr) );
  }

  leerLocalStorage(){
    if ( !localStorage.getItem('marcadores') ) {
      return;
    }

    const lngLatArr: MarcadorColor[] = JSON.parse(localStorage.getItem('marcadores')!);
    // console.log(lngLatArr);

    lngLatArr.forEach(m => {
      
      const newMarker = new mapboxgl.Marker({
        color: m.color,
        draggable: true
      })
        .setLngLat( m.centro! )
        .addTo( this.mapa );

        this.marcadores.push({
          color: m.color,
          marker: newMarker
        });

        // Listener
        newMarker.on('dragend', () => {
          // console.log('drag');
          this.guardarMarcadoresLocalStorage();
        });
    });
    // console.log(this.marcadores);

  }

  borrarMarcador( i: number){
    // console.log('Borrando marcador');

    // Borrar el marcador del mapa
    this.marcadores[i].marker?.remove();
    //Borrar el marcador del arreglo de marcadores
    this.marcadores.splice(i, 1);
    // guardar marcadores
    this.guardarMarcadoresLocalStorage();
  }
}
