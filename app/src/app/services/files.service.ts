import { Injectable, state } from '@angular/core';

@Injectable()
export class FilesService {

  constructor() { }

  public files: file[] = [];

  public addFile(path: string) {
    var fileName = this.getFileName(path);
    var outPath = this.getFolderPath(path) + '\out\\' + this.getFileNameWithExt(path);
    var fileType = "Tokenised"; // TODO: get file type from detokeniser
    this.files.push({
      name: fileName,
      path: path,
      outputPath: outPath,
      syntax: "Advance",
      selected: false,
      status: 'pending'
    })
  }

  public changeSyntax(index: number, syntax) {
    this.files[index].syntax = syntax;
  }

  public changeOutpath(index: number, path: string) {
    this.files[index].path = path;
  }

  public removeFile(index: number){
    console.log(index);
    this.files.splice(index, 1);
  }

  public removeSelected(): number{
    var deleted =0;
    console.log(this.files.length);
    console.log(this.files);
    for (var i =0; i< this.files.length; i++) {
      if (this.files[i].selected) {
        var index = this.files.indexOf(this.files[i]);
        this.removeFile(index);
        i--;
        deleted++;
      }
    }
    return deleted;
  }

  public removeCompleted(){
    for (var i =0; i< this.files.length; i++) {
        if (this.files[i].status == "done") {
          var index = this.files.indexOf(this.files[i]);
          this.removeFile(index);
          i--;
        }
      }
  }

  public convert(index){
    // TODO: convert file
  }

  public convertSelected(){

  }

  public convertAll(){
    
  }

  private getFileNameWithExt(path: string): string {
    return this.getFileName(path) + '.' + this.getFileExt(path);
  }

  private getFolderPath(path: string): string {
    var index = path.lastIndexOf('\\');
    return path.substr(0, index + 1);
  }

  private getFileExt(path: string): string {
    var index = path.lastIndexOf('.');
    return path.slice(index + 1 - path.length);
  }

  private getFileName(path: string): string {
    var index = path.lastIndexOf('\\');
    return path.slice(index + 1 - path.length).replace('.' + this.getFileExt(path), '');
  }
}

export class file {
  name: string;
  path: string;
  outputPath: string;
  syntax: "Tandy" | "Pc jr" | "Advance";
  selected: boolean;
  status: 'converting' | 'pending' | 'done'
}