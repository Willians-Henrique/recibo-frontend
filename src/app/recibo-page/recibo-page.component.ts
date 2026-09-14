import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReciboClienteComponent } from '../components/recibo-cliente/recibo-cliente.component';
import { ReciboImobiliariaComponent } from '../components/recibo-imobiliaria/recibo-imobiliaria.component';
import { ContratoService } from '../services/contrato.service';
import { ContratoRecibo } from '../models/contrato-recibo.model';

@Component({
  selector: 'app-recibo-page',
  imports: [ReciboClienteComponent, ReciboImobiliariaComponent],
  templateUrl: './recibo-page.component.html',
  styleUrl: './recibo-page.component.scss'
})
export class ReciboPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly contratoService = inject(ContratoService);

  contrato: ContratoRecibo | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.queryParamMap.get('id');

    if (!id) {
      return;
    }

    this.contratoService.buscarRecibo(id).subscribe({
      next: (contrato) => this.contrato = contrato,
      error: (error) => console.error('Erro ao buscar o contrato:', error)
    });
  }
}

