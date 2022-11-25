import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompaniesService } from '../services/companies.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {

  private currentRouter: string;
  constructor(public companiesService: CompaniesService, private _router: Router) {
    this.currentRouter = this._router.url;
  }

  ngOnInit(): void {
  }


  reLoad() {
    this._router.navigate([this.currentRouter]);
  }

  logout() {
    this._router.navigateByUrl('/login')
  }
}
