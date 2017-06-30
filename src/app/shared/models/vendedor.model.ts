export class Vendedor {
    id: number;
    vendedor_id: number;
    rut: string;
    digito_verificador: string;
    nombre: string;
    descuento_1: number;
    descuento_2: number;
    bodega_id: string;
    vendedor_tipo_id: number;
    dispositivo_pin: string;
    ultimo_cierre: string;
    proximo_cierre: string;
    clientes: number;
    visitas: number;
    actualizar: boolean;
    version_app: string;
    ultimo_acceso: string;
}
