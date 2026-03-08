import { Router } from 'express';
import OpenAI from 'openai';

/**
 * ===================================================
 *  ROTA: /api/chat
 *  Chat com a Zoe usando OpenAI (ChatGPT).
 *
 *  POST /api/chat
 *  Body: {
 *    message: string,
 *    conversationHistory?: { role: string, content: string }[],
 *    tripContext?: { destination?: string, country?: string }
 *  }
 *  Retorna: { reply: string, extractedDestination?: { name: string, country: string } }
 *
 *  Modelo: gpt-4o-mini
 *  A Zoe é a assistente virtual premium da Voyax.
 * ===================================================
 */
const router = Router();

function buildSystemPrompt(tripContext?: any): string {
    const currentDest = tripContext?.destination && tripContext.destination !== 'not defined yet'
        ? `${tripContext.destination}${tripContext.country ? `, ${tripContext.country}` : ''}`
        : 'ainda não definido';

    return `Você é a Zoe, assistente virtual premium da Voyax — uma plataforma de concierge de viagens de alto padrão.

Regras de comportamento:
- Responda SEMPRE em português brasileiro, mas se falarem outra língua, responda nessa língua
- Seja sofisticada, elegante e acolhedora
- Use tom premium e refinado, como um concierge 5 estrelas
- Sugira opções de hotéis, classes e experiências quando pedido
- Seja proativa: ofereça sugestões antes que o usuário peça
- Mantenha respostas concisas (máximo 3 parágrafos)
- Use emojis com moderação (máximo 1 por resposta)
- Quando falar de preços, use a moeda apropriada ao destino
- NÃO force um destino — responda com base no que o usuário pedir
- Se o usuário perguntar sobre finanças ou planejamento, responda sobre isso
- Aceite QUALQUER destino do mundo — você não está limitada a uma lista fixa

Destino atual do usuário: ${currentDest}

INSTRUÇÃO ESPECIAL — Extração de destino:
Se o usuário mencionar um destino de viagem (cidade ou país), INCLUA no FINAL da sua resposta uma linha JSON no seguinte formato EXATO:
[DEST]{"name":"NomeDaCidade","country":"NomeDoCountry"}[/DEST]

Exemplos:
- Se o usuário diz "quero ir pra China": [DEST]{"name":"Pequim","country":"China"}[/DEST]
- Se o usuário diz "viagem para Bangkok": [DEST]{"name":"Bangkok","country":"Tailândia"}[/DEST]
- Se o usuário diz "quero conhecer a Islândia": [DEST]{"name":"Reykjavik","country":"Islândia"}[/DEST]
- Se o usuário diz "viagem pra Roma": [DEST]{"name":"Roma","country":"Itália"}[/DEST]

Se o usuário NÃO mencionar nenhum destino, NÃO inclua a tag [DEST].
A tag [DEST] deve aparecer APENAS quando houver um novo destino mencionado.`;
}

/**
 * Parse [DEST]{...}[/DEST] tag from AI reply.
 * Returns { cleanReply, destination } where destination may be null.
 */
function parseDestinationTag(reply: string): { cleanReply: string; destination: { name: string; country: string } | null } {
    const destMatch = reply.match(/\[DEST\]\s*(\{[^}]+\})\s*\[\/DEST\]/);
    if (!destMatch) {
        return { cleanReply: reply.trim(), destination: null };
    }

    // Remove the tag from the visible reply
    const cleanReply = reply.replace(/\[DEST\]\s*\{[^}]+\}\s*\[\/DEST\]/, '').trim();

    try {
        const parsed = JSON.parse(destMatch[1]);
        if (parsed.name && parsed.country) {
            return { cleanReply, destination: { name: parsed.name, country: parsed.country } };
        }
    } catch {
        // JSON parse failed, ignore
    }

    return { cleanReply, destination: null };
}

/**
 * Simple fallback destination extraction (used when OpenAI is unavailable)
 */
function extractDestinationFallback(msg: string): { name: string; country: string } | null {
    const lower = msg.toLowerCase();
    const destinations: Record<string, { name: string; country: string }> = {
        'china': { name: 'Pequim', country: 'China' },
        'pequim': { name: 'Pequim', country: 'China' },
        'beijing': { name: 'Pequim', country: 'China' },
        'xangai': { name: 'Xangai', country: 'China' },
        'shanghai': { name: 'Xangai', country: 'China' },
        'japão': { name: 'Tóquio', country: 'Japão' },
        'japan': { name: 'Tóquio', country: 'Japão' },
        'tokyo': { name: 'Tóquio', country: 'Japão' },
        'tóquio': { name: 'Tóquio', country: 'Japão' },
        'paris': { name: 'Paris', country: 'França' },
        'frança': { name: 'Paris', country: 'França' },
        'dubai': { name: 'Dubai', country: 'Emirados Árabes' },
        'emirados': { name: 'Dubai', country: 'Emirados Árabes' },
        'nova york': { name: 'Nova York', country: 'EUA' },
        'new york': { name: 'Nova York', country: 'EUA' },
        'londres': { name: 'Londres', country: 'Inglaterra' },
        'london': { name: 'Londres', country: 'Inglaterra' },
        'roma': { name: 'Roma', country: 'Itália' },
        'rome': { name: 'Roma', country: 'Itália' },
        'itália': { name: 'Roma', country: 'Itália' },
        'bangkok': { name: 'Bangkok', country: 'Tailândia' },
        'tailândia': { name: 'Bangkok', country: 'Tailândia' },
        'thailand': { name: 'Bangkok', country: 'Tailândia' },
        'maldivas': { name: 'Maldivas', country: 'Ásia' },
        'maldives': { name: 'Maldivas', country: 'Ásia' },
        'islândia': { name: 'Reykjavik', country: 'Islândia' },
        'iceland': { name: 'Reykjavik', country: 'Islândia' },
        'sydney': { name: 'Sydney', country: 'Austrália' },
        'austrália': { name: 'Sydney', country: 'Austrália' },
        'australia': { name: 'Sydney', country: 'Austrália' },
        'moscou': { name: 'Moscou', country: 'Rússia' },
        'russia': { name: 'Moscou', country: 'Rússia' },
        'rússia': { name: 'Moscou', country: 'Rússia' },
        'moscow': { name: 'Moscou', country: 'Rússia' },
        'barcelona': { name: 'Barcelona', country: 'Espanha' },
        'madrid': { name: 'Madrid', country: 'Espanha' },
        'espanha': { name: 'Madrid', country: 'Espanha' },
        'amsterdam': { name: 'Amsterdam', country: 'Holanda' },
        'lisboa': { name: 'Lisboa', country: 'Portugal' },
        'portugal': { name: 'Lisboa', country: 'Portugal' },
        'grécia': { name: 'Atenas', country: 'Grécia' },
        'atenas': { name: 'Atenas', country: 'Grécia' },
        'santorini': { name: 'Santorini', country: 'Grécia' },
        'cancún': { name: 'Cancún', country: 'México' },
        'cancun': { name: 'Cancún', country: 'México' },
        'méxico': { name: 'Cidade do México', country: 'México' },
        'bali': { name: 'Bali', country: 'Indonésia' },
        'indonésia': { name: 'Bali', country: 'Indonésia' },
        'singapura': { name: 'Singapura', country: 'Singapura' },
        'singapore': { name: 'Singapura', country: 'Singapura' },
        'buenos aires': { name: 'Buenos Aires', country: 'Argentina' },
        'argentina': { name: 'Buenos Aires', country: 'Argentina' },
    };

    const sortedKeys = Object.keys(destinations).sort((a, b) => b.length - a.length);
    for (const key of sortedKeys) {
        if (lower.includes(key)) {
            return destinations[key];
        }
    }
    return null;
}

/**
 * Generate a contextual fallback reply based on the user message and extracted destination
 */
function buildFallbackReply(msg: string, dest: { name: string; country: string } | null): string {
    if (dest) {
        return `Ótima escolha! ${dest.name}, ${dest.country} é um destino incrível. Posso ajudar a planejar voos, hospedagem e experiências exclusivas para a sua viagem. Por onde gostaria de começar?`;
    }
    const lower = msg.toLowerCase();
    if (lower.includes('hotel') || lower.includes('hospedagem')) {
        return 'Estou selecionando as melhores opções de hospedagem para o seu perfil premium. Posso filtrar por localização, estilo ou faixa de investimento. Qual critério é mais importante para você?';
    }
    if (lower.includes('voo') || lower.includes('passagem')) {
        return 'Verificando as melhores opções de voos para você. Posso comparar classes de cabine, horários e escalas para encontrar a combinação ideal entre conforto e custo-benefício.';
    }
    if (lower.includes('roteiro') || lower.includes('itinerário')) {
        return 'Entendido! Vou montar um roteiro personalizado baseado no seu perfil premium. Quantos dias você tem disponíveis?';
    }
    if (lower.includes('orçamento') || lower.includes('custo') || lower.includes('preço')) {
        return 'Posso ajudar a otimizar seu orçamento de viagem. Quer que eu compare custos entre destinos ou crie um planejamento financeiro completo?';
    }
    return 'Entendido! Como sua concierge premium, estou aqui para ajudar com qualquer aspecto da sua viagem — desde a escolha do destino até experiências exclusivas. O que gostaria de explorar?';
}

// POST /api/chat — envia mensagem para a Zoe (OpenAI ChatGPT)
router.post('/', async (req, res) => {
    try {
        const { message, conversationHistory, tripContext } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Campo obrigatório: message' });
        }

        const apiKey = process.env.OPENAI_API_KEY;

        // Se não tem API key, retorna resposta fallback com extração de destino
        if (!apiKey) {
            const dest = extractDestinationFallback(message);
            const reply = buildFallbackReply(message, dest);
            return res.json({ reply, extractedDestination: dest });
        }

        // Inicializa o client OpenAI
        const openai = new OpenAI({ apiKey });

        // Build system prompt with dynamic trip context
        const systemContent = buildSystemPrompt(tripContext);

        // Build messages array with conversation history
        const openaiMessages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
            { role: 'system', content: systemContent },
        ];

        // Add last 6 messages from conversation history
        if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
            const recent = conversationHistory.slice(-6);
            for (const msg of recent) {
                openaiMessages.push({
                    role: msg.role === 'user' ? 'user' : 'assistant',
                    content: msg.content,
                });
            }
        }

        // Add current message
        openaiMessages.push({ role: 'user', content: message });

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: openaiMessages,
            temperature: 0.4,
            max_tokens: 600,
        });

        const rawReply = completion.choices[0]?.message?.content
            || 'Desculpe, não consegui processar sua solicitação. Tente novamente.';

        // Parse destination from AI reply
        const { cleanReply, destination } = parseDestinationTag(rawReply);

        res.json({
            reply: cleanReply,
            extractedDestination: destination,
        });

    } catch (error: any) {
        console.error('Erro no chat (OpenAI):', error);

        return res.status(500).json({
            reply: `Erro real da OpenAI: ${error?.message || 'erro desconhecido'}`,
            extractedDestination: null,
        });
    }
});

export default router;
