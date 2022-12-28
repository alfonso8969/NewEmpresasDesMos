import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/class/users';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-help-support',
  templateUrl: './help-support.component.html',
  styleUrls: ['./help-support.component.css']
})
export class HelpSupportComponent implements OnInit {

  user: User;
  
  constructor(private userService: UsersService) {
    this.user = this.userService.getUserLogged();
   }

  ngOnInit(): void { 
  }

}
