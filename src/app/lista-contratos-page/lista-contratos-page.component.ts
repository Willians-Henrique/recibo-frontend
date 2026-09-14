import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ContratoService } from '../services/contrato.service';
import { ContratoResumo } from '../models/contrato-recibo.model';

@Component({
  selector: 'app-lista-contratos-page',
  imports: [MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './lista-contratos-page.component.html',
  styleUrl: './lista-contratos-page.component.scss'
})
export class ListaContratosPageComponent implements OnInit {
  private readonly contratoService = inject(ContratoService);
  private readonly router = inject(Router);

  colunas = ['inquilinoNome', 'proprietarioNome', 'endereco', 'acoes'];
  contratos: ContratoResumo[] = [];

  ngOnInit(): void {
    this.contratoService.listarResumo().subscribe({
      next: (contratos) => this.contratos = contratos,
      error: (error) => console.error('Erro ao listar contratos:', error)
    });
  }

  formatarEndereco(contrato: ContratoResumo): string {
    const { rua, numero, bairro, cidade } = contrato.endereco;
    return `${rua}, ${numero} - ${bairro}, ${cidade}`;
  }

  emitirRecibo(contrato: ContratoResumo): void {
    this.router.navigate(['/recibo'], { queryParams: { id: contrato.id } });
  }

  novoContrato(): void {
    this.router.navigate(['/contratos/novo']);
  }

  editarContrato(contrato: ContratoResumo): void {
    this.router.navigate(['/contratos', contrato.id, 'editar']);
  }
}

