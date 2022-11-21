import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompaniesService } from '../services/companies.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {

  constructor(public companiesService: CompaniesService,
    private router: Router) {

   }

  ngOnInit(): void {
  }

  logout() {
    this.router.navigateByUrl('/login')
  }
}
