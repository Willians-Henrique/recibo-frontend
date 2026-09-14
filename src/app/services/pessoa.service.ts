import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pessoa, NovaPessoa } from '../models/entidades.model';

@Injectable({ providedIn: 'root' })
export class PessoaService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/pessoa`;

  listar(): Observable<Pessoa[]> {
    return this.http.get<Pessoa[]>(this.baseUrl);
  }

  buscarPorId(id: string): Observable<Pessoa> {
    return this.http.get<Pessoa>(`${this.baseUrl}/${id}`);
  }

  criar(dados: NovaPessoa): Observable<Pessoa> {
    return this.http.post<Pessoa>(this.baseUrl, dados);
  }

  atualizar(id: string, dados: Partial<NovaPessoa>): Observable<Pessoa> {
    return this.http.put<Pessoa>(`${this.baseUrl}/${id}`, dados);
  }

  remover(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
