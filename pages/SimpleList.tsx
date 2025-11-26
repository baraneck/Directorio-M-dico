import React, { useState, useMemo } from 'react';
import { Doctor } from '../types';
import { Search, ChevronRight } from 'lucide-react';

interface SimpleListProps {
  doctors: Doctor[];
  onSelectDoctor: (doctor: Doctor) => void;
}

export const SimpleList: React.FC<SimpleListProps> = ({ doctors, onSelectDoctor }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter and Sort Alphabetically
  const filteredDoctors = useMemo(() => {
    return doctors
      .filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [doctors, searchTerm]);

  return (
    <div className="h-full flex flex-col bg-slate-50 relative">
      
      {/* Header & Search */}
      <div className="sticky top-0 z-10 bg-white shadow-sm border-b pt-safe-header px-4 pb-4 space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Listado Rápido</h1>
          <p className="text-xs text-slate-500">Índice alfabético de profesionales</p>
        </div>

        {/* Simple Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-100 border-none rounded-xl text-base focus:ring-2 focus:ring-primary-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* List Content */}
      <div className="flex-1 overflow-y-auto bg-white pb-24 md:pb-4">
        {filteredDoctors.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            No se encontraron médicos.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredDoctors.map(doc => (
              <div 
                key={doc.id}
                onClick={() => onSelectDoctor(doc)}
                className={`p-4 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 cursor-pointer transition-colors ${!doc.isActive ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center gap-3">
                  {/* Status Dot */}
                  <div className={`w-2 h-2 rounded-full shrink-0 ${doc.isActive ? 'bg-primary-500' : 'bg-red-400'}`}></div>
                  
                  <span className="text-lg font-medium text-slate-800">
                    {doc.name}
                  </span>
                  
                  {!doc.isActive && (
                    <span className="text-[10px] uppercase font-bold text-red-500 border border-red-200 px-1.5 rounded">
                      Inactivo
                    </span>
                  )}
                </div>
                
                <ChevronRight className="w-5 h-5 text-slate-300" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};