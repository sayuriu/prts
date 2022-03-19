import {Component, Input, OnInit} from '@angular/core';
import {ImageDataService} from "@services/image-data.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Component({
  selector: 'image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit {

      _imgSource: SafeUrl = '';
      _progress = 0;
      _isLoading = true;

      constructor(
          private image: ImageDataService,
          private sanitizer: DomSanitizer
      ) { }

      @Input() url!: string;
      // @Input() placeholderURL? = 'assets/images/placeholder.png';
      @Input() alt? = '';
      @Input() h = 'auto';
      @Input() w = 'auto';

      @Input() progressBarBG = '#3471ff';
      async ngOnInit() {
          // if (this.placeholderURL)
          // {
          //     await this.getImage(this.placeholderURL);
          // }
          await this.getImage(this.url);
      }
      private async getImage(url: string)
      {
          const refThis = this;
          this._imgSource = await this.image.load(url, {
              onExpire() {},
              onprogress(_, ev) {
                  if (ev && ev.lengthComputable)
                      refThis.updateProgress(Math.round(ev.loaded / ev.total * 100));
              },
              onload() {
                  refThis.updateProgress(100);
              }
          }).then(data => {
              this._isLoading = false;
              return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data ?? new Blob))
          });
      }
      throttleActive = false;
      updateProgress(progress: number)
      {
          if (this.throttleActive)
              return;
          this._progress = progress;
          this.throttleActive = true;
          setTimeout(() => {
              this.throttleActive = false;
          }, 300);
      }

}
