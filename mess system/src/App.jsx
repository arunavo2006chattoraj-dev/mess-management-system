import React, { useState, useContext, useEffect } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import Sidebar from './components/Sidebar';
import StudentPortal from './components/StudentPortal';
import CatererPortal from './components/CatererPortal';

function DashboardLayout() {
  const { currentUser, selectedPortal, setSelectedPortal } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Reset active tab to dashboard when portal changes
  useEffect(() => {
    setActiveTab('dashboard');
  }, [selectedPortal]);

  if (!selectedPortal) {
    return <LandingPage onSelectRole={setSelectedPortal} />;
  }

  if (!currentUser) {
    return (
      <Auth 
        role={selectedPortal} 
        onBack={() => setSelectedPortal(null)} 
      />
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Responsive Sidebar component */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />
      
      {/* Main dashboard viewport */}
      <main className="main-content">
        {currentUser.role === 'student' ? (
          <StudentPortal 
            activeTab={activeTab} 
            setIsSidebarOpen={setIsSidebarOpen} 
          />
        ) : (
          <CatererPortal 
            activeTab={activeTab} 
            setIsSidebarOpen={setIsSidebarOpen} 
          />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <DashboardLayout />
    </AppProvider>
  );
}

export default App;
