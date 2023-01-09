export interface Session {
  id_session?: number;
  id_user?: number;
  user_name?: string;
  user_email: string;
  user_img?: string;
  date: string;
  ip?: string;
  message: string;
  complete: boolean;
}
