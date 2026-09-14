import { Component, Input } from '@angular/core';
import { HeaderReciboComponent } from '../../shared/header-recibo/header-recibo.component';
import { FormReciboImobiliariaComponent } from '../form-recibo-imobiliaria/form-recibo-imobiliaria.component';
import { ContratoRecibo } from '../../models/contrato-recibo.model';

@Component({
  selector: 'app-recibo-imobiliaria',
  imports: [HeaderReciboComponent, FormReciboImobiliariaComponent ],
  templateUrl: './recibo-imobiliaria.component.html',
  styleUrl: './recibo-imobiliaria.component.scss'
})
export class ReciboImobiliariaComponent {
  @Input() contrato: ContratoRecibo | null = null;
}

