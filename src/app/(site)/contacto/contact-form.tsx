"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContactForm, type ContactFormState } from "./actions";
import { fadeUp, onceInView, staggerContainer } from "@/lib/motion";

const INITIAL: ContactFormState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="lg"
      disabled={pending}
      className="w-full sm:w-auto"
    >
      {pending ? "Enviando…" : "Enviar mensaje"}
    </Button>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContactForm, INITIAL);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      toast.success("Mensaje enviado", { description: state.message });
      formRef.current?.reset();
    } else if (state.status === "error" && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <motion.form
      ref={formRef}
      action={formAction}
      noValidate
      className="grid gap-5"
      aria-describedby="form-status"
      initial="hidden"
      whileInView="visible"
      viewport={onceInView}
      variants={staggerContainer}
    >
      <motion.div variants={fadeUp} className="grid gap-2">
        <Label htmlFor="name">Nombre completo *</Label>
        <Input
          id="name"
          name="name"
          required
          autoComplete="name"
          aria-invalid={!!state.errors?.name}
          aria-describedby={state.errors?.name ? "err-name" : undefined}
        />
        {state.errors?.name && (
          <p id="err-name" className="text-sm text-destructive">
            {state.errors.name[0]}
          </p>
        )}
      </motion.div>

      <motion.div variants={fadeUp} className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-invalid={!!state.errors?.email}
            aria-describedby={state.errors?.email ? "err-email" : undefined}
          />
          {state.errors?.email && (
            <p id="err-email" className="text-sm text-destructive">
              {state.errors.email[0]}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">Teléfono (opcional)</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            aria-invalid={!!state.errors?.phone}
          />
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="grid gap-2">
        <Label htmlFor="message">Mensaje *</Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Cuéntanos qué tienes en mente: tipo de pieza, dimensiones, plazos…"
          aria-invalid={!!state.errors?.message}
          aria-describedby={state.errors?.message ? "err-message" : undefined}
        />
        {state.errors?.message && (
          <p id="err-message" className="text-sm text-destructive">
            {state.errors.message[0]}
          </p>
        )}
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="flex flex-wrap items-center gap-4"
      >
        <SubmitButton />
        {state.status === "success" && (
          <p id="form-status" role="status" className="text-sm text-accent">
            {state.message}
          </p>
        )}
      </motion.div>
    </motion.form>
  );
}
