import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import axiosInstance from '../lib/axios';
import { Users, Package, ShoppingBag, TrendingUp, LucideIcon } from 'lucide-react';
import {
	LineChart, Line, XAxis, YAxis, CartesianGrid,
	Tooltip, ResponsiveContainer,
} from 'recharts';
import { AxiosError } from 'axios';

interface AnalyticsData {
	users: number;
	products: number;
	totalSales: number;
	totalRevenue: number;
}

interface DailySalesEntry {
	date: string;
	sales: number;
	revenue: number;
}

interface AnalyticsResponse {
	analyticsData: AnalyticsData;
	dailySalesData: DailySalesEntry[];
}

interface CardProps {
	title: string;
	value: string;
	icon: LucideIcon;
	delay?: number;
}

const StatCard = ({ title, value, icon: Icon, delay = 0 }: CardProps) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5, delay }}
		style={{
			background: 'var(--black-card)',
			border: '1px solid rgba(201,168,76,0.15)',
			padding: '28px 24px',
			position: 'relative',
			overflow: 'hidden',
			transition: 'border-color 0.3s, box-shadow 0.3s',
		}}
		onMouseEnter={e => {
			(e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.4)';
			(e.currentTarget as HTMLElement).style.boxShadow = '0 0 40px rgba(201,168,76,0.08)';
		}}
		onMouseLeave={e => {
			(e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.15)';
			(e.currentTarget as HTMLElement).style.boxShadow = 'none';
		}}
	>
		{/* Corner accent */}
		<div style={{ position: 'absolute', top: 0, left: 0, width: 40, height: 1, background: 'linear-gradient(90deg, #c9a84c, transparent)' }} />
		<div style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 40, background: 'linear-gradient(180deg, #c9a84c, transparent)' }} />

		<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
			<div>
				<p style={{ fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)', fontFamily: 'DM Sans, sans-serif', marginBottom: 10 }}>{title}</p>
				<p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.4rem', fontWeight: 600, color: 'var(--white)', lineHeight: 1 }}>{value}</p>
			</div>
			<div style={{ width: 38, height: 38, border: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(201,168,76,0.05)' }}>
				<Icon size={16} style={{ color: '#c9a84c' }} />
			</div>
		</div>

		{/* Bottom gold accent */}
		<div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent)' }} />
	</motion.div>
);

/* Custom tooltip */
const GoldTooltip = ({ active, payload, label }: any) => {
	if (!active || !payload?.length) return null;
	return (
		<div style={{ background: '#0e0b07', border: '1px solid rgba(201,168,76,0.3)', padding: '12px 16px', fontFamily: 'DM Sans, sans-serif' }}>
			<p style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.6)', marginBottom: 8 }}>{label}</p>
			{payload.map((p: any) => (
				<p key={p.name} style={{ fontSize: '0.8rem', color: p.color, marginBottom: 4 }}>
					<span style={{ color: 'rgba(245,245,240,0.5)', marginRight: 6, fontSize: '0.65rem' }}>{p.name}:</span>
					{p.name === 'Revenue' ? `$${p.value.toLocaleString()}` : p.value.toLocaleString()}
				</p>
			))}
		</div>
	);
};

const AnalyticsTab = () => {
	const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({ users: 0, products: 0, totalSales: 0, totalRevenue: 0 });
	const [isLoading, setIsLoading] = useState(true);
	const [dailySalesData, setDailySalesData] = useState<DailySalesEntry[]>([]);

	useEffect(() => {
		(async () => {
			try {
				const res = await axiosInstance.get<AnalyticsResponse>('/analytics');
				setAnalyticsData(res.data.analyticsData);
				setDailySalesData(res.data.dailySalesData);
			} catch (e) {
				console.error((e as AxiosError).message);
			} finally {
				setIsLoading(false);
			}
		})();
	}, []);

	if (isLoading) return (
		<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
			<div style={{ width: 32, height: 32, border: '1px solid transparent', borderTopColor: '#c9a84c', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
			<style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
		</div>
	);

	return (
		<div>
			{/* Stat cards */}
			<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 1, marginBottom: 40, border: '1px solid rgba(201,168,76,0.12)', background: 'rgba(201,168,76,0.05)' }}>
				<StatCard title="Total Users"    value={analyticsData.users.toLocaleString()}            icon={Users}      delay={0} />
				<StatCard title="Total Products" value={analyticsData.products.toLocaleString()}         icon={Package}    delay={0.08} />
				<StatCard title="Total Sales"    value={analyticsData.totalSales.toLocaleString()}       icon={ShoppingBag} delay={0.16} />
				<StatCard title="Total Revenue"  value={`$${analyticsData.totalRevenue.toLocaleString()}`} icon={TrendingUp} delay={0.24} />
			</div>

			{/* Chart */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.3 }}
				style={{
					background: 'var(--black-card)',
					border: '1px solid rgba(201,168,76,0.15)',
					padding: '32px 28px',
					position: 'relative',
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
					<div>
						<p style={{ fontSize: '0.58rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.4)', fontFamily: 'DM Sans, sans-serif', marginBottom: 4 }}>Performance</p>
						<h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 600, color: 'var(--white)', margin: 0 }}>Sales & Revenue</h3>
					</div>
					<div style={{ display: 'flex', gap: 20 }}>
						<span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(245,245,240,0.4)', fontFamily: 'DM Sans, sans-serif' }}>
							<span style={{ width: 20, height: 1, background: '#c9a84c', display: 'inline-block' }} /> Sales
						</span>
						<span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(245,245,240,0.4)', fontFamily: 'DM Sans, sans-serif' }}>
							<span style={{ width: 20, height: 1, background: 'rgba(245,245,240,0.3)', display: 'inline-block', borderTop: '1px dashed rgba(245,245,240,0.3)' }} /> Revenue
						</span>
					</div>
				</div>

				<ResponsiveContainer width="100%" height={340}>
					<LineChart data={dailySalesData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
						<CartesianGrid strokeDasharray="1 4" stroke="rgba(201,168,76,0.08)" vertical={false} />
						<XAxis
							dataKey="date"
							stroke="rgba(245,245,240,0.15)"
							tick={{ fill: 'rgba(245,245,240,0.3)', fontSize: 10, fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.05em' }}
							axisLine={{ stroke: 'rgba(201,168,76,0.1)' }}
							tickLine={false}
						/>
						<YAxis
							yAxisId="left"
							stroke="rgba(245,245,240,0.15)"
							tick={{ fill: 'rgba(245,245,240,0.3)', fontSize: 10, fontFamily: 'DM Sans, sans-serif' }}
							axisLine={false}
							tickLine={false}
						/>
						<YAxis
							yAxisId="right"
							orientation="right"
							stroke="rgba(245,245,240,0.15)"
							tick={{ fill: 'rgba(245,245,240,0.3)', fontSize: 10, fontFamily: 'DM Sans, sans-serif' }}
							axisLine={false}
							tickLine={false}
						/>
						<Tooltip content={<GoldTooltip />} cursor={{ stroke: 'rgba(201,168,76,0.15)', strokeWidth: 1 }} />
						<Line
							yAxisId="left"
							type="monotone"
							dataKey="sales"
							stroke="#c9a84c"
							strokeWidth={1.5}
							dot={false}
							activeDot={{ r: 4, fill: '#c9a84c', stroke: '#0a0600', strokeWidth: 2 }}
							name="Sales"
						/>
						<Line
							yAxisId="right"
							type="monotone"
							dataKey="revenue"
							stroke="rgba(245,245,240,0.25)"
							strokeWidth={1}
							strokeDasharray="4 4"
							dot={false}
							activeDot={{ r: 4, fill: 'rgba(245,245,240,0.6)', stroke: '#0a0600', strokeWidth: 2 }}
							name="Revenue"
						/>
					</LineChart>
				</ResponsiveContainer>

				{/* corner accent */}
				<div style={{ position: 'absolute', top: 0, right: 0, width: 40, height: 1, background: 'linear-gradient(270deg, #c9a84c, transparent)' }} />
				<div style={{ position: 'absolute', top: 0, right: 0, width: 1, height: 40, background: 'linear-gradient(180deg, #c9a84c, transparent)' }} />
			</motion.div>
		</div>
	);
};

export default AnalyticsTab;
