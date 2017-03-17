import { FilesService } from './../../services/files.service';
import { Component, OnInit, transition, ElementRef } from '@angular/core';
import { MdSnackBar } from '@angular/material';
declare var electron: any;

@Component({
  selector: 'mainpane',
  templateUrl: './mainpane.component.html',
  styleUrls: ['./mainpane.component.css']
})
export class MainpaneComponent implements OnInit {

  constructor(public snackBar: MdSnackBar, private elRef: ElementRef, private fileService :FilesService) { }
  private currentWindow =  electron.remote.getCurrentWindow()
  private dialog = electron.remote.dialog;

  ngOnInit() {
    var div = this.elRef.nativeElement.querySelector('.main-pane');
    div.ondragover = () => {
      div.classList.add('over');
      return false;
    }
    div.ondragleave = div.ondragend = () => {
      div.classList.remove('over');
      return false;
    }
    div.ondrop = (e) => {
      div.classList.remove('over');
      e.preventDefault()
      for (let f of e.dataTransfer.files) {
        this.fileService.addFile(f.path);
      }
      return false;
    }
  }

  files = this.fileService.files;

  public select(file) {
    var index = this.files.indexOf(file);
    this.files[index].selected = !this.files[index].selected;
  }

  public clear(file, event) {
    var index = this.files.indexOf(file);
    this.fileService.removeFile(index);
    event.stopPropagation();
  }

  public changeSyntax(file, syntax: string) {
    var index = this.files.indexOf(file);
    this.fileService.changeSyntax(index, syntax);
    this.snackBar.open(`Changed syntax of ${this.files[index].name} to ${syntax}`, null, {
      duration: 1000,
    });
  }

  public changePath(file) {
    var index = this.files.indexOf(file);
    var paths = this.dialog.showOpenDialog(this.currentWindow, {
      properties: ['openDirectory', 'showHiddenFiles', 'createDirectory']
    });
    if (paths[0]) {
      this.fileService.changeOutpath(index, paths[0])
      this.snackBar.open(`Changed outpath of ${this.files[index].name} to ${paths[0]}`, null, {
        duration: 1000,
      });
    }
  }

}
