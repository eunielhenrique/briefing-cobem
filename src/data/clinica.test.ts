import { describe, it, expect } from 'vitest'
import { isPendente, mostra, linkWhatsApp, jsonLdClinica, clinica } from './clinica'

describe('convenção PENDENTE', () => {
  it('detecta valor pendente', () => {
    expect(isPendente('[PENDENTE: cidade]')).toBe(true)
    expect(isPendente('Fortaleza')).toBe(false)
    expect(isPendente(null)).toBe(true)
  })

  it('mostra() nunca vaza o marcador cru para a tela', () => {
    expect(mostra('[PENDENTE: endereço]')).toBe('[a confirmar]')
    expect(mostra('Rua X, 100')).toBe('Rua X, 100')
  })

  it('linkWhatsApp devolve null se pendente e wa.me se real', () => {
    expect(linkWhatsApp('[PENDENTE: WhatsApp]')).toBeNull()
    expect(linkWhatsApp('(85) 9 8888-7777')).toBe('https://wa.me/5585988887777')
  })

  it('JSON-LD nunca inclui campo pendente', () => {
    const ld = jsonLdClinica()
    if (ld === null) return // tudo pendente: sem JSON-LD, correto
    expect(JSON.stringify(ld)).not.toContain('[PENDENTE')
  })

  it('dados obrigatórios existem no objeto', () => {
    expect(clinica.nome).toBe('COBEM Oftalmologia')
    expect(clinica.instagram).toBe('@cobemoftalmologia')
  })
})
