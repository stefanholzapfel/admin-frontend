import { Component, } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'kiwi-confirm-modal',
  templateUrl: './kiwi-confirm-modal.component.html',
})
export class KiwiConfirmModalComponent {

  title = '';
  text = '';

  confirmBtnType = 'danger';
  confirmBtnIcon = 'fa fa-trash';

  confirmBtnTitle = 'Delete';
  cancelBtnTitle = 'Cancel';

  onConfirm = () => {
  };

  constructor(public bsModalRef: BsModalRef) {
  }

  confirm() {
    this.onConfirm();
    this.bsModalRef.hide();
  }
}