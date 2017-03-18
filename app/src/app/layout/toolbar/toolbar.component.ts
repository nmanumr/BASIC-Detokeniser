import { Component, OnInit } from '@angular/core';
import { FilesService } from "app/services/files.service";
declare var electron: any;
declare var fs: any;

@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  private dialog = electron.remote.dialog;
  private currentWindow = electron.remote.getCurrentWindow()

  constructor(private fileService: FilesService) { }

  ngOnInit() {
  }

  public addfiles() {
    var files = this.dialog.showOpenDialog(this.currentWindow, {
      properties: ['openFile', 'showHiddenFiles', 'multiSelections'],
      filters: [
        { name: 'BASIC files', extensions: ['bas', 'baz'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });
    for (var file of files) {
      this.fileService.addFile(file);
    }
  }

  public addfolder() {
    var folder = this.dialog.showOpenDialog(this.currentWindow, {
      properties: ['openDirectory', 'showHiddenFiles', 'createDirectory']
    });
    var files;
    if (folder) {
      files = this.openFolder(folder[0]);
    }
    for (var file of files) {
      this.fileService.addFile(file);
    }
  }

  public select(type: 'a' | 'i' | 'n') {
    for (var file of this.fileService.files) {
      switch (type) {
        case 'a':
          file.selected = true;
          break;
        case 'n':
          file.selected = false;
          break;
        case 'i':
          file.selected = !file.selected;
          break;
      }
    }
  }

  public delete() {
    var deleted = this.fileService.removeSelected();
    if (deleted == 0) {
      this.fileService.removeCompleted();
    }
  }

  private openFolder(folder: string): string[] {
    var files = fs.readdirSync(folder);
    var docs = [];

    for (var file of files) {

      if (fs.lstatSync(folder + "\\" + file).isDirectory()) {
        var scripts = this.openFolder(folder + "\\" + file);
        for (var script of scripts) {
          docs.push(script);
        }
      }
      else{
        docs.push(folder + "\\"+file);
      }
    }

    return docs;
  }
}
