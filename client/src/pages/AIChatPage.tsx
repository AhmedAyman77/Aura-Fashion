import { AnimatePresence, motion } from 'framer-motion';
import { Send, Trash2, Info } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const RAG_URL = 'http://localhost:8000/api/v1/nlp/index/answer/1';

interface Message {
	id: string;
	role: 'user' | 'assistant';
	content: string;
	timestamp: Date;
}

/* Neural AI Logo (matches navbar) */
const AIHexLogo = ({ size = 22 }: { size?: number }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M12 2L20.66 7V17L12 22L3.34 17V7L12 2Z" stroke="rgba(201,168,76,0.6)" strokeWidth="1" fill="rgba(201,168,76,0.08)" />
		<circle cx="12" cy="12" r="2.2" fill="#c9a84c" />
		<line x1="12" y1="9.8" x2="12" y2="5"   stroke="rgba(201,168,76,0.5)" strokeWidth="0.8" />
		<line x1="12" y1="14.2" x2="12" y2="19"  stroke="rgba(201,168,76,0.5)" strokeWidth="0.8" />
		<line x1="10.1" y1="10.9" x2="5.8" y2="8.4"   stroke="rgba(201,168,76,0.5)" strokeWidth="0.8" />
		<line x1="13.9" y1="13.1" x2="18.2" y2="15.6"  stroke="rgba(201,168,76,0.5)" strokeWidth="0.8" />
		<line x1="13.9" y1="10.9" x2="18.2" y2="8.4"   stroke="rgba(201,168,76,0.5)" strokeWidth="0.8" />
		<line x1="10.1" y1="13.1" x2="5.8" y2="15.6"   stroke="rgba(201,168,76,0.5)" strokeWidth="0.8" />
		<circle cx="12"   cy="4.5"   r="1.1" fill="#e8c97a" />
		<circle cx="12"   cy="19.5"  r="1.1" fill="#e8c97a" />
		<circle cx="5.5"  cy="8.25"  r="1.1" fill="#e8c97a" />
		<circle cx="18.5" cy="15.75" r="1.1" fill="#e8c97a" />
		<circle cx="18.5" cy="8.25"  r="1.1" fill="#e8c97a" />
		<circle cx="5.5"  cy="15.75" r="1.1" fill="#e8c97a" />
	</svg>
);

const AIChatPage = () => {
	const [messages, setMessages] = useState<Message[]>([
		{
			id: '0',
			role: 'assistant',
			content: "Welcome to Lumière AI. I'm your personal shopping concierge, powered by RAG. Ask me about our collections, get style recommendations, or inquire about any piece in our house.",
			timestamp: new Date(),
		},
	]);
	const [input, setInput] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto';
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	}, [input]);

	const sendMessage = async () => {
		const trimmed = input.trim();
		if (!trimmed || isLoading) return;
		const userMsg: Message = { id: Date.now().toString(), role: 'user', content: trimmed, timestamp: new Date() };
		setMessages(prev => [...prev, userMsg]);
		setInput('');
		setIsLoading(true);
		setError(null);
		try {
			const res = await fetch(RAG_URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text: trimmed, limit: 40 }),
			});
			if (!res.ok) throw new Error(`${res.status}`);
			const data = await res.json();
			setMessages(prev => [...prev, {
				id: (Date.now() + 1).toString(),
				role: 'assistant',
				content: data.answer || "I couldn't find a relevant answer. Please try rephrasing your question.",
				timestamp: new Date(),
			}]);
		} catch {
			setError('Failed to reach the AI concierge. Please try again.');
			setMessages(prev => prev.filter(m => m.id !== userMsg.id));
			setInput(trimmed);
		} finally {
			setIsLoading(false);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
	};

	const clearChat = () => {
		setMessages([{
			id: '0', role: 'assistant',
			content: "Welcome to Lumière AI. I'm your personal shopping concierge, powered by RAG. Ask me about our collections, get style recommendations, or inquire about any piece in our house.",
			timestamp: new Date(),
		}]);
		setError(null);
	};

	const fmt = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

	return (
		<div style={{ minHeight: '100vh', paddingTop: 96, paddingBottom: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '96px 24px 40px' }}>
			<style>{`
				@keyframes ai-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.65;transform:scale(.88)} }
				@keyframes dot-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
				.chat-textarea::placeholder { color: rgba(245,245,240,0.2); }
				.chat-textarea:focus { outline: none; }
				::-webkit-scrollbar { width: 3px; }
				::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.2); }
				::-webkit-scrollbar-track { background: transparent; }
			`}</style>

			<div style={{ width: '100%', maxWidth: 760 }}>

				{/* ── Header ── */}
				<motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} style={{ marginBottom: 28 }}>
					<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
						<div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
							{/* Logo with pulsing glow */}
							<div style={{
								width: 48, height: 48,
								border: '1px solid rgba(201,168,76,0.3)',
								display: 'flex', alignItems: 'center', justifyContent: 'center',
								background: 'rgba(201,168,76,0.06)',
								position: 'relative',
								animation: 'ai-pulse 3s ease-in-out infinite',
							}}>
								<AIHexLogo size={24} />
								{/* corner accents */}
								<div style={{ position: 'absolute', top: 0, left: 0, width: 10, height: 1, background: '#c9a84c' }} />
								<div style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 10, background: '#c9a84c' }} />
								<div style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 1, background: '#c9a84c' }} />
								<div style={{ position: 'absolute', bottom: 0, right: 0, width: 1, height: 10, background: '#c9a84c' }} />
							</div>
							<div>
								<p style={{ fontSize: '0.55rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.45)', fontFamily: 'DM Sans, sans-serif', marginBottom: 4 }}>
									Powered by RAG · HuggingFace
								</p>
								<h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.9rem', fontWeight: 600, color: 'var(--white)', margin: 0, lineHeight: 1 }}>
									Lumière <span style={{ background: 'linear-gradient(90deg, #c9a84c, #e8c97a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>AI</span>
								</h1>
							</div>
						</div>

						<button
							onClick={clearChat}
							style={{
								display: 'flex', alignItems: 'center', gap: 6,
								background: 'transparent', border: '1px solid rgba(255,255,255,0.07)',
								color: 'rgba(245,245,240,0.35)', padding: '8px 14px',
								fontFamily: 'DM Sans, sans-serif',
								fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase',
								cursor: 'pointer', transition: 'all 0.25s',
							}}
							onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(200,50,50,0.4)'; (e.currentTarget as HTMLElement).style.color = '#e05555'; (e.currentTarget as HTMLElement).style.background = 'rgba(200,50,50,0.05)'; }}
							onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.color = 'rgba(245,245,240,0.35)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
						>
							<Trash2 size={12} />
							Clear
						</button>
					</div>

					{/* Info strip */}
					<div style={{
						marginTop: 18,
						display: 'flex', alignItems: 'flex-start', gap: 10,
						background: 'rgba(201,168,76,0.04)',
						border: '1px solid rgba(201,168,76,0.15)',
						padding: '12px 16px',
					}}>
						<Info size={13} style={{ color: 'rgba(201,168,76,0.5)', marginTop: 1, flexShrink: 0 }} />
						<p style={{ fontSize: '0.72rem', color: 'rgba(245,245,240,0.45)', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.65, margin: 0 }}>
							Ask about our collections, get personalised styling recommendations, or inquire about specific pieces. The concierge uses RAG to provide accurate, context-aware answers.
						</p>
					</div>
				</motion.div>

				{/* ── Chat window ── */}
				<motion.div
					initial={{ opacity: 0, scale: 0.99 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.4, delay: 0.15 }}
					style={{
						background: 'var(--black-card)',
						border: '1px solid rgba(201,168,76,0.18)',
						display: 'flex', flexDirection: 'column',
						height: 'calc(100vh - 360px)', minHeight: 400,
						position: 'relative',
						boxShadow: '0 20px 80px rgba(0,0,0,0.7)',
					}}
				>
					{/* corner accents */}
					<div style={{ position: 'absolute', top: 0, left: 0, width: 40, height: 1, background: 'linear-gradient(90deg, #c9a84c, transparent)' }} />
					<div style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 40, background: 'linear-gradient(180deg, #c9a84c, transparent)' }} />
					<div style={{ position: 'absolute', top: 0, right: 0, width: 40, height: 1, background: 'linear-gradient(270deg, #c9a84c, transparent)' }} />
					<div style={{ position: 'absolute', top: 0, right: 0, width: 1, height: 40, background: 'linear-gradient(180deg, #c9a84c, transparent)' }} />

					{/* Messages */}
					<div style={{ flex: 1, overflowY: 'auto', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
						<AnimatePresence initial={false}>
							{messages.map(msg => (
								<motion.div
									key={msg.id}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.22 }}
									style={{ display: 'flex', gap: 12, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}
								>
									{/* Avatar */}
									<div style={{
										width: 34, height: 34, flexShrink: 0,
										border: `1px solid ${msg.role === 'assistant' ? 'rgba(201,168,76,0.35)' : 'rgba(245,245,240,0.15)'}`,
										background: msg.role === 'assistant' ? 'rgba(201,168,76,0.08)' : 'rgba(245,245,240,0.05)',
										display: 'flex', alignItems: 'center', justifyContent: 'center',
									}}>
										{msg.role === 'assistant'
											? <AIHexLogo size={16} />
											: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(245,245,240,0.5)" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
										}
									</div>

									{/* Bubble */}
									<div style={{ maxWidth: '76%', display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 5 }}>
										<div style={{
											padding: '12px 18px',
											background: msg.role === 'assistant'
												? 'rgba(20,16,10,0.9)'
												: 'rgba(201,168,76,0.1)',
											border: msg.role === 'assistant'
												? '1px solid rgba(201,168,76,0.12)'
												: '1px solid rgba(201,168,76,0.35)',
											fontSize: '0.875rem',
											color: msg.role === 'assistant' ? 'rgba(245,245,240,0.85)' : 'var(--white)',
											lineHeight: 1.7,
											fontFamily: 'DM Sans, sans-serif',
											whiteSpace: 'pre-wrap',
										}}>
											{msg.content}
										</div>
										<span style={{ fontSize: '0.58rem', letterSpacing: '0.08em', color: 'rgba(245,245,240,0.2)', fontFamily: 'DM Sans, sans-serif' }}>
											{fmt(msg.timestamp)}
										</span>
									</div>
								</motion.div>
							))}
						</AnimatePresence>

						{/* Typing indicator */}
						{isLoading && (
							<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', gap: 12 }}>
								<div style={{
									width: 34, height: 34, flexShrink: 0,
									border: '1px solid rgba(201,168,76,0.35)',
									background: 'rgba(201,168,76,0.08)',
									display: 'flex', alignItems: 'center', justifyContent: 'center',
									animation: 'ai-pulse 1.5s ease-in-out infinite',
								}}>
									<AIHexLogo size={16} />
								</div>
								<div style={{
									padding: '14px 18px',
									background: 'rgba(20,16,10,0.9)',
									border: '1px solid rgba(201,168,76,0.12)',
									display: 'flex', alignItems: 'center', gap: 6,
								}}>
									{[0, 1, 2].map(i => (
										<span key={i} style={{
											width: 5, height: 5, borderRadius: '50%', background: '#c9a84c',
											display: 'inline-block',
											animation: `dot-bounce 1.2s ease-in-out ${i * 0.18}s infinite`,
										}} />
									))}
								</div>
							</motion.div>
						)}
						<div ref={messagesEndRef} />
					</div>

					{/* Error */}
					{error && (
						<div style={{
							margin: '0 20px 12px',
							padding: '10px 16px',
							background: 'rgba(180,40,40,0.08)',
							border: '1px solid rgba(180,40,40,0.3)',
							color: '#e05555',
							fontSize: '0.75rem',
							fontFamily: 'DM Sans, sans-serif',
						}}>
							{error}
						</div>
					)}

					{/* ── Input area ── */}
					<div style={{
						borderTop: '1px solid rgba(201,168,76,0.12)',
						padding: '16px 20px',
						background: 'rgba(8,6,4,0.8)',
					}}>
						<div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
							<div style={{
								flex: 1,
								background: 'rgba(10,8,5,0.9)',
								border: '1px solid rgba(201,168,76,0.15)',
								transition: 'border-color 0.25s, box-shadow 0.25s',
							}}
								onFocusCapture={e => {
									(e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.4)';
									(e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(201,168,76,0.06)';
								}}
								onBlurCapture={e => {
									(e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.15)';
									(e.currentTarget as HTMLElement).style.boxShadow = 'none';
								}}
							>
								<textarea
									ref={textareaRef}
									className="chat-textarea"
									value={input}
									onChange={e => setInput(e.target.value)}
									onKeyDown={handleKeyDown}
									placeholder="Ask about our collections, styles, or any piece…"
									rows={1}
									disabled={isLoading}
									style={{
										width: '100%', background: 'transparent',
										color: 'var(--white)', fontSize: '0.875rem',
										padding: '13px 16px', resize: 'none',
										outline: 'none', maxHeight: 120,
										fontFamily: 'DM Sans, sans-serif',
										border: 'none', display: 'block',
									}}
								/>
							</div>

							<button
								onClick={sendMessage}
								disabled={!input.trim() || isLoading}
								style={{
									width: 44, height: 44, flexShrink: 0,
									background: (!input.trim() || isLoading) ? 'rgba(201,168,76,0.08)' : 'linear-gradient(135deg, #a87828, #c9a84c)',
									border: `1px solid ${(!input.trim() || isLoading) ? 'rgba(201,168,76,0.15)' : 'transparent'}`,
									color: (!input.trim() || isLoading) ? 'rgba(201,168,76,0.3)' : '#0a0600',
									display: 'flex', alignItems: 'center', justifyContent: 'center',
									cursor: (!input.trim() || isLoading) ? 'not-allowed' : 'pointer',
									transition: 'all 0.25s',
									flexDirection: 'column',
								}}
								onMouseEnter={e => { if (input.trim() && !isLoading) (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(201,168,76,0.35)'; }}
								onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
							>
								<Send size={16} />
							</button>
						</div>

						<p style={{ fontSize: '0.58rem', color: 'rgba(245,245,240,0.2)', textAlign: 'center', marginTop: 10, fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.05em' }}>
							Enter to send · Shift+Enter for new line
						</p>
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default AIChatPage;
