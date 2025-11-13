import React from 'react';
import { Cloud, CloudRain, Sun, CloudSnow } from 'lucide-react';
import { Card } from './ui/card';

interface WelcomeCardProps {
  userName: string;
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({ userName }) => {
  // Mock weather data - en producción vendría de una API
  const weather = {
    temperature: 30,
    condition: 'Foggy cloudy weather',
    icon: 'cloud',
  };

  const getWeatherIcon = () => {
    switch (weather.icon) {
      case 'sun':
        return <Sun className="w-6 h-6 text-yellow-400" />;
      case 'rain':
        return <CloudRain className="w-6 h-6 text-blue-400" />;
      case 'snow':
        return <CloudSnow className="w-6 h-6 text-blue-200" />;
      default:
        return <Cloud className="w-6 h-6 text-slate-400" />;
    }
  };

  return (
    <Card className="bg-gradient-to-br from-[#114b5f] via-[#1a936f] to-[#114b5f] border-[#1a936f]/50 p-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#88d498]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#1a936f]/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-white mb-2">
            Welcome home, {userName}!
          </h2>
          <p className="text-[#c6dabf] mb-6 max-w-md">
            Your dashboard is ready with the latest updates. 
            Check your business metrics and stay on top of your sales performance.
          </p>
          
          {/* Weather info */}
          <div className="flex items-start gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white">+{weather.temperature}°C</span>
                {getWeatherIcon()}
              </div>
              <p className="text-[#c6dabf]">Outdoor temperature</p>
              <p className="text-[#88d498] mt-1">{weather.condition}</p>
            </div>
          </div>
        </div>
        
        {/* Character illustration */}
        <div className="hidden lg:block">
          <div className="w-48 h-48 relative">
            {/* Simple avatar illustration using CSS */}
            <div className="absolute bottom-0 right-0">
              <div className="relative">
                {/* Head */}
                <div className="w-32 h-32 bg-gradient-to-br from-[#1a936f] to-[#114b5f] rounded-full relative">
                  {/* Face features - simplified */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    {/* Eyes */}
                    <div className="flex gap-4 mb-2">
                      <div className="w-3 h-3 bg-slate-900 rounded-full"></div>
                      <div className="w-3 h-3 bg-slate-900 rounded-full"></div>
                    </div>
                    {/* Mouth */}
                    <div className="w-6 h-2 bg-slate-900 rounded-full mx-auto"></div>
                  </div>
                  
                  {/* Beard */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4">
                    <div className="w-20 h-16 bg-gradient-to-b from-amber-700 to-amber-600 rounded-b-full"></div>
                  </div>
                </div>
                
                {/* Scarf */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-12">
                  <div className="w-24 h-6 bg-gradient-to-r from-[#88d498] to-[#c6dabf] rounded-lg"></div>
                </div>
                
                {/* Body */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-20">
                  <div className="w-28 h-20 bg-gradient-to-b from-[#1a936f] to-[#114b5f] rounded-t-3xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};