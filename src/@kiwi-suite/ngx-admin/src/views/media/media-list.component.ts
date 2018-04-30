import {Component, OnInit} from '@angular/core';
import {DomSanitizer, SafeUrl, ɵgetDOM as getDOM} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {FileUploader} from 'ng2-file-upload';
import {ConfigurationService, MediaService} from '../../services';
import {ResourceListComponent} from '../resource/resource-list.component';

@Component({
    selector: 'app-media-list',
    templateUrl: './media-list.component.html',
    styleUrls: ['./media-list.component.scss'],
})
export class MediaListComponent extends ResourceListComponent implements OnInit {

    protected pathPrefix = '';

    public uploader: FileUploader;

    constructor(protected config: ConfigurationService,
                protected dataService: MediaService,
                protected domSanitizer: DomSanitizer,
                protected route: ActivatedRoute) {
        super(route);
    }

    ngOnInit() {
        super.ngOnInit();
        this.config.params$.subscribe(config => {
            this.uploader = new FileUploader({
                url: this.dataService.uploadLink,
                removeAfterUpload: true,
                autoUpload: true,
                headers: [
                    {
                        name: 'X-XSRF-TOKEN',
                        value: getDOM().getCookie('XSRF-TOKEN')
                    }
                ]
            });
            this.uploader.onCompleteAll = () => {
                this.dataService.load();
            };
        });
    }

    get resourceNamePlural() {
        return 'Media';
    }

    isImage(mimeType: string): boolean {
        if (!mimeType || mimeType.length < 6) {
            return false;
        }

        if (mimeType.substr(0, 6) !== 'image/') {
            return false;
        }

        return true;
    }

    isSVG(mimeType: string): boolean {
        if (!mimeType || mimeType.length < 6) {
            return false;
        }

        if (mimeType.indexOf('svg') === -1) {
            return false;
        }

        return true;
    }

    mimeTypeIcon(mimeType: string): string {
        return 'fa-file';
    }

    base64Image(file?: File | Blob): Promise<SafeUrl> {
        return new Promise<SafeUrl>(
            (resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (reader.error) {
                        reject(reader.error);
                        return;
                    }
                    resolve(this.domSanitizer.bypassSecurityTrustUrl(reader.result));
                };
                reader.readAsDataURL(file);
            },
        );
    }
}
