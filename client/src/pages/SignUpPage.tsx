import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, ArrowRight, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUserStore } from '../stores/useUserStore';

interface FormData {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
}

interface ValidationErrors {
	name?: string;
	email?: string;
	password?: string;
	confirmPassword?: string;
}

// Mirror the server-side zod rules so the user sees errors instantly,
// before a round-trip to the API.
function validate(data: FormData): ValidationErrors {
	const errors: ValidationErrors = {};

	if (data.name.trim().length < 2)  errors.name = 'Name must be at least 2 characters';
	if (data.name.trim().length > 64) errors.name = 'Name must be at most 64 characters';

	if (!data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
		errors.email = 'Please enter a valid email address';

	if (data.password.length < 8)
		errors.password = 'Password must be at least 8 characters';
	else if (data.password.length > 128)
		errors.password = 'Password must be at most 128 characters';
	else if (!/[A-Z]/.test(data.password))
		errors.password = 'Password needs at least one uppercase letter';
	else if (!/[0-9]/.test(data.password))
		errors.password = 'Password needs at least one number';

	if (data.password !== data.confirmPassword)
		errors.confirmPassword = 'Passwords do not match';

	return errors;
}

const SignUpPage = () => {
	const [formData, setFormData] = useState<FormData>({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
	});
	const [errors, setErrors] = useState<ValidationErrors>({});
	const { signup, loading } = useUserStore();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const validationErrors = validate(formData);
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}
		setErrors({});
		signup(formData);
	};

	const field = (key: keyof FormData) => ({
		value: formData[key],
		onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
			setFormData({ ...formData, [key]: e.target.value });
			// Clear the error for this field as the user types
			if (errors[key]) setErrors({ ...errors, [key]: undefined });
		},
	});

	return (
		<div className='flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
			<motion.div
				className='sm:mx-auto sm:w-full sm:max-w-md'
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
			>
				<h2 className='mt-6 text-center text-3xl font-extrabold text-emerald-400'>Create your account</h2>
			</motion.div>

			<motion.div
				className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, delay: 0.2 }}
			>
				<div className='bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10'>
					<form onSubmit={handleSubmit} className='space-y-6'>

						{/* Name */}
						<div>
							<label htmlFor='name' className='block text-sm font-medium text-gray-300'>Full name</label>
							<div className='mt-1 relative rounded-md shadow-sm'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<User className='h-5 w-5 text-gray-400' aria-hidden='true' />
								</div>
								<input
									id='name' type='text' required
									{...field('name')}
									className={`block w-full px-3 py-2 pl-10 bg-gray-700 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm ${errors.name ? 'border-red-500' : 'border-gray-600'}`}
									placeholder='Ahmed Ayman'
								/>
							</div>
							{errors.name && <p className='mt-1 text-xs text-red-400'>{errors.name}</p>}
						</div>

						{/* Email */}
						<div>
							<label htmlFor='email' className='block text-sm font-medium text-gray-300'>Email address</label>
							<div className='mt-1 relative rounded-md shadow-sm'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<Mail className='h-5 w-5 text-gray-400' aria-hidden='true' />
								</div>
								<input
									id='email' type='email' required
									{...field('email')}
									className={`block w-full px-3 py-2 pl-10 bg-gray-700 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm ${errors.email ? 'border-red-500' : 'border-gray-600'}`}
									placeholder='you@example.com'
								/>
							</div>
							{errors.email && <p className='mt-1 text-xs text-red-400'>{errors.email}</p>}
						</div>

						{/* Password */}
						<div>
							<label htmlFor='password' className='block text-sm font-medium text-gray-300'>Password</label>
							<div className='mt-1 relative rounded-md shadow-sm'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<Lock className='h-5 w-5 text-gray-400' aria-hidden='true' />
								</div>
								<input
									id='password' type='password' required
									{...field('password')}
									className={`block w-full px-3 py-2 pl-10 bg-gray-700 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm ${errors.password ? 'border-red-500' : 'border-gray-600'}`}
									placeholder='••••••••'
								/>
							</div>
							{errors.password
								? <p className='mt-1 text-xs text-red-400'>{errors.password}</p>
								: <p className='mt-1 text-xs text-gray-500'>Min 8 chars, one uppercase, one number</p>
							}
						</div>

						{/* Confirm Password */}
						<div>
							<label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-300'>Confirm Password</label>
							<div className='mt-1 relative rounded-md shadow-sm'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<Lock className='h-5 w-5 text-gray-400' aria-hidden='true' />
								</div>
								<input
									id='confirmPassword' type='password' required
									{...field('confirmPassword')}
									className={`block w-full px-3 py-2 pl-10 bg-gray-700 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm ${errors.confirmPassword ? 'border-red-500' : 'border-gray-600'}`}
									placeholder='••••••••'
								/>
							</div>
							{errors.confirmPassword && <p className='mt-1 text-xs text-red-400'>{errors.confirmPassword}</p>}
						</div>

						<button
							type='submit'
							className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50'
							disabled={loading}
						>
							{loading ? (
								<><Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />Loading...</>
							) : (
								<><UserPlus className='mr-2 h-5 w-5' aria-hidden='true' />Sign up</>
							)}
						</button>
					</form>

					<p className='mt-8 text-center text-sm text-gray-400'>
						Already have an account?{' '}
						<Link to='/login' className='font-medium text-emerald-400 hover:text-emerald-300'>
							Login here <ArrowRight className='inline h-4 w-4' />
						</Link>
					</p>
				</div>
			</motion.div>
		</div>
	);
};

export default SignUpPage;
