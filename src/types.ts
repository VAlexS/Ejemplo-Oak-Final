export type Evento = {
    id: string;
    titulo: string;
    descripcion?: string;
    fecha: string;
    inicio: number;
    final: number;
    invitados: string[];
};