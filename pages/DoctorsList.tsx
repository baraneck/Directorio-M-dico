import React, { useState, useMemo } from 'react';
import { Doctor } from '../types';
import { Search, Plus, Filter, Eye, EyeOff, ChevronRight, Hash } from 'lucide-react';

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
      <div className="sticky top-0 z-10 bg-white shadow-sm border-b pt-safe-header px-4 pb-4 space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Directorio Médico</h1>
            <p className="text-xs text-slate-500">Consulta de profesionales y salas</p>
          </div>
          
          <button 
            onClick={onAddDoctor}
            className="flex items-center gap-2 bg-primary-600 text-white px-3 py-2 rounded-xl text-sm font-bold shadow-sm active:scale-95 transition-all hover:bg-primary-700 hover:shadow-primary-500/30"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nuevo Médico</span>
            <span className="sm:hidden">Nuevo</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, ID, sala, mutua..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
            />
          </div>
          <button 
            onClick={() => setShowDisabled(!showDisabled)}
            className={`px-3 py-2.5 rounded-xl border flex items-center justify-center gap-2 transition-colors sm:w-auto w-full ${showDisabled ? 'bg-slate-800 text-white border-slate-800' : 'bg-white border-slate-200 text-slate-500'}`}
            title={showDisabled ? "Ocultar deshabilitados" : "Mostrar deshabilitados"}
          >
            {showDisabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span className="sm:hidden text-xs font-bold">Inactivos</span>
          </button>
        </div>

        {/* Specialty Filter Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setSelectedSpecialty('Todos')}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-colors ${
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
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-colors ${
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
      <div className="flex-1 overflow-y-auto p-4 pb-24 md:pb-4 space-y-6">
        {Object.keys(processedDoctors).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
            <div className="bg-slate-100 p-6 rounded-full mb-4">
              <Filter className="w-12 h-12 text-slate-400" />
            </div>
            <p className="text-lg font-bold text-slate-700">No se encontraron médicos</p>
            <p className="text-sm text-slate-500 max-w-[200px]">
              {showDisabled ? "No hay resultados." : "Intenta cambiar los filtros o habilita la vista de inactivos."}
            </p>
          </div>
        ) : (
          Object.entries(processedDoctors).map(([specialty, docs]) => (
            <div key={specialty} className="animate-fade-in">
              <div className="flex items-center gap-3 mb-3 pl-1">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                  {specialty}
                </h2>
                <div className="h-px flex-1 bg-slate-200"></div>
                <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {(docs as Doctor[]).length}
                </span>
              </div>
              
              {/* Responsive Grid Layout: 1 col mobile, 2 cols tablet, 3 cols desktop, 4 cols large */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {(docs as Doctor[]).map(doc => (
                  <div 
                    key={doc.id}
                    onClick={() => onSelectDoctor(doc)}
                    className={`group bg-white rounded-3xl p-4 shadow-sm border border-slate-200 active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden flex items-center gap-5 hover:shadow-md h-full ${!doc.isActive ? 'opacity-60 grayscale bg-slate-50' : ''}`}
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <img src={doc.avatarUrl} className="w-20 h-20 rounded-2xl object-cover shadow-md bg-slate-200 border-2 border-white" />
                      <div className="absolute -bottom-2 -right-2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg border-2 border-white shadow-sm">
                        Sala {doc.room}
                      </div>
                    </div>

                    {/* Main Info */}
                    <div className="flex-1 min-w-0 py-1">
                      <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1 truncate">
                        {doc.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                         <div className="bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                           <Hash className="w-4 h-4 text-slate-400" />
                           <span className="text-base font-mono font-bold text-slate-700 tracking-tight">{doc.id}</span>
                         </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                         <span className="text-primary-600 font-bold text-xs uppercase tracking-wide bg-primary-50 px-2 py-0.5 rounded-md truncate max-w-[100px] md:max-w-none">
                           {doc.specialty}
                         </span>
                         {!doc.isActive && <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Inactivo</span>}
                      </div>
                    </div>

                    {/* Action Arrow (Visible on hover on desktop) */}
                    <div className="pr-1 text-slate-300 group-hover:text-primary-500 transition-colors">
                      <ChevronRight size={28} strokeWidth={2.5} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* FAB - Add Doctor (Mobile Only) */}
      <button
        onClick={onAddDoctor}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg shadow-primary-600/40 flex items-center justify-center hover:bg-primary-700 hover:scale-105 active:scale-95 transition-all z-20 sm:hidden"
      >
        <Plus className="w-7 h-7" />
      </button>

    </div>
  );
};