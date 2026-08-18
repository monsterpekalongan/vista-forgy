import { AppProvider, useApp } from './ui/AppState';
import { HomeScreen } from './ui/screens/HomeScreen';
import { OnboardingScreen } from './ui/screens/OnboardingScreen';
import { RunnerScreen } from './ui/screens/RunnerScreen';
import { SkillMapScreen } from './ui/screens/SkillMapScreen';
import { StatsScreen } from './ui/screens/StatsScreen';
import { SettingsScreen } from './ui/screens/SettingsScreen';
import { DataScreen } from './ui/screens/DataScreen';
import { ExamScreen } from './ui/screens/ExamScreen';

import { Home, Map, Award, BarChart2, Settings, Database } from 'lucide-react';

function MainLayout() {
  const { screen, setScreen } = useApp();

  if (screen === 'onboarding') {
    return <OnboardingScreen />;
  }

  if (screen === 'runner') {
    return <RunnerScreen />;
  }

  const renderScreen = () => {
    switch (screen) {
      case 'home': return <HomeScreen />;
      case 'map': return <SkillMapScreen />;
      case 'exam': return <ExamScreen />;
      case 'stats': return <StatsScreen />;
      case 'settings': return <SettingsScreen />;
      case 'data': return <DataScreen />;
      default: return <HomeScreen />;
    }
  };

  return (
    <div className="h-dvh w-full overflow-hidden flex flex-col bg-[var(--bg)] text-[var(--text)]">
      {/* Desktop & Mobile Main Layout Wrapper */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop Left Sidebar (>= 1024px) */}
        <aside
          className="hidden lg:flex flex-col border-r border-border p-6 bg-[#0E121B]"
          style={{ width: 260, flexShrink: 0 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold font-display text-lg">
              VF
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-text">Vista Forgy</h2>
              <p className="text-xs text-muted font-mono">VF-1.0 SPA</p>
            </div>
          </div>

          <nav aria-label="Desktop Navigation" className="flex flex-col gap-2 flex-1">
            <SidebarBtn icon={<Home size={18} />} label="Beranda" active={screen === 'home'} onClick={() => setScreen('home')} />
            <SidebarBtn icon={<Map size={18} />} label="Peta Skill" active={screen === 'map'} onClick={() => setScreen('map')} />
            <SidebarBtn icon={<Award size={18} />} label="Ujian Promosi" active={screen === 'exam'} onClick={() => setScreen('exam')} />
            <SidebarBtn icon={<BarChart2 size={18} />} label="Statistik" active={screen === 'stats'} onClick={() => setScreen('stats')} />
            <SidebarBtn icon={<Database size={18} />} label="Data & Backup" active={screen === 'data'} onClick={() => setScreen('data')} />
            <SidebarBtn icon={<Settings size={18} />} label="Pengaturan" active={screen === 'settings'} onClick={() => setScreen('settings')} />
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-6">
          {renderScreen()}
        </main>
      </div>

      {/* Mobile Bottom Tab Bar (< 1024px) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0E121B]/95 backdrop-blur-md border-t border-border flex justify-around items-center py-2"
        style={{ paddingBottom: 'calc(8px + env(safe-area-inset-bottom, 0px))' }}
      >
        <NavTab icon={<Home size={20} />} label="Beranda" active={screen === 'home'} onClick={() => setScreen('home')} />
        <NavTab icon={<Map size={20} />} label="Peta" active={screen === 'map'} onClick={() => setScreen('map')} />
        <NavTab icon={<Award size={20} />} label="Ujian" active={screen === 'exam'} onClick={() => setScreen('exam')} />
        <NavTab icon={<BarChart2 size={20} />} label="Statistik" active={screen === 'stats'} onClick={() => setScreen('stats')} />
        <NavTab icon={<Database size={20} />} label="Data" active={screen === 'data'} onClick={() => setScreen('data')} />
        <NavTab icon={<Settings size={20} />} label="Pengaturan" active={screen === 'settings'} onClick={() => setScreen('settings')} />
      </nav>
    </div>
  );
}

function SidebarBtn({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
        active ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'text-muted hover:text-text hover:bg-white/5'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function NavTab({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
        active ? 'text-amber-400' : 'text-muted'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
