import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ContratoService } from '../services/contrato.service';
import { PessoaService } from '../services/pessoa.service';
import { ImovelService } from '../services/imovel.service';
import { EnderecoService } from '../services/endereco.service';
import {
  TIPOS_LOCACAO_VALIDOS,
  GARANTIAS_VALIDAS,
  STATUS_CONTRATO_VALIDOS,
  Pessoa,
  Imovel,
  Endereco
} from '../models/entidades.model';

@Component({
  selector: 'app-contrato-form-page',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './contrato-form-page.component.html',
  styleUrl: './contrato-form-page.component.scss'
})
export class ContratoFormPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly contratoService = inject(ContratoService);
  private readonly pessoaService = inject(PessoaService);
  private readonly imovelService = inject(ImovelService);
  private readonly enderecoService = inject(EnderecoService);

  readonly tiposLocacao = TIPOS_LOCACAO_VALIDOS;
  readonly garantias = GARANTIAS_VALIDAS;
  readonly statusContrato = STATUS_CONTRATO_VALIDOS;

  contratoId: string | null = null;
  pessoas: Pessoa[] = [];
  imoveis: Imovel[] = [];
  private enderecosPorId = new Map<string, Endereco>();
  salvando = false;

  form = this.fb.group({
    imovelId: [''],
    inquilinoId: [''],
    destinatarioId: [''],
    tipoLocacao: [''],
    garantia: [''],
    dataInicio: [''],
    duracaoMeses: [12],
    dataFim: [''],
    diaVencimento: [5],
    proximoReajuste: [''],
    valorAluguel: [''],
    taxaAdministracao: [''],
    acrescimoInquilino: ['0'],
    admAcrescimoInquilino: ['0'],
    descontoInquilino: ['0'],
    admDescontoInquilino: ['0'],
    acrescimoProprietario: ['0'],
    descontoProprietario: ['0'],
    iptu: ['0'],
    iptuProprietario: ['0'],
    condominio: ['0'],
    condominioProprietario: ['0'],
    seguroFianca: ['0'],
    seguroIncendio: ['0'],
    parcelaCaucao: ['0'],
    observacoes: [''],
    pix: [''],
    agenciaConta: [''],
    retirada: [false],
    ativo: ['ativo']
  });

  ngOnInit(): void {
    this.pessoaService.listar().subscribe({
      next: (pessoas) => this.pessoas = pessoas,
      error: (error) => console.error('Erro ao listar pessoas:', error)
    });

    this.imovelService.listar().subscribe({
      next: (imoveis) => this.imoveis = imoveis,
      error: (error) => console.error('Erro ao listar imoveis:', error)
    });

    this.enderecoService.listar().subscribe({
      next: (enderecos) => this.enderecosPorId = new Map(enderecos.map((endereco) => [endereco.id, endereco])),
      error: (error) => console.error('Erro ao listar enderecos:', error)
    });

    this.contratoId = this.route.snapshot.paramMap.get('id');

    if (!this.contratoId) {
      return;
    }

    this.contratoService.buscarPorId(this.contratoId).subscribe({
      next: (contrato) => this.form.patchValue(contrato),
      error: (error) => console.error('Erro ao buscar contrato:', error)
    });
  }

  formatarImovel(imovel: Imovel): string {
    const endereco = this.enderecosPorId.get(imovel.enderecoId);

    if (!endereco) {
      return `${imovel.tipo} — ${imovel.numeroRegistro || imovel.id}`;
    }

    return `${endereco.rua}, ${endereco.numero} - ${endereco.bairro}, ${endereco.cidade}`;
  }

  salvar(): void {
    this.salvando = true;
    const dados = this.form.value as any;

    if (this.contratoId) {
      this.contratoService.atualizar(this.contratoId, dados).subscribe({
        next: () => this.router.navigate(['/contratos']),
        error: (error) => { console.error('Erro ao atualizar contrato:', error); this.salvando = false; }
      });
      return;
    }

    this.contratoService.criar(dados).subscribe({
      next: () => this.router.navigate(['/contratos']),
      error: (error) => { console.error('Erro ao criar contrato:', error); this.salvando = false; }
    });
  }
}

