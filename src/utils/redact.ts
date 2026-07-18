export function redactSecret(value: string): string {
  if (value.length <= 8) {
    return '********';
  }

  return `${value.slice(0, 3)}…${value.slice(-3)}`;
}

export function messageFromError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}
