// ⚠️ Lista-hipótese baseada no padrão de clínica oftalmológica (mesmas opções do
// formulário de briefing). O briefing do cliente confirma quais ficam.
export type Servico = {
  slug: string; nome: string; resumo: string
  oQueE: string; sintomas: string[]; tratamento: string
  faqs: { p: string; r: string }[]
}

export const servicos: Servico[] = [
  {
    slug: 'catarata',
    nome: 'Cirurgia de Catarata',
    resumo: 'Recupere a nitidez da visão com cirurgia moderna e segura.',
    oQueE: 'A catarata é a opacificação do cristalino, a lente natural do olho, e é a principal causa de perda visual reversível no mundo. É mais comum a partir dos 60 anos e tem tratamento definitivo.',
    sintomas: ['Visão embaçada ou "nublada"', 'Sensibilidade à luz e ofuscamento', 'Cores desbotadas', 'Dificuldade para dirigir à noite', 'Troca frequente do grau dos óculos'],
    tratamento: 'O único tratamento é cirúrgico: o cristalino opaco é substituído por uma lente intraocular. É um procedimento rápido, indolor e com recuperação em poucos dias. Na consulta, avaliamos o seu caso e indicamos a lente mais adequada.',
    faqs: [
      { p: 'A cirurgia de catarata dói?', r: 'Não. É feita com anestesia local (colírio) e sedação leve; a maioria dos pacientes relata apenas leve desconforto.' },
      { p: 'Quanto tempo dura a recuperação?', r: 'A visão melhora nos primeiros dias e a recuperação completa costuma levar cerca de 30 dias, com colírios e acompanhamento.' },
      { p: 'A catarata pode voltar?', r: 'Não. Pode ocorrer opacificação da cápsula com o tempo, resolvida em consultório com laser, sem nova cirurgia.' },
    ],
  },
  {
    slug: 'glaucoma',
    nome: 'Glaucoma',
    resumo: 'Diagnóstico precoce e controle para proteger seu nervo óptico.',
    oQueE: 'O glaucoma é uma doença silenciosa que danifica o nervo óptico, geralmente associada à pressão ocular elevada. Sem tratamento, pode levar à perda irreversível da visão — por isso o diagnóstico precoce é decisivo.',
    sintomas: ['Na maioria dos casos, nenhum sintoma no início', 'Perda gradual da visão periférica', 'Halos ao redor de luzes', 'Em crises agudas: dor ocular intensa e visão turva'],
    tratamento: 'O controle é feito com colírios, laser ou cirurgia, conforme o estágio. O acompanhamento regular com medida de pressão, campo visual e OCT permite ajustar o tratamento e preservar a visão.',
    faqs: [
      { p: 'Glaucoma tem cura?', r: 'Não tem cura, mas tem controle. Com tratamento adequado, a imensa maioria dos pacientes preserva a visão.' },
      { p: 'Quem precisa se preocupar?', r: 'Pessoas acima de 40 anos, com histórico familiar, alta miopia ou pressão ocular elevada devem fazer avaliação periódica.' },
      { p: 'Colírio de glaucoma é para sempre?', r: 'Em geral o tratamento é contínuo. Interromper por conta própria é a principal causa de progressão da doença.' },
    ],
  },
  {
    slug: 'cirurgia-refrativa',
    nome: 'Cirurgia Refrativa (miopia, astigmatismo, hipermetropia)',
    resumo: 'Liberdade dos óculos com correção a laser personalizada.',
    oQueE: 'A cirurgia refrativa corrige miopia, astigmatismo e hipermetropia remodelando a córnea com laser, reduzindo ou eliminando a dependência de óculos e lentes de contato.',
    sintomas: ['Dependência de óculos ou lentes para o dia a dia', 'Desconforto com lentes de contato', 'Grau estável há pelo menos 1 ano'],
    tratamento: 'Após exames detalhados da córnea (topografia, paquimetria), definimos a técnica mais segura para o seu caso. O procedimento dura minutos e a recuperação visual costuma ser rápida.',
    faqs: [
      { p: 'Qualquer pessoa pode operar?', r: 'Não. É preciso grau estável, córnea saudável e idade mínima em torno de 21 anos. Os exames pré-operatórios definem a indicação.' },
      { p: 'O resultado é definitivo?', r: 'A correção do grau tratado é permanente; alterações naturais do olho com a idade (como a vista cansada) podem ocorrer.' },
      { p: 'Quanto tempo de repouso?', r: 'Na maioria das técnicas, 1 a 3 dias de repouso relativo, com retorno rápido às atividades.' },
    ],
  },
  {
    slug: 'cornea-e-ceratocone',
    nome: 'Córnea e Ceratocone',
    resumo: 'Do diagnóstico ao crosslinking e adaptação de lentes especiais.',
    oQueE: 'O ceratocone é uma doença progressiva em que a córnea afina e assume formato de cone, distorcendo a visão. Costuma surgir na adolescência e evolui até por volta dos 35 anos.',
    sintomas: ['Visão distorcida ou duplicada', 'Troca frequente e rápida de grau', 'Astigmatismo irregular progressivo', 'Coceira ocular frequente (hábito de coçar agrava)'],
    tratamento: 'Conforme o estágio: óculos, lentes de contato especiais, crosslinking (para frear a progressão), anel intraestromal ou, em casos avançados, transplante de córnea.',
    faqs: [
      { p: 'Ceratocone cega?', r: 'Com diagnóstico e tratamento adequados, a grande maioria dos pacientes mantém boa visão. O acompanhamento evita a progressão.' },
      { p: 'O que é crosslinking?', r: 'Procedimento que fortalece o colágeno da córnea com riboflavina e luz UV, freando a progressão do ceratocone.' },
      { p: 'Coçar o olho faz mal mesmo?', r: 'Sim — o ato de coçar é um dos principais fatores de progressão. Tratar a alergia ocular faz parte do tratamento.' },
    ],
  },
  {
    slug: 'oftalmopediatria',
    nome: 'Oftalmopediatria',
    resumo: 'Cuidado com a visão das crianças, do teste do olhinho à escola.',
    oQueE: 'A oftalmopediatria cuida da saúde ocular de bebês, crianças e adolescentes. Grande parte do desenvolvimento visual acontece até os 7 anos — problemas detectados cedo têm tratamento muito mais eficaz.',
    sintomas: ['Olhos desalinhados (estrabismo)', 'Aproximar-se muito de telas e cadernos', 'Dor de cabeça e baixo rendimento escolar', 'Lacrimejamento e fotofobia', 'Reflexo branco na pupila em fotos'],
    tratamento: 'Consulta adaptada para a idade, com avaliação de grau, alinhamento e desenvolvimento visual. Tratamentos incluem óculos, tampão, exercícios e, quando necessário, cirurgia de estrabismo.',
    faqs: [
      { p: 'Quando levar meu filho pela primeira vez?', r: 'Além do teste do olhinho na maternidade, recomenda-se avaliação oftalmológica completa entre 6 e 12 meses e antes da alfabetização.' },
      { p: 'Criança pequena consegue fazer exame de vista?', r: 'Sim. Há técnicas e equipamentos específicos que medem o grau mesmo sem a criança falar ou ler.' },
      { p: 'Tela faz mal para a visão infantil?', r: 'O excesso está associado a fadiga visual e progressão de miopia. Pausas regulares e atividades ao ar livre ajudam a proteger.' },
    ],
  },
  {
    slug: 'lentes-de-contato',
    nome: 'Lentes de Contato',
    resumo: 'Adaptação segura, do grau simples às lentes especiais.',
    oQueE: 'A adaptação de lentes de contato é um processo médico: o mapa da córnea, a lágrima e a rotina do paciente definem a lente ideal — de gelatinosas de uso diário a rígidas e esclerais para córneas irregulares.',
    sintomas: ['Desconforto com a lente atual', 'Olho seco ou vermelho com lentes', 'Ceratocone ou astigmatismo alto', 'Vontade de reduzir o uso dos óculos'],
    tratamento: 'Avaliamos a superfície ocular, testamos a lente em consultório e ensinamos manuseio e higiene. O acompanhamento periódico garante conforto e segurança a longo prazo.',
    faqs: [
      { p: 'Lente de contato pode com ceratocone?', r: 'Sim — em muitos casos é o que devolve a melhor visão. Lentes rígidas e esclerais são desenhadas para córneas irregulares.' },
      { p: 'Posso dormir com as lentes?', r: 'Na grande maioria das lentes, não. Dormir com lentes aumenta muito o risco de infecção grave.' },
      { p: 'Qual a validade de uma adaptação?', r: 'Reavaliação anual (ou antes, se houver desconforto) mantém a saúde da córnea e a qualidade da visão.' },
    ],
  },
]
