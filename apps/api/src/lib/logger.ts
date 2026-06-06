export const logger = {
  info(message: string, context?: Record<string, unknown>) {
    console.log(message, context ?? '');
  },
  error(message: string, context?: Record<string, unknown>) {
    console.error(message, context ?? '');
  },
};
