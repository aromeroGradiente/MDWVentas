import { Component, ElementRef, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';

import { VendedorService } from '../shared/services/vendedor.service';
import { VendedorTipoService } from '../shared/services/vendedor-tipo.service';
import { BodegaService } from '../shared/services/bodega.service';

import { VendedorTipo } from '../shared/models/vendedor-tipo.model';
import { Vendedor } from '../shared/models/vendedor.model';
import { Bodega } from '../shared/models/bodega.model';

declare var $: any;

@Component({
  selector: 'app-vendedores',
  templateUrl: './vendedores.component.html',
  styleUrls: ['./vendedores.component.css']
})
export class VendedoresComponent implements OnInit {

  private vendedores: Vendedor[];
  vendedoresFiltrados: Vendedor[];
  vendedoresActualizar = {}; // new Array<{ id: number, actualizar: number }>();
  vendedoresTipo: VendedorTipo[];
  bodegas: Bodega[];
  soloPin = false;
  seleccionarTodos = false;
  buttonLock = true;

  filtrosSelect = {
    vendedor_tipo_id: 0,
    bodega_id: 0
  };

  filtrosInput = {
    rut: 0,
    nombre: 0,
    dispositivo_pin: 0
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vendedorService: VendedorService,
    private vendedorTipoService: VendedorTipoService,
    private bodegaService: BodegaService,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) { }


  ngOnInit() {

    // Se obtienen los vendedores
    this.vendedorService.getAll()
      .subscribe(vendedores => {
        this.vendedores = vendedores.slice(0, 50);
        this.vendedoresFiltrados = this.vendedores;
      });

    // Se obtienen los tipos de vendedor
    this.vendedorTipoService.getAll()
      .subscribe(vendedoresTipos => {
        this.vendedoresTipo = vendedoresTipos;
      });

    // Se obtienen las bodegas
    this.bodegaService.getAll()
      .subscribe(bodegas => {

        this.bodegas = bodegas;

        // Refrescar selectpicker bootstrap
        setTimeout(() => {
          $('.selectpicker').selectpicker('refresh');
          // this.load_js();
        }, 500)

      })
  }


  onChangeSelector(event: Event, selector) {

    const value = (event.target as HTMLSelectElement).value;
    const newValue = value === 'Todos' || value === '' ? 0 : (event.target as HTMLSelectElement).value;

    this.filtrar(selector, newValue);

  }

  onCheckBoxFiltro() {
    this.vendedoresFiltrados = this.vendedores;

    // Si solo pin === false, hago filtro de select e input
    if (!this.soloPin) {
      this.filtrarSelect();
    }

    this.filtrarInput();
  }

  filtrar(selector, value) {

    // Si es un filtro select se transforma valor a numero
    if (selector === 'bodega_id' || selector === 'vendedor_tipo_id') {
      this.filtrosSelect[selector] = +value;
    } else {
      this.filtrosInput[selector] = value;
    }

    this.vendedoresFiltrados = this.vendedores;

    this.filtrarSelect();

    this.filtrarInput();
  }

  filtrarSelect() {

    // Si solo pin activado, no se filtran los selects
    if (this.soloPin) {
      return;
    }

    for (const filtro in this.filtrosSelect) {

      // Si un filtro === 0 significa que no ha sido asignado por usuario y se pasa al siguiente
      if (this.filtrosSelect[filtro] === 0) {
        continue;
      }

      // Se filtran los vendedores
      this.vendedoresFiltrados = this.vendedoresFiltrados
        .filter(vendedor =>
          vendedor[filtro] === this.filtrosSelect[filtro]
        );
    }
  }

  filtrarInput() {

    // Hago una copia para no perder los filtros originales
    const tmpFiltrosInput: any = {};
    Object.assign(tmpFiltrosInput, this.filtrosInput);

    // Si solo pin activado, seteo otros filtros a cero
    if (this.soloPin) {
      tmpFiltrosInput.nombre = 0;
      tmpFiltrosInput.rut = 0;
    }

    for (const filtro in tmpFiltrosInput) {

      // Si un filtro === 0 significa que no ha sido asignado por usuario y se pasa al siguiente
      if (tmpFiltrosInput[filtro] === 0) {
        continue;
      }

      // Filtramos vendedores
      this.vendedoresFiltrados = this.vendedoresFiltrados.filter(vendedor => {

        // Si el campo del vendedor es nulo no se puede filtrar y se pasa al siguiente
        if (vendedor[filtro] === null) {
          return 0;
        }

        return (vendedor[filtro].toString().toLowerCase().indexOf(tmpFiltrosInput[filtro]) !== -1)

      });
    }
  }

  onCheckBoxActualizar(event: Event) {

    const value = (event.target as HTMLSelectElement).checked === true ? 1 : 0;
    const vendedor_id = (event.target as HTMLSelectElement).id;

    this.vendedoresActualizar[vendedor_id] = value;
    this.buttonLock = false;
  }

  onSelectAll() {
    this.seleccionarTodos = !this.seleccionarTodos;
    this.buttonLock = false;

    const checkBoxes = this.elementRef.nativeElement.querySelectorAll('table td .form-group input');
    _.forEach(checkBoxes, (element) => {
      this.renderer.setProperty(element, 'checked', this.seleccionarTodos);
      this.vendedoresActualizar[element.id] = +this.seleccionarTodos;
    });

  }

  onNotify() {
    const data = [];

    _.forEach(this.vendedoresActualizar, (value, id) => {
      data.push({ id: id, actualizar: value });
    })

    this.vendedorService.actualizarVersion(data)
      .subscribe(response => {
        if (response.result === true) {

          if (response.respuestas) {

            _.forEach(response.respuestas, (isUpdated, id) => {

              if (isUpdated) {

                const vendedorIndex = this.vendedoresFiltrados.findIndex((vendedor) => vendedor.id === +id);
                const vendedor = this.vendedoresFiltrados[vendedorIndex];

                // Se actualiza campo de vendedor
                vendedor.actualizar = this.vendedoresActualizar[id];

                // Eliminar dato actualizado
                delete this.vendedoresActualizar[id];
              }
            })
          }
        }
        this.buttonLock = true;
      });
  }
}
