import React from 'react';
import { useApp } from '../lib/context';
import {
  TrendingUp,
  DollarSign,
  Package,
  ShoppingCart,
  ArrowUp,
  ArrowDown,
  Download,
  Sparkles,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { WelcomeCard } from './WelcomeCard';
import { motion } from 'motion/react';

// Hook personalizado para animación de conteo
const useCountAnimation = (end: number, duration: number = 2000) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Ease out cubic para suavizar el final
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(end * easeOut));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
};

// Componente MetricCard animado
interface MetricCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend?: number;
  icon: React.ReactNode;
  gradient: string;
  iconBg: string;
  iconColor: string;
  delay?: number;
  subtitle?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  prefix = '',
  suffix = '',
  trend,
  icon,
  gradient,
  iconBg,
  iconColor,
  delay = 0,
  subtitle,
}) => {
  const animatedValue = useCountAnimation(value, 2000);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        y: -5,
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      <Card className={`${gradient} border-purple-500/20 p-6 relative overflow-hidden group`}>
        {/* Efecto de brillo animado */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 5,
            ease: "easeInOut"
          }}
        />
        
        <div className="flex items-start justify-between relative z-10">
          <div className="flex-1">
            <p className="text-slate-400 mb-2">{title}</p>
            {subtitle ? (
              <>
                <motion.h3 
                  className="text-white mb-1"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: delay + 0.2, duration: 0.3 }}
                >
                  {subtitle}
                </motion.h3>
                <div className="flex items-center gap-1 text-slate-400">
                  <span>
                    <motion.span
                      key={animatedValue}
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 1 }}
                    >
                      {animatedValue}
                    </motion.span>
                    {suffix}
                  </span>
                </div>
              </>
            ) : (
              <>
                <motion.h2 
                  className="text-white mb-1"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: delay + 0.2, duration: 0.3 }}
                >
                  {prefix}
                  <motion.span
                    key={animatedValue}
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: 1 }}
                  >
                    {animatedValue.toFixed(2)}
                  </motion.span>
                </motion.h2>
                {trend !== undefined && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: delay + 0.4 }}
                    className={`flex items-center gap-1 ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}
                  >
                    {trend >= 0 ? (
                      <ArrowUp className="w-4 h-4" />
                    ) : (
                      <ArrowDown className="w-4 h-4" />
                    )}
                    <span>{Math.abs(trend).toFixed(1)}%</span>
                  </motion.div>
                )}
              </>
            )}
          </div>
          <motion.div
            className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center`}
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            {icon}
          </motion.div>
        </div>

        {/* Partículas de fondo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${20 + i * 30}%`,
                top: `${30 + i * 20}%`,
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2 + i,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export const Dashboard: React.FC = () => {
  const { sales, products, user, currency } = useApp();

  // Calculate metrics
  const today = new Date().toISOString().split('T')[0];
  const todaySales = sales.filter((s) => s.date === today);
  const todayRevenue = todaySales.reduce((sum, s) => sum + s.total, 0);

  const thisWeekStart = new Date();
  thisWeekStart.setDate(thisWeekStart.getDate() - 7);
  const weekSales = sales.filter((s) => new Date(s.date) >= thisWeekStart);
  const weekRevenue = weekSales.reduce((sum, s) => sum + s.total, 0);

  const thisMonthStart = new Date();
  thisMonthStart.setDate(1);
  const monthSales = sales.filter((s) => new Date(s.date) >= thisMonthStart);
  const monthRevenue = monthSales.reduce((sum, s) => sum + s.total, 0);

  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
  
  // Calculate profit
  const calculateProfit = (sale: any) => {
    const product = products.find((p) => p.id === sale.productId);
    if (!product) return 0;
    const cost = product.costPrice * sale.quantity;
    return sale.total - cost;
  };

  const totalProfit = sales.reduce((sum, s) => sum + calculateProfit(s), 0);
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  // Best selling product
  const productSales = sales.reduce((acc, sale) => {
    acc[sale.productId] = (acc[sale.productId] || 0) + sale.quantity;
    return acc;
  }, {} as Record<string, number>);

  const bestProductId = Object.entries(productSales).sort(
    ([, a], [, b]) => b - a
  )[0]?.[0];
  const bestProduct = products.find((p) => p.id === bestProductId);

  // Chart data - Weekly
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];
    const daySales = sales.filter((s) => s.date === dateStr);
    const revenue = daySales.reduce((sum, s) => sum + s.total, 0);
    const profit = daySales.reduce((sum, s) => sum + calculateProfit(s), 0);

    return {
      name: date.toLocaleDateString('es-ES', { weekday: 'short' }),
      ventas: revenue,
      ganancias: profit,
    };
  });

  // Monthly data for chart
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const monthName = date.toLocaleDateString('es-ES', { month: 'short' });
    
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    const monthSalesData = sales.filter((s) => {
      const saleDate = new Date(s.date);
      return saleDate >= monthStart && saleDate <= monthEnd;
    });
    
    const revenue = monthSalesData.reduce((sum, s) => sum + s.total, 0);
    const profit = monthSalesData.reduce((sum, s) => sum + calculateProfit(s), 0);

    return {
      name: monthName,
      ventas: revenue,
      ganancias: profit,
    };
  });

  const exportToExcel = () => {
    alert('Exportando a Excel... (Funcionalidad de demostración)');
  };

  const exportToPDF = () => {
    alert('Exportando a PDF... (Funcionalidad de demostración)');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Card */}
      <WelcomeCard userName={user?.name || 'Usuario'} />

      {/* Export buttons */}
      <motion.div 
        className="flex justify-end gap-3"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Button
          onClick={exportToExcel}
          className="bg-green-600 hover:bg-green-700 text-white transition-all hover:shadow-lg hover:shadow-green-500/50"
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar Excel
        </Button>
        <Button
          onClick={exportToPDF}
          className="bg-red-600 hover:bg-red-700 text-white transition-all hover:shadow-lg hover:shadow-red-500/50"
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar PDF
        </Button>
      </motion.div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Ventas del Día"
          value={todayRevenue}
          prefix={currency}
          trend={12.5}
          icon={<ShoppingCart className="w-6 h-6" />}
          gradient="bg-gradient-to-br from-[#114b5f]/20 to-[#114b5f]/5"
          iconBg="bg-[#114b5f]/30"
          iconColor="text-[#88d498]"
          delay={0}
        />

        <MetricCard
          title="Ventas de la Semana"
          value={weekRevenue}
          prefix={currency}
          trend={8.2}
          icon={<TrendingUp className="w-6 h-6" />}
          gradient="bg-gradient-to-br from-[#1a936f]/20 to-[#1a936f]/5"
          iconBg="bg-[#1a936f]/30"
          iconColor="text-[#88d498]"
          delay={0.2}
        />

        <MetricCard
          title="Ganancia Total"
          value={totalProfit}
          prefix={currency}
          trend={profitMargin}
          icon={<DollarSign className="w-6 h-6" />}
          gradient="bg-gradient-to-br from-[#88d498]/20 to-[#88d498]/5"
          iconBg="bg-[#88d498]/30"
          iconColor="text-[#1a936f]"
          delay={0.4}
        />

        <MetricCard
          title="Producto Top"
          value={productSales[bestProductId] || 0}
          subtitle={bestProduct?.name || 'N/A'}
          suffix=" unidades"
          icon={<Package className="w-6 h-6" />}
          gradient="bg-gradient-to-br from-[#c6dabf]/20 to-[#c6dabf]/5"
          iconBg="bg-[#c6dabf]/30"
          iconColor="text-[#1a936f]"
          delay={0.6}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 p-6 hover:border-[#1a936f]/30 transition-all duration-300">
            <div className="mb-6">
              <h3 className="text-white mb-1">Evolución Semanal</h3>
              <p className="text-slate-400">Últimos 7 días</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="ventas" 
                  fill="#1a936f" 
                  name="Ventas"
                  animationBegin={1000}
                  animationDuration={1500}
                />
                <Bar 
                  dataKey="ganancias" 
                  fill="#88d498" 
                  name="Ganancias"
                  animationBegin={1200}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Monthly chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 p-6 hover:border-[#114b5f]/30 transition-all duration-300">
            <div className="mb-6">
              <h3 className="text-white mb-1">Evolución Mensual</h3>
              <p className="text-slate-400">Últimos 6 meses</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="ventas"
                  stroke="#1a936f"
                  strokeWidth={3}
                  name="Ventas"
                  animationBegin={1000}
                  animationDuration={2000}
                  dot={{ fill: '#1a936f', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="ganancias"
                  stroke="#88d498"
                  strokeWidth={3}
                  name="Ganancias"
                  animationBegin={1200}
                  animationDuration={2000}
                  dot={{ fill: '#88d498', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.3 }}
          whileHover={{ scale: 1.05 }}
        >
          <Card className="bg-[#1a936f]/10 border-[#1a936f]/20 p-6 relative overflow-hidden group cursor-pointer">
            <motion.div
              className="absolute inset-0 bg-[#1a936f]/5"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="flex items-center gap-3 relative z-10">
              <motion.div 
                className="w-10 h-10 bg-[#1a936f]/20 rounded-full flex items-center justify-center"
                animate={{ 
                  boxShadow: [
                    '0 0 0 0 rgba(26, 147, 111, 0.4)',
                    '0 0 0 10px rgba(26, 147, 111, 0)',
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <TrendingUp className="w-5 h-5 text-[#88d498]" />
              </motion.div>
              <div>
                <p className="text-[#88d498]">Meta Mensual</p>
                <p className="text-white">¡Alcanzada!</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.4 }}
          whileHover={{ scale: 1.05 }}
        >
          <Card className="bg-[#114b5f]/10 border-[#114b5f]/20 p-6 relative overflow-hidden group cursor-pointer">
            <motion.div
              className="absolute inset-0 bg-[#114b5f]/5"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
            <div className="flex items-center gap-3 relative z-10">
              <motion.div 
                className="w-10 h-10 bg-[#114b5f]/20 rounded-full flex items-center justify-center"
                animate={{ 
                  boxShadow: [
                    '0 0 0 0 rgba(17, 75, 95, 0.4)',
                    '0 0 0 10px rgba(17, 75, 95, 0)',
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              >
                <ShoppingCart className="w-5 h-5 text-[#88d498]" />
              </motion.div>
              <div>
                <p className="text-[#88d498]">Ventas Destacadas</p>
                <p className="text-white">{sales.length} registros</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          whileHover={{ scale: 1.05 }}
        >
          <Card className="bg-[#c6dabf]/10 border-[#c6dabf]/20 p-6 relative overflow-hidden group cursor-pointer">
            <motion.div
              className="absolute inset-0 bg-[#c6dabf]/5"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
            <div className="flex items-center gap-3 relative z-10">
              <motion.div 
                className="w-10 h-10 bg-[#c6dabf]/20 rounded-full flex items-center justify-center"
                animate={{ 
                  boxShadow: [
                    '0 0 0 0 rgba(198, 218, 191, 0.4)',
                    '0 0 0 10px rgba(198, 218, 191, 0)',
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
              >
                <Package className="w-5 h-5 text-[#1a936f]" />
              </motion.div>
              <div>
                <p className="text-[#88d498]">Inventario</p>
                <p className="text-white">Stock normal</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};