import { StatusService } from './services/status.service';
import { FilesService } from './services/files.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { MaterialModule } from '@angular/material';
import 'hammerjs';
import { TitleBarComponent } from './layout/title-bar/title-bar.component';
import { StatusbarComponent } from './layout/statusbar/statusbar.component';
import { ToolbarComponent } from './layout/toolbar/toolbar.component';
import { MainpaneComponent } from './layout/mainpane/mainpane.component';

@NgModule({
  declarations: [
    AppComponent,
    TitleBarComponent,
    StatusbarComponent,
    ToolbarComponent,
    MainpaneComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot()
  ],
  providers: [FilesService, StatusService],
  bootstrap: [AppComponent]
})
export class AppModule { }
