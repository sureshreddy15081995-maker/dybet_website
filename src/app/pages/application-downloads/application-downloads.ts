import { Component } from '@angular/core';

@Component({
  selector: 'app-application-downloads',
  imports: [],
  templateUrl: './application-downloads.html',
  styleUrl: './application-downloads.css'
})
export class ApplicationDownloads {

  onDownloadLinks(root: String): void {
    alert(`${root} download link not found`)
  }
}
