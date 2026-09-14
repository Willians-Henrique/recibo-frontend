import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { EnderecoService } from '../services/endereco.service';
import { UFS_VALIDAS } from '../models/entidades.model';

@Component({
  selector: 'app-endereco-form-page',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './endereco-form-page.component.html',
  styleUrl: './endereco-form-page.component.scss'
})
export class EnderecoFormPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly enderecoService = inject(EnderecoService);

  readonly ufs = UFS_VALIDAS;

  enderecoId: string | null = null;
  salvando = false;

  form = this.fb.group({
    rua: [''],
    numero: [''],
    complemento: [''],
    bairro: [''],
    cidade: [''],
    estado: [''],
    pais: ['Brasil']
  });

  ngOnInit(): void {
    this.enderecoId = this.route.snapshot.paramMap.get('id');

    if (!this.enderecoId) {
      return;
    }

    this.enderecoService.buscarPorId(this.enderecoId).subscribe({
      next: (endereco) => this.form.patchValue({ ...endereco, complemento: endereco.complemento ?? '' }),
      error: (error) => console.error('Erro ao buscar endereço:', error)
    });
  }

  salvar(): void {
    this.salvando = true;
    const dados = this.form.value as any;

    if (this.enderecoId) {
      this.enderecoService.atualizar(this.enderecoId, dados).subscribe({
        next: () => this.router.navigate(['/enderecos']),
        error: (error) => { console.error('Erro ao atualizar endereço:', error); this.salvando = false; }
      });
      return;
    }

    this.enderecoService.criar(dados).subscribe({
      next: () => this.router.navigate(['/enderecos']),
      error: (error) => { console.error('Erro ao criar endereço:', error); this.salvando = false; }
    });
  }
}

