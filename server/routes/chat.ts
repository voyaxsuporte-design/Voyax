import { Router } from 'express';
import OpenAI from 'openai';

/**
 * ===================================================
 *  ROTA: /api/chat
 *  Chat com a Zoe usando OpenAI (ChatGPT).
 *
 *  POST /api/chat
 *  Body: { message: string, context?: string }
 *  Retorna: { reply: string }
 *
 *  Modelo: gpt-4o-mini
 *  A Zoe é a assistente virtual premium da Voyax.
 * ===================================================
 */
const router = Router();

const ZOE_SYSTEM_PROMPT = `Você é a Zoe, assistente virtual premium da Voyax — uma plataforma de concierge de viagens de alto padrão.

Regras de comportamento:
- Responda SEMPRE em português brasileiro mas se falarem outra lingua tambem responda 
- Seja sofisticada, elegante e acolhedora
- Use tom premium e refinado, como um concierge 5 estrelas
- Sugira as opcoes que os clientes pedem de hoteis classes e experiencias
- Seja proativa: ofereça sugestões antes que o usuário peça
- Mantenha respostas concisas (máximo 3 parágrafos)
- Use emojis com moderação (máximo 1 por resposta)
- Quando falar de preços, use R$ ou € conforme o contexto ou outra moeda dependendo do que o cliente peça
- Mencione que o usuário é membro Black da Voyax quando ele assinar o plano
- Seus destinos especializados: Paris, Tóquio, Nova York, Dubai, Maldivas, Londres e outros destinos

Contexto do usuário:
- quando fizer login ele vai ter um perfil com suas informacoes 
- Plano: Voyax Black (premium)
- Milhas: 2.450.000
- Viagem planejada: Paris, 12-24 Mai 2024`;

// POST /api/chat — envia mensagem para a Zoe (OpenAI ChatGPT)
router.post('/', async (req, res) => {
    try {
        const { message, context } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Campo obrigatório: message' });
        }

        const apiKey = process.env.OPENAI_API_KEY;

        // Se não tem API key, retorna resposta fallback
        if (!apiKey) {
            const fallbackReplies = [
                'Com certeza! Estou analisando as melhores opções de voos diretos e hotéis com vista para a Torre Eiffel. Vamos começar selecionando o seu voo?',
                'Excelente escolha, Gabriel! Como membro Black, você tem acesso a upgrades exclusivos. Posso preparar um roteiro personalizado com experiências gastronômicas e culturais curadas especialmente para seu perfil.',
                'Entendido! Estou buscando as melhores opções dentro do seu orçamento premium. Considerando sua preferência por experiências de alto padrão, selecionei algumas alternativas exclusivas para você.',
            ];
            const reply = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
            return res.json({ reply });
        }

        // Inicializa o client OpenAI
        const openai = new OpenAI({ apiKey });

        // Monta o system prompt com contexto adicional se houver
        const systemContent = context
            ? `${ZOE_SYSTEM_PROMPT}\n\nContexto adicional: ${context}`
            : ZOE_SYSTEM_PROMPT;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemContent },
                { role: 'user', content: message },
            ],
            temperature: 0.7,
            max_tokens: 500,
        });

        const reply = completion.choices[0]?.message?.content
            || 'Desculpe, não consegui processar sua solicitação. Tente novamente.';

        res.json({ reply });

    } catch (error: any) {
        console.error('Erro no chat:', error.message);
        res.status(500).json({
            error: 'Erro ao processar mensagem',
            reply: 'Desculpe, estou com um pequeno problema técnico. Tente novamente em instantes.',
        });
    }
});

export default router;
