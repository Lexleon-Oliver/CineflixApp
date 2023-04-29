import { User } from './../../users/user';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HostListener } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService} from 'src/app/services/app.service';
import { UserInMainService } from '../../services/user-in-main.service';
import { WindowScrollService } from '../../services/window-scroll.service';

@Component({
  selector: 'app-nav-bar-main',
  templateUrl: './nav-bar-main.component.html',
  styleUrls: ['./nav-bar-main.component.scss']
})
export class NavBarMainComponent implements OnInit {
  searchInput: string;
  showSearch = false;
  selectedMenu: string;
  screenHeight: number;
  screenWidth: number;
  scrollY$: Observable<number>;
  userLogged: User;
  navBackground = false;
  navButtons = {
    profileButtons:[
      {text: 'Conta', route:'', checked:""},
      {text: 'Centro de ajuda', route:'', checked:""},
      {text: 'Sair da Netflix', route:'', checked:""},
    ],
    mainButtons:[
      {text: 'Início', route:'/main/:id', checked:""},
      {text: 'Séries', route:'/series', checked:''},
      {text: 'Filmes', route:'/filmes', checked:''},
      
    ]
  }

  @Output() onSearch = new EventEmitter<string>();
  @Output() onMenuChange = new EventEmitter<string>();

  constructor(private userService:UserInMainService, private route: Router, 
    private scrollService: WindowScrollService, private rotaAtiva: ActivatedRoute) { 
    this.userLoggedIn()
    this.getScreenSize();
    this.scrollY$ = this.scrollService.scrollY$;
  }

  @HostListener('window:scroll', ['$event']) 
  onScroll(e: Event): void {
    this.scrollService.scrollY.next(this.getYPosition(e));
  }
  
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  getYPosition(e: Event): number {
    return (e.target as Element).scrollTop;
  }

  ngOnInit(): void {
  }

  userLoggedIn() {
    this.userLogged=this.userService.getCurrentUser();
  }

  onWindowScroll(event:Event) {
    if (scrollY>0) this.navBackground = true
    else this.navBackground = false
  }

  setSelectedMenu(text: string): void {
    this.selectedMenu = text;
    if (this.selectedMenu=='Início'){
      this.route.navigate(['main',this.userLogged.id])
    }else if(this.selectedMenu=='Séries'){
      this.route.navigate(['series']);
    }else if(this.selectedMenu=='Filmes'){
      this.route.navigate(['filmes']);
    }
  }

  onSearchClicked(searchValue: string) {
    this.onSearch.emit(searchValue);
  }

  onAdd(){
    switch (this.rotaAtiva.snapshot.url[0].path) {
      case 'series':
        this.route.navigate(['nova-serie']);
        break;
      case 'filmes':
        this.route.navigate(['novo-filme']);
        break;
    }
  }
  
}
