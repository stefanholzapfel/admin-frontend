import { Component, Input } from '@angular/core';

@Component({
  selector: 'ixo-dashboard-counter',
  templateUrl: './ixo-counter.component.html',
})
export class IxoDashboardCounterComponent {
  @Input() data;
}
