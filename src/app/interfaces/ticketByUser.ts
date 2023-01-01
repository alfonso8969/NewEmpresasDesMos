export interface TicketByUser {
  ticket_code: string;
  id_technical?: number;
  user_name?: string;
  campo?: string;
  message?: string;
  fecha?: Date;
  respondido?: number;
  solucionado?: number;
  respuesta?: string;
  user_img?: string;
  ticket_refer?: string;
  fecha_solucion?: Date | string;
}
