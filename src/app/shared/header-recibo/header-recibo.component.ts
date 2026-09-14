import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ContratoRecibo } from '../../models/contrato-recibo.model';

@Component({
  selector: 'app-header-recibo',
  imports: [
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './header-recibo.component.html',
  styleUrl: './header-recibo.component.scss'
})
export class HeaderReciboComponent implements OnChanges {
  @Input() corretor = 'João Bosco L';
  @Input() slogan = 'VENDA – ALUGA – ADMINISTRAÇÃO DE IMÓVEIS';
  @Input() creci = '175963';
  @Input() contrato: ContratoRecibo | null = null;

  private readonly fb = inject(FormBuilder);

  form = this.fb.group({
    dataPagamento: [''],
    dataReajuste: ['']
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contrato'] && this.contrato) {
      this.form.patchValue({
        dataReajuste: this.contrato.proximoReajuste
      });
    }
  }
}



