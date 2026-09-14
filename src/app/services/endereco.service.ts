import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Endereco, NovoEndereco } from '../models/entidades.model';

@Injectable({ providedIn: 'root' })
export class EnderecoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/endereco`;

  listar(): Observable<Endereco[]> {
    return this.http.get<Endereco[]>(this.baseUrl);
  }

  buscarPorId(id: string): Observable<Endereco> {
    return this.http.get<Endereco>(`${this.baseUrl}/${id}`);
  }

  criar(dados: NovoEndereco): Observable<Endereco> {
    return this.http.post<Endereco>(this.baseUrl, dados);
  }

  atualizar(id: string, dados: Partial<NovoEndereco>): Observable<Endereco> {
    return this.http.put<Endereco>(`${this.baseUrl}/${id}`, dados);
  }

  remover(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
