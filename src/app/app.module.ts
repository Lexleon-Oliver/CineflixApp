import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './users/users.component';
import { MainComponent } from './main/main.component';
import { ModalModule } from './modal';
import { UserCardComponent } from './users/user-card/user-card.component';
import { NavBarMainComponent } from './main/nav-bar-main/nav-bar-main.component';
import { NavbuttonComponent } from './main/nav-bar-main/nav-button/navbutton.component';
import { SeriesCardComponent } from './main/series-card/series-card.component';
import { CategoryCarrouselComponent } from './main/category-carrousel/category-carrousel.component';
import { ErrorComponentComponent } from './error-component/error-component.component';
import { NavBarHamburgerMenuComponent } from './main/nav-bar-main/nav-bar-hamburger-menu/nav-bar-hamburger-menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HamburgerButtonComponent } from './main/nav-bar-main/nav-bar-hamburger-menu/hamburger-button/hamburger-button.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FormsModule } from '@angular/forms';
import { UserListComponent } from './users/user-list/user-list.component';
import { EstrelasComponent } from './main/estrelas/estrelas/estrelas.component';
import { SelectedSerieComponent } from './main/selected-serie/selected-serie.component';
import { RendererizaFilmeComponent } from './main/rendereriza-filme/rendereriza-filme.component';
import { RenderizaMidiaComponent } from "./main/renderiza-midia/renderiza-midia.component";

@NgModule({ declarations: [
        AppComponent,
        HomeComponent,
        UsersComponent,
        MainComponent,
        UserCardComponent,
        NavBarMainComponent,
        NavbuttonComponent,
        SeriesCardComponent,
        CategoryCarrouselComponent,
        ErrorComponentComponent,
        NavBarHamburgerMenuComponent,
        HamburgerButtonComponent,
        NavBarComponent,
        UserListComponent,
        SelectedSerieComponent,
        RendererizaFilmeComponent,
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ModalModule,
    FormsModule, RenderizaMidiaComponent], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
