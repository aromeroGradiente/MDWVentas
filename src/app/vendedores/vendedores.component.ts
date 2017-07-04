import { Component, ElementRef, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';

import { VendedorService } from '../shared/services/vendedor.service';
import { VendedorTipoService } from '../shared/services/vendedor-tipo.service';
import { BodegaService } from '../shared/services/bodega.service';
import { PagerService } from '../shared/services/pager.service';

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

  // pager object
  pager: any = {};

  // paged items
  pagedItems: any[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vendedorService: VendedorService,
    private vendedorTipoService: VendedorTipoService,
    private bodegaService: BodegaService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private pagerService: PagerService
  ) { }


  ngOnInit() {

    // Se obtienen los vendedores
    this.vendedorService.getAll()
      .subscribe(vendedores => {
        this.vendedores = vendedores; // .slice(0, 50);
        this.vendedoresFiltrados = this.vendedores;
        this.setPage(1);
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
        }, 500)

      })
  }


  onChangeSelector(event: Event, selector) {

    const value = (event.target as HTMLSelectElement).value;
    const newValue = value === 'Todos' || value === '' ? 0 : (event.target as HTMLSelectElement).value;

    this.filtrar(selector, newValue);

  }

  onCheckBoxFiltro() {
    this.filtrar()
    this.setPage(1);
  }

  checkSoloPin() {
    if (this.soloPin) {
      this.vendedoresFiltrados = this.vendedores
        .filter((vendedor) => vendedor.dispositivo_pin !== null && vendedor.dispositivo_pin !== '');
    } else {
      this.vendedoresFiltrados = this.vendedores;
    }
  }

  filtrar(selector = null, value = null) {
    this.checkSoloPin();
    // Si es un filtro select se transforma valor a numero
    if (selector === 'bodega_id' || selector === 'vendedor_tipo_id') {
      this.filtrosSelect[selector] = +value;
    } else if (selector === 'rut' || selector === 'nombre' || selector === 'dispositivo_pin') {
      this.filtrosInput[selector] = value;
    }

    this.filtrarSelect();

    this.filtrarInput();

    this.setPage(1);
  }

  filtrarSelect() {

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

    for (const filtro in this.filtrosInput) {

      // Si un filtro === 0 significa que no ha sido asignado por usuario y se pasa al siguiente
      if (this.filtrosInput[filtro] === 0) {
        continue;
      }

      // Filtramos vendedores
      this.vendedoresFiltrados = this.vendedoresFiltrados.filter(vendedor => {

        // Si el campo del vendedor es nulo no se puede filtrar y se pasa al siguiente
        if (vendedor[filtro] === null) {
          return 0;
        }

        return (vendedor[filtro].toString().toLowerCase().indexOf(this.filtrosInput[filtro]) !== -1)

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


  setPage(page: number) {
    if ((page < 1 || page > this.pager.totalPages) && this.pager.totalPages !== 0) {
      return;
    }

    // get pager object from service
    this.pager = this.pagerService.getPager(this.vendedoresFiltrados.length, page);

    // get current page of items
    this.pagedItems = this.vendedoresFiltrados.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
}
