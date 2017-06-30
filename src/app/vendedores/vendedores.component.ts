import { Component, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
declare var $: any;

import { VendedorService } from '../shared/services/vendedor.service';
import { VendedorTipoService } from '../shared/services/vendedor-tipo.service';
import { BodegaService } from '../shared/services/bodega.service';

import { VendedorTipo } from '../shared/models/vendedor-tipo.model';
import { Vendedor } from '../shared/models/vendedor.model';
import { Bodega } from '../shared/models/bodega.model';



@Component({
  selector: 'app-vendedores',
  templateUrl: './vendedores.component.html',
  styleUrls: ['./vendedores.component.css']
})
export class VendedoresComponent implements OnInit {

  private vendedores: Vendedor[];
  vendedoresFiltrados: Vendedor[];
  vendedoresTipo: VendedorTipo[];
  bodegas: Bodega[];
  soloPin = false;

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
  ) { }


  ngOnInit() {

    this.vendedorService.getAll()
      .subscribe(vendedores => {
        this.vendedores = vendedores.slice(0, 50);
        this.vendedoresFiltrados = this.vendedores;
      });

    this.vendedorTipoService.getAll()
      .subscribe(vendedoresTipos => {
        this.vendedoresTipo = vendedoresTipos;
      });

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

  onCheckBox() {
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
}
