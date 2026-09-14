import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin } from 'rxjs';
import { ImovelService } from '../services/imovel.service';
import { PessoaService } from '../services/pessoa.service';
import { EnderecoService } from '../services/endereco.service';
import { Imovel, Pessoa, Endereco } from '../models/entidades.model';

interface ImovelLinha extends Imovel {
  proprietarioNome: string;
  enderecoFormatado: string;
}

@Component({
  selector: 'app-imovel-lista-page',
  imports: [MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './imovel-lista-page.component.html',
  styleUrl: './imovel-lista-page.component.scss'
})
export class ImovelListaPageComponent implements OnInit {
  private readonly imovelService = inject(ImovelService);
  private readonly pessoaService = inject(PessoaService);
  private readonly enderecoService = inject(EnderecoService);
  private readonly router = inject(Router);

  colunas = ['tipo', 'proprietarioNome', 'enderecoFormatado', 'numeroRegistro', 'acoes'];
  imoveis: ImovelLinha[] = [];

  ngOnInit(): void {
    forkJoin({
      imoveis: this.imovelService.listar(),
      pessoas: this.pessoaService.listar(),
      enderecos: this.enderecoService.listar()
    }).subscribe({
      next: ({ imoveis, pessoas, enderecos }) => {
        const pessoasPorId = new Map<string, Pessoa>(pessoas.map((pessoa) => [pessoa.id, pessoa]));
        const enderecosPorId = new Map<string, Endereco>(enderecos.map((endereco) => [endereco.id, endereco]));

        this.imoveis = imoveis.map((imovel) => {
          const endereco = enderecosPorId.get(imovel.enderecoId);

          return {
            ...imovel,
            proprietarioNome: pessoasPorId.get(imovel.proprietarioId)?.nome ?? '-',
            enderecoFormatado: endereco ? `${endereco.rua}, ${endereco.numero} - ${endereco.bairro}, ${endereco.cidade}` : '-'
          };
        });
      },
      error: (error) => console.error('Erro ao listar imoveis:', error)
    });
  }

  novoImovel(): void {
    this.router.navigate(['/imoveis/novo']);
  }

  editarImovel(imovel: Imovel): void {
    this.router.navigate(['/imoveis', imovel.id, 'editar']);
  }
}


