import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs';
import { PaisSmall } from '../../interfaces/paises.interface';
import { PaisesService } from '../../services/paises.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css']
})
export class SelectorPageComponent implements OnInit {
  formSelector: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required],
  });

  regiones: string[] = [];
  paises: PaisSmall[] = [];
  // fronteras: string[] = [];
  fronteras: PaisSmall[] = [];

  cargando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private paisesService: PaisesService
  ) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    //Cuando cambie la region
    // this.formSelector.get('region')?.valueChanges.subscribe( data =>{
    //   console.log(data)
    //   this.paisesService.getPaisesPorRegion(data).subscribe( paises =>{
    //     this.paises = paises;
    //     console.log(paises);
    //   })
    // })

    //Cuando cambie la region
    this.formSelector.get('region')?.valueChanges
    .pipe(
      tap( (_) => {
        this.formSelector.get('pais')?.reset('');
        this.cargando = true
      } ),
      switchMap( region => this.paisesService.getPaisesPorRegion(region) )
    )
    .subscribe( paises => {
      this.paises = paises;
      this.cargando=false;
    });

    //Cuando cambie el pais
    this.formSelector.get('pais')?.valueChanges
    .pipe(
      tap( (_) => {
        this.formSelector.get('frontera')?.reset('');
        this.cargando = true
      }),
      switchMap( codigo => this.paisesService.getPaisPorCodigo(codigo) ),
      switchMap( pais => this.paisesService.getPaisesPorCodigos(pais?.borders!) )
    )
    .subscribe(data =>{
      this.fronteras = data;
      this.cargando = false;
    })


  }


  guardar() {
    console.log(this.formSelector.value)
  }

}
