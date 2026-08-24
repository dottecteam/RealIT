import { Request, Response } from 'express';

const FASTAPI_URL = process.env.FASTAPI_URL;

export async function triggerSync(_req: Request, res: Response) {
    if (!FASTAPI_URL) {
        return res.status(503).json({ error: 'FASTAPI_URL não configurada. Sincronização desativada.' });
    }

    try {
        const resposta = await fetch(`${FASTAPI_URL}/processar`, { method: 'POST' });
        const data = await resposta.json();

        if (!resposta.ok) {
            return res.status(502).json({ error: 'Erro ao chamar o FastAPI.', detalhe: data });
        }

        return res.json({ status: 'ok', fastapi: data });
    } catch (error) {
        return res.status(502).json({ error: 'FastAPI inacessível. Verifique se está rodando.' });
    }
}

export async function iniciarCronDiario() {
    if (!FASTAPI_URL) {
        console.log('[Sync] FASTAPI_URL não configurada — sincronização diária desativada.');
        return;
    }

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    async function aguardarFastAPI(tentativas = 10, intervalMs = 5000): Promise<boolean> {
        for (let i = 1; i <= tentativas; i++) {
            try {
                const res = await fetch(`${FASTAPI_URL}/health`);
                if (res.ok) {
                    console.log('[Sync] FastAPI disponível.');
                    return true;
                }
            } catch {
                console.log(`[Sync] FastAPI ainda não disponível — tentativa ${i}/${tentativas}...`);
            }
            await sleep(intervalMs);
        }
        console.error('[Sync] FastAPI não respondeu após todas as tentativas.');
        return false;
    }

    const disponivel = await aguardarFastAPI();
    if (disponivel) {
        console.log('[Sync] Executando sincronização inicial...');
        try {
            const resposta = await fetch(`${FASTAPI_URL}/processar`, { method: 'POST' });
            const data = await resposta.json();
            console.log('[Sync] Sincronização inicial concluída:', data);
        } catch (error) {
            console.error('[Sync] Erro na sincronização inicial:', error);
        }
    }

    const agora = new Date();
    const proximoDia = new Date();
    proximoDia.setDate(agora.getDate() + 1);
    proximoDia.setHours(3, 0, 0, 0);
    const msAteProximoDia = proximoDia.getTime() - agora.getTime();

    console.log(`[Sync] Próxima sincronização agendada para ${proximoDia.toISOString()}`);

    setTimeout(async function rodar() {
        console.log('[Sync] Iniciando sincronização diária...');
        try {
            const resposta = await fetch(`${FASTAPI_URL}/processar`, { method: 'POST' });
            const data = await resposta.json();
            console.log('[Sync] Concluído:', data);
        } catch (error) {
            console.error('[Sync] Erro na sincronização diária:', error);
        }

        const proxima = new Date();
        proxima.setDate(proxima.getDate() + 1);
        proxima.setHours(3, 0, 0, 0);
        setTimeout(rodar, proxima.getTime() - Date.now());
    }, msAteProximoDia);
}
