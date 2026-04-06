import { Search, X } from 'lucide-react';

interface SearchBarProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

const SearchBar = ({ value, onChange, placeholder = 'Search products...' }: SearchBarProps) => {
	return (
		<div style={{ position: 'relative', width: '100%', maxWidth: 560, margin: '0 auto' }}>
			<div style={{
				position: 'absolute',
				insetInlineStart: 0,
				top: 0,
				bottom: 0,
				paddingLeft: 16,
				display: 'flex',
				alignItems: 'center',
				pointerEvents: 'none',
			}}>
				<Search style={{ height: 16, width: 16, color: 'rgba(201,168,76,0.5)' }} />
			</div>
			<input
				type='text'
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				style={{
					width: '100%',
					paddingLeft: 44,
					paddingRight: value ? 44 : 16,
					paddingTop: 12,
					paddingBottom: 12,
					background: 'rgba(245,245,240,0.03)',
					border: '1px solid rgba(201,168,76,0.25)',
					borderRadius: 2,
					color: 'rgba(245,245,240,0.8)',
					fontFamily: 'DM Sans, sans-serif',
					fontSize: '0.85rem',
					letterSpacing: '0.06em',
					outline: 'none',
					transition: 'border-color 0.25s, box-shadow 0.25s',
					boxSizing: 'border-box',
				}}
				onFocus={e => {
					e.target.style.borderColor = 'rgba(201,168,76,0.55)';
					e.target.style.boxShadow = '0 0 0 2px rgba(201,168,76,0.08)';
				}}
				onBlur={e => {
					e.target.style.borderColor = 'rgba(201,168,76,0.25)';
					e.target.style.boxShadow = 'none';
				}}
			/>
			{value && (
				<button
					onClick={() => onChange('')}
					style={{
						position: 'absolute',
						top: 0,
						right: 0,
						bottom: 0,
						paddingRight: 14,
						display: 'flex',
						alignItems: 'center',
						background: 'none',
						border: 'none',
						cursor: 'pointer',
						color: 'rgba(245,245,240,0.35)',
						transition: 'color 0.2s',
					}}
					onMouseEnter={e => (e.currentTarget.style.color = 'rgba(201,168,76,0.7)')}
					onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,245,240,0.35)')}
				>
					<X style={{ height: 15, width: 15 }} />
				</button>
			)}
		</div>
	);
};

export default SearchBar;
