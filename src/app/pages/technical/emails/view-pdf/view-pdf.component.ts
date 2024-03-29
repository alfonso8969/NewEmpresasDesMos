import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Log } from 'src/app/interfaces/log';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { LogsService } from 'src/app/services/logs.service';
import { ViewSDKClient } from 'src/app/services/view-sdk.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-pdf',
  templateUrl: './view-pdf.component.html',
  styleUrls: ['./view-pdf.component.css']
})
export class ViewPdfComponent implements OnInit, OnDestroy, AfterViewInit {


  url: string = environment.apiUrl;

  log: Log;

  footer: HTMLElement;
  load: boolean;
  extensionsImg : boolean;
  file: string;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private viewSDKClient: ViewSDKClient,
    private fileService: FileUploadService,
    private logService: LogsService) {

    this.log = this.logService.initLog();
    this.route.paramMap.subscribe((params: any) => {
      this.file = params.get('file');
      if(this.file.split('.')[1].toLowerCase() == 'pdf') {
        this.extensionsImg = false;
        setTimeout(() => {
          this.viewSDKClient.ready().then(() => {
            /* Invoke file preview */
            this.viewSDKClient.previewFile('pdf-div', this.url + '/attachment/' + this.file, this.file, {
              /* Pass the embed mode option here */
              embedMode: 'IN_LINE'
            });
          });
        }, 600);
      } else {
        this.extensionsImg = true;
      }
    });
  }

  ngAfterViewInit() {
    this.footer = document.getElementsByTagName('footer')[0];
    this.footer.hidden = true;
  }

  ngOnInit(): void {
  }

  public downloadPdf(): void {
    this.fileService.getPdf(this.file).subscribe({
      next: (data: Blob) => {
        var file = new Blob([data], { type: data.type })
        var fileURL = URL.createObjectURL(file);
        window.open(fileURL);
        var a = document.createElement('a');
        a.href = fileURL;
        a.target = '_blank';
        a.download = this.file;
        document.body.appendChild(a);
        a.click();
      }, error: (error: any) => {
        this.log.action = 'Descargar archivo';
        this.log.status = false;
        this.log.message = `Error al descargar archivo: ${JSON.stringify(error)}`;
        this.logService.setLog(this.log);
        console.log('getPDF error: ', error);
      }
    });
  }

  public closePdf(): void {
    this.router.navigate(['dashboard/technical-emails-details']);
  }

  ngOnDestroy() {
    this.footer.hidden = false;
  }

}
