"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContact, type ContactState } from "./actions";

const initialState: ContactState = { ok: false, error: null };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContact,
    initialState,
  );

  if (state.ok) {
    return (
      <div className="rounded-lg border bg-muted/30 p-6">
        <p className="font-medium">Thanks — your message has been sent.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          We endeavour to answer all enquiries within 24 hours on business days.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {/* Honeypot (hidden from users) */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="flex flex-col gap-2">
        <Label htmlFor="name">
          Name<span className="text-destructive"> *</span>
        </Label>
        <Input id="name" name="name" required autoComplete="name" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">
            Email<span className="text-destructive"> *</span>
          </Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="message">
          Message<span className="text-destructive"> *</span>
        </Label>
        <Textarea id="message" name="message" rows={5} required />
      </div>

      {state.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
