import type { FieldErrors } from "@shared/lib/action-types";

export function FieldError({ errors, name }: { errors?: FieldErrors; name: string }) {
  if (!errors) return null;
  const raw = errors[name];
  const msg = Array.isArray(raw) ? raw[0] : raw;
  if (!msg) return null;
  return <p className="mt-1 text-xs text-red-600">{msg}</p>;
}
