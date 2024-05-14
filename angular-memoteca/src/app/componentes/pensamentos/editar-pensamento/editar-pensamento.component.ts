import { Router, ActivatedRoute } from '@angular/router';
import { PensamentoService } from './../pensamento.service';
import { Pensamento } from './../pensamento';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-editar-pensamento',
  templateUrl: './editar-pensamento.component.html',
  styleUrls: ['./editar-pensamento.component.css']
})
export class EditarPensamentoComponent implements OnInit {

  pensamento: Pensamento = {
    id: 0,
    conteudo: '',
    autoria: '',
    modelo: '',
    favorito: false,
  }

  formulario!: FormGroup

  constructor(
    private service: PensamentoService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder : FormBuilder
  ) {
   }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')
    this.service.buscarPorId(parseInt(id!)).subscribe((pensamento) => {
      this.pensamento = pensamento;
      console.log(this.pensamento);

      this.formulario = this.formBuilder.group({
        conteudo: [pensamento.conteudo, Validators.compose([
          Validators.required,
          Validators.pattern(/\S+/), 
        ])],
        autoria: [pensamento.autoria, Validators.compose([
          Validators.required,
          Validators.minLength(3),
        ])],
        modelo: [pensamento.modelo],
        favorito: [pensamento.favorito]
      });
    });
  }

  editarPensamento() {
    if (this.formulario.valid) {

      this.pensamento.autoria = this.formulario.get('autoria')?.value;
      this.pensamento.conteudo = this.formulario.get('conteudo')?.value;
      this.pensamento.modelo = this.formulario.get('modelo')?.value;

      this.service.editar(this.pensamento).subscribe(() => {
        this.router.navigate(['/listarPensamento'])
      });
    }
  }

  cancelar() {
    this.router.navigate(['/listarPensamento'])
  }

  habilitarBotao(): string{
    if (this.formulario.valid) {
     return 'botao';
    }else{
     return 'botao__desabilitado'
    }
   }
 

}
