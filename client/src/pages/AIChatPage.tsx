import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Info, Loader, Send, Trash2, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const RAG_URL = 'http://localhost:6000/api/v1/nlp/index/answer/1';

interface Message {
	id: string;
	role: 'user' | 'assistant';
	content: string;
	timestamp: Date;
}

const AIChatPage = () => {
	const [messages, setMessages] = useState<Message[]>([
		{
			id: '0',
			role: 'assistant',
			content:
				"Hello! I'm your AI shopping assistant powered by RAG. Ask me anything about our products, categories, or get personalized recommendations!",
			timestamp: new Date(),
		},
	]);
	const [input, setInput] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	// Auto-resize textarea
	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto';
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	}, [input]);

	const sendMessage = async () => {
		const trimmed = input.trim();
		if (!trimmed || isLoading) return;

		const userMessage: Message = {
			id: Date.now().toString(),
			role: 'user',
			content: trimmed,
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInput('');
		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch(`${RAG_URL}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					text: trimmed,
					limit: 5,
				}),
			});

			if (!response.ok) {
				throw new Error(`Server responded with ${response.status}`);
			}

			const data = await response.json();

			const assistantMessage: Message = {
				id: (Date.now() + 1).toString(),
				role: 'assistant',
				content: data.answer || "I couldn't find a relevant answer. Please try rephrasing your question.",
				timestamp: new Date(),
			};

			setMessages((prev) => [...prev, assistantMessage]);
		} catch (err: any) {
			setError('Failed to reach the AI assistant. Please try again.');
			// Remove the user message on error so they can retry
			setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
			setInput(trimmed);
		} finally {
			setIsLoading(false);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};

	const clearChat = () => {
		setMessages([
			{
				id: '0',
				role: 'assistant',
				content:
					"Hello! I'm your AI shopping assistant powered by RAG. Ask me anything about our products, categories, or get personalized recommendations!",
				timestamp: new Date(),
			},
		]);
		setError(null);
	};

	const formatTime = (date: Date) =>
		date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

	return (
		<div className='min-h-screen flex flex-col items-center px-4 py-8'>
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className='w-full max-w-3xl mb-6'
			>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-3'>
						<div className='w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30'>
							<Bot size={22} className='text-white' />
						</div>
						<div>
							<h1 className='text-2xl font-bold text-emerald-400'>AI Shopping Assistant</h1>
							<p className='text-gray-400 text-sm flex items-center gap-1'>
								<span className='w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse' />
								Powered by RAG · HuggingFace Space
							</p>
						</div>
					</div>
					<button
						onClick={clearChat}
						className='flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors text-sm px-3 py-1.5 rounded-lg hover:bg-red-400/10'
					>
						<Trash2 size={16} />
						Clear
					</button>
				</div>

				{/* Info banner */}
				<div className='mt-4 flex items-start gap-2 bg-emerald-900/30 border border-emerald-700/40 rounded-xl p-3 text-sm text-emerald-300'>
					<Info size={16} className='mt-0.5 shrink-0' />
					<p>
						Ask about products, get recommendations, or inquire about categories. The assistant uses RAG to
						provide accurate, context-aware answers.
					</p>
				</div>
			</motion.div>

			{/* Chat container */}
			<motion.div
				initial={{ opacity: 0, scale: 0.98 }}
				animate={{ opacity: 1, scale: 1 }}
				className='w-full max-w-3xl flex flex-col bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl overflow-hidden'
				style={{ height: 'calc(100vh - 260px)', minHeight: '400px' }}
			>
				{/* Messages */}
				<div className='flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent'>
					<AnimatePresence initial={false}>
						{messages.map((msg) => (
							<motion.div
								key={msg.id}
								initial={{ opacity: 0, y: 12 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.2 }}
								className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
							>
								{/* Avatar */}
								<div
									className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-md ${
										msg.role === 'assistant'
											? 'bg-emerald-600 shadow-emerald-600/30'
											: 'bg-gray-600 shadow-gray-600/30'
									}`}
								>
									{msg.role === 'assistant' ? (
										<Bot size={16} className='text-white' />
									) : (
										<User size={16} className='text-white' />
									)}
								</div>

								{/* Bubble */}
								<div
									className={`max-w-[78%] flex flex-col ${
										msg.role === 'user' ? 'items-end' : 'items-start'
									}`}
								>
									<div
										className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
											msg.role === 'assistant'
												? 'bg-gray-700/80 text-gray-100 rounded-tl-sm'
												: 'bg-emerald-600 text-white rounded-tr-sm'
										}`}
									>
										{msg.content}
									</div>
									<span className='text-xs text-gray-500 mt-1 px-1'>
										{formatTime(msg.timestamp)}
									</span>
								</div>
							</motion.div>
						))}
					</AnimatePresence>

					{/* Typing indicator */}
					{isLoading && (
						<motion.div
							initial={{ opacity: 0, y: 8 }}
							animate={{ opacity: 1, y: 0 }}
							className='flex gap-3'
						>
							<div className='w-8 h-8 rounded-full bg-emerald-600 flex-shrink-0 flex items-center justify-center shadow-md shadow-emerald-600/30'>
								<Bot size={16} className='text-white' />
							</div>
							<div className='px-4 py-3 rounded-2xl rounded-tl-sm bg-gray-700/80 flex items-center gap-1'>
								<span className='w-2 h-2 rounded-full bg-emerald-400 animate-bounce' style={{ animationDelay: '0ms' }} />
								<span className='w-2 h-2 rounded-full bg-emerald-400 animate-bounce' style={{ animationDelay: '150ms' }} />
								<span className='w-2 h-2 rounded-full bg-emerald-400 animate-bounce' style={{ animationDelay: '300ms' }} />
							</div>
						</motion.div>
					)}

					<div ref={messagesEndRef} />
				</div>

				{/* Error */}
				{error && (
					<div className='mx-4 mb-2 px-3 py-2 bg-red-900/40 border border-red-700/50 rounded-xl text-red-300 text-sm'>
						{error}
					</div>
				)}

				{/* Input area */}
				<div className='p-4 border-t border-gray-700 bg-gray-800/50'>
					<div className='flex gap-2 items-end'>
						<div className='flex-1 bg-gray-700/60 border border-gray-600 focus-within:border-emerald-500 rounded-xl transition-colors'>
							<textarea
								ref={textareaRef}
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyDown={handleKeyDown}
								placeholder='Ask about products, deals, recommendations...'
								rows={1}
								className='w-full bg-transparent text-white placeholder-gray-400 text-sm px-4 py-3 resize-none outline-none max-h-32'
								disabled={isLoading}
							/>
						</div>
						<button
							onClick={sendMessage}
							disabled={!input.trim() || isLoading}
							className='w-11 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center transition-colors shadow-lg shadow-emerald-600/20 flex-shrink-0'
						>
							{isLoading ? (
								<Loader size={18} className='text-white animate-spin' />
							) : (
								<Send size={18} className='text-white' />
							)}
						</button>
					</div>
					<p className='text-xs text-gray-500 mt-2 text-center'>
						Press <kbd className='bg-gray-700 px-1 rounded text-gray-400'>Enter</kbd> to send ·{' '}
						<kbd className='bg-gray-700 px-1 rounded text-gray-400'>Shift+Enter</kbd> for new line
					</p>
				</div>
			</motion.div>
		</div>
	);
};

export default AIChatPage;
