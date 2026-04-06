const LoadingSpinner = () => {
	return (
		<div style={{
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			minHeight: '100vh',
			background: 'var(--black)',
			flexDirection: 'column',
			gap: 24,
			position: 'relative',
			overflow: 'hidden',
		}}>
			{/* Ambient glow */}
			<div style={{
				position: 'absolute',
				width: 300,
				height: 300,
				borderRadius: '50%',
				background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)',
				pointerEvents: 'none',
			}} />

			{/* Spinner rings */}
			<div style={{ position: 'relative', width: 72, height: 72 }}>
				{/* Outer static ring */}
				<div style={{
					position: 'absolute',
					inset: 0,
					borderRadius: '50%',
					border: '1px solid rgba(201,168,76,0.15)',
				}} />
				{/* Middle static ring */}
				<div style={{
					position: 'absolute',
					inset: 10,
					borderRadius: '50%',
					border: '1px solid rgba(201,168,76,0.08)',
				}} />
				{/* Spinning arc */}
				<div style={{
					position: 'absolute',
					inset: 0,
					borderRadius: '50%',
					border: '1.5px solid transparent',
					borderTopColor: '#c9a84c',
					borderRightColor: 'rgba(201,168,76,0.3)',
					animation: 'spin 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
				}} />
				{/* Inner dot */}
				<div style={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: 4,
					height: 4,
					borderRadius: '50%',
					background: '#c9a84c',
					boxShadow: '0 0 8px rgba(201,168,76,0.8)',
				}} />
			</div>

			{/* Brand wordmark */}
			<div style={{
				fontFamily: 'Cormorant Garamond, serif',
				fontSize: '0.7rem',
				letterSpacing: '0.35em',
				textTransform: 'uppercase',
				color: 'rgba(201,168,76,0.5)',
				userSelect: 'none',
			}}>
				Loading
			</div>

			<style>{`
				@keyframes spin {
					to { transform: rotate(360deg); }
				}
			`}</style>

			<div className='sr-only'>Loading</div>
		</div>
	);
};

export default LoadingSpinner;
