import React, { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Home, Calendar, MessageSquare, Menu, X, LogOut, Sun, Moon, Bell,
  ChefHat, ClipboardList, BarChart3, BellOff, Users
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const { 
    isBackendConnected, currentUser, logout, theme, toggleTheme, notifications, 
    markNotificationsAsRead, clearNotifications 
  } = useContext(AppContext);

  const [showNotifDrawer, setShowNotifDrawer] = useState(false);
  const notifRef = useRef(null);

  // Filter notifications for active user role
  const userRole = currentUser?.role;
  const filteredNotifications = notifications.filter(n => n.recipient === userRole);
  const unreadCount = filteredNotifications.filter(n => !n.read).length;

  useEffect(() => {
    // Close notification drawer when clicking outside
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifDrawer(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotifClick = () => {
    setShowNotifDrawer(!showNotifDrawer);
    if (!showNotifDrawer && unreadCount > 0) {
      markNotificationsAsRead(userRole);
    }
  };

  const handleClearNotif = (e) => {
    e.stopPropagation();
    clearNotifications(userRole);
  };

  // Select navigation tabs based on user role
  const menuItems = userRole === 'student' 
    ? [
        { id: 'dashboard', label: 'Student Dashboard', icon: Home },
        { id: 'weekly', label: 'Weekly Timetable', icon: Calendar },
        { id: 'forum', label: 'Discussion Forum', icon: MessageSquare }
      ]
    : [
        { id: 'dashboard', label: 'Overview Dashboard', icon: Home },
        { id: 'menu-manager', label: 'Menu Management', icon: ClipboardList },
        { id: 'analytics', label: 'Review Analytics', icon: BarChart3 },
        { id: 'students', label: 'Student Directory', icon: Users }
      ];

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div>
          <div className="sidebar-header">
            <div>
              <div className="sidebar-logo">
                <span className="sidebar-logo-icon">
                  <ChefHat size={20} />
                </span>
                Co-Mess Hub
              </div>
              <div className={`db-status-badge ${isBackendConnected ? 'connected' : 'offline'}`} title={isBackendConnected ? 'Connected to MongoDB Cloud Server' : 'Operating in offline local mock state'}>
                <span className="status-dot"></span>
                {isBackendConnected ? 'Cloud Online' : 'Local Fallback'}
              </div>
            </div>
            <button className="close-sidebar-btn" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <ul className="sidebar-menu">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <div 
                    className={`sidebar-link ${activeTab === item.id ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsOpen(false); // Close sidebar on mobile select
                    }}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">
              {getInitials(currentUser?.fullName)}
            </div>
            <div className="user-info">
              <span className="user-name">{currentUser?.fullName}</span>
              <span className="user-id">{currentUser?.id}</span>
            </div>
          </div>

          <div className="sidebar-actions">
            {/* Theme Toggle */}
            <button 
              className="theme-toggle" 
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notifications Toggle */}
            <div className="notif-wrapper" style={{ position: 'relative' }} ref={notifRef}>
              <button 
                className="notif-badge-container" 
                onClick={handleNotifClick}
                title="Notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && <span className="notif-count">{unreadCount}</span>}
              </button>

              {/* Notification Drawer */}
              {showNotifDrawer && (
                <div className="notif-drawer glass-panel">
                  <div className="notif-drawer-header">
                    <h3>Recent Updates</h3>
                    {filteredNotifications.length > 0 && (
                      <button className="notif-clear-btn" onClick={handleClearNotif}>
                        Clear All
                      </button>
                    )}
                  </div>
                  
                  <div className="notif-list">
                    {filteredNotifications.length === 0 ? (
                      <div className="empty-state" style={{ padding: '20px 0' }}>
                        <BellOff size={28} />
                        <span>No new notifications</span>
                      </div>
                    ) : (
                      filteredNotifications.map((notif) => (
                        <div key={notif.id} className={`notif-item ${notif.read ? 'read' : ''}`}>
                          <p>{notif.text}</p>
                          <div className="notif-item-time">{notif.time}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Logout Toggle */}
            <button 
              className="theme-toggle" 
              onClick={logout}
              title="Logout Session"
              style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}
            >
              <LogOut size={18} style={{ color: 'var(--danger)' }} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
