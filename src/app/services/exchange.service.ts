import { Injectable } from '@angular/core';
import { OverlayRecognition } from '../interfaces/overlay_recognition';
import { UserResult } from '../interfaces/user_result';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {
  private image_URL: string = "";
  private image_ID: number = 0;
  private projectID: number = 0;
    
  private results: any[] = [];

  private user_results: UserResult[] = [];

  constructor(private http: HttpClient) {}

  //returns the stored image URL
  getURL(): any
  {
    return this.image_URL;
  }

  //takes an URL and stores it
  setImage(newURL: string, newImageID: number, newProjectID: number): void
  {
    this.image_URL = newURL;
    this.image_ID = newImageID;
    this.projectID = newProjectID;
  }

  //returns the results data
  getResult(): any[]
  {
    return this.results;
  }

  //takes an array of 'OverlayRecognition' Items and stores the required Data in an array
  setResult(newResults: OverlayRecognition[]): void
  {
    this.results = [];
    for(var i: number = 0; i < newResults.length; i++)
    {
      var left: number = newResults[i].bbox_xyxy_abs[0];
      var top: number = newResults[i].bbox_xyxy_abs[1];
      var width: number = (newResults[i].bbox_xyxy_abs[2] - newResults[i].bbox_xyxy_abs[0]);
      var height: number = (newResults[i].bbox_xyxy_abs[3] - newResults[i].bbox_xyxy_abs[1]);
      var text: string = newResults[i].text;
      var display: boolean = true;

      this.results.push([left, top, width, height, text, display]);
    }
  }


  /*takes an array of arrays of the form [number, number, number, number, string, boolean]
    and stores the required Data in an array
  */
  saveUserResult(newUserResults: any[])
  {
    this.user_results = [];
    for(var i: number = 0; i < newUserResults.length; i++)
    {
      
      if(newUserResults[i][5])
      {
        var tempX = newUserResults[i][0] + newUserResults[i][2];
        var tempY = newUserResults[i][1] + newUserResults[i][3];

        var tempResult = <UserResult>{text: newUserResults[i][4], 
                                       bbox_xyxy_abs: [newUserResults[i][0],
                                                       newUserResults[i][1],
                                                       tempX,
                                                       tempY]
                                      }
        this.user_results.push(tempResult);
      }
    }
    console.log(this.user_results);
    /*
    Example Implementation of how to insert into the given project, once API-endpoints are available

    const url = '/store/projects'
    return this.http.patch(`${url}/${this.projectID}/images/${this.image_ID}/user_result`, this.user_results)
    */
  }
}
