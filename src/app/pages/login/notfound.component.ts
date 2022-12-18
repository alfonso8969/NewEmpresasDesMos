import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-notFound',
  template: './notFound.component.html',
  styleUrls: ['./notFound.component.css']
})
export class NotFoundComponent implements OnInit {

  path: string;
  content: string;

  constructor(private route: ActivatedRoute) {
    this.content = '/login';
   }

  ngOnInit() {
    this.route.data.pipe(take(1))
      .subscribe({
        next: (data: any) => {
          this.path = data.path;
        }
      });
  }

}
