import { Component, OnInit } from '@angular/core';

import { User, UserService, ArticlesService, SessionSet } from '../../core';

@Component({
  selector: 'app-layout-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  constructor(
    private userService: UserService,
    private articleService: ArticlesService
  ) {}

  currentUser: User;
  currentSessionSet: SessionSet;

  ngOnInit() {
    this.userService.currentUser.subscribe(
      (userData) => {
        this.currentUser = userData;
      }
    );

    this.articleService.sessionSet.subscribe(
      (sessionSetData) => {
        this.currentSessionSet = sessionSetData;
      }
    )
  }
}
