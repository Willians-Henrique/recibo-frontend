import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { forkJoin } from 'rxjs';
import { PessoaService } from '../services/pessoa.service';
import { EnderecoService } from '../services/endereco.service';
import { UFS_VALIDAS, ESTADOS_CIVIS_VALIDOS, Endereco } from '../models/entidades.model';

@Component({
  selector: 'app-pessoa-form-page',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './pessoa-form-page.component.html',
  styleUrl: './pessoa-form-page.component.scss'
})
export class PessoaFormPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly pessoaService = inject(PessoaService);
  private readonly enderecoService = inject(EnderecoService);

  readonly ufs = UFS_VALIDAS;
  readonly estadosCivis = ESTADOS_CIVIS_VALIDOS;

  pessoaId: string | null = null;
  enderecoId: string | null = null;
  enderecos: Endereco[] = [];
  salvando = false;

  form = this.fb.group({
    nome: [''],
    telefone: [''],
    email: [''],
    cpf: [''],
    rg: [''],
    orgaoEmissor: [''],
    ufEmissorRg: [''],
    estadoCivil: [''],
    nacionalidade: ['Brasileira'],
    enderecoExistenteId: [''],
    rua: [''],
    numero: [''],
    complemento: [''],
    bairro: [''],
    cidade: [''],
    estado: [''],
    pais: ['Brasil']
  });

  ngOnInit(): void {
    this.enderecoService.listar().subscribe({
      next: (enderecos) => this.enderecos = enderecos,
      error: (error) => console.error('Erro ao listar enderecos:', error)
    });

    // só faz sentido reaproveitar endereço existente na criação; ao editar, o endereço já está vinculado
    this.form.get('enderecoExistenteId')!.valueChanges.subscribe((idSelecionado) => {
      const camposEndereco = ['rua', 'numero', 'complemento', 'bairro', 'cidade', 'estado', 'pais'];

      if (idSelecionado) {
        const endereco = this.enderecos.find((e) => e.id === idSelecionado);

        if (endereco) {
          this.form.patchValue({
            rua: endereco.rua,
            numero: endereco.numero,
            complemento: endereco.complemento ?? '',
            bairro: endereco.bairro,
            cidade: endereco.cidade,
            estado: endereco.estado,
            pais: endereco.pais
          });
        }

        camposEndereco.forEach((campo) => this.form.get(campo)!.disable());
      } else {
        camposEndereco.forEach((campo) => this.form.get(campo)!.enable());
      }
    });

    this.pessoaId = this.route.snapshot.paramMap.get('id');

    if (!this.pessoaId) {
      return;
    }

    this.pessoaService.buscarPorId(this.pessoaId).subscribe({
      next: (pessoa) => {
        this.enderecoId = pessoa.enderecoId;

        this.enderecoService.buscarPorId(pessoa.enderecoId).subscribe({
          next: (endereco) => {
            this.form.patchValue({
              nome: pessoa.nome,
              telefone: pessoa.telefone,
              email: pessoa.email,
              cpf: pessoa.cpf,
              rg: pessoa.rg,
              orgaoEmissor: pessoa.orgaoEmissor,
              ufEmissorRg: pessoa.ufEmissorRg,
              estadoCivil: pessoa.estadoCivil,
              nacionalidade: pessoa.nacionalidade,
              rua: endereco.rua,
              numero: endereco.numero,
              complemento: endereco.complemento ?? '',
              bairro: endereco.bairro,
              cidade: endereco.cidade,
              estado: endereco.estado,
              pais: endereco.pais
            });
          },
          error: (error) => console.error('Erro ao buscar endereço:', error)
        });
      },
      error: (error) => console.error('Erro ao buscar pessoa:', error)
    });
  }

  salvar(): void {
    const dados = this.form.getRawValue();

    const dadosPessoa = {
      nome: dados.nome ?? '',
      telefone: dados.telefone ?? '',
      email: dados.email ?? '',
      cpf: dados.cpf ?? '',
      rg: dados.rg ?? '',
      orgaoEmissor: dados.orgaoEmissor ?? '',
      ufEmissorRg: dados.ufEmissorRg ?? '',
      estadoCivil: dados.estadoCivil as any,
      nacionalidade: dados.nacionalidade ?? ''
    };

    this.salvando = true;

    if (this.pessoaId && this.enderecoId) {
      const dadosEndereco = {
        rua: dados.rua ?? '',
        numero: dados.numero ?? '',
        complemento: dados.complemento || undefined,
        bairro: dados.bairro ?? '',
        cidade: dados.cidade ?? '',
        estado: dados.estado as any,
        pais: dados.pais || undefined
      };

      forkJoin([
        this.enderecoService.atualizar(this.enderecoId, dadosEndereco),
        this.pessoaService.atualizar(this.pessoaId, dadosPessoa)
      ]).subscribe({
        next: () => this.router.navigate(['/pessoas']),
        error: (error) => { console.error('Erro ao atualizar pessoa:', error); this.salvando = false; }
      });
      return;
    }

    // reaproveita um endereço já cadastrado, em vez de criar um duplicado
    if (dados.enderecoExistenteId) {
      this.pessoaService.criar({ ...dadosPessoa, enderecoId: dados.enderecoExistenteId }).subscribe({
        next: () => this.router.navigate(['/pessoas']),
        error: (error) => { console.error('Erro ao criar pessoa:', error); this.salvando = false; }
      });
      return;
    }

    const dadosEndereco = {
      rua: dados.rua ?? '',
      numero: dados.numero ?? '',
      complemento: dados.complemento || undefined,
      bairro: dados.bairro ?? '',
      cidade: dados.cidade ?? '',
      estado: dados.estado as any,
      pais: dados.pais || undefined
    };

    this.enderecoService.criar(dadosEndereco).subscribe({
      next: (endereco) => {
        this.pessoaService.criar({ ...dadosPessoa, enderecoId: endereco.id }).subscribe({
          next: () => this.router.navigate(['/pessoas']),
          error: (error) => { console.error('Erro ao criar pessoa:', error); this.salvando = false; }
        });
      },
      error: (error) => { console.error('Erro ao criar endereço:', error); this.salvando = false; }
    });
  }
}

