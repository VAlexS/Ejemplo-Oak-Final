import { RouterContext } from "oak/router.ts";
import { eventosCollection } from "../db/conexiondb.ts";

type PostEventoCtx = RouterContext<
    "/addEvent",
    Record<string | number, string | undefined>,
    Record<string, any>
>;

export const addEvento = async (ctx: PostEventoCtx): Promise<void> => {
    try{
        //paso los datos a traves del body de json
        const result = ctx.request.body({type: "json"});
        const value = await result.value;
        if(!value?.titulo && !value?.fecha && !value?.inicio && !value?.final && !value?.invitados){
            ctx.response.body = {mensaje: "Te faltan datos por definir"};
            ctx.response.status = 400;
            return;
        }

        const inicio  = value.inicio; const final  = value.final;
        if(final <= inicio){
            ctx.response.body = {mensaje: "La hora de inicio y la hora de fin no son coherentes"};
            ctx.response.status = 400;
            return;
        }

        const fecha = new Date(value.fecha);


        const id = await eventosCollection.insertOne({
            titulo: value.titulo,
            descripcion: value.descripcion,
            fecha: fecha,
            inicio: inicio,
            final: final,
            invitados: value.invitados,
        });

        const anio = fecha.getFullYear();
        const mes = fecha.getMonth() + 1;
        const dia = fecha.getDate();


        const fechaCompleta = anio.toString().concat("-").concat(mes.toString()).concat("-").concat(dia.toString());
        console.log("Hola");
        console.log(fechaCompleta);

        ctx.response.body = {
            id: id.toString(),
            titulo: value.titulo,
            descripcion: value.descripcion,
            fecha: fechaCompleta,
            inicio: inicio,
            final: final,
            invitados: value.invitados,
        };

        ctx.response.status = 200;


        
    }catch(e){
        console.error(e);
        ctx.response.status = 500;
    }
};