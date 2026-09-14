import { Component, Input } from '@angular/core';
import { HeaderReciboComponent } from '../../shared/header-recibo/header-recibo.component';
import { FormReciboClienteComponent } from '../form-recibo-cliente/form-recibo-cliente.component';
import { ContratoRecibo } from '../../models/contrato-recibo.model';

@Component({
  selector: 'app-recibo-cliente',
  imports: [HeaderReciboComponent, FormReciboClienteComponent],
  templateUrl: './recibo-cliente.component.html',
  styleUrl: './recibo-cliente.component.scss'
})
export class ReciboClienteComponent {
  @Input() contrato: ContratoRecibo | null = null;
}
