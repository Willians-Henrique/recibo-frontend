import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ContratoRecibo } from '../../models/contrato-recibo.model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-header-recibo',
  imports: [
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule
  ],
  templateUrl: './header-recibo.component.html',
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }],
  styleUrl: './header-recibo.component.scss'
})
export class HeaderReciboComponent implements OnChanges {
  @Input() contrato: ContratoRecibo | null = null;

  private readonly fb = inject(FormBuilder);

  form = this.fb.group({
    dataVencimento: [''],
    dataReajuste: ['']
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contrato'] && this.contrato) {
      this.form.patchValue({
        // dataVencimento: this.contrato.dataVencimento,  --> se necessario, tipar em contrato
        dataReajuste: this.contrato.proximoReajuste
      });
    }
  }
}



