import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomFieldTypeAbstract } from './custom-field-type.abstract';
import { QuillEditorComponent } from 'ngx-quill';
import { CustomValidators } from '../../validators/CustomValidators';
import { LinkSelectModalData } from '../../modals/kiwi-link-select-modal/link-select-modal-data.interface';
import { KiwiLinkSelectModalComponent } from '../../modals/kiwi-link-select-modal/kiwi-link-select-modal.component';
import { BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'formly-field-quill',
  template: `
    <quill-editor #editor
                  [ngModel]="value?.html"
                  [style]="{height: height}"
                  [readOnly]="to.disabled"
                  [modules]="modules"
                  [placeholder]="to.placeholder"
                  [required]="to.required"
                  [class.is-invalid]="showError"
                  [class.read-only]="to.disabled"
                  (onContentChanged)="onContentChanged($event)">
    </quill-editor>
  `,
})
export class FormlyFieldQuillComponent extends CustomFieldTypeAbstract implements OnInit {

  value = {html: '', quill: []};

  @ViewChild('editor') editor: QuillEditorComponent;

  constructor(private modalService: BsModalService) {
    super();
  }

  get modules() {
    return this.to.modules;
  }

  get height() {
    return this.to.height + 'px';
  }

  ngOnInit() {
    if (this.to.required) {
      this.formControl.setValidators([CustomValidators.quillRequired]);
    }
    setTimeout(() => {
      this.setValue(this.formControl.value || {html: '', quill: []});
    });
    this.to.modules.keyboard = {
      bindings: {
        smartbreak: {
          key: 13,
          shiftKey: true,
          handler(range, context) {
            this.quill.setSelection(range.index, 'silent');
            this.quill.insertText(range.index, '\n', 'user');
            this.quill.setSelection(range.index + 1, 'silent');
            this.quill.format('linebreak', true, 'user');
          },
        },
        paragraph: {
          key: 13,
          handler(range, context) {
            this.quill.setSelection(range.index, 'silent');
            this.quill.insertText(range.index, '\n', 'user');
            this.quill.setSelection(range.index + 1, 'silent');
            const f = this.quill.getFormat(range.index + 1);
            if (f.hasOwnProperty('linebreak')) {
              delete (f.linebreak);
              this.quill.removeFormat(range.index + 1);
              for (const key in f) {
                if (f.hasOwnProperty(key)) {
                  this.quill.formatText(range.index + 1, key, f[key]);
                }
              }
            }
          },
        },
      },
    };

    if (!this.to.modules.handlers) {
      this.to.modules.toolbar.handlers = {};
    }

    this.to.modules.toolbar.handlers.mylink = (value) => {
      if (value) {
        const initialState: LinkSelectModalData = {
          value: null,
          onConfirm: (data) => {
            console.log(data);
            const myLinkData: any = {target: data.target};
            if (data.type === 'external') {
              myLinkData.href = data.value;
            } else if (data.type === 'media') {
              myLinkData.href = 'media:' + data.value.id;
            } else if (data.type === 'sitemap') {
              myLinkData.href = 'sitemap:' + data.value.id;
            }
            this.editor.quillEditor.format('mylink', myLinkData, 'user');
          },
        };
        this.modalService.show(KiwiLinkSelectModalComponent, {class: 'modal-lg', initialState});
      } else {
        this.editor.quillEditor.format('mylink', false, 'user');
      }
    };
  }

  onContentChanged(data: any) {
    this.formControl.markAsTouched();
    this.setValue({html: data.html, quill: data.content});
  }

}
