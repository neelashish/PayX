import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams, Link } from 'react-router-dom';
import { 
  Menu, X, CreditCard, Receipt, Users, BarChart3, Settings, LogOut, 
  Plus, Search, Download, Copy, Check, ChevronRight, Shield, Zap, 
  FileText, Globe, ArrowRight, Building2, AlertCircle, 
  CheckCircle2, XCircle, Clock, TrendingUp, IndianRupee, ExternalLink
} from 'lucide-react';
import type { AppState, PaymentRequest, Transaction } from './types';
import { 
  loadState, saveState, initDemoState, isDemoMode, 
  createOrganisation, createUser, createMembership, createCustomer,
  createPaymentRequest, createTransaction,
  createReceipt, getNextReceiptNumber, getOrgTransactions,
  getOrgPaymentRequests, getOrgCustomers, getOrgReceipts,
  hashPassword, verifyPassword, createFeeCategory
} from './store';
import { downloadReceiptPDF, formatCurrency, formatDate, formatDateTime } from './utils/pdf';

// ==================== LANDING PAGE ====================
function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="font-bold text-xl text-gray-900">PayX</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
              <a href="#organisations" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">For Organisations</a>
              <button onClick={() => navigate('/auth')} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Sign In</button>
              <button onClick={() => navigate('/auth?mode=register')} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">Get Started</button>
              <button onClick={() => navigate('/demo')} className="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">Try Demo</button>
            </div>

            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-sm text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#how-it-works" className="block text-sm text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
              <a href="#organisations" className="block text-sm text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>For Organisations</a>
              <button onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }} className="block w-full text-left text-sm text-gray-600 py-2">Sign In</button>
              <button onClick={() => { navigate('/auth?mode=register'); setMobileMenuOpen(false); }} className="block w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg text-center">Get Started</button>
              <button onClick={() => { navigate('/demo'); setMobileMenuOpen(false); }} className="block w-full px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg text-center">Try Demo</button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full text-xs font-medium text-indigo-700 mb-6">
            <Shield size={12} /> Secure Payment Management Platform
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Payments made simple.<br />
            <span className="text-indigo-600">Receipts made automatic.</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Create payment links, manage transactions, and generate professional receipts for your organisation from one simple platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => navigate('/auth?mode=register')} className="w-full sm:w-auto px-8 py-3.5 text-base font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2">
              Get Started <ArrowRight size={18} />
            </button>
            <button onClick={() => navigate('/demo')} className="w-full sm:w-auto px-8 py-3.5 text-base font-medium text-indigo-600 border-2 border-indigo-200 rounded-xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
              Explore Demo <ExternalLink size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4 sm:p-8">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">Dashboard Overview</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Sample data — demonstration only</p>
                  </div>
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">DEMO DATA</span>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                  {[
                    { label: 'Total Collected', value: '₹2,500', color: 'text-green-600' },
                    { label: 'Successful', value: '2', color: 'text-green-600' },
                    { label: 'Pending', value: '1', color: 'text-amber-600' },
                    { label: 'Payment Links', value: '3', color: 'text-indigo-600' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                      <p className={`text-lg sm:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Recent Payments</p>
                  {[
                    { name: 'Aarav Sharma', amount: '₹500', status: 'success', desc: 'Course Registration' },
                    { name: 'Priya Patel', amount: '₹2,000', status: 'success', desc: 'Tuition Fee' },
                  ].map((tx) => (
                    <div key={tx.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.status === 'success' ? 'bg-green-100' : 'bg-amber-100'}`}>
                          {tx.status === 'success' ? <CheckCircle2 size={14} className="text-green-600" /> : <Clock size={14} className="text-amber-600" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{tx.name}</p>
                          <p className="text-xs text-gray-500">{tx.desc}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{tx.amount}</p>
                        <button className="text-xs text-indigo-600 hover:text-indigo-700">Receipt ↓</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Everything you need to manage payments</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Built for schools, colleges, coaching institutes, NGOs, clubs, and businesses across India.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Globe, title: 'Organisation Payment Links', desc: 'Create unique, shareable payment links for your organisation.' },
              { icon: CreditCard, title: 'UPI-Focused Checkout', desc: 'Clean checkout experience designed for UPI and supported methods.' },
              { icon: BarChart3, title: 'Transaction Tracking', desc: 'Monitor all payments with real-time status and reconciliation.' },
              { icon: Receipt, title: 'Automatic PDF Receipts', desc: 'Professional receipts generated automatically on successful payment.' },
              { icon: FileText, title: 'Excel & CSV Import', desc: 'Bulk import customers and data from spreadsheets.' },
              { icon: TrendingUp, title: 'Payment Reports', desc: 'Comprehensive reports and exports for your records.' },
            ].map((feature) => (
              <div key={feature.title} className="bg-white rounded-xl p-6 border border-gray-200 hover:border-indigo-200 transition-colors">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon size={20} className="text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">Five simple steps from setup to receipt.</p>
          </div>
          <div className="space-y-6">
            {[
              { step: 1, title: 'Create your organisation workspace', desc: 'Register your school, college, NGO, or business on PayX.' },
              { step: 2, title: 'Generate a payment link', desc: 'Create a payment request with amount, description, and customer details.' },
              { step: 3, title: 'Customers pay through available methods', desc: 'Share the link — customers pay via UPI or other configured methods.' },
              { step: 4, title: 'Payment verification', desc: 'The application verifies payment through the configured integration.' },
              { step: 5, title: 'Download the receipt', desc: 'Professional PDF receipts are generated automatically.' },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">{item.step}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-8 text-center">
            Actual payment methods and automated confirmation depend on the configured payment provider. Demo mode is available without any provider setup.
          </p>
        </div>
      </section>

      {/* For Organisations */}
      <section id="organisations" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Built for Every Organisation</h2>
          <p className="text-lg text-gray-600 mb-8">Whether you're a school, college, coaching centre, NGO, club, or business — PayX adapts to your needs.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {['Schools', 'Colleges', 'Coaching', 'NGOs', 'Clubs', 'Healthcare', 'Businesses', 'Other'].map((type) => (
              <div key={type} className="bg-white rounded-lg p-4 border border-gray-200">
                <Building2 size={20} className="text-indigo-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">{type}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">P</span>
              </div>
              <span className="font-bold text-gray-900">PayX</span>
            </div>
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} PayX. Multi-organisation payment management platform.</p>
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/demo')} className="text-sm text-gray-500 hover:text-gray-700">Demo</button>
              <button onClick={() => navigate('/auth')} className="text-sm text-gray-500 hover:text-gray-700">Sign In</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ==================== AUTH PAGE ====================
function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', orgName: '', orgType: 'school' as const,
    phone: '', address: '', city: '', state: '', pinCode: '', country: 'India',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'register') setMode('register');
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const state = loadState();
    const user = state.users.find(u => u.email === formData.email);
    if (!user || !verifyPassword(formData.password, user.passwordHash)) {
      setError('Invalid email or password');
      return;
    }
    const membership = state.memberships.find(m => m.userId === user.id);
    if (!membership) {
      setError('No organisation membership found');
      return;
    }
    const newState = { ...state, currentUserId: user.id, currentOrgId: membership.organisationId };
    saveState(newState);
    navigate('/dashboard');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!formData.name || !formData.email || !formData.password || !formData.orgName) {
      setError('Please fill in all required fields');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    let state = loadState();
    const existingUser = state.users.find(u => u.email === formData.email);
    if (existingUser) {
      setError('An account with this email already exists');
      return;
    }
    const { state: stateWithUser, user } = createUser(state, {
      email: formData.email,
      name: formData.name,
      passwordHash: hashPassword(formData.password),
    });
    state = stateWithUser;
    const { state: stateWithOrg, org } = createOrganisation(state, {
      name: formData.orgName,
      type: formData.orgType,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pinCode: formData.pinCode,
      country: formData.country,
    });
    state = stateWithOrg;
    const { state: finalState } = createMembership(state, {
      userId: user.id,
      organisationId: org.id,
      role: 'owner',
    });
    saveState({ ...finalState, currentUserId: user.id, currentOrgId: org.id });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-xl text-gray-900">PayX</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            {mode === 'login' ? 'Sign in to your organisation dashboard' : 'Set up your organisation on PayX'}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="you@example.com" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="••••••••" required />
              </div>
              <button type="submit" className="w-full py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors text-sm">Sign In</button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Min 6 characters" required />
              </div>
              <hr className="border-gray-200" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organisation Name *</label>
                <input type="text" value={formData.orgName} onChange={e => setFormData({...formData, orgName: e.target.value})} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organisation Type</label>
                <select value={formData.orgType} onChange={e => setFormData({...formData, orgType: e.target.value as any})} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="school">School</option>
                  <option value="college">College / University</option>
                  <option value="coaching">Coaching / Training Institute</option>
                  <option value="ngo">NGO / Charitable Organisation</option>
                  <option value="club">Club / Association</option>
                  <option value="healthcare">Healthcare Provider</option>
                  <option value="business">Business / Service Provider</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input type="text" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
                  <input type="text" value={formData.pinCode} onChange={e => setFormData({...formData, pinCode: e.target.value})} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <button type="submit" className="w-full py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors text-sm">Create Organisation</button>
            </form>
          )}

          <div className="mt-4 text-center">
            <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }} className="text-sm text-indigo-600 hover:text-indigo-700">
              {mode === 'login' ? "Don't have an account? Register" : 'Already have an account? Sign In'}
            </button>
          </div>
        </div>

        <div className="mt-4 text-center">
          <button onClick={() => navigate('/demo')} className="text-sm text-gray-500 hover:text-gray-700 underline">
            Or try the demo without signing up
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== DEMO PAGE ====================
function DemoPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<AppState>(() => {
    const s = loadState();
    if (s.currentOrgId === 'demo-org-northstar') return s;
    return initDemoState();
  });

  const org = state.organisations.find(o => o.id === 'demo-org-northstar')!;
  const paymentRequests = getOrgPaymentRequests(state, org.id);
  const transactions = getOrgTransactions(state, org.id);
  const receipts = getOrgReceipts(state, org.id);
  const [selectedPR, setSelectedPR] = useState<PaymentRequest | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<'review' | 'details' | 'payment' | 'result'>('review');
  const [customerDetails, setCustomerDetails] = useState({ name: '', email: '', phone: '', ref: '' });
  const [paymentResult, setPaymentResult] = useState<{ status: 'success' | 'failed' | 'cancelled'; txId?: string } | null>(null);

  const totalCollected = transactions.filter(t => t.status === 'success').reduce((sum, t) => sum + t.amount, 0);
  const successCount = transactions.filter(t => t.status === 'success').length;
  const pendingCount = transactions.filter(t => t.status === 'pending').length;

  const simulatePayment = (outcome: 'success' | 'failed' | 'cancelled') => {
    if (!selectedPR) return;
    
    let newState = state;
    const txId = `demo-tx-${Date.now()}`;
    
    if (outcome === 'success') {
      const { state: s1, tx } = createTransaction(newState, {
        organisationId: org.id,
        paymentRequestId: selectedPR.id,
        amount: selectedPR.amount,
        currency: 'INR',
        status: 'success',
        method: 'upi',
        providerRef: `DEMO-TXN-${Date.now().toString(36).toUpperCase()}`,
        customerName: customerDetails.name || selectedPR.customerName || 'Demo Customer',
        customerEmail: customerDetails.email || selectedPR.customerEmail,
        customerRef: customerDetails.ref || selectedPR.customerRef,
        description: selectedPR.title,
        isDemo: true,
        paidAt: new Date().toISOString(),
      });
      newState = s1;
      
      const receiptNum = getNextReceiptNumber(newState, org.id);
      const { state: s2 } = createReceipt(newState, {
        organisationId: org.id,
        transactionId: tx.id,
        receiptNumber: receiptNum,
        isDemo: true,
      });
      newState = s2;
      
      setPaymentResult({ status: 'success', txId: tx.id });
    } else {
      const { state: s1 } = createTransaction(newState, {
        organisationId: org.id,
        paymentRequestId: selectedPR.id,
        amount: selectedPR.amount,
        currency: 'INR',
        status: outcome === 'failed' ? 'failed' : 'cancelled',
        method: 'upi',
        providerRef: `DEMO-TXN-${Date.now().toString(36).toUpperCase()}`,
        customerName: customerDetails.name || selectedPR.customerName || 'Demo Customer',
        customerEmail: customerDetails.email || selectedPR.customerEmail,
        customerRef: customerDetails.ref || selectedPR.customerRef,
        description: selectedPR.title,
        isDemo: true,
      });
      newState = s1;
      setPaymentResult({ status: outcome });
    }
    
    setState(newState);
    setCheckoutStep('result');
  };

  const downloadDemoReceipt = (txId: string) => {
    const tx = newState().transactions.find(t => t.id === txId);
    if (!tx) return;
    const receipt = newState().receipts.find(r => r.transactionId === txId);
    if (!receipt) return;
    const pr = state.paymentRequests.find(p => p.id === tx.paymentRequestId);
    downloadReceiptPDF(org, tx, receipt, pr);
  };

  const newState = () => state;

  const resetDemo = () => {
    setSelectedPR(null);
    setCheckoutStep('review');
    setCustomerDetails({ name: '', email: '', phone: '', ref: '' });
    setPaymentResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center">
        <p className="text-sm font-medium text-amber-800 flex items-center justify-center gap-2">
          <AlertCircle size={14} /> DEMO MODE — No real payment is being processed
        </p>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="font-bold text-lg text-gray-900">PayX</span>
            </Link>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-gray-600">{org.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="text-sm text-gray-600 hover:text-gray-900">Home</button>
            <button onClick={() => navigate('/auth')} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">Get Started</button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {!selectedPR ? (
          <>
            {/* Demo Dashboard */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-xs text-gray-500 mb-1">Total Collected</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalCollected)}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-xs text-gray-500 mb-1">Successful Payments</p>
                <p className="text-2xl font-bold text-green-600">{successCount}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-xs text-gray-500 mb-1">Pending</p>
                <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-xs text-gray-500 mb-1">Payment Links</p>
                <p className="text-2xl font-bold text-indigo-600">{paymentRequests.length}</p>
              </div>
            </div>

            {/* Payment Requests */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">Sample Payment Requests</h2>
                <p className="text-xs text-gray-500 mt-1">Click any payment request to try the demo checkout</p>
              </div>
              <div className="divide-y divide-gray-100">
                {paymentRequests.map(pr => (
                  <div key={pr.id} className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => { setSelectedPR(pr); setCheckoutStep('review'); setCustomerDetails({ name: pr.customerName || '', email: pr.customerEmail || '', phone: pr.customerPhone || '', ref: pr.customerRef || '' }); }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                        <CreditCard size={18} className="text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{pr.title}</p>
                        <p className="text-xs text-gray-500">{pr.customerName} • {pr.customerRef}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-900">{formatCurrency(pr.amount)}</span>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Transactions */}
            {transactions.length > 0 && (
              <div className="mt-6 bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-900">Recent Demo Transactions</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {transactions.slice(0, 5).map(tx => {
                    const receipt = receipts.find(r => r.transactionId === tx.id);
                    return (
                      <div key={tx.id} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.status === 'success' ? 'bg-green-100' : tx.status === 'failed' ? 'bg-red-100' : 'bg-gray-100'}`}>
                            {tx.status === 'success' ? <CheckCircle2 size={14} className="text-green-600" /> : tx.status === 'failed' ? <XCircle size={14} className="text-red-600" /> : <Clock size={14} className="text-gray-600" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{tx.customerName}</p>
                            <p className="text-xs text-gray-500">{tx.description} • {formatDate(tx.createdAt)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-900">{formatCurrency(tx.amount)}</span>
                          {receipt && tx.status === 'success' && (
                            <button onClick={() => downloadDemoReceipt(tx.id)} className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                              <Download size={12} /> Receipt
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Checkout Flow */
          <div className="max-w-lg mx-auto">
            <button onClick={resetDemo} className="text-sm text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-1">
              ← Back to demo dashboard
            </button>
            
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Org header */}
              <div className="p-6 border-b border-gray-100 text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Building2 size={24} className="text-indigo-600" />
                </div>
                <h2 className="font-semibold text-gray-900">{org.name}</h2>
                <p className="text-xs text-gray-500 mt-1">{org.city}, {org.state}</p>
              </div>

              {/* Steps */}
              {checkoutStep === 'review' && (
                <div className="p-6">
                  <h3 className="font-medium text-gray-900 mb-4">Payment Summary</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Description</span>
                      <span className="font-medium text-gray-900">{selectedPR.title}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Customer</span>
                      <span className="font-medium text-gray-900">{selectedPR.customerName || '—'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Reference</span>
                      <span className="font-medium text-gray-900">{selectedPR.customerRef || '—'}</span>
                    </div>
                    <hr className="border-gray-100" />
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-900">Amount Payable</span>
                      <span className="text-xl font-bold text-gray-900">{formatCurrency(selectedPR.amount)}</span>
                    </div>
                  </div>
                  <button onClick={() => setCheckoutStep('details')} className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                    Proceed to Pay
                  </button>
                </div>
              )}

              {checkoutStep === 'details' && (
                <div className="p-6">
                  <h3 className="font-medium text-gray-900 mb-4">Customer Details</h3>
                  <div className="space-y-3 mb-6">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                      <input type="text" value={customerDetails.name} onChange={e => setCustomerDetails({...customerDetails, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                      <input type="email" value={customerDetails.email} onChange={e => setCustomerDetails({...customerDetails, email: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                      <input type="tel" value={customerDetails.phone} onChange={e => setCustomerDetails({...customerDetails, phone: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Reference ID</label>
                      <input type="text" value={customerDetails.ref} onChange={e => setCustomerDetails({...customerDetails, ref: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </div>
                  <button onClick={() => setCheckoutStep('payment')} className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                    Continue
                  </button>
                </div>
              )}

              {checkoutStep === 'payment' && (
                <div className="p-6">
                  <h3 className="font-medium text-gray-900 mb-2">Choose Payment Outcome</h3>
                  <p className="text-xs text-gray-500 mb-6">This is a demo — choose a simulated result</p>
                  
                  <div className="space-y-3">
                    <button onClick={() => simulatePayment('success')} className="w-full p-4 border-2 border-green-200 rounded-xl hover:bg-green-50 transition-colors text-left flex items-center gap-3">
                      <CheckCircle2 size={20} className="text-green-600" />
                      <div>
                        <p className="font-medium text-green-800">Simulate Success</p>
                        <p className="text-xs text-green-600">Payment confirmed, receipt generated</p>
                      </div>
                    </button>
                    <button onClick={() => simulatePayment('failed')} className="w-full p-4 border-2 border-red-200 rounded-xl hover:bg-red-50 transition-colors text-left flex items-center gap-3">
                      <XCircle size={20} className="text-red-600" />
                      <div>
                        <p className="font-medium text-red-800">Simulate Failure</p>
                        <p className="text-xs text-red-600">Payment failed, no receipt</p>
                      </div>
                    </button>
                    <button onClick={() => simulatePayment('cancelled')} className="w-full p-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left flex items-center gap-3">
                      <XCircle size={20} className="text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-800">Cancel Payment</p>
                        <p className="text-xs text-gray-600">Payment cancelled by user</p>
                      </div>
                    </button>
                  </div>

                  <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-700 flex items-center gap-1">
                      <Shield size={12} /> In a real integration, payment status would be verified server-side through the configured payment provider.
                    </p>
                  </div>
                </div>
              )}

              {checkoutStep === 'result' && paymentResult && (
                <div className="p-6 text-center">
                  {paymentResult.status === 'success' ? (
                    <>
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 size={32} className="text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Successful</h3>
                      <p className="text-sm text-gray-600 mb-2">Demo transaction completed</p>
                      <p className="text-lg font-bold text-gray-900 mb-6">{formatCurrency(selectedPR.amount)}</p>
                      {paymentResult.txId && (
                        <button onClick={() => downloadDemoReceipt(paymentResult.txId!)} className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 mb-3">
                          <Download size={16} /> Download Receipt (Demo)
                        </button>
                      )}
                      <p className="text-xs text-red-600 font-medium mb-4">DEMO RECEIPT — NOT PROOF OF PAYMENT</p>
                    </>
                  ) : paymentResult.status === 'failed' ? (
                    <>
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <XCircle size={32} className="text-red-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Failed</h3>
                      <p className="text-sm text-gray-600 mb-6">The simulated payment was not successful. No receipt has been generated.</p>
                      <button onClick={() => { setCheckoutStep('payment'); setPaymentResult(null); }} className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors mb-3">
                        Retry Payment
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <XCircle size={32} className="text-gray-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Cancelled</h3>
                      <p className="text-sm text-gray-600 mb-6">The payment was cancelled. No receipt has been generated.</p>
                      <button onClick={() => { setCheckoutStep('payment'); setPaymentResult(null); }} className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors mb-3">
                        Try Again
                      </button>
                    </>
                  )}
                  <button onClick={resetDemo} className="text-sm text-indigo-600 hover:text-indigo-700">
                    Back to demo dashboard
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== DASHBOARD LAYOUT ====================
function DashboardLayout({ children, state, onNavigate, currentPage }: { children: React.ReactNode; state: AppState; onNavigate: (page: string) => void; currentPage: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const org = state.organisations.find(o => o.id === state.currentOrgId);
  const demo = isDemoMode(state);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'payment-links', label: 'Payment Links', icon: CreditCard },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'fees', label: 'Fees & Products', icon: IndianRupee },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {demo && (
        <div className="fixed top-0 left-0 right-0 bg-amber-50 border-b border-amber-200 px-4 py-1.5 text-center z-50">
          <p className="text-xs font-medium text-amber-800">DEMO MODE — Simulated data only</p>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${demo ? 'top-7' : 'top-0'} lg:translate-x-0 lg:static`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900 truncate max-w-[140px]">{org?.name}</p>
                  <p className="text-xs text-gray-500">Dashboard</p>
                </div>
              </div>
              <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
                <X size={18} />
              </button>
            </div>
          </div>
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map(item => (
              <button key={item.id} onClick={() => { onNavigate(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${currentPage === item.id ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>
          <div className="p-3 border-t border-gray-100">
            <button onClick={() => { saveState({ ...state, currentUserId: null, currentOrgId: null }); window.location.href = '/'; }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/20 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <main className={`flex-1 ${demo ? 'mt-7' : ''}`}>
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <button onClick={() => setSidebarOpen(true)} className="p-2">
            <Menu size={20} />
          </button>
          <span className="font-semibold text-sm text-gray-900">{org?.name}</span>
          <div className="w-8" />
        </div>
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

// ==================== DASHBOARD OVERVIEW ====================
function DashboardOverview({ state }: { state: AppState }) {
  const orgId = state.currentOrgId!;
  const transactions = getOrgTransactions(state, orgId);
  const paymentRequests = getOrgPaymentRequests(state, orgId);
  const customers = getOrgCustomers(state, orgId);
  const receipts = getOrgReceipts(state, orgId);

  const totalCollected = transactions.filter(t => t.status === 'success').reduce((sum, t) => sum + t.amount, 0);
  const successCount = transactions.filter(t => t.status === 'success').length;
  const pendingCount = transactions.filter(t => t.status === 'pending').length;
  const failedCount = transactions.filter(t => t.status === 'failed').length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Overview</h1>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
          <p className="text-xs text-gray-500 mb-1">Total Collected</p>
          <p className="text-xl sm:text-2xl font-bold text-green-600">{formatCurrency(totalCollected)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
          <p className="text-xs text-gray-500 mb-1">Successful</p>
          <p className="text-xl sm:text-2xl font-bold text-green-600">{successCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
          <p className="text-xs text-gray-500 mb-1">Pending</p>
          <p className="text-xl sm:text-2xl font-bold text-amber-600">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
          <p className="text-xs text-gray-500 mb-1">Failed</p>
          <p className="text-xl sm:text-2xl font-bold text-red-600">{failedCount}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Transactions</h2>
            <span className="text-xs text-gray-500">{transactions.length} total</span>
          </div>
          {transactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">No transactions yet</div>
          ) : (
            <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
              {transactions.slice(0, 10).map(tx => (
                <div key={tx.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.status === 'success' ? 'bg-green-100' : tx.status === 'failed' ? 'bg-red-100' : tx.status === 'pending' ? 'bg-amber-100' : 'bg-gray-100'}`}>
                      {tx.status === 'success' ? <CheckCircle2 size={14} className="text-green-600" /> : tx.status === 'failed' ? <XCircle size={14} className="text-red-600" /> : <Clock size={14} className="text-amber-600" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{tx.customerName || 'Unknown'}</p>
                      <p className="text-xs text-gray-500">{formatDate(tx.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(tx.amount)}</p>
                    <p className={`text-xs capitalize ${tx.status === 'success' ? 'text-green-600' : tx.status === 'failed' ? 'text-red-600' : 'text-amber-600'}`}>{tx.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="font-semibold text-gray-900 mb-4">Quick Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Payment Links</span>
                <span className="text-sm font-medium text-gray-900">{paymentRequests.filter(p => p.status === 'active').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Customers</span>
                <span className="text-sm font-medium text-gray-900">{customers.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Receipts Generated</span>
                <span className="text-sm font-medium text-gray-900">{receipts.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Demo Transactions</span>
                <span className="text-sm font-medium text-gray-900">{transactions.filter(t => t.isDemo).length}</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="font-semibold text-gray-900 mb-3">Payment Mode</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full" />
              <span className="text-sm text-gray-700">Demo Mode Active</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Configure a payment provider in Settings to enable live payments.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== PAYMENT LINKS PAGE ====================
function PaymentLinksPage({ state, setState }: { state: AppState; setState: (s: AppState) => void }) {
  const orgId = state.currentOrgId!;
  const org = state.organisations.find(o => o.id === orgId)!;
  const paymentRequests = getOrgPaymentRequests(state, orgId);
  const [showCreate, setShowCreate] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', description: '', amount: '', customerName: '', customerEmail: '', customerRef: '' });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(form.amount);
    if (!form.title || isNaN(amount) || amount <= 0) return;
    
    const { state: newState } = createPaymentRequest(state, {
      organisationId: orgId,
      title: form.title,
      description: form.description,
      amount,
      isFixedAmount: true,
      customerName: form.customerName || undefined,
      customerEmail: form.customerEmail || undefined,
      customerRef: form.customerRef || undefined,
      status: 'active',
    });
    setState(newState);
    setForm({ title: '', description: '', amount: '', customerName: '', customerEmail: '', customerRef: '' });
    setShowCreate(false);
  };

  const copyLink = (prId: string) => {
    const link = `${window.location.origin}/pay/${orgId}/${prId}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(prId);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payment Links</h1>
        <button onClick={() => setShowCreate(!showCreate)} className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 flex items-center gap-2">
          <Plus size={16} /> New Link
        </button>
      </div>

      {showCreate && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Create Payment Link</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) *</label>
                <input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" min="1" step="0.01" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <input type="text" value={form.customerName} onChange={e => setForm({...form, customerName: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={form.customerEmail} onChange={e => setForm({...form, customerEmail: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reference ID</label>
                <input type="text" value={form.customerRef} onChange={e => setForm({...form, customerRef: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">Create Link</button>
              <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {paymentRequests.length === 0 ? (
          <div className="p-8 text-center">
            <CreditCard size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No payment links yet. Create one to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {paymentRequests.map(pr => (
              <div key={pr.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CreditCard size={18} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{pr.title}</p>
                    <p className="text-xs text-gray-500">{pr.customerName || 'General'} {pr.customerRef ? `• ${pr.customerRef}` : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-13 sm:ml-0">
                  <span className="font-semibold text-gray-900 text-sm">{formatCurrency(pr.amount)}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${pr.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{pr.status}</span>
                  <button onClick={() => copyLink(pr.id)} className="p-2 text-gray-400 hover:text-indigo-600 transition-colors" title="Copy link">
                    {copied === pr.id ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== TRANSACTIONS PAGE ====================
function TransactionsPage({ state, setState }: { state: AppState; setState: (s: AppState) => void }) {
  const orgId = state.currentOrgId!;
  const org = state.organisations.find(o => o.id === orgId)!;
  const transactions = getOrgTransactions(state, orgId);
  const receipts = getOrgReceipts(state, orgId);
  const [filter, setFilter] = useState<'all' | 'success' | 'failed' | 'pending'>('all');
  const [search, setSearch] = useState('');

  const filtered = transactions
    .filter(t => filter === 'all' || t.status === filter)
    .filter(t => !search || t.customerName?.toLowerCase().includes(search.toLowerCase()) || t.description?.toLowerCase().includes(search.toLowerCase()));

  const handleDownloadReceipt = (tx: Transaction) => {
    const receipt = receipts.find(r => r.transactionId === tx.id);
    if (!receipt) return;
    const pr = state.paymentRequests.find(p => p.id === tx.paymentRequestId);
    downloadReceiptPDF(org, tx, receipt, pr);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Transactions</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search transactions..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="flex gap-2">
          {(['all', 'success', 'failed', 'pending'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${filter === f ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center">
            <Receipt size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No transactions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Description</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Date</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(tx => {
                  const receipt = receipts.find(r => r.transactionId === tx.id);
                  return (
                    <tr key={tx.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">{tx.customerName || '—'}</p>
                        <p className="text-xs text-gray-500">{tx.customerRef || ''}</p>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <p className="text-sm text-gray-600">{tx.description || '—'}</p>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <p className="text-sm font-medium text-gray-900">{formatCurrency(tx.amount)}</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${tx.status === 'success' ? 'bg-green-100 text-green-700' : tx.status === 'failed' ? 'bg-red-100 text-red-700' : tx.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                          {tx.status === 'success' ? <CheckCircle2 size={10} /> : tx.status === 'failed' ? <XCircle size={10} /> : <Clock size={10} />}
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center hidden md:table-cell">
                        <p className="text-xs text-gray-500">{formatDate(tx.createdAt)}</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {receipt && tx.status === 'success' ? (
                          <button onClick={() => handleDownloadReceipt(tx)} className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1 mx-auto">
                            <Download size={12} /> Receipt
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== CUSTOMERS PAGE ====================
function CustomersPage({ state, setState }: { state: AppState; setState: (s: AppState) => void }) {
  const orgId = state.currentOrgId!;
  const customers = getOrgCustomers(state, orgId);
  const transactions = getOrgTransactions(state, orgId);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', referenceId: '' });

  const filtered = customers.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.referenceId?.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    const { state: newState } = createCustomer(state, {
      organisationId: orgId,
      name: form.name,
      email: form.email || undefined,
      phone: form.phone || undefined,
      referenceId: form.referenceId || undefined,
    });
    setState(newState);
    setForm({ name: '', email: '', phone: '', referenceId: '' });
    setShowAdd(false);
  };

  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split('\n').filter(l => l.trim());
      let newState = state;
      let imported = 0;
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
        if (cols.length >= 1 && cols[0]) {
          const { state: s } = createCustomer(newState, {
            organisationId: orgId,
            name: cols[0],
            email: cols[1] || undefined,
            phone: cols[2] || undefined,
            referenceId: cols[3] || undefined,
          });
          newState = s;
          imported++;
        }
      }
      setState(newState);
      alert(`Imported ${imported} customers`);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const getCustomerTxCount = (customerId: string) => {
    return transactions.filter(t => t.customerRef === customerId || t.customerName === customers.find(c => c.id === customerId)?.name).length;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <div className="flex gap-2">
          <label className="px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer flex items-center gap-1">
            <Download size={14} className="rotate-180" /> Import CSV
            <input type="file" accept=".csv" onChange={handleCSVImport} className="hidden" />
          </label>
          <button onClick={() => setShowAdd(!showAdd)} className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 flex items-center gap-2">
            <Plus size={16} /> Add
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6">
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reference ID</label>
                <input type="text" value={form.referenceId} onChange={e => setForm({...form, referenceId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">Add Customer</button>
          </form>
        </div>
      )}

      <div className="mb-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center">
            <Users size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No customers found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map(c => (
              <div key={c.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">{c.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{c.name}</p>
                    <p className="text-xs text-gray-500">{c.referenceId || '—'} {c.email ? `• ${c.email}` : ''}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{getCustomerTxCount(c.id)} transactions</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== FEES PAGE ====================
function FeesPage({ state, setState }: { state: AppState; setState: (s: AppState) => void }) {
  const orgId = state.currentOrgId!;
  const fees = state.feeCategories.filter(f => f.organisationId === orgId);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', defaultAmount: '' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    const { state: newState } = createFeeCategory(state, {
      organisationId: orgId,
      name: form.name,
      description: form.description || undefined,
      defaultAmount: form.defaultAmount ? parseFloat(form.defaultAmount) : undefined,
    });
    setState(newState);
    setForm({ name: '', description: '', defaultAmount: '' });
    setShowAdd(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Fees & Products</h1>
        <button onClick={() => setShowAdd(!showAdd)} className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 flex items-center gap-2">
          <Plus size={16} /> Add Fee
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6">
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fee Name *</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Amount (₹)</label>
                <input type="number" value={form.defaultAmount} onChange={e => setForm({...form, defaultAmount: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" min="0" step="0.01" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">Add Fee Category</button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {fees.length === 0 ? (
          <div className="p-8 text-center">
            <IndianRupee size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No fee categories yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {fees.map(fee => (
              <div key={fee.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{fee.name}</p>
                  <p className="text-xs text-gray-500">{fee.description || 'No description'}</p>
                </div>
                {fee.defaultAmount && (
                  <span className="text-sm font-semibold text-gray-900">{formatCurrency(fee.defaultAmount)}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== REPORTS PAGE ====================
function ReportsPage({ state }: { state: AppState }) {
  const orgId = state.currentOrgId!;
  const transactions = getOrgTransactions(state, orgId);
  const receipts = getOrgReceipts(state, orgId);

  const totalCollected = transactions.filter(t => t.status === 'success').reduce((sum, t) => sum + t.amount, 0);
  const demoCount = transactions.filter(t => t.isDemo).length;
  const liveCount = transactions.filter(t => !t.isDemo).length;

  const exportCSV = () => {
    const headers = ['Date', 'Customer', 'Amount', 'Status', 'Method', 'Reference', 'Demo'];
    const rows = transactions.map(t => [
      formatDateTime(t.createdAt),
      t.customerName || '',
      t.amount.toString(),
      t.status,
      t.method || '',
      t.providerRef || t.id,
      t.isDemo ? 'Yes' : 'No',
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <button onClick={exportCSV} className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 flex items-center gap-2">
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Total Revenue</p>
          <p className="text-xl font-bold text-green-600">{formatCurrency(totalCollected)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Total Transactions</p>
          <p className="text-xl font-bold text-gray-900">{transactions.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Demo Transactions</p>
          <p className="text-xl font-bold text-amber-600">{demoCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Receipts Issued</p>
          <p className="text-xl font-bold text-indigo-600">{receipts.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Transaction Summary</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Successful Payments</span>
            <span className="text-sm font-medium text-green-600">{transactions.filter(t => t.status === 'success').length}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Failed Payments</span>
            <span className="text-sm font-medium text-red-600">{transactions.filter(t => t.status === 'failed').length}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Cancelled Payments</span>
            <span className="text-sm font-medium text-gray-600">{transactions.filter(t => t.status === 'cancelled').length}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Pending Payments</span>
            <span className="text-sm font-medium text-amber-600">{transactions.filter(t => t.status === 'pending').length}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm font-medium text-gray-900">Average Transaction</span>
            <span className="text-sm font-medium text-gray-900">
              {transactions.filter(t => t.status === 'success').length > 0 
                ? formatCurrency(totalCollected / transactions.filter(t => t.status === 'success').length) 
                : '₹0.00'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== SETTINGS PAGE ====================
function SettingsPage({ state, setState }: { state: AppState; setState: (s: AppState) => void }) {
  const orgId = state.currentOrgId!;
  const org = state.organisations.find(o => o.id === orgId)!;
  const [editOrg, setEditOrg] = useState(false);
  const [form, setForm] = useState({ name: org.name, email: org.email, phone: org.phone, address: org.address, city: org.city, state: org.state, pinCode: org.pinCode });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newState = { ...state, organisations: state.organisations.map(o => o.id === orgId ? { ...o, ...form, updatedAt: new Date().toISOString() } : o) };
    saveState(newState);
    setState(newState);
    setEditOrg(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      <div className="space-y-6">
        {/* Organisation Profile */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Organisation Profile</h2>
            <button onClick={() => setEditOrg(!editOrg)} className="text-sm text-indigo-600 hover:text-indigo-700">
              {editOrg ? 'Cancel' : 'Edit'}
            </button>
          </div>
          {editOrg ? (
            <form onSubmit={handleSave} className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">Save Changes</button>
            </form>
          ) : (
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500">Name:</span> <span className="text-gray-900 ml-2">{org.name}</span></div>
                <div><span className="text-gray-500">Type:</span> <span className="text-gray-900 ml-2 capitalize">{org.type}</span></div>
                <div><span className="text-gray-500">Email:</span> <span className="text-gray-900 ml-2">{org.email}</span></div>
                <div><span className="text-gray-500">Phone:</span> <span className="text-gray-900 ml-2">{org.phone}</span></div>
                <div className="sm:col-span-2"><span className="text-gray-500">Address:</span> <span className="text-gray-900 ml-2">{[org.address, org.city, org.state, org.pinCode].filter(Boolean).join(', ')}</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Payment Integration */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Payment Integration</h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <AlertCircle size={18} className="text-amber-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800">Demo Mode Active</p>
                <p className="text-xs text-amber-700 mt-0.5">No live payment provider is configured. All transactions are simulated.</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Zap size={16} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Mock Provider</p>
                    <p className="text-xs text-gray-500">Simulated payments for development</p>
                  </div>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg opacity-60">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <CreditCard size={16} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Razorpay (Test)</p>
                    <p className="text-xs text-gray-500">Requires API credentials</p>
                  </div>
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Not configured</span>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg opacity-60">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Globe size={16} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">UPI Direct</p>
                    <p className="text-xs text-gray-500">Requires approved bank/provider integration</p>
                  </div>
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Not available</span>
              </div>
            </div>
            <p className="text-xs text-gray-500">To enable live payments, configure a supported payment provider with valid credentials. Contact PayX support for integration assistance.</p>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Data Management</h2>
          </div>
          <div className="p-4 space-y-3">
            <button onClick={() => { if (confirm('Reset all data? This cannot be undone.')) { localStorage.removeItem('payx_data'); window.location.href = '/'; } }} className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
              Reset All Data
            </button>
            <p className="text-xs text-gray-500">This will clear all organisation data, transactions, and settings from this browser.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== DASHBOARD CONTAINER ====================
function DashboardContainer() {
  const [state, setState] = useState<AppState>(loadState);
  const [currentPage, setCurrentPage] = useState('overview');

  useEffect(() => {
    if (!state.currentUserId || !state.currentOrgId) {
      window.location.href = '/auth';
    }
  }, [state.currentUserId, state.currentOrgId]);

  if (!state.currentUserId || !state.currentOrgId) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Redirecting...</p></div>;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'overview': return <DashboardOverview state={state} />;
      case 'payment-links': return <PaymentLinksPage state={state} setState={setState} />;
      case 'transactions': return <TransactionsPage state={state} setState={setState} />;
      case 'customers': return <CustomersPage state={state} setState={setState} />;
      case 'fees': return <FeesPage state={state} setState={setState} />;
      case 'reports': return <ReportsPage state={state} />;
      case 'settings': return <SettingsPage state={state} setState={setState} />;
      default: return <DashboardOverview state={state} />;
    }
  };

  return (
    <DashboardLayout state={state} onNavigate={setCurrentPage} currentPage={currentPage}>
      {renderPage()}
    </DashboardLayout>
  );
}

// ==================== PUBLIC PAYMENT PAGE ====================
function PublicPaymentPage() {
  const { orgId, prId } = useParams();
  const state = loadState();
  const org = state.organisations.find(o => o.id === orgId);
  const pr = state.paymentRequests.find(p => p.id === prId);

  if (!org || !pr) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle size={48} className="text-gray-300 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Payment Link Not Found</h1>
          <p className="text-gray-600 mb-4">This payment link may have expired or is invalid.</p>
          <Link to="/" className="text-indigo-600 hover:text-indigo-700 text-sm">Go to PayX</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-gray-100 text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Building2 size={24} className="text-indigo-600" />
            </div>
            <h2 className="font-semibold text-gray-900">{org.name}</h2>
            <p className="text-xs text-gray-500 mt-1">{org.city}, {org.state}</p>
          </div>
          <div className="p-6">
            <h3 className="font-medium text-gray-900 mb-4">{pr.title}</h3>
            {pr.description && <p className="text-sm text-gray-600 mb-4">{pr.description}</p>}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Amount</span>
                <span className="font-bold text-gray-900 text-lg">{formatCurrency(pr.amount)}</span>
              </div>
              {pr.customerName && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Customer</span>
                  <span className="text-gray-900">{pr.customerName}</span>
                </div>
              )}
              {pr.customerRef && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Reference</span>
                  <span className="text-gray-900">{pr.customerRef}</span>
                </div>
              )}
            </div>
            <div className="p-3 bg-blue-50 rounded-lg mb-4">
              <p className="text-xs text-blue-700 flex items-center gap-1">
                <Shield size={12} /> Secure payment page powered by PayX
              </p>
            </div>
            <p className="text-xs text-gray-500 text-center">
              Payment methods depend on the organisation's configured payment provider.
            </p>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">Powered by PayX</p>
      </div>
    </div>
  );
}

// ==================== MAIN APP ====================
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/dashboard" element={<DashboardContainer />} />
        <Route path="/pay/:orgId/:prId" element={<PublicPaymentPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
