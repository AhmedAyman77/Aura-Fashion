import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Upload, Loader, X } from 'lucide-react';
import { useProductStore } from '../stores/useProductStore';

const categories = ['jeans', 't-shirts', 'shoes', 'glasses', 'jackets', 'suits', 'bags'];

interface NewProduct {
	name: string;
	description: string;
	price: string;
	category: string;
}

const inputStyle: React.CSSProperties = {
	width: '100%',
	background: 'rgba(10,8,5,0.8)',
	border: '1px solid rgba(201,168,76,0.15)',
	color: 'var(--white)',
	fontFamily: 'DM Sans, sans-serif',
	fontSize: '0.875rem',
	padding: '12px 16px',
	outline: 'none',
	transition: 'border-color 0.25s, box-shadow 0.25s',
	borderRadius: 0,
};

const InputField = ({ label, children }: { label: string; children: React.ReactNode }) => (
	<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
		<label style={{ fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)', fontFamily: 'DM Sans, sans-serif' }}>
			{label}
		</label>
		{children}
	</div>
);

const CreateProductForm = () => {
	const [newProduct, setNewProduct] = useState<NewProduct>({ name: '', description: '', price: '', category: '' });
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string>('');
	const { createProduct, loading } = useProductStore();

	const focusIn = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)';
		e.currentTarget.style.boxShadow = '0 0 20px rgba(201,168,76,0.06)';
	};
	const focusOut = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		e.currentTarget.style.borderColor = 'rgba(201,168,76,0.15)';
		e.currentTarget.style.boxShadow = 'none';
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const formData = new FormData();
			formData.append('name', newProduct.name);
			formData.append('description', newProduct.description);
			formData.append('price', newProduct.price);
			formData.append('category', newProduct.category);
			if (imageFile) formData.append('image', imageFile);
			await createProduct(formData);
			setNewProduct({ name: '', description: '', price: '', category: '' });
			setImageFile(null);
			setImagePreview('');
		} catch {
			console.log('error creating a product');
		}
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImageFile(file);
			setImagePreview(URL.createObjectURL(file));
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 16 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			style={{ maxWidth: 560, margin: '0 auto' }}
		>
			<style>{`
				.luxe-input::placeholder { color: rgba(245,245,240,0.2); }
				.luxe-input option { background: #0e0b07; color: #f5f5f0; }
				.upload-zone { transition: border-color 0.3s, background 0.3s; }
				.upload-zone:hover { border-color: rgba(201,168,76,0.45) !important; background: rgba(201,168,76,0.04) !important; }
			`}</style>

			{/* Panel header */}
			<div style={{ marginBottom: 32 }}>
				<p style={{ fontSize: '0.58rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.4)', fontFamily: 'DM Sans, sans-serif', marginBottom: 6 }}>
					Collection Management
				</p>
				<h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 600, color: 'var(--white)', margin: 0 }}>
					New Piece
				</h2>
				<div style={{ height: 1, background: 'linear-gradient(90deg, rgba(201,168,76,0.4), transparent)', marginTop: 12, width: 120 }} />
			</div>

			{/* Form card */}
			<div style={{
				background: 'var(--black-card)',
				border: '1px solid rgba(201,168,76,0.15)',
				padding: '36px 32px',
				position: 'relative',
			}}>
				{/* corner accents */}
				<div style={{ position: 'absolute', top: 0, left: 0, width: 32, height: 1, background: 'linear-gradient(90deg, #c9a84c, transparent)' }} />
				<div style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 32, background: 'linear-gradient(180deg, #c9a84c, transparent)' }} />
				<div style={{ position: 'absolute', bottom: 0, right: 0, width: 32, height: 1, background: 'linear-gradient(270deg, #c9a84c, transparent)' }} />
				<div style={{ position: 'absolute', bottom: 0, right: 0, width: 1, height: 32, background: 'linear-gradient(0deg, #c9a84c, transparent)' }} />

				<form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

					<InputField label="Product Name">
						<input
							className="luxe-input"
							type="text"
							value={newProduct.name}
							onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
							onFocus={focusIn} onBlur={focusOut}
							style={inputStyle}
							placeholder="e.g. Milano Wool Blazer"
							required
						/>
					</InputField>

					<InputField label="Description">
						<textarea
							className="luxe-input"
							value={newProduct.description}
							onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
							onFocus={focusIn} onBlur={focusOut}
							rows={3}
							style={{ ...inputStyle, resize: 'none' }}
							placeholder="Describe the piece — materials, craftsmanship, provenance…"
							required
						/>
					</InputField>

					<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
						<InputField label="Price (USD)">
							<input
								className="luxe-input"
								type="number"
								value={newProduct.price}
								onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
								onFocus={focusIn} onBlur={focusOut}
								step="0.01"
								style={inputStyle}
								placeholder="0.00"
								required
							/>
						</InputField>

						<InputField label="Category">
							<select
								className="luxe-input"
								value={newProduct.category}
								onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
								onFocus={focusIn} onBlur={focusOut}
								style={inputStyle}
								required
							>
								<option value="">Select…</option>
								{categories.map(c => (
									<option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
								))}
							</select>
						</InputField>
					</div>

					{/* Image upload */}
					<InputField label="Product Image">
						<input type="file" id="image" className="sr-only" accept="image/*" onChange={handleImageChange} />
						{imagePreview ? (
							<div style={{ position: 'relative', display: 'inline-block' }}>
								<img
									src={imagePreview}
									alt="Preview"
									style={{ width: '100%', height: 160, objectFit: 'cover', border: '1px solid rgba(201,168,76,0.25)', display: 'block' }}
								/>
								<button
									type="button"
									onClick={() => { setImageFile(null); setImagePreview(''); }}
									style={{
										position: 'absolute', top: 8, right: 8,
										background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(201,168,76,0.3)',
										color: '#c9a84c', width: 28, height: 28,
										display: 'flex', alignItems: 'center', justifyContent: 'center',
										cursor: 'pointer',
									}}
								>
									<X size={12} />
								</button>
							</div>
						) : (
							<label
								htmlFor="image"
								className="upload-zone"
								style={{
									display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
									gap: 10, height: 120, border: '1px dashed rgba(201,168,76,0.2)',
									cursor: 'pointer', background: 'rgba(201,168,76,0.02)',
								}}
							>
								<Upload size={20} style={{ color: 'rgba(201,168,76,0.4)' }} />
								<span style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.4)', fontFamily: 'DM Sans, sans-serif' }}>
									Choose image
								</span>
							</label>
						)}
					</InputField>

					{/* Submit */}
					<button
						type="submit"
						disabled={loading}
						style={{
							display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
							padding: '14px 24px',
							background: loading ? 'rgba(201,168,76,0.15)' : 'linear-gradient(135deg, #a87828, #c9a84c, #e0b85a)',
							border: '1px solid transparent',
							color: loading ? 'rgba(201,168,76,0.5)' : '#0a0600',
							fontFamily: 'DM Sans, sans-serif',
							fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase',
							fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
							transition: 'all 0.25s ease',
							marginTop: 8,
						}}
						onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.boxShadow = '0 0 28px rgba(201,168,76,0.3)'; }}
						onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
					>
						{loading ? (
							<><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Processing…</>
						) : (
							<><PlusCircle size={14} /> Add to Collection</>
						)}
					</button>
				</form>
			</div>

			<style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
		</motion.div>
	);
};

export default CreateProductForm;
