import { Component, OnInit } from '@angular/core';
import '../assets/css/styles.css';
import '../../node_modules/primeng/resources/themes/omega/theme.css';
import '../../node_modules/primeng/resources/primeng.min.css';
import '../../node_modules/font-awesome/css/font-awesome.min.css';

import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'learn-english-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

    private hasActiveRoute: boolean = false;

    constructor(
        private router: Router, private activatedRoute: ActivatedRoute) { }

    ngOnInit(): void {
        this.activatedRoute.url.subscribe(url => { this.hasActiveRoute = true; console.log(url); });
        console.log(this.router.url);
    }

    ngOnChange() {
        this.activatedRoute.url.subscribe(url => { this.hasActiveRoute = true; console.log(url); });
        console.log(this.router.url);
    }

    interrogate(key): void {
        this.router.navigate(['/test', key]);
    }

}
