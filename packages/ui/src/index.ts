export function formatStatus(status: string): string {
  return status.replaceAll('_', ' ').toUpperCase();
}
