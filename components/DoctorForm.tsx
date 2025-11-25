
import React, { useState, useEffect, useRef } from 'react';
import { Doctor } from '../types';
import { X, Plus, Hash, Camera } from 'lucide-react';

interface DoctorFormProps {
  initialData?: Doctor | null;
  onSave: (doctor: Doctor) => void;
  onCancel: () => void;
  existingIds: string[];
  specialties: string[];
}

export const DoctorForm: React.FC<DoctorFormProps> = ({ initialData, onSave, onCancel, existingIds, specialties }) => {
  const [formData, setFormData] = useState<Doctor>({
    id: '',
    name: '',
    specialty: specialties[0] || '',
    room: '',
    mutuas: [],
    isActive: true,
    avatarUrl: ''
  });

  const [newMutua, setNewMutua] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'id') setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMutua = () => {
    if (!newMutua.trim()) return;
    if (formData.mutuas.includes(newMutua.trim())) return;
    setFormData(prev => ({ ...prev, mutuas: [...prev.mutuas, newMutua.trim()] }));
    setNewMutua('');
  };

  const handleRemoveMutua = (mutua: string) => {
    setFormData(prev => ({ ...prev, mutuas: prev.mutuas.filter(m => m !== mutua) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.id.trim() || !formData.name.trim() || !formData.room.trim() || !formData.specialty) {
      setError('Por favor completa todos los campos obligatorios.');
      return;
    }

    // Check Unique ID only if creating new (initialData is null) or if ID changed (unlikely for edit but good safety)
    if (!initialData && existingIds.includes(formData.id)) {
      setError('Este ID ya existe. Por favor usa un ID único.');
      return;
    }

    onSave({
      ...formData,
      avatarUrl: formData.avatarUrl || `https://picsum.photos/100/100?random=${Date.now()}`
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-md p-0 sm:p-4 animate-fade-in">
      {/* Updated max-h to subtract top safe area */}
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col h-auto max-h-[calc(100dvh-env(safe-area-inset-top)-2rem)] overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b bg-slate-50 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {initialData ? 'Editar Médico' : 'Registrar Nuevo Médico'}
            </h2>
            <p className="text-xs text-slate-500">
              {initialData ? 'Modificar datos existentes' : 'Ingrese los datos del profesional'}
            </p>
          </div>
          <button onClick={onCancel} className="p-2 bg-white hover:bg-slate-100 rounded-full border border-slate-200 transition-colors shadow-sm">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              {error}
            </div>
          )}

          {/* Avatar Upload */}
          <div className="flex flex-col items-center justify-center mb-2">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative w-28 h-28 rounded-full bg-slate-100 border-4 border-white shadow-lg cursor-pointer group overflow-hidden hover:scale-105 transition-transform"
            >
              {formData.avatarUrl ? (
                <img src={formData.avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                  <Camera className="w-8 h-8 mb-1" />
                  <span className="text-[9px] font-bold uppercase tracking-wide">Foto</span>
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 text-primary-600 text-xs font-bold uppercase tracking-wide hover:underline"
            >
              {formData.avatarUrl ? 'Cambiar Imagen' : 'Subir Imagen'}
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange}
            />
          </div>

          {/* ID Field - Highlighted */}
          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
            <label className="block text-xs font-bold text-indigo-900 uppercase tracking-wide mb-2 flex items-center gap-2">
              <Hash className="w-3 h-3" />
              ID Profesional (Manual)
            </label>
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleChange}
              disabled={!!initialData} // Lock ID on edit
              placeholder="Ej. MED-001"
              className={`w-full p-3 rounded-xl border font-mono ${!!initialData ? 'bg-slate-200 text-slate-500 border-transparent cursor-not-allowed' : 'bg-white border-indigo-200 focus:ring-2 focus:ring-indigo-500 text-indigo-900'} outline-none transition-all`}
            />
            {!initialData && <p className="text-[10px] text-indigo-600 mt-2 font-medium">Debe ser único para cada médico.</p>}
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Nombre Completo</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej. Dr. Juan Pérez"
              className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none transition-all focus:border-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             {/* Specialty Field */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Especialidad</label>
              <div className="relative">
                <select
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none bg-white appearance-none"
                >
                  <option value="" disabled>Seleccionar...</option>
                  {specialties.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>

            {/* Room Field */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nº Sala</label>
              <input
                type="text"
                name="room"
                value={formData.room}
                onChange={handleChange}
                placeholder="Ej. 204"
                className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none transition-all text-center font-bold"
              />
            </div>
          </div>

          {/* Mutuas Field */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Mutuas Aseguradoras</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newMutua}
                onChange={(e) => setNewMutua(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMutua())}
                placeholder="Ej. Sanitas..."
                className="flex-1 p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none"
              />
              <button
                type="button"
                onClick={handleAddMutua}
                className="bg-slate-800 text-white p-3 rounded-xl hover:bg-slate-900 transition-colors shadow-sm"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            <div className="min-h-[50px] p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-wrap gap-2">
              {formData.mutuas.length > 0 ? (
                formData.mutuas.map(mutua => (
                  <span key={mutua} className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold bg-white text-slate-700 border border-slate-200 shadow-sm">
                    {mutua}
                    <button type="button" onClick={() => handleRemoveMutua(mutua)} className="ml-2 text-slate-400 hover:text-red-500 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-400 italic w-full text-center py-2">Sin mutuas asignadas</span>
              )}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t flex gap-4 bg-white pb-safe shrink-0">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3.5 px-4 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3.5 px-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-500/30 transition-all active:scale-95"
          >
            {initialData ? 'Guardar Cambios' : 'Crear Médico'}
          </button>
        </div>

      </div>
    </div>
  );
};
