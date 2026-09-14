import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ContratoRecibo, EnderecoRecibo } from '../../models/contrato-recibo.model';
import { paraNumero, formatarReais } from '../../utils/dinheiro.util';

@Component({
  selector: 'app-form-recibo-cliente',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './form-recibo-cliente.component.html',
  styleUrl: './form-recibo-cliente.component.scss'
})
export class FormReciboClienteComponent implements OnChanges {
  @Input() contrato: ContratoRecibo | null = null;

  private readonly fb = inject(FormBuilder);

  form = this.fb.group({
    imovel: this.fb.group({
      endereco: ['']
    }),
    proprietario: this.fb.group({
      nome: [''],
      cpf: ['']
    }),
    inquilino: this.fb.group({
      nome: [''],
      cpf: ['']
    }),
    observacoes: [''],
    valorAluguel: [''],
    iptu: [''],
    acrescimo: [''],
    desconto: [''],
    condominio: [''],
    seguroFianca: [''],
    seguroIncendio: [''],
    parcelaCaucao: [''],
    total: [''],
    dataRecebimento: this.fb.control<Date | null>(null),
    assinaturaRecebedor: ['']
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contrato'] && this.contrato) {
      const contrato = this.contrato;

      this.form.patchValue({
        imovel: { endereco: this.formatarEndereco(contrato.imovel.endereco) },
        proprietario: { nome: contrato.imovel.proprietario.nome, cpf: contrato.imovel.proprietario.cpf },
        inquilino: { nome: contrato.inquilino.nome, cpf: contrato.inquilino.cpf },
        valorAluguel: contrato.valorAluguel,
        iptu: contrato.iptu,
        acrescimo: contrato.acrescimoInquilino,
        desconto: contrato.descontoInquilino,
        condominio: contrato.condominio,
        seguroFianca: contrato.seguroFianca,
        seguroIncendio: contrato.seguroIncendio,
        parcelaCaucao: contrato.parcelaCaucao,
        total: this.calcularTotal(contrato),
        assinaturaRecebedor: contrato.destinatario.nome
      });
    }
  }

  private calcularTotal(contrato: ContratoRecibo): string {
    const total =
      paraNumero(contrato.valorAluguel) +
      paraNumero(contrato.iptu) +
      paraNumero(contrato.acrescimoInquilino) -
      paraNumero(contrato.descontoInquilino) +
      paraNumero(contrato.condominio) +
      paraNumero(contrato.seguroFianca) +
      paraNumero(contrato.seguroIncendio) +
      paraNumero(contrato.parcelaCaucao);

    return formatarReais(total);
  }

  private formatarEndereco(endereco: EnderecoRecibo): string {
    return `${endereco.rua}, ${endereco.numero} - ${endereco.bairro}, ${endereco.cidade} - ${endereco.estado}`;
  }
}


