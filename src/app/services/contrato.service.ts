import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ContratoRecibo, ContratoResumo } from '../models/contrato-recibo.model';
import { Contrato, NovoContrato } from '../models/entidades.model';

@Injectable({ providedIn: 'root' })
export class ContratoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  buscarRecibo(id: string): Observable<ContratoRecibo> {
    return this.http.get<ContratoRecibo>(`${this.baseUrl}/contrato/${id}/recibo`);
  }

  listarResumo(ativo?: string): Observable<ContratoResumo[]> {
    const url = ativo ? `${this.baseUrl}/contrato/resumo?ativo=${ativo}` : `${this.baseUrl}/contrato/resumo`;
    return this.http.get<ContratoResumo[]>(url);
  }

  listar(): Observable<Contrato[]> {
    return this.http.get<Contrato[]>(`${this.baseUrl}/contrato`);
  }

  buscarPorId(id: string): Observable<Contrato> {
    return this.http.get<Contrato>(`${this.baseUrl}/contrato/${id}`);
  }

  criar(dados: NovoContrato): Observable<Contrato> {
    return this.http.post<Contrato>(`${this.baseUrl}/contrato`, dados);
  }

  atualizar(id: string, dados: Partial<NovoContrato>): Observable<Contrato> {
    return this.http.put<Contrato>(`${this.baseUrl}/contrato/${id}`, dados);
  }

  remover(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/contrato/${id}`);
  }
}

