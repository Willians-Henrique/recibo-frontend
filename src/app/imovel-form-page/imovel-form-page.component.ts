import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { forkJoin } from 'rxjs';
import { ImovelService } from '../services/imovel.service';
import { EnderecoService } from '../services/endereco.service';
import { PessoaService } from '../services/pessoa.service';
import { UFS_VALIDAS, TIPOS_IMOVEL_VALIDOS, Pessoa, Endereco } from '../models/entidades.model';

@Component({
  selector: 'app-imovel-form-page',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './imovel-form-page.component.html',
  styleUrl: './imovel-form-page.component.scss'
})
export class ImovelFormPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly imovelService = inject(ImovelService);
  private readonly enderecoService = inject(EnderecoService);
  private readonly pessoaService = inject(PessoaService);

  readonly ufs = UFS_VALIDAS;
  readonly tipos = TIPOS_IMOVEL_VALIDOS;

  imovelId: string | null = null;
  enderecoId: string | null = null;
  pessoas: Pessoa[] = [];
  enderecos: Endereco[] = [];
  salvando = false;

  form = this.fb.group({
    proprietarioId: [''],
    tipo: [''],
    condominio: [''],
    codigoAgua: [''],
    codigoEnergia: [''],
    codigoIptu: [''],
    numeroRegistro: [''],
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
    this.pessoaService.listar().subscribe({
      next: (pessoas) => this.pessoas = pessoas,
      error: (error) => console.error('Erro ao listar pessoas:', error)
    });

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

    this.imovelId = this.route.snapshot.paramMap.get('id');

    if (!this.imovelId) {
      return;
    }

    this.imovelService.buscarPorId(this.imovelId).subscribe({
      next: (imovel) => {
        this.enderecoId = imovel.enderecoId;

        this.enderecoService.buscarPorId(imovel.enderecoId).subscribe({
          next: (endereco) => {
            this.form.patchValue({
              proprietarioId: imovel.proprietarioId,
              tipo: imovel.tipo,
              condominio: imovel.condominio ?? '',
              codigoAgua: imovel.codigoAgua ?? '',
              codigoEnergia: imovel.codigoEnergia ?? '',
              codigoIptu: imovel.codigoIptu ?? '',
              numeroRegistro: imovel.numeroRegistro ?? '',
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
      error: (error) => console.error('Erro ao buscar imóvel:', error)
    });
  }

  salvar(): void {
    const dados = this.form.getRawValue();

    const dadosImovel = {
      proprietarioId: dados.proprietarioId ?? '',
      tipo: dados.tipo as any,
      condominio: dados.condominio || undefined,
      codigoAgua: dados.codigoAgua || undefined,
      codigoEnergia: dados.codigoEnergia || undefined,
      codigoIptu: dados.codigoIptu || undefined,
      numeroRegistro: dados.numeroRegistro || undefined
    };

    this.salvando = true;

    if (this.imovelId && this.enderecoId) {
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
        this.imovelService.atualizar(this.imovelId, dadosImovel)
      ]).subscribe({
        next: () => this.router.navigate(['/imoveis']),
        error: (error) => { console.error('Erro ao atualizar imóvel:', error); this.salvando = false; }
      });
      return;
    }

    // reaproveita um endereço já cadastrado, em vez de criar um duplicado
    if (dados.enderecoExistenteId) {
      this.imovelService.criar({ ...dadosImovel, enderecoId: dados.enderecoExistenteId }).subscribe({
        next: () => this.router.navigate(['/imoveis']),
        error: (error) => { console.error('Erro ao criar imóvel:', error); this.salvando = false; }
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
        this.imovelService.criar({ ...dadosImovel, enderecoId: endereco.id }).subscribe({
          next: () => this.router.navigate(['/imoveis']),
          error: (error) => { console.error('Erro ao criar imóvel:', error); this.salvando = false; }
        });
      },
      error: (error) => { console.error('Erro ao criar endereço:', error); this.salvando = false; }
    });
  }
}

