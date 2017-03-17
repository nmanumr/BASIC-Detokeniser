import { Component, OnInit } from '@angular/core';
import { FilesService } from "app/services/files.service";
declare var electron: any;

@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  private dialog = electron.remote.dialog;

  constructor(private fileService :FilesService) { }

  ngOnInit() {
  }

  public addfiles(){

  }
}
