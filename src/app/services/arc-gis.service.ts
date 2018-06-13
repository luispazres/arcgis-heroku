import { Injectable } from '@angular/core';
import { EsriLoaderService } from 'angular2-esri-loader';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

@Injectable()
export class ArcGisService {

  constructor( private esriLoader:EsriLoaderService, private http: HttpClient) { }

  generateToken(){
    this.esriLoader.load({
    }).then(() => {
      this.esriLoader.loadModules([
      "dojo/domReady!",
      "esri/request",
      "esri/config",
      "esri/identity/IdentityManager",
      ])
        .then(([dom, request, esriConfig, esriId]) => {

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

            return response.data.token;
          });

        });
    });
  }

}
