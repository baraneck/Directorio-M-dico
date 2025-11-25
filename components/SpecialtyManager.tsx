import React, { useState } from 'react';
import { X, Plus, Trash2, Tag } from 'lucide-react';

interface SpecialtyManagerProps {
  specialties: string[];
  onSave: (specialties: string[]) => void;
  onClose: () => void;
}

export const SpecialtyManager: React.FC<SpecialtyManagerProps> = ({ specialties, onSave, onClose }) => {
  const [list, setList] = useState<string[]>(specialties);
  const [newSpec, setNewSpec] = useState('');

  const handleAdd = () => {
    if (!newSpec.trim()) return;
    const formatted = newSpec.trim();
    if (list.includes(formatted)) return;
    setList([...list, formatted]);
    setNewSpec('');
  };

  const handleDelete = (spec: string) => {
    // Removed window.confirm to ensure compatibility and immediate action
    setList(list.filter(s => s !== spec));
  };

  const handleSave = () => {
    onSave(list);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        
        <div className="flex justify-between items-center p-5 border-b bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Especialidades</h2>
            <p className="text-xs text-slate-500">Gestionar listado disponible</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white hover:bg-slate-100 rounded-full border border-slate-200 transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1">
          {/* Add New */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={newSpec}
              onChange={(e) => setNewSpec(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="Nueva especialidad..."
              className="flex-1 p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none"
            />
            <button
              onClick={handleAdd}
              disabled={!newSpec.trim()}
              className="bg-slate-800 text-white p-3 rounded-xl hover:bg-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="space-y-2">
            {list.map((spec) => (
              <div key={spec} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl group hover:border-slate-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-200">
                    <Tag className="w-4 h-4 text-slate-400" />
                  </div>
                  <span className="font-bold text-slate-700">{spec}</span>
                </div>
                <button 
                  onClick={() => handleDelete(spec)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            {list.length === 0 && (
              <div className="text-center py-8 text-slate-400 italic">
                No hay especialidades definidas.
              </div>
            )}
          </div>
        </div>

        <div className="p-5 border-t bg-white pb-safe">
          <button
            onClick={handleSave}
            className="w-full py-3.5 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-500/30 transition-all active:scale-95"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};