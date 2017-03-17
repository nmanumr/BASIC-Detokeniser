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
    this.files.splice(index, 1);
  }

  public convert(index){

  }

  public convertSelected(){

  }

  public convertAll(){
    
  }



  private getFileNameWithExt(path: string): string {
    return this.getFileName(path) + '.' + this.getFileExt(path);
  }

  private getFolderPath(path: string): string {
    console.log(path, typeof(path));
    var index = path.lastIndexOf('\\');
    return path.substr(0, index + 1);
  }

  private getFileExt(path: string): string {
    console.log(path, typeof(path));
    var index = path.lastIndexOf('.');
    return path.slice(index + 1 - path.length);
  }

  private getFileName(path: string): string {
    console.log(path, typeof(path));
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
  status: 'convering' | 'pending' | 'done'
}