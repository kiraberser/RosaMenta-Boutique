"use client";

import * as React from "react";
import { useFormState } from "react-dom";

type ActionFn<S, P> = (state: Awaited<S>, payload: P) => S | Promise<S>;

type UseCompatActionState = <S, P = FormData>(
  action: ActionFn<S, P>,
  initialState: Awaited<S>,
  permalink?: string,
) => [state: Awaited<S>, dispatch: (payload: P) => void, isPending: boolean];

const reactRecord = React as unknown as Record<string, unknown>;
const reactUseActionState = reactRecord["useActionState"] as
  | UseCompatActionState
  | undefined;

export const useCompatActionState: UseCompatActionState =
  (reactUseActionState ?? (useFormState as unknown as UseCompatActionState));
