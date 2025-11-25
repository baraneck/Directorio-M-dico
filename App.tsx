import React, { useState, useEffect } from 'react';
import { Doctor, ViewState } from './types';
import { StorageService } from './services/storage';
import { DoctorsList } from './pages/DoctorsList';
import { DoctorForm } from './components/DoctorForm';
import { SpecialtyManager } from './components/SpecialtyManager';
import { Users, BarChart3, X, MapPin, Building, Power, Settings, Loader2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

// Simple Stats Page
const Dashboard: React.FC<{ doctors: Doctor[]; onManageSpecialties: () => void }> = ({ doctors, onManageSpecialties }) => {
  const activeDoctors = doctors.filter(d => d.isActive);
  
  const data = React.useMemo(() => {
    const counts: Record<string, number> = {};
    activeDoctors.forEach(d => {
      counts[d.specialty] = (counts[d.specialty] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [activeDoctors]);

  return (
    // Updated padding to use safe area utility (pt-safe-header)
    <div className="px-6 pb-24 pt-safe-header bg-slate-50 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Resumen Centro</h1>
        <button 
          onClick={onManageSpecialties}
          className="p-2 bg-white text-slate-600 rounded-xl border border-slate-200 shadow-sm active:scale-95 transition-all"
          title="Gestionar Especialidades"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-slate-400 text-sm font-medium mb-1">Total Activos</div>
          <div className="text-3xl font-bold text-primary-600">{activeDoctors.length}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-slate-400 text-sm font-medium mb-1">Especialidades</div>
          <div className="text-3xl font-bold text-indigo-600">{data.length}</div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-6">
        <h3 className="font-bold text-slate-700 mb-4">Médicos por Especialidad</h3>
        <div className="h-64 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" width={100} tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border:'none', boxShadow:'0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Bar dataKey="count" fill="#0ea5e9" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Doctor Detail Modal
const DoctorDetail: React.FC<{ 
  doctor: Doctor; 
  onClose: () => void; 
  onEdit: () => void; 
  onToggleStatus: () => void; 
}> = ({ doctor, onClose, onEdit, onToggleStatus }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl max-h-[90dvh] flex flex-col">
        <div className={`relative h-32 shrink-0 bg-gradient-to-r ${doctor.isActive ? 'from-primary-600 to-indigo-600' : 'from-slate-400 to-slate-500'}`}>
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
          {!doctor.isActive && (
            <div className="absolute top-4 left-4 bg-black/20 text-white px-3 py-1 rounded-full text-xs font-bold uppercase backdrop-blur-sm">
              Deshabilitado
            </div>
          )}
        </div>
        
        <div className="px-6 pb-6 relative overflow-y-auto">
          <div className="flex justify-between items-end -mt-12 mb-4">
            <img 
              src={doctor.avatarUrl} 
              alt={doctor.name} 
              className={`w-24 h-24 rounded-2xl border-4 border-white shadow-lg object-cover bg-white ${!doctor.isActive ? 'grayscale' : ''}`}
            />
            <div className="flex gap-2 mb-1">
              <button onClick={onEdit} className="px-4 py-2 bg-slate-100 text-slate-700 font-medium text-sm rounded-xl hover:bg-slate-200 transition-colors">
                Editar
              </button>
              <button 
                onClick={onToggleStatus} 
                className={`px-4 py-2 font-medium text-sm rounded-xl transition-colors flex items-center gap-2 active:scale-95 ${doctor.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
              >
                <Power className="w-4 h-4" />
                {doctor.isActive ? 'Deshabilitar' : 'Habilitar'}
              </button>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 leading-tight mb-1">{doctor.name}</h2>
          <p className="text-primary-600 font-medium mb-4">{doctor.specialty}</p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-slate-500">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Ubicación</p>
                <p className="font-semibold text-slate-700">Sala {doctor.room}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-slate-500">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">ID del Sistema</p>
                <p className="font-semibold text-slate-700 font-mono">{doctor.id}</p>
              </div>
            </div>

            <div className="p-4 border border-slate-100 rounded-xl">
              <p className="text-xs text-slate-400 font-bold uppercase mb-3">Mutuas Aceptadas</p>
              <div className="flex flex-wrap gap-2">
                {doctor.mutuas.length > 0 ? doctor.mutuas.map(m => (
                  <span key={m} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">
                    {m}
                  </span>
                )) : <span className="text-slate-400 italic text-sm">Sin mutuas</span>}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<ViewState>(ViewState.DOCTORS);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isManagingSpecialties, setIsManagingSpecialties] = useState(false);

  // Initial Load (Async)
  useEffect(() => {
    const loadData = async () => {
      const docs = await StorageService.getDoctors();
      const specs = await StorageService.getSpecialties();
      setDoctors(docs);
      setSpecialties(specs);
      setLoading(false);
    };
    loadData();
  }, []);

  // Save changes
  const handleSaveDoctor = async (doc: Doctor) => {
    let newDoctors;
    if (isEditing) {
      newDoctors = doctors.map(d => d.id === doc.id ? doc : d);
      setIsEditing(false);
      setSelectedDoctor(doc);
    } else {
      newDoctors = [...doctors, doc];
      setIsCreating(false);
    }
    setDoctors(newDoctors);
    await StorageService.saveDoctors(newDoctors);
  };

  const handleToggleStatus = async (id: string) => {
    const doc = doctors.find(d => d.id === id);
    if (!doc) return;
    
    const updatedDoc = { ...doc, isActive: !doc.isActive };
    const newDoctors = doctors.map(d => d.id === id ? updatedDoc : d);
    
    setDoctors(newDoctors);
    setSelectedDoctor(updatedDoc);
    await StorageService.saveDoctors(newDoctors);
  };

  const handleSaveSpecialties = async (newSpecialties: string[]) => {
    setSpecialties(newSpecialties);
    await StorageService.saveSpecialties(newSpecialties);
  };

  if (loading) {
    return (
      <div className="flex flex-col h-dynamic items-center justify-center bg-slate-50 text-primary-600 gap-3">
        <Loader2 className="w-10 h-10 animate-spin" />
        <span className="font-bold text-sm">Cargando base de datos...</span>
      </div>
    );
  }

  return (
    // Changed h-screen to h-dynamic (100dvh) for mobile browsers
    <div className="flex flex-col h-dynamic max-w-md mx-auto bg-slate-50 shadow-2xl overflow-hidden relative border-x border-slate-200">
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {view === ViewState.DASHBOARD && (
          <Dashboard 
            doctors={doctors} 
            onManageSpecialties={() => setIsManagingSpecialties(true)}
          />
        )}
        
        {view === ViewState.DOCTORS && (
          <DoctorsList 
            doctors={doctors}
            specialties={specialties}
            onSelectDoctor={setSelectedDoctor}
            onAddDoctor={() => setIsCreating(true)}
          />
        )}
      </div>

      {/* Navigation Bar with Safe Area padding (pb-safe-nav) */}
      <nav className="bg-white border-t border-slate-200 flex justify-around items-center pt-2 pb-safe-nav sticky bottom-0 z-40">
        <NavButton 
          icon={<Users />} 
          label="Directorio" 
          active={view === ViewState.DOCTORS} 
          onClick={() => setView(ViewState.DOCTORS)} 
        />
        <NavButton 
          icon={<BarChart3 />} 
          label="Resumen" 
          active={view === ViewState.DASHBOARD} 
          onClick={() => setView(ViewState.DASHBOARD)} 
        />
      </nav>

      {/* Modals */}
      {(isCreating || (isEditing && selectedDoctor)) && (
        <DoctorForm 
          initialData={isEditing ? selectedDoctor : null}
          existingIds={doctors.map(d => d.id)}
          specialties={specialties}
          onSave={handleSaveDoctor}
          onCancel={() => {
            setIsCreating(false);
            setIsEditing(false);
          }}
        />
      )}

      {selectedDoctor && !isEditing && (
        <DoctorDetail 
          doctor={selectedDoctor} 
          onClose={() => setSelectedDoctor(null)}
          onEdit={() => setIsEditing(true)}
          onToggleStatus={() => handleToggleStatus(selectedDoctor.id)}
        />
      )}

      {isManagingSpecialties && (
        <SpecialtyManager 
          specialties={specialties}
          onSave={handleSaveSpecialties}
          onClose={() => setIsManagingSpecialties(false)}
        />
      )}

    </div>
  );
}

const NavButton: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full p-2 transition-colors ${active ? 'text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
  >
    <div className={`mb-1 ${active ? 'scale-110' : ''} transition-transform`}>
      {React.cloneElement(icon as React.ReactElement<any>, { size: 24, strokeWidth: active ? 2.5 : 2 })}
    </div>
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);
