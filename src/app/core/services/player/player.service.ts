import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Profile } from '../../modules/player/profile';
import { environment } from '../../../../environments/environment';
import { Stats } from '../../modules/player/stats';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PlayerService {
  constructor(private httpClient: HttpClient) { }

  httpBeforLoginOptions() {
    let Options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'siteid': environment.skinId
      })
    }
    return Options
  };

  httpOptions() {
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'siteid': environment.skinId,
        'wsession': sessionStorage.getItem('wsessionDY') || ''
      })
    };
    return options;
  }

  httpOptionsBearer(token: any) {
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        // 'Authorization': `Bearer ${token}`,
        'siteid': environment.skinId,
        'wsession': sessionStorage.getItem('wsessionDY') || ''
      })
    };
    return options;
  }


  onPlayerGetProfile() {
    return this.httpClient.post<Profile>(`${environment.baseUrl}${environment.api.player.getProfile}`, {}, this.httpOptions());
  }

  onPlayerUpdateProfile(payload: any): Observable<Profile> {
    return this.httpClient.post<Profile>(`${environment.baseUrl}${environment.api.player.updateProfile}`, payload, this.httpOptions());
  }

  onPlayerUpdatePassword(payload: any): Observable<Profile> {
    return this.httpClient.post<Profile>(`${environment.baseUrl}${environment.api.player.updatePassword}`, payload, this.httpOptions());
  }

  onPlayerGetStats() {
    return this.httpClient.post<Stats>(`${environment.baseUrl}${environment.api.player.playerStats}`, {}, this.httpBeforLoginOptions());
  }

  onPlayerGetPlayerLevels(): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}${environment.api.player.playerLevels}`, {}, this.httpOptions());
  }

  onPlayerGetRemoteGameHistory(postdata: any) {
    return this.httpClient.post<any>(`${environment.baseUrl}${environment.api.history.remotegame}`, postdata, this.httpOptions());
  }

  getPlayerProviderList(postdata: any) {
    return this.httpClient.post<any>(`${environment.baseUrl}${environment.api.player.playerProviderList}`, postdata, this.httpOptions());
  }

} 
