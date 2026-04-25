"use client";

import { useState, useActionState } from "react";
import { updateUsername, type UsernameState } from "@/lib/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  username: string;
}

const initialState: UsernameState = { error: null };

export function EditUsernameForm({ username }: Props) {
  const [inputValue, setInputValue] = useState(username);
  const [state, formAction, isPending] = useActionState(updateUsername, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="username" className="text-silver">
          Username
        </Label>
        <Input
          id="username"
          name="username"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          required
          minLength={3}
          maxLength={20}
          pattern="^[a-zA-Z0-9_]{3,20}$"
          className="bg-bg-card border-border text-silver"
          disabled={isPending}
        />
      </div>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? "A guardar..." : "Salvar"}
      </Button>
    </form>
  );
}