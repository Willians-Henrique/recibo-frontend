import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PessoaService } from '../services/pessoa.service';
import { Pessoa } from '../models/entidades.model';

@Component({
  selector: 'app-pessoa-lista-page',
  imports: [MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './pessoa-lista-page.component.html',
  styleUrl: './pessoa-lista-page.component.scss'
})
export class PessoaListaPageComponent implements OnInit {
  private readonly pessoaService = inject(PessoaService);
  private readonly router = inject(Router);

  colunas = ['nome', 'cpf', 'telefone', 'email', 'estadoCivil', 'acoes'];
  pessoas: Pessoa[] = [];

  ngOnInit(): void {
    this.pessoaService.listar().subscribe({
      next: (pessoas) => this.pessoas = pessoas,
      error: (error) => console.error('Erro ao listar pessoas:', error)
    });
  }

  novaPessoa(): void {
    this.router.navigate(['/pessoas/novo']);
  }

  editarPessoa(pessoa: Pessoa): void {
    this.router.navigate(['/pessoas', pessoa.id, 'editar']);
  }
}

