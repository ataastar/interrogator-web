import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Directive({
  selector: '[HasRole]'
})
export class HasRole implements OnInit {

  @Input() role: string;

  constructor(private elementRef: ElementRef, private authService: AuthService) {
  }

  ngOnInit() {
    this.checkAccess();
  }

  checkAccess() {
    if (!this.authService.hasRole(this.role)) {
      this.elementRef.nativeElement.style.display = "none";
    }
  }
}
