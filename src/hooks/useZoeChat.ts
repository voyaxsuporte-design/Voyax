import { useState, useRef, useCallback } from 'react';
import { DESTINATIONS, Destination } from '../constants';
import { useAppContext } from '../App';

/**
 * ===================================================
 *  useZoeChat — Hook global de conversação da Zoe
 *
 *  Mantém um ÚNICO histórico de conversa compartilhado
 *  entre todas as páginas (/chat, /passagens, /hospedagem,
 *  /experiencias, /checkout).
 *
 *  Cada página envia seu pageContext para que a Zoe
 *  adapte o foco da resposta ao módulo atual.
 * ===================================================
 */

export type PageContext = 'chat' | 'flights' | 'hotels' | 'experiences' | 'checkout';

export interface ZoeMessage {
    id: string;
    text: string;
    sender: 'user' | 'zoe';
    timestamp: Date;
    /** Which page this message was sent from */
    pageContext?: PageContext;
}

// ── Destination helper ──────────────────────────────

function createDestination(name: string, country: string): Destination {
    const known = DESTINATIONS.find(
        d => d.name.toLowerCase() === name.toLowerCase() ||
            d.country.toLowerCase() === country.toLowerCase()
    );
    if (known) return known;

    return {
        name,
        country,
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
        climate: '—',
        exchange: '—',
    };
}

// ── API call ────────────────────────────────────────

async function callZoeAPI(
    userMessage: string,
    conversationHistory: ZoeMessage[],
    tripContext: { destination: string; country: string },
    currentPageContext: PageContext,
): Promise<{ reply: string; extractedDestination?: { name: string; country: string } }> {
    const history = conversationHistory.slice(-10).map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
    }));

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

    try {
        const res = await fetch(`${API_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: userMessage,
                conversationHistory: history,
                tripContext,
                currentPageContext,
            }),
        });

        const data = await res.json();
        return {
            reply: data.reply || 'Desculpe, não consegui processar sua solicitação.',
            extractedDestination: data.extractedDestination || undefined,
        };
    } catch (err) {
        console.error('Zoe API error:', err);
        return { reply: 'Desculpe, estou com um pequeno problema técnico. Tente novamente em instantes.' };
    }
}

// ── Shared hook ─────────────────────────────────────

export function useZoeChat(pageContext: PageContext) {
    const {
        zoeChatMessages: messages,
        setZoeChatMessages: setMessages,
        zoeReplyCount,
        setZoeReplyCount,
        tripContextProps,
        userPlan,
    } = useAppContext();

    const [isTyping, setIsTyping] = useState(false);
    const isSendingRef = useRef(false);

    const PAYWALL_TRIGGER = 3;
    const isBlocked = userPlan === 'free' && zoeReplyCount >= PAYWALL_TRIGGER;

    const sendMessage = useCallback(async (userText: string): Promise<void> => {
        if (isSendingRef.current || !userText.trim()) return;
        isSendingRef.current = true;
        setIsTyping(true);

        const userMsg: ZoeMessage = {
            id: Date.now().toString(),
            text: userText,
            sender: 'user',
            timestamp: new Date(),
            pageContext,
        };

        // Append user message and capture updated list for the API call
        let updatedMessages: ZoeMessage[] = [];
        setMessages(prev => {
            updatedMessages = [...prev, userMsg];
            return updatedMessages;
        });

        // Small yield to let React commit the state
        await new Promise(r => setTimeout(r, 0));

        try {
            const { reply, extractedDestination } = await callZoeAPI(
                userText,
                updatedMessages,
                {
                    destination: tripContextProps.destination.name,
                    country: tripContextProps.destination.country,
                },
                pageContext,
            );

            // Update destination if AI detected a new one
            if (extractedDestination) {
                const newDest = createDestination(extractedDestination.name, extractedDestination.country);
                if (newDest.name !== tripContextProps.destination.name) {
                    tripContextProps.onChangeDestination(newDest);
                }
            }

            const zoeMsg: ZoeMessage = {
                id: (Date.now() + 1).toString(),
                text: reply,
                sender: 'zoe',
                timestamp: new Date(),
                pageContext,
            };

            setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last && last.sender === 'zoe' && last.text === reply) return prev;
                return [...prev, zoeMsg];
            });

            setZoeReplyCount(prev => prev + 1);
        } catch {
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                text: 'Desculpe, estou com um problema técnico. Tente novamente.',
                sender: 'zoe',
                timestamp: new Date(),
                pageContext,
            }]);
        } finally {
            setIsTyping(false);
            isSendingRef.current = false;
        }
    }, [pageContext, tripContextProps, setMessages, setZoeReplyCount]);

    return {
        messages,
        setMessages,
        isTyping,
        isBlocked,
        sendMessage,
        zoeReplyCount,
        PAYWALL_TRIGGER,
    };
}
