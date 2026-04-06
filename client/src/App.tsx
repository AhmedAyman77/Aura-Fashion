import { Navigate, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';
import PurchaseSuccessPage from './pages/PurchaseSuccessPage';
import PurchaseCancelPage from './pages/PurchaseCancelPage';
import AIChatPage from './pages/AIChatPage';

import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';

import { useUserStore } from './stores/useUserStore';
import { useCartStore } from './stores/useCartStore';

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();
  const { getCartItems } = useCartStore();

  useEffect(() => { checkAuth(); }, [checkAuth]);
  useEffect(() => { if (!user) return; getCartItems(); }, [getCartItems, user]);

  if (checkingAuth) return <LoadingSpinner />;

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#f5f5f0', position: 'relative', overflow: 'hidden' }}>
      <div className='relative z-50 pt-20'>
        <Navbar />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/signup' element={!user ? <SignUpPage /> : <Navigate to='/' />} />
          <Route path='/login' element={!user ? <LoginPage /> : <Navigate to='/' />} />
          <Route path='/secret-dashboard' element={user?.role === 'admin' ? <AdminPage /> : <Navigate to='/login' />} />
          <Route path='/category/:category' element={<CategoryPage />} />
          <Route path='/cart' element={user ? <CartPage /> : <Navigate to='/login' />} />
          <Route path='/purchase-success' element={user ? <PurchaseSuccessPage /> : <Navigate to='/login' />} />
          <Route path='/purchase-cancel' element={user ? <PurchaseCancelPage /> : <Navigate to='/login' />} />
          <Route path='/ai-chat' element={<AIChatPage />} />
        </Routes>
      </div>
      <Toaster
        toastOptions={{
          style: { background: '#111', color: '#f5f5f0', border: '1px solid #1e1e1e', fontFamily: 'DM Sans, sans-serif' },
        }}
      />
    </div>
  );
}

export default App;
