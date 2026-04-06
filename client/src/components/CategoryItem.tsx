import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

interface Category { href: string; name: string; imageUrl: string; }
interface CategoryItemProps { category: Category; }

const CategoryItem = ({ category }: CategoryItemProps) => {
	return (
		<Link to={'/category' + category.href} style={{ textDecoration: 'none', display: 'block' }}>
			<div style={{
				position: 'relative', overflow: 'hidden', height: 380,
				background: '#0a0a0a', border: '1px solid #1e1e1e',
				cursor: 'pointer', transition: 'border-color 0.3s',
			}}
				onMouseEnter={e => {
					(e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.4)';
					const img = (e.currentTarget as HTMLElement).querySelector('img') as HTMLElement;
					if (img) img.style.transform = 'scale(1.08)';
					const arrow = (e.currentTarget as HTMLElement).querySelector('.arrow-icon') as HTMLElement;
					if (arrow) { arrow.style.opacity = '1'; arrow.style.transform = 'translate(0,0)'; }
				}}
				onMouseLeave={e => {
					(e.currentTarget as HTMLElement).style.borderColor = '#1e1e1e';
					const img = (e.currentTarget as HTMLElement).querySelector('img') as HTMLElement;
					if (img) img.style.transform = 'scale(1)';
					const arrow = (e.currentTarget as HTMLElement).querySelector('.arrow-icon') as HTMLElement;
					if (arrow) { arrow.style.opacity = '0'; arrow.style.transform = 'translate(-4px, 4px)'; }
				}}
			>
				<img
					src={category.imageUrl}
					alt={category.name}
					style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease', filter: 'brightness(0.6)' }}
					loading='lazy'
				/>

				{/* Gradient overlay */}
				<div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)' }} />

				{/* Gold top line */}
				<div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)', opacity: 0 }} className='top-line' />

				{/* Content */}
				<div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px' }}>
					<p style={{ color: 'var(--gold)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'DM Sans', marginBottom: 8 }}>
						Collection
					</p>
					<h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 600, color: '#f5f5f0', margin: 0, letterSpacing: '0.02em' }}>
						{category.name}
					</h3>
				</div>

				{/* Arrow icon */}
				<div className='arrow-icon' style={{
					position: 'absolute', top: 16, right: 16,
					width: 36, height: 36, border: '1px solid var(--gold)',
					display: 'flex', alignItems: 'center', justifyContent: 'center',
					color: 'var(--gold)', opacity: 0, transform: 'translate(-4px, 4px)',
					transition: 'all 0.3s ease',
				}}>
					<ArrowUpRight size={16} />
				</div>
			</div>
		</Link>
	);
};

export default CategoryItem;
