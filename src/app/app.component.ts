import { Component } from '@angular/core';

@Component({
    selector: 'learn-english-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

    /*stringifiedParams = queryString.stringify({
        client_id: '423949024920-kl1emj9rbq5753ht3h6qqrlub0u054pq.apps.googleusercontent.com',
        redirect_uri: 'http://localhost/authenticate/google',
        scope: [
          'https://www.googleapis.com/auth/userinfo.email',
        ].join(' '), // space seperated string
        response_type: 'code',
        access_type: 'offline',
        prompt: 'consent',
      });

      googleLoginUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' + this.stringifiedParams;*/
}
