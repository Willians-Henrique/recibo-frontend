import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Imovel, NovoImovel } from '../models/entidades.model';

@Injectable({ providedIn: 'root' })
export class ImovelService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/imovel`;

  listar(): Observable<Imovel[]> {
    return this.http.get<Imovel[]>(this.baseUrl);
  }

  buscarPorId(id: string): Observable<Imovel> {
    return this.http.get<Imovel>(`${this.baseUrl}/${id}`);
  }

  criar(dados: NovoImovel): Observable<Imovel> {
    return this.http.post<Imovel>(this.baseUrl, dados);
  }

  atualizar(id: string, dados: Partial<NovoImovel>): Observable<Imovel> {
    return this.http.put<Imovel>(`${this.baseUrl}/${id}`, dados);
  }

  remover(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
