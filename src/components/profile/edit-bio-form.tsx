"use client";

import { useActionState } from "react";
import { updateBio, type BioState } from "@/lib/actions/profile";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface Props {
  bio: string | null;
}

const initialState: BioState = { error: null };

export function EditBioForm({ bio }: Props) {
  const [state, formAction, isPending] = useActionState(updateBio, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="bio" className="text-silver">Bio</Label>
        <textarea
          id="bio"
          name="bio"
          defaultValue={bio ?? ""}
          maxLength={150}
          rows={3}
          placeholder="Escreve algo sobre ti..."
          className="w-full rounded-md border border-border bg-bg-card px-3 py-2 text-sm text-silver placeholder:text-silver-dim focus:outline-none focus:ring-1 focus:ring-white/20 resize-none"
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
