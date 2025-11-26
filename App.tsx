import React, { useState, useEffect, useRef } from 'react';
import { Doctor, ViewState, BackupData } from './types';
import { StorageService } from './services/storage';
import { DoctorsList } from './pages/DoctorsList';
import { SimpleList } from './pages/SimpleList';
import { DoctorForm } from './components/DoctorForm';
import { SpecialtyManager } from './components/SpecialtyManager';
import { Users, BarChart3, X, MapPin, Building, Power, Settings, Loader2, Activity, List, Download, Upload, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

// Simple Stats Page
const Dashboard: React.FC<{ 
  doctors: Doctor[]; 
  onManageSpecialties: () => void;
  onImportSuccess: () => void; 
}> = ({ doctors, onManageSpecialties, onImportSuccess }) => {
  const activeDoctors = doctors.filter(d => d.isActive);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const data = React.useMemo(() => {
    const counts: Record<string, number> = {};
    activeDoctors.forEach(d => {
      counts[d.specialty] = (counts[d.specialty] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [activeDoctors]);

  const handleExport = async () => {
    try {
      const backup = await StorageService.createBackup();
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `clinigest_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Error al crear la copia de seguridad');
      console.error(e);
    }
  };

  const handleImportClick = () => {
    if (window.confirm('ADVERTENCIA: Al importar una copia de seguridad se reemplazarán los datos actuales. ¿Desea continuar?')) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = event.target?.result as string;
        const backupData: BackupData = JSON.parse(json);
        
        // Basic validation
        if (!backupData.doctors || !Array.isArray(backupData.doctors)) {
          throw new Error('Formato de archivo inválido');
        }

        await StorageService.restoreBackup(backupData);
        alert('Datos restaurados correctamente.');
        onImportSuccess(); // Refresh app state
      } catch (error) {
        alert('Error al leer el archivo de copia de seguridad. Asegúrese de que es un archivo .json válido generado por esta aplicación.');
        console.error(error);
      }
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  return (
    // Updated padding to use safe area utility (pt-safe-header)
    <div className="px-6 pb-24 pt-safe-header bg-slate-50 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Resumen Centro</h1>
          <p className="text-sm text-slate-500 hidden md:block">Estadísticas generales y configuración</p>
        </div>
      </div>
      
      {/* Responsive Grid for Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-slate-400 text-sm font-medium mb-1">Total Activos</div>
          <div className="text-3xl font-bold text-primary-600">{activeDoctors.length}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-slate-400 text-sm font-medium mb-1">Especialidades</div>
          <div className="text-3xl font-bold text-indigo-600">{data.length}</div>
        </div>
         <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hidden md:block">
          <div className="text-slate-400 text-sm font-medium mb-1">Total Médicos</div>
          <div className="text-3xl font-bold text-slate-700">{doctors.length}</div>
        </div>
         <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hidden md:block">
          <div className="text-slate-400 text-sm font-medium mb-1">Estado Sistema</div>
          <div className="text-xs font-bold text-green-600 bg-green-50 inline-block px-2 py-1 rounded-md mt-1">OPERATIVO</div>
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

      {/* Data Management Section */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-6">
        <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-400" />
          Gestión de Datos
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={onManageSpecialties}
            className="flex items-center justify-center gap-2 px-4 py-4 bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors"
          >
            <List className="w-5 h-5" />
            Editar Especialidades
          </button>
          
          <button 
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-4 py-4 bg-indigo-50 text-indigo-700 font-bold rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-colors"
          >
            <Download className="w-5 h-5" />
            Exportar Backup
          </button>
          
          <button 
            onClick={handleImportClick}
            className="flex items-center justify-center gap-2 px-4 py-4 bg-amber-50 text-amber-700 font-bold rounded-xl border border-amber-100 hover:bg-amber-100 transition-colors"
          >
            <Upload className="w-5 h-5" />
            Importar Backup
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".json" 
            className="hidden" 
          />
        </div>
        <p className="mt-4 text-xs text-slate-400 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5" />
          Use Exportar/Importar para transferir sus datos a otro dispositivo o guardar una copia de seguridad.
        </p>
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
  const loadData = async () => {
    setLoading(true);
    const docs = await StorageService.getDoctors();
    const specs = await StorageService.getSpecialties();
    setDoctors(docs);
    setSpecialties(specs);
    setLoading(false);
  };

  useEffect(() => {
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
    // Responsive Layout: Full width on desktop, flex row
    <div className="flex h-dynamic w-full bg-slate-50 overflow-hidden relative">
      
      {/* Desktop Sidebar (Visible only on md+) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 shrink-0 z-20">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
                <Activity className="w-6 h-6" />
            </div>
            <div>
                <h1 className="font-bold text-slate-800 text-lg leading-tight">CliniGest</h1>
                <p className="text-xs text-slate-500 font-medium">Gestión Médica</p>
            </div>
        </div>
        
        <div className="flex-1 p-4 space-y-2">
            <SidebarButton 
                icon={<Users />} 
                label="Directorio Médico" 
                active={view === ViewState.DOCTORS} 
                onClick={() => setView(ViewState.DOCTORS)} 
            />
            <SidebarButton 
                icon={<List />} 
                label="Listado Rápido" 
                active={view === ViewState.LIST} 
                onClick={() => setView(ViewState.LIST)} 
            />
            <SidebarButton 
                icon={<BarChart3 />} 
                label="Resumen del Centro" 
                active={view === ViewState.DASHBOARD} 
                onClick={() => setView(ViewState.DASHBOARD)} 
            />
        </div>
        
        <div className="p-4 border-t border-slate-100">
             <div className="text-xs text-slate-400 text-center">
                 v1.0.0 Stable
             </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative w-full">
        {view === ViewState.DASHBOARD && (
          <Dashboard 
            doctors={doctors} 
            onManageSpecialties={() => setIsManagingSpecialties(true)}
            onImportSuccess={loadData}
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

        {view === ViewState.LIST && (
          <SimpleList 
            doctors={doctors}
            onSelectDoctor={setSelectedDoctor}
          />
        )}
      </main>

      {/* Mobile Navigation Bar (Visible only on < md) */}
      <nav className="md:hidden bg-white border-t border-slate-200 flex justify-around items-center pt-2 pb-safe-nav absolute bottom-0 w-full z-40">
        <NavButton 
          icon={<Users />} 
          label="Directorio" 
          active={view === ViewState.DOCTORS} 
          onClick={() => setView(ViewState.DOCTORS)} 
        />
        <NavButton 
          icon={<List />} 
          label="Listado" 
          active={view === ViewState.LIST} 
          onClick={() => setView(ViewState.LIST)} 
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

const SidebarButton: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all ${active ? 'bg-primary-50 text-primary-700 font-bold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
    >
      {React.cloneElement(icon as React.ReactElement<any>, { size: 20, strokeWidth: active ? 2.5 : 2 })}
      <span className="text-sm">{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500"></div>}
    </button>
  );