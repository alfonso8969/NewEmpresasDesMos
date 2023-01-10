export interface Log {
  id_log?: number;
  id_user: number;
  user_name?: string;
  user_email?: string;
  user_img?: string;
  ip: string;
  action: string;
  date: string;
  message: string;
  status: boolean;
}