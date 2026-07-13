// Formata uma data ISO (ex.: o created_at do Supabase) no padrão pt-BR.
export function formatarData(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
