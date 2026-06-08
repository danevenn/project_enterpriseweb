// Logger estructurado mínimo. Es el ÚNICO punto del código autorizado a escribir
// en la consola: hoy emite JSON estructurado a stdout/stderr; mañana es donde se
// enchufaría un transporte real (Sentry, Logtail, Datadog…) sin tocar ni un solo
// call site. Por eso el resto del código llama a `logger.*` y nunca a `console.*`
// (regla `no-console` activada en ESLint).

type LogLevel = "info" | "warn" | "error";

function emit(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  const entry = {
    level,
    time: new Date().toISOString(),
    message,
    ...meta,
  };
  // eslint-disable-next-line no-console -- punto único y autorizado de salida de logs
  console[level](JSON.stringify(entry));
}

/** Normaliza un valor desconocido capturado en un `catch` a algo serializable. */
function serializeError(error: unknown) {
  if (error instanceof Error) {
    return { name: error.name, message: error.message, stack: error.stack };
  }
  return error;
}

export const logger = {
  info: (message: string, meta?: Record<string, unknown>) => emit("info", message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => emit("warn", message, meta),
  error: (message: string, error?: unknown, meta?: Record<string, unknown>) =>
    emit("error", message, { ...meta, error: serializeError(error) }),
};
