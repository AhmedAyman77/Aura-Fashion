import { PlusCircle, ShoppingBag, Crown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import CreateProductForm from '../components/CreateProductForm';
import ProductsList from '../components/ProductsList';
import { useProductStore } from '../stores/useProductStore';

type TabId = 'create' | 'products';

interface Tab {
	id: TabId;
	label: string;
	icon: React.ElementType;
	sub: string;
}

const tabs: Tab[] = [
	{ id: 'create',   label: 'New Product', icon: PlusCircle,  sub: 'Add to collection' },
	{ id: 'products', label: 'Inventory',   icon: ShoppingBag, sub: 'Manage pieces' },
];

const AdminPage = () => {
	const [activeTab, setActiveTab] = useState<TabId>('create');
	const { fetchAllProducts } = useProductStore();

	useEffect(() => { fetchAllProducts(); }, [fetchAllProducts]);

	return (
		<div style={{ minHeight: '100vh', background: 'var(--black)', paddingTop: 100 }}>
			<style>{`
				.admin-tab {
					position: relative;
					display: flex;
					align-items: center;
					gap: 10px;
					padding: 14px 26px;
					background: transparent;
					border: 1px solid rgba(201,168,76,0.1);
					color: rgba(245,245,240,0.38);
					cursor: pointer;
					transition: all 0.3s ease;
					font-family: 'DM Sans', sans-serif;
					text-align: left;
				}
				.admin-tab:hover {
					border-color: rgba(201,168,76,0.35);
					color: rgba(245,245,240,0.75);
					background: rgba(201,168,76,0.04);
				}
				.admin-tab.active {
					border-color: rgba(201,168,76,0.5);
					color: var(--white);
					background: rgba(201,168,76,0.07);
					box-shadow: 0 0 30px rgba(201,168,76,0.08);
				}
				.admin-tab.active::after {
					content: '';
					position: absolute;
					bottom: -1px;
					left: 10%;
					width: 80%;
					height: 1px;
					background: linear-gradient(90deg, transparent, #c9a84c, transparent);
				}
				.tab-icon-wrap {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 32px;
					height: 32px;
					border-radius: 2px;
					border: 1px solid rgba(201,168,76,0.15);
					background: rgba(201,168,76,0.05);
					flex-shrink: 0;
					transition: all 0.3s;
				}
				.admin-tab.active .tab-icon-wrap {
					border-color: rgba(201,168,76,0.4);
					background: rgba(201,168,76,0.1);
				}
			`}</style>

			<div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px 80px' }}>

				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					style={{ marginBottom: 48, display: 'flex', alignItems: 'center', gap: 16 }}
				>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
						<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
							<Crown size={14} style={{ color: '#c9a84c', opacity: 0.7 }} />
							<span style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)', fontFamily: 'DM Sans, sans-serif' }}>
								Aura Fashion · Admin
							</span>
						</div>
						<h1 style={{
							fontFamily: 'Cormorant Garamond, serif',
							fontSize: '2.6rem',
							fontWeight: 600,
							letterSpacing: '0.04em',
							background: 'linear-gradient(90deg, #c9a84c, #e8c97a, #c9a84c)',
							backgroundSize: '200% auto',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
							lineHeight: 1,
							margin: 0,
						}}>
							House Dashboard
						</h1>
					</div>
					<div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(201,168,76,0.3), transparent)', marginLeft: 16 }} />
				</motion.div>

				{/* Tab bar */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.15 }}
					style={{ display: 'flex', gap: 0, marginBottom: 40, borderBottom: '1px solid rgba(201,168,76,0.1)' }}
				>
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`admin-tab${activeTab === tab.id ? ' active' : ''}`}
						>
							<span className="tab-icon-wrap">
								<tab.icon size={14} style={{ color: activeTab === tab.id ? '#c9a84c' : 'rgba(245,245,240,0.4)' }} />
							</span>
							<span style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
								<span style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>{tab.label}</span>
								<span style={{ fontSize: '0.6rem', letterSpacing: '0.06em', color: 'rgba(245,245,240,0.3)', fontWeight: 400 }}>{tab.sub}</span>
							</span>
						</button>
					))}
				</motion.div>

				{/* Tab content */}
				<motion.div
					key={activeTab}
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.35 }}
				>
					{activeTab === 'create'   && <CreateProductForm />}
					{activeTab === 'products' && <ProductsList />}
				</motion.div>

			</div>
		</div>
	);
};

export default AdminPage;
