import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EnderecoService } from '../services/endereco.service';
import { Endereco } from '../models/entidades.model';

@Component({
  selector: 'app-endereco-lista-page',
  imports: [MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './endereco-lista-page.component.html',
  styleUrl: './endereco-lista-page.component.scss'
})
export class EnderecoListaPageComponent implements OnInit {
  private readonly enderecoService = inject(EnderecoService);
  private readonly router = inject(Router);

  colunas = ['rua', 'bairro', 'cidade', 'estado', 'acoes'];
  enderecos: Endereco[] = [];

  ngOnInit(): void {
    this.enderecoService.listar().subscribe({
      next: (enderecos) => this.enderecos = enderecos,
      error: (error) => console.error('Erro ao listar enderecos:', error)
    });
  }

  novoEndereco(): void {
    this.router.navigate(['/enderecos/novo']);
  }

  editarEndereco(endereco: Endereco): void {
    this.router.navigate(['/enderecos', endereco.id, 'editar']);
  }
}

