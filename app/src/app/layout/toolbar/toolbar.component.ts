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
  private currentWindow =  electron.remote.getCurrentWindow()

  constructor(private fileService :FilesService) { }

  ngOnInit() {
  }

  public addfiles(){
    var paths = this.dialog.showOpenDialog(this.currentWindow, {
      properties: ['openDirectory', 'showHiddenFiles', 'createDirectory']
    });
    if (paths[0]) {
      this.fileService.changeOutpath(index, paths[0])
    }
  }

  public addfolder(){
    var paths = this.dialog.showOpenDialog(this.currentWindow, {
      properties: ['openDirectory', 'showHiddenFiles', 'createDirectory']
    });
    if (paths[0]) {
      console.log(paths[0]);
    }
  }
}
