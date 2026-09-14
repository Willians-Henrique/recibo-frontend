import { Routes } from '@angular/router';
import { ReciboPageComponent } from './recibo-page/recibo-page.component';
import { ListaContratosPageComponent } from './lista-contratos-page/lista-contratos-page.component';
import { ContratoFormPageComponent } from './contrato-form-page/contrato-form-page.component';
import { PessoaListaPageComponent } from './pessoa-lista-page/pessoa-lista-page.component';
import { PessoaFormPageComponent } from './pessoa-form-page/pessoa-form-page.component';
import { ImovelListaPageComponent } from './imovel-lista-page/imovel-lista-page.component';
import { ImovelFormPageComponent } from './imovel-form-page/imovel-form-page.component';
import { EnderecoListaPageComponent } from './endereco-lista-page/endereco-lista-page.component';
import { EnderecoFormPageComponent } from './endereco-form-page/endereco-form-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'contratos', pathMatch: 'full' },
  { path: 'contratos', component: ListaContratosPageComponent },
  { path: 'contratos/novo', component: ContratoFormPageComponent },
  { path: 'contratos/:id/editar', component: ContratoFormPageComponent },
  { path: 'recibo', component: ReciboPageComponent },
  { path: 'pessoas', component: PessoaListaPageComponent },
  { path: 'pessoas/novo', component: PessoaFormPageComponent },
  { path: 'pessoas/:id/editar', component: PessoaFormPageComponent },
  { path: 'imoveis', component: ImovelListaPageComponent },
  { path: 'imoveis/novo', component: ImovelFormPageComponent },
  { path: 'imoveis/:id/editar', component: ImovelFormPageComponent },
  { path: 'enderecos', component: EnderecoListaPageComponent },
  { path: 'enderecos/novo', component: EnderecoFormPageComponent },
  { path: 'enderecos/:id/editar', component: EnderecoFormPageComponent },
];




