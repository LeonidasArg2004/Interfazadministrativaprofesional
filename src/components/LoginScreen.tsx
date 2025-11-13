import React, { useState } from 'react';
import { useApp } from '../lib/context';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { AlertCircle, Sparkles } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, complete todos los campos');
      return;
    }

    const success = login(email, password);
    if (!success) {
      setError('Credenciales incorrectas o usuario no autorizado');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#114b5f] via-slate-900 to-[#1a936f] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-[#1a936f] rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#88d498] rounded-full filter blur-3xl"></div>
      </div>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md p-8">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1a936f] to-[#88d498] rounded-xl mb-4 shadow-lg shadow-[#1a936f]/30">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-white mb-2">Marvin Cosmetic</h1>
            <p className="text-[#c6dabf]">Sistema de Gestión</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-slate-300">
                Usuario o Correo Electrónico
              </Label>
              <Input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-[#88d498] focus:ring-[#88d498]/20"
                placeholder="admin@empresa.com"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-slate-300">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-[#88d498] focus:ring-[#88d498]/20"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="border-slate-600 data-[state=checked]:bg-[#1a936f]"
              />
              <label htmlFor="remember" className="text-slate-300 cursor-pointer">
                Recordar sesión
              </label>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-400">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#1a936f] to-[#88d498] hover:from-[#114b5f] hover:to-[#1a936f] text-white shadow-lg shadow-[#1a936f]/30"
            >
              Iniciar Sesión
            </Button>
          </form>

          {/* Footer info */}
          <div className="mt-6 text-center">
            <p className="text-[#c6dabf]">
              Acceso exclusivo para administradores
            </p>
            <p className="text-slate-500 mt-2">Demo: admin@empresa.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};