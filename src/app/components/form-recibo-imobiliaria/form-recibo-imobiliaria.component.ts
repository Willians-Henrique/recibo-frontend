import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ContratoRecibo } from '../../models/contrato-recibo.model';
import { paraNumero, formatarReais } from '../../utils/dinheiro.util';

interface LinhaValor {
  label?: string;
  valor?: string;
}

@Component({
  selector: 'app-form-recibo-imobiliaria',
  imports: [MatFormFieldModule],
  templateUrl: './form-recibo-imobiliaria.component.html',
  styleUrl: './form-recibo-imobiliaria.component.scss'
})
export class FormReciboImobiliariaComponent implements OnChanges {
  @Input() contrato: ContratoRecibo | null = null;

  // mesmos campos dos dois lados por enquanto, só pra visualizar o layout
  valoresRecebidos: LinhaValor[] = [
    { label: 'Valor', valor: 'R$ 0,00' },
    { label: 'Iptu', valor: 'R$ 0,00' },
    { label: 'Acréscimo', valor: 'R$ 0,00' },
    { label: 'Desconto', valor: 'R$ 0,00' },
    { label: 'Condomínio', valor: 'R$ 0,00' },
    { label: 'Seguro fiança', valor: 'R$ 0,00' },
    { label: 'Seguro incêndio', valor: 'R$ 0,00' },
    { label: 'Parcela caução', valor: 'R$ 0,00' },
    { label: 'Total', valor: 'R$ 0,00' }
  ];

  valoresARepassar: LinhaValor[] = [
    { label: 'Valor aluguel', valor: 'R$ 0,00' },
    { label: 'Administração', valor: 'R$ 0,00' },
    { label: 'Adm Acrescimo Inquilino', valor: 'R$ 0,00' },
    { label: 'Adm Desconto Inquilino', valor: 'R$ 0,00' },
    { label: 'Iptu', valor: 'R$ 0,00' },
    { label: 'Acréscimo', valor: 'R$ 0,00' },
    { label: 'Desconto', valor: 'R$ 0,00' },
    { label: 'Condomínio', valor: 'R$ 0,00' },
    { label: 'Total', valor: 'R$ 0,00' }
  ];

  dadosRepasse: LinhaValor[] = [
    { label: 'Recebedor', valor: 'R$ 0,00' },
    { label: 'Retirada', valor: 'sim' },
    { label: 'Pix', valor: 'R$ 0,00' },
    { label: 'Agência e Conta', valor: 'R$ 0,00' }
  ];
  dadosContrato: LinhaValor[] = [
    { label: 'Início do contrato', valor: '01/10/2020' },
    { label: 'Vigência', valor: '12 meses' },
    { label: 'Término do contrato', valor: '01/10/2021' }
  ];

  dadosFinais: LinhaValor[] = [
    { label: 'Data de recebimento', valor: '01/10/2026' },
    { label: 'Assinatura do recebedor', valor: '' }
  ];

  dadosIdentificacao: LinhaValor[] = [
    { label: 'Inquilino', valor: '' },
    { label: 'Proprietário', valor: '' },
    { label: 'Endereço do imóvel', valor: '' }
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contrato'] && this.contrato) {
      const c = this.contrato;

      this.valoresRecebidos = [
        { label: 'Valor', valor: `R$ ${c.valorAluguel}` },
        { label: 'Iptu', valor: `R$ ${c.iptu}` },
        { label: 'Acréscimo', valor: `R$ ${c.acrescimoInquilino}` },
        { label: 'Desconto', valor: `R$ ${c.descontoInquilino}` },
        { label: 'Condomínio', valor: `R$ ${c.condominio}` },
        { label: 'Seguro fiança', valor: `R$ ${c.seguroFianca}` },
        { label: 'Seguro incêndio', valor: `R$ ${c.seguroIncendio}` },
        { label: 'Parcela caução', valor: `R$ ${c.parcelaCaucao}` },
        { label: 'Total', valor: `R$ ${this.calcularTotalRecebido(c)}` }
      ];

      this.valoresARepassar = [
        { label: 'Valor aluguel', valor: `R$ ${c.valorAluguel}` },
        { label: 'Administração', valor: `R$ ${c.taxaAdministracao}` },
        { label: 'Adm Acrescimo Inquilino', valor: `R$ ${c.admAcrescimoInquilino}` },
        { label: 'Adm Desconto Inquilino', valor: `R$ ${c.admDescontoInquilino}` },
        { label: 'Iptu', valor: `R$ ${c.iptuProprietario}` },
        { label: 'Acréscimo', valor: `R$ ${c.acrescimoProprietario}` },
        { label: 'Desconto', valor: `R$ ${c.descontoProprietario}` },
        { label: 'Condomínio', valor: `R$ ${c.condominioProprietario}` },
        { label: 'Total', valor: `R$ ${this.calcularTotalARepassar(c)}` }
      ];

      this.dadosRepasse = [
        { label: 'Recebedor', valor: c.destinatario.nome },
        { label: 'Retirada', valor: c.retirada ? 'sim' : 'não' },
        { label: 'Pix', valor: c.pix ?? '-' },
        { label: 'Agência e Conta', valor: c.agenciaConta ?? '-' }
      ];

      this.dadosContrato = [
        { label: 'Início do contrato', valor: c.dataInicio },
        { label: 'Vigência', valor: `${c.duracaoMeses} meses` },
        { label: 'Término do contrato', valor: c.dataFim }
      ];

      this.dadosFinais = [
        { label: 'Data de recebimento', valor: '' },
        { label: 'Assinatura do recebedor', valor: '' } // fica em branco, assinado à caneta
      ];

      this.dadosIdentificacao = [
        { label: 'Inquilino', valor: c.inquilino.nome },
        { label: 'Proprietário', valor: c.imovel.proprietario.nome },
        { label: 'Endereço do imóvel', valor: this.formatarEndereco(c) }
      ];
    }
  }

  private formatarEndereco(c: ContratoRecibo): string {
    const { rua, numero, bairro, cidade } = c.imovel.endereco;
    return `${rua}, ${numero} - ${bairro}, ${cidade}`;
  }

  private calcularTotalRecebido(c: ContratoRecibo): string {
    const total =
      paraNumero(c.valorAluguel) +
      paraNumero(c.iptu) +
      paraNumero(c.acrescimoInquilino) -
      paraNumero(c.descontoInquilino) +
      paraNumero(c.condominio) +
      paraNumero(c.seguroFianca) +
      paraNumero(c.seguroIncendio) +
      paraNumero(c.parcelaCaucao);

    return formatarReais(total);
  }

  private calcularTotalARepassar(c: ContratoRecibo): string {
    const total =
      paraNumero(c.valorAluguel) -
      paraNumero(c.taxaAdministracao) -
      paraNumero(c.admAcrescimoInquilino) +
      paraNumero(c.admDescontoInquilino) +
      paraNumero(c.iptuProprietario) +
      paraNumero(c.acrescimoProprietario) -
      paraNumero(c.descontoProprietario) +
      paraNumero(c.condominioProprietario);

    return formatarReais(total);
  }
}



