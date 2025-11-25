import React, { useState, useMemo } from 'react';
import { Doctor } from '../types';
import { Search, Plus, Filter, Eye, EyeOff, Hash, MapPin } from 'lucide-react';

interface DoctorsListProps {
  doctors: Doctor[];
  specialties: string[];
  onSelectDoctor: (doctor: Doctor) => void;
  onAddDoctor: () => void;
}

export const DoctorsList: React.FC<DoctorsListProps> = ({ doctors, specialties, onSelectDoctor, onAddDoctor }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('Todos');
  const [showDisabled, setShowDisabled] = useState(false);

  // Filter and Group Logic
  const processedDoctors = useMemo(() => {
    let filtered = doctors.filter(d => 
      (d.isActive || showDisabled) && // Filter active/inactive
      (d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.mutuas.some(m => m.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    if (selectedSpecialty !== 'Todos') {
      filtered = filtered.filter(d => d.specialty === selectedSpecialty);
    }

    // Group by Specialty for display
    const groups: Record<string, Doctor[]> = {};
    filtered.forEach(d => {
      if (!groups[d.specialty]) groups[d.specialty] = [];
      groups[d.specialty].push(d);
    });

    return groups;
  }, [doctors, searchTerm, selectedSpecialty, showDisabled]);

  return (
    <div className="h-full flex flex-col bg-slate-50 relative">
      
      {/* Header & Search */}
      <div className="sticky top-0 z-10 bg-white shadow-sm border-b pt-safe-header px-4 pb-4 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Directorio Médico</h1>
            <p className="text-xs text-slate-500">Consulta de profesionales</p>
          </div>
          
          <button 
            onClick={onAddDoctor}
            className="flex items-center gap-2 bg-primary-600 text-white px-3 py-2 rounded-xl text-sm font-bold shadow-sm active:scale-95 transition-all hover:bg-primary-700 hover:shadow-primary-500/30"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Nuevo Médico</span>
            <span className="sm:hidden">Nuevo</span>
          </button>
        </div>

        {/* Search Bar - Larger */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar médico, sala, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-slate-100 border-none rounded-2xl text-base focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-inner"
            />
          </div>
          <button 
            onClick={() => setShowDisabled(!showDisabled)}
            className={`px-4 py-3.5 rounded-2xl border flex items-center justify-center gap-2 transition-colors sm:w-auto w-full ${showDisabled ? 'bg-slate-800 text-white border-slate-800' : 'bg-white border-slate-200 text-slate-500'}`}
          >
            {showDisabled ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            <span className="sm:hidden font-bold">Inactivos</span>
          </button>
        </div>

        {/* Specialty Filter Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setSelectedSpecialty('Todos')}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-colors ${
              selectedSpecialty === 'Todos' 
                ? 'bg-slate-800 text-white shadow-md shadow-slate-200' 
                : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            Todos
          </button>
          {specialties.map(s => (
            <button
              key={s}
              onClick={() => setSelectedSpecialty(s)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-colors ${
                selectedSpecialty === s 
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-200' 
                  : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* List Content */}
      <div className="flex-1 overflow-y-auto p-3 pb-24 md:pb-4 space-y-6">
        {Object.keys(processedDoctors).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
            <div className="bg-slate-100 p-6 rounded-full mb-4">
              <Filter className="w-12 h-12 text-slate-400" />
            </div>
            <p className="text-lg font-bold text-slate-700">No se encontraron médicos</p>
          </div>
        ) : (
          Object.entries(processedDoctors).map(([specialty, docs]) => (
            <div key={specialty} className="animate-fade-in">
              <div className="flex items-center gap-3 mb-3 pl-1">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {specialty}
                </h2>
                <div className="h-px flex-1 bg-slate-200"></div>
              </div>
              
              {/* COMPACT GRID LAYOUT: 2 Columns on Mobile, 3 on Tablet, etc. */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {(docs as Doctor[]).map(doc => (
                  <div 
                    key={doc.id}
                    onClick={() => onSelectDoctor(doc)}
                    className={`group bg-white rounded-2xl p-3 shadow-sm border border-slate-200 active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden flex flex-col items-center text-center hover:shadow-md hover:border-primary-200 ${!doc.isActive ? 'opacity-60 grayscale bg-slate-50' : ''}`}
                  >
                    {/* Avatar & Room Badge */}
                    <div className="relative mb-3">
                      <img 
                        src={doc.avatarUrl} 
                        className="w-16 h-16 rounded-full object-cover shadow-sm bg-slate-100 border-2 border-slate-50 group-hover:scale-105 transition-transform" 
                      />
                      {/* Room Badge - Prominent */}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full border-2 border-white shadow-sm flex items-center gap-0.5 whitespace-nowrap z-10">
                        <span>Sala {doc.room}</span>
                      </div>
                    </div>

                    {/* Main Info - Vertical Compact */}
                    <div className="w-full">
                      <h3 className="text-sm font-bold text-slate-800 leading-tight mb-1 line-clamp-2 min-h-[2.5em]">
                        {doc.name}
                      </h3>
                      
                      <div className="flex items-center justify-center gap-1 mb-2 opacity-60">
                         <Hash className="w-3 h-3" />
                         <span className="text-[10px] font-mono font-bold tracking-tight">{doc.id}</span>
                      </div>
                      
                      <div className="flex flex-wrap justify-center gap-1">
                         <span className="text-primary-700 font-bold text-[10px] uppercase tracking-wide bg-primary-50 px-2 py-0.5 rounded-md truncate max-w-full">
                           {doc.specialty}
                         </span>
                      </div>
                      
                      {!doc.isActive && (
                        <div className="mt-2 text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full inline-block">
                          Inactivo
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* FAB (Mobile Only) */}
      <button
        onClick={onAddDoctor}
        className="fixed bottom-24 right-5 w-12 h-12 bg-primary-600 text-white rounded-full shadow-lg shadow-primary-600/40 flex items-center justify-center hover:bg-primary-700 active:scale-95 transition-all z-20 sm:hidden"
      >
        <Plus className="w-6 h-6" />
      </button>

    </div>
  );
};
