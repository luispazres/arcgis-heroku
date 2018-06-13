import { Component, OnInit, ElementRef } from '@angular/core';
import { EsriLoaderService } from 'angular2-esri-loader';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { ArcGisService } from '../../../services/arc-gis.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  map: any;
  view: any;
  //datos_mapa: any;

  constructor(private elRef:ElementRef, private esriLoader:EsriLoaderService, private http: HttpClient, private _arcGis: ArcGisService) { }

  ngOnInit() {

    this.esriLoader.load({
    }).then(() => {
      this.esriLoader.loadModules(['esri/Map',"esri/views/MapView",
      "esri/WebMap",
      "dojo/domReady!",
      "esri/request",
      "esri/config",
      "esri/layers/FeatureLayer",
      "esri/identity/IdentityManager",
      "esri/widgets/ScaleBar",
      "esri/widgets/Legend",
      "esri/widgets/Expand",
      "esri/widgets/BasemapGallery",
      "esri/widgets/Home"])
        .then(([Map ,MapView, WebMap, dom, request, esriConfig, FeatureLayer, esriId, ScaleBar, Legend,
        Expand, BasemapGallery, Home]) => {

          esriConfig.request.corsEnabledServers.push("https://igsa.me/arcgis/tokens/");

          request("https://igsa.me/arcgis/tokens/",{
            method: "post",
            query:{
              f:"json",
              username: 'lpaz',
              password: 'lpaz',
              referer: 'https://igsa.me/arcgis/rest/services/Pruebas/NegociosHNnv2/FeatureServer/0'
            }
          }).then(response => {

            console.log(response.data.token);

            var registerToken = esriId.registerToken({
              server: "https://igsa.me/arcgis/rest/services/Pruebas/NegociosHNnv2/FeatureServer/0",
              username: "lpaz",
              token: response.data.token,
              expires: response.data.expires,
              ssl: false
            });

          /*  this.map = new Map({
               basemap: "streets",
               ground: "world-elevation"
            });

            var fl = new FeatureLayer({
               url: "https://igsa.me/arcgis/rest/services/Pruebas/NegociosHN2/MapServer/0",
               token: response.data.token
             });

             this.map.add(fl);*/

            this.map = new WebMap({
              portalItem: { // autocasts as new PortalItem()
                //id: "b1712739bd2047d3a830e9aeb0246a64",
                id: "f8a1fc4269ae4465a2b07b6b66d53681",
                token: response.data.token
              }
            });

            /************************************************************
             * Set the WebMap instance to the map property in a MapView.
             ************************************************************/
            var view = new MapView({
              map: this.map,
              container: this.elRef.nativeElement.firstChild
            });

            // Widgets
          /*  var basemapGallery = new BasemapGallery({
              view: view
            });
            // Add widget to the top right corner of the view
            view.ui.add(basemapGallery, {
              position: "top-right"
            });*/

            var homeWidget = new Home({
              view: view
            });

            // adds the home widget to the top left corner of the MapView
            view.ui.add(homeWidget, "top-left");

            const basemapGallery = new Expand({
              content: new BasemapGallery({
                view: view,
                style: "classic" // other styles include 'classic'
              }),
              view: view,
              expanded: false
            });
            view.ui.add(basemapGallery, "top-right");

            const legend = new Expand({
              content: new Legend({
                view: view,
                style: "classic" // other styles include 'classic'
              }),
              view: view,
              expanded: false
            });
            view.ui.add(legend, "top-right");

            var scaleBar = new ScaleBar({
              view: view,
              style: "card"
            });
            // Add widget to the bottom left corner of the view
            view.ui.add(scaleBar, {
              position: "bottom-left"
            });

            return response.data.token;
          });



          /*var registerToken = esriId.registerToken({
            server: "https://igsa.me/arcgis/rest/services/Pruebas/NegociosHN2/MapServer/0",
            username: "lpaz",
            token: token.token,
            expires: token.expires,
            ssl: false
          });

          console.log(registerToken);*/

        });
    });
  }

}
