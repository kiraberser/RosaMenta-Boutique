export type FieldErrors = Record<string, string[] | string | undefined>;

export type ActionState<T = unknown> = {
  success: boolean;
  message: string;
  errors?: FieldErrors;
  data?: T;
};

export type FormStatus = "idle" | "pending" | "success" | "error";

export const initialActionState: ActionState = {
  success: false,
  message: "",
};

export function okState<T>(message: string, data?: T): ActionState<T> {
  return { success: true, message, data };
}

export function errorState(message: string, errors?: FieldErrors): ActionState {
  return { success: false, message, errors };
}
