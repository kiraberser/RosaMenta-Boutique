export type Direccion = {
  id: number;
  calle: string;
  ciudad: string;
  cp: string;
  estado: string;
  pais: string;
  es_principal: boolean;
  created_at: string;
  updated_at: string;
};

export type Usuario = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string | null;
  avatar_url?: string | null;
  is_staff: boolean;
  acepta_newsletter: boolean;
  direcciones: Direccion[];
  date_joined: string;
};

export type AuthTokens = {
  access: string;
  refresh: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  password: string;
  password_confirm: string;
  acepta_newsletter?: boolean;
};
