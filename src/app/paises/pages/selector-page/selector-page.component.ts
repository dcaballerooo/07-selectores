import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { switchMap, tap } from 'rxjs';

import { PaisesService } from '../../services/paises.service';
import { PaisSmall } from '../../interfaces/paises.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
})
export class SelectorPageComponent implements OnInit {

  myForm: FormGroup = this.fb.group({
    region: ['', Validators.required ],
    pais: ['', Validators.required ],
    frontera: ['', Validators.required ]

  })

  //llenar selectores
  regiones: string[]= [];
  paises: PaisSmall[] = [];
  // fronteras: string[] = [];
  fronteras: PaisSmall[] = [];


  //UI
  cargando: boolean = false;

  constructor(private fb: FormBuilder,
              private paisesService: PaisesService) { }

  ngOnInit(): void {

    this.regiones = this.paisesService.regiones;


    //Cuando cambie mi region
    // this.myForm.get('region')?.valueChanges
    //             .subscribe( region => {
    //               console.log(region)

    //               this.paisesService.getPaisesPorRegion( region )
    //                   .subscribe( paises => {
    //                     console.log( paises );
    //                       this.paises = paises;
    //                   })
    //             })

    //Cuando cambie mi region
    this.myForm.get('region')?.valueChanges
    .pipe(
      tap( ( _ )=> {
          this.myForm.get('pais')?.reset('');
          this.cargando = true;
      }),
      switchMap( region => this.paisesService.getPaisesPorRegion( region ) )
    )   
    .subscribe( paises => {
      this.paises = paises;
      this.cargando = false;
    })

    //Cuando cambie mi pais 
    this.myForm.get('pais')?.valueChanges
    .pipe(
      tap( ( _ ) => {
        this.fronteras = [];
        this.myForm.get('frontera')?.reset('');
        this.cargando = true;
      }),
      switchMap( code => this.paisesService.getPaisPorCode( code ) ),
      switchMap( pais => this.paisesService.getPaisesPorCodigos(pais?.borders!))
    )
    .subscribe( paises => {
      // this.fronteras = pais?.borders || [];
      this.fronteras = paises;
      this.cargando = false;
    } )


  }


  guardar(){
    console.log(this.myForm.value);
  }

}
