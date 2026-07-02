/**
 * ÚNICA fonte dos dados da clínica. Briefing respondido → atualizar SÓ este arquivo.
 * Valor não confirmado usa o marcador [PENDENTE: ...] — a UI o exibe como "[a confirmar]"
 * e ele NUNCA entra em JSON-LD/meta tags (mock não se apresenta como real).
 */
export type Medico = { nome: string; crm: string; especialidade: string; bio?: string }

export const clinica = {
  nome: 'COBEM Oftalmologia',
  cidade: '[PENDENTE: cidade]',
  endereco: '[PENDENTE: endereço completo]',
  whatsapp: '[PENDENTE: WhatsApp da clínica]',
  telefone: '[PENDENTE: telefone fixo]',
  email: '[PENDENTE: e-mail da clínica]',
  horario: '[PENDENTE: horário de atendimento]',
  responsavelTecnico: '[PENDENTE: RT — Dr(a). + CRM]',
  instagram: '@cobemoftalmologia',
  googleReviews: '[PENDENTE: link do Google Reviews]',
  medicos: [] as Medico[], // preencher com o briefing
  convenios: [] as string[], // preencher com o briefing
  depoimentos: [] as { autor: string; texto: string }[], // só depoimentos REAIS
}

export function isPendente(v: unknown): boolean {
  return v == null || (typeof v === 'string' && v.startsWith('[PENDENTE'))
}

/** Para exibição: pendente vira "[a confirmar]" — nunca o marcador cru. */
export function mostra(v: string | null | undefined): string {
  return isPendente(v) ? '[a confirmar]' : (v as string)
}

/** Link wa.me ou null enquanto o número não é real. */
export function linkWhatsApp(numero: string = clinica.whatsapp): string | null {
  if (isPendente(numero)) return null
  return `https://wa.me/55${numero.replace(/\D/g, '')}`
}

/** JSON-LD MedicalClinic só com dados reais; null se nem o mínimo existe. */
export function jsonLdClinica(): object | null {
  if (isPendente(clinica.endereco)) return null
  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name: clinica.nome,
    address: clinica.endereco,
  }
  if (!isPendente(clinica.telefone)) ld.telephone = clinica.telefone
  if (!isPendente(clinica.horario)) ld.openingHours = clinica.horario
  return ld
}
