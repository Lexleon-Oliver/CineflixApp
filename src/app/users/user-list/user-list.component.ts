import { User } from './../user';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  @Input() users: User[] = [];
  @Input() edit = false;

  constructor() { }

  ngOnInit(): void {
  }

}
