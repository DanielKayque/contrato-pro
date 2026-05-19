import puppeteer from 'puppeteer-core';

type DadosContrato = {
  nomeCliente: string;
  servico: string;
  valor: string;
  dataInicio: string;
  dataFim: string;
  nomeFreelancer: string;
};

const templates: Record<string, (dados: DadosContrato) => string> = {
  dev: (d) => `
    <html><head><style>
      body { font-family: Arial, sans-serif; padding: 60px; color: #1a1a1a; line-height: 1.7; }
      h1 { font-size: 22px; border-bottom: 2px solid #1a1a1a; padding-bottom: 12px; margin-bottom: 32px; }
      .campo { margin-bottom: 12px; }
      .label { font-size: 11px; text-transform: uppercase; color: #666; letter-spacing: 0.05em; }
      .valor { font-size: 15px; font-weight: 500; }
      .clausulas { margin-top: 40px; }
      .clausulas h2 { font-size: 14px; margin-bottom: 8px; margin-top: 24px; }
      .clausulas p { font-size: 13px; color: #333; }
      .assinaturas { display: flex; justify-content: space-between; margin-top: 80px; }
      .assinatura { text-align: center; border-top: 1px solid #333; padding-top: 8px; width: 200px; font-size: 12px; }
    </style></head><body>
      <h1>Contrato de Prestação de Serviços — Desenvolvimento</h1>
      <div class="campo"><div class="label">Contratante</div><div class="valor">${d.nomeCliente}</div></div>
      <div class="campo"><div class="label">Contratado</div><div class="valor">${d.nomeFreelancer}</div></div>
      <div class="campo"><div class="label">Serviço</div><div class="valor">${d.servico}</div></div>
      <div class="campo"><div class="label">Valor total</div><div class="valor">R$ ${d.valor}</div></div>
      <div class="campo"><div class="label">Período</div><div class="valor">${d.dataInicio} até ${d.dataFim}</div></div>
      <div class="clausulas">
        <h2>1. Objeto</h2>
        <p>O contratado se compromete a entregar o serviço de ${d.servico} conforme acordado entre as partes.</p>
        <h2>2. Propriedade intelectual</h2>
        <p>Todo código produzido durante o contrato é de propriedade do contratante após quitação integral do valor.</p>
        <h2>3. Revisões</h2>
        <p>Estão inclusas até 2 rodadas de revisão. Alterações além do escopo serão cobradas à parte.</p>
        <h2>4. Pagamento</h2>
        <p>O valor de R$ ${d.valor} será pago conforme condições acordadas entre as partes.</p>
      </div>
      <div class="assinaturas">
        <div class="assinatura">${d.nomeCliente}<br>Contratante</div>
        <div class="assinatura">${d.nomeFreelancer}<br>Contratado</div>
      </div>
    </body></html>
  `,

  design: (d) => `
    <html><head><style>
      body { font-family: Arial, sans-serif; padding: 60px; color: #1a1a1a; line-height: 1.7; }
      h1 { font-size: 22px; border-bottom: 2px solid #1a1a1a; padding-bottom: 12px; margin-bottom: 32px; }
      .campo { margin-bottom: 12px; }
      .label { font-size: 11px; text-transform: uppercase; color: #666; letter-spacing: 0.05em; }
      .valor { font-size: 15px; font-weight: 500; }
      .clausulas h2 { font-size: 14px; margin-bottom: 8px; margin-top: 24px; }
      .clausulas p { font-size: 13px; color: #333; }
      .assinaturas { display: flex; justify-content: space-between; margin-top: 80px; }
      .assinatura { text-align: center; border-top: 1px solid #333; padding-top: 8px; width: 200px; font-size: 12px; }
    </style></head><body>
      <h1>Contrato de Prestação de Serviços — Design</h1>
      <div class="campo"><div class="label">Contratante</div><div class="valor">${d.nomeCliente}</div></div>
      <div class="campo"><div class="label">Contratado</div><div class="valor">${d.nomeFreelancer}</div></div>
      <div class="campo"><div class="label">Serviço</div><div class="valor">${d.servico}</div></div>
      <div class="campo"><div class="label">Valor total</div><div class="valor">R$ ${d.valor}</div></div>
      <div class="campo"><div class="label">Período</div><div class="valor">${d.dataInicio} até ${d.dataFim}</div></div>
      <div class="clausulas">
        <h2>1. Objeto</h2>
        <p>O contratado se compromete a entregar o serviço de ${d.servico} conforme acordado.</p>
        <h2>2. Direitos de uso</h2>
        <p>As artes produzidas são de uso exclusivo do contratante após quitação. O contratado pode exibir o trabalho em portfólio.</p>
        <h2>3. Revisões</h2>
        <p>Estão inclusas até 3 rodadas de revisão. Alterações estruturais após aprovação serão cobradas à parte.</p>
        <h2>4. Entrega</h2>
        <p>Os arquivos serão entregues nos formatos combinados (AI, PDF, PNG) até ${d.dataFim}.</p>
      </div>
      <div class="assinaturas">
        <div class="assinatura">${d.nomeCliente}<br>Contratante</div>
        <div class="assinatura">${d.nomeFreelancer}<br>Contratado</div>
      </div>
    </body></html>
  `,

  consultoria: (d) => `
    <html><head><style>
      body { font-family: Arial, sans-serif; padding: 60px; color: #1a1a1a; line-height: 1.7; }
      h1 { font-size: 22px; border-bottom: 2px solid #1a1a1a; padding-bottom: 12px; margin-bottom: 32px; }
      .campo { margin-bottom: 12px; }
      .label { font-size: 11px; text-transform: uppercase; color: #666; letter-spacing: 0.05em; }
      .valor { font-size: 15px; font-weight: 500; }
      .clausulas h2 { font-size: 14px; margin-bottom: 8px; margin-top: 24px; }
      .clausulas p { font-size: 13px; color: #333; }
      .assinaturas { display: flex; justify-content: space-between; margin-top: 80px; }
      .assinatura { text-align: center; border-top: 1px solid #333; padding-top: 8px; width: 200px; font-size: 12px; }
    </style></head><body>
      <h1>Contrato de Consultoria</h1>
      <div class="campo"><div class="label">Contratante</div><div class="valor">${d.nomeCliente}</div></div>
      <div class="campo"><div class="label">Consultor</div><div class="valor">${d.nomeFreelancer}</div></div>
      <div class="campo"><div class="label">Escopo</div><div class="valor">${d.servico}</div></div>
      <div class="campo"><div class="label">Valor total</div><div class="valor">R$ ${d.valor}</div></div>
      <div class="campo"><div class="label">Período</div><div class="valor">${d.dataInicio} até ${d.dataFim}</div></div>
      <div class="clausulas">
        <h2>1. Objeto</h2>
        <p>O consultor prestará serviços de ${d.servico} durante o período acordado.</p>
        <h2>2. Confidencialidade</h2>
        <p>O consultor se compromete a manter sigilo sobre todas as informações recebidas durante a prestação dos serviços.</p>
        <h2>3. Cancelamento</h2>
        <p>O cancelamento deve ser comunicado com 7 dias de antecedência. Sessões já realizadas serão cobradas integralmente.</p>
      </div>
      <div class="assinaturas">
        <div class="assinatura">${d.nomeCliente}<br>Contratante</div>
        <div class="assinatura">${d.nomeFreelancer}<br>Consultor</div>
      </div>
    </body></html>
  `,
};

export async function gerarPDF(
  nicho: string,
  dados: DadosContrato,
): Promise<Buffer> {
  const templateFn = templates[nicho];

  if (!templateFn) {
    throw new Error(`Nicho inválido: ${nicho}`);
  }

  const html = templateFn(dados);

  // const browser = await puppeteer.launch({
  //   args: ['--no-sandbox', '--disable-setuid-sandbox'],
  // });

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome-stable',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
    headless: true,
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'load' });
  const pdf = await page.pdf({ format: 'A4', printBackground: true });
  await browser.close();

  return Buffer.from(pdf);
}
