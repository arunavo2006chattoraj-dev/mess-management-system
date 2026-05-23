import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  RatingDistributionChart, MealRatingsTrendChart, HygieneQuantityProgressRings 
} from './AnalyticsCharts';
import { 
  TrendingUp, Users, Award, ChefHat, Edit3, ClipboardList, Check,
  ChevronRight, Calendar, Filter, MessageSquare, AlertCircle, Sparkles, Smile
} from 'lucide-react';

const CatererPortal = ({ activeTab, setIsSidebarOpen }) => {
  const { 
    menu, reviews, updateMenuMeal, currentUser, users 
  } = useContext(AppContext);

  // --- STUDENT DIRECTORY STATES ---
  const [searchTerm, setSearchTerm] = useState('');
  const [hostelFilter, setHostelFilter] = useState('All');

  // --- MENU MANAGEMENT STATES ---
  const [selectedDay, setSelectedDay] = useState('Monday');
  
  // Local edit states initialized with selectedDay's values
  const [breakfastItems, setBreakfastItems] = useState('');
  const [breakfastTime, setBreakfastTime] = useState('');
  const [lunchItems, setLunchItems] = useState('');
  const [lunchTime, setLunchTime] = useState('');
  const [snacksItems, setSnacksItems] = useState('');
  const [snacksTime, setSnacksTime] = useState('');
  const [dinnerItems, setDinnerItems] = useState('');
  const [dinnerTime, setDinnerTime] = useState('');

  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync edit states when selectedDay changes
  React.useEffect(() => {
    const dayMenu = menu[selectedDay] || {};
    setBreakfastItems(dayMenu.Breakfast?.items || '');
    setBreakfastTime(dayMenu.Breakfast?.time || '');
    setLunchItems(dayMenu.Lunch?.items || '');
    setLunchTime(dayMenu.Lunch?.time || '');
    setSnacksItems(dayMenu.Snacks?.items || '');
    setSnacksTime(dayMenu.Snacks?.time || '');
    setDinnerItems(dayMenu.Dinner?.items || '');
    setDinnerTime(dayMenu.Dinner?.time || '');
  }, [selectedDay, menu]);

  const handlePublishMenu = (e) => {
    e.preventDefault();
    updateMenuMeal(selectedDay, 'Breakfast', breakfastItems, breakfastTime);
    updateMenuMeal(selectedDay, 'Lunch', lunchItems, lunchTime);
    updateMenuMeal(selectedDay, 'Snacks', snacksItems, snacksTime);
    updateMenuMeal(selectedDay, 'Dinner', dinnerItems, dinnerTime);
    
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // --- ANALYTICS FILTERS STATES ---
  const [filterDay, setFilterDay] = useState('All');
  const [filterMeal, setFilterMeal] = useState('All');
  const [filterRating, setFilterRating] = useState('All');

  // Filter logic
  const filteredReviews = reviews.filter(r => {
    const matchesDay = filterDay === 'All' || r.day === filterDay;
    const matchesMeal = filterMeal === 'All' || r.mealType === filterMeal;
    
    let matchesRating = true;
    if (filterRating === 'High') matchesRating = r.rating >= 8;
    else if (filterRating === 'Mid') matchesRating = r.rating >= 5 && r.rating <= 7;
    else if (filterRating === 'Low') matchesRating = r.rating < 5;

    return matchesDay && matchesMeal && matchesRating;
  });

  // Calculate Metrics
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1) 
    : '0.0';

  const avgHygiene = totalReviews > 0
    ? (reviews.reduce((sum, r) => sum + (r.hygiene || 4), 0) / totalReviews).toFixed(1)
    : '0.0';

  const recentReviews = reviews.slice(0, 5);

  // Common Complaints and Requested Foods (dynamic extraction from reviews)
  const commonComplaints = reviews
    .filter(r => r.rating <= 6 && r.howToImprove)
    .map(r => r.howToImprove)
    .slice(0, 4);

  const requestedFoods = reviews
    .filter(r => r.rating >= 7 && r.ratherHave)
    .map(r => r.ratherHave)
    .slice(0, 4);

  // Default lists if not enough reviews have comments
  const displayComplaints = commonComplaints.length >= 2 
    ? commonComplaints 
    : ['Reduce oil in parathas', 'Watery dal seasoning', 'Plates cleanliness in rush hours', 'Hard rotis at dinner'];

  const displayRequests = requestedFoods.length >= 2 
    ? requestedFoods 
    : ['Paneer Butter Masala', 'Chole Bhature & Raita', 'Veg Manchurian with Fried Rice', 'Poha with Jalebis'];

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      
      {/* Mobile Top Header */}
      <header className="portal-header">
        <button className="mobile-hamburger" onClick={() => setIsSidebarOpen(true)}>
          <ChevronRight size={20} />
        </button>
        <div className="portal-title">
          <h1>Caterer Dashboard</h1>
          <p>Logged in: {currentUser?.fullName}</p>
        </div>
      </header>

      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Metrics Grid */}
          <div className="metrics-grid">
            <div className="metric-card glass-panel">
              <div className="metric-details">
                <h3>Total Audits</h3>
                <p>{totalReviews}</p>
              </div>
              <div className="metric-icon-box" style={{ background: 'var(--primary-glow)', color: 'var(--primary)' }}>
                <Users size={20} />
              </div>
            </div>

            <div className="metric-card glass-panel">
              <div className="metric-details">
                <h3>Average Score</h3>
                <p>{avgRating} <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/10</span></p>
              </div>
              <div className="metric-icon-box" style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--warning)' }}>
                <TrendingUp size={20} />
              </div>
            </div>

            <div className="metric-card glass-panel">
              <div className="metric-details">
                <h3>Hygiene Rating</h3>
                <p>{avgHygiene} <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/5.0</span></p>
              </div>
              <div className="metric-icon-box" style={{ background: 'var(--success-glow)', color: 'var(--success)' }}>
                <Award size={20} />
              </div>
            </div>

            <div className="metric-card glass-panel">
              <div className="metric-details">
                <h3>Kitchen Status</h3>
                <p style={{ color: 'var(--success)', fontSize: '20px', fontWeight: 800 }}>OPERATIONAL</p>
              </div>
              <div className="metric-icon-box" style={{ background: 'var(--success-glow)', color: 'var(--success)' }}>
                <ChefHat size={20} />
              </div>
            </div>
          </div>

          <div className="analytics-dashboard-grid">
            
            {/* Left side: Quick today's menu overview & complaints */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              
              {/* Today's Menu Review Card */}
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ClipboardList size={18} style={{ color: 'var(--primary)' }} />
                  Today's Seeding Menu
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {['Breakfast', 'Lunch', 'Snacks', 'Dinner'].map((meal) => {
                    // Quick check today
                    const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long' });
                    const todayMenu = menu[todayStr] || {};
                    return (
                      <div key={meal} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
                        <div>
                          <strong style={{ fontSize: '13px', color: 'var(--primary)' }}>{meal}</strong>
                          <p style={{ fontSize: '13px', fontWeight: 500, marginTop: '2px' }}>{todayMenu[meal]?.items || 'None'}</p>
                        </div>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{todayMenu[meal]?.time || 'N/A'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Complaints & Requests Cards */}
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={18} style={{ color: 'var(--danger)' }} />
                  Urgent Attention Items
                </h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {displayComplaints.slice(0, 3).map((comp, idx) => (
                    <li key={idx} style={{ display: 'flex', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <span style={{ color: 'var(--danger)', fontWeight: 700 }}>•</span>
                      {comp}
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Right side: Recent Feedbacks Stream */}
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, borderBottom: '1px solid var(--border-light)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={18} style={{ color: 'var(--primary)' }} />
                Recent Student Feedbacks
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '340px', overflowY: 'auto' }}>
                {recentReviews.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '12px', textAlign: 'center', padding: '20px' }}>No feedbacks logged yet.</p>
                ) : (
                  recentReviews.map((rev) => (
                    <div key={rev.id} style={{ padding: '10px', background: 'var(--bg-tertiary)', borderRadius: '8px', borderLeft: '3px solid var(--primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '10px' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '12px' }}>{rev.studentName} ({rev.hostelId})</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{rev.day} • {rev.mealType}</div>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', fontStyle: 'italic' }}>"{rev.comments || 'No comment text'}"</p>
                      </div>
                      <span className={`badge ${rev.rating >= 8 ? 'badge-success' : rev.rating >= 5 ? 'badge-primary' : 'badge-danger'}`} style={{ padding: '2px 8px', fontSize: '10px' }}>
                        {rev.rating}/10
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* MENU MANAGEMENT TAB */}
      {activeTab === 'menu-manager' && (
        <div>
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Calendar size={22} style={{ color: 'var(--primary)' }} />
                Menu Management Panel
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>Choose a day from the list and update the meal schedules instantly.</p>
            </div>
            
            {saveSuccess && (
              <div className="badge badge-success" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', animation: 'fadeIn 0.2s' }}>
                <Check size={16} /> Instant Updates Published!
              </div>
            )}
          </div>

          <div className="menu-editor-grid">
            
            {/* Days Selector */}
            <div className="days-selector-card glass-panel">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <button 
                  key={day}
                  className={`day-select-btn ${selectedDay === day ? 'active' : ''}`}
                  onClick={() => setSelectedDay(day)}
                >
                  {day}
                  <ChevronRight size={16} />
                </button>
              ))}
            </div>

            {/* Menu Fields Form */}
            <div className="glass-panel" style={{ padding: '30px' }}>
              <form onSubmit={handlePublishMenu}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', marginBottom: '20px', color: 'var(--primary)' }}>
                  Configure Menu: {selectedDay}
                </h3>

                <div className="meal-forms-list">
                  {/* Breakfast edit */}
                  <div className="meal-edit-row">
                    <strong style={{ fontSize: '14px' }}>Breakfast Menu</strong>
                    <div className="form-group">
                      <label style={{ fontSize: '11px' }}>Food Items</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={breakfastItems}
                        onChange={(e) => setBreakfastItems(e.target.value)}
                        style={{ paddingLeft: '12px' }}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ fontSize: '11px' }}>Service Hours</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={breakfastTime}
                        onChange={(e) => setBreakfastTime(e.target.value)}
                        style={{ paddingLeft: '12px' }}
                        required
                      />
                    </div>
                  </div>

                  {/* Lunch edit */}
                  <div className="meal-edit-row">
                    <strong style={{ fontSize: '14px' }}>Lunch Menu</strong>
                    <div className="form-group">
                      <label style={{ fontSize: '11px' }}>Food Items</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={lunchItems}
                        onChange={(e) => setLunchItems(e.target.value)}
                        style={{ paddingLeft: '12px' }}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ fontSize: '11px' }}>Service Hours</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={lunchTime}
                        onChange={(e) => setLunchTime(e.target.value)}
                        style={{ paddingLeft: '12px' }}
                        required
                      />
                    </div>
                  </div>

                  {/* Snacks edit */}
                  <div className="meal-edit-row">
                    <strong style={{ fontSize: '14px' }}>Snacks Menu</strong>
                    <div className="form-group">
                      <label style={{ fontSize: '11px' }}>Food Items</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={snacksItems}
                        onChange={(e) => setSnacksItems(e.target.value)}
                        style={{ paddingLeft: '12px' }}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ fontSize: '11px' }}>Service Hours</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={snacksTime}
                        onChange={(e) => setSnacksTime(e.target.value)}
                        style={{ paddingLeft: '12px' }}
                        required
                      />
                    </div>
                  </div>

                  {/* Dinner edit */}
                  <div className="meal-edit-row">
                    <strong style={{ fontSize: '14px' }}>Dinner Menu</strong>
                    <div className="form-group">
                      <label style={{ fontSize: '11px' }}>Food Items</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={dinnerItems}
                        onChange={(e) => setDinnerItems(e.target.value)}
                        style={{ paddingLeft: '12px' }}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ fontSize: '11px' }}>Service Hours</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={dinnerTime}
                        onChange={(e) => setDinnerTime(e.target.value)}
                        style={{ paddingLeft: '12px' }}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '25px' }}>
                  <button type="submit" className="btn btn-primary" style={{ padding: '12px 30px' }}>
                    Publish Menu Live
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* REVIEW ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Header & Filter Bar */}
          <div className="glass-panel" style={{ padding: '0px', overflow: 'hidden' }}>
            <div className="analytics-filters-bar">
              <span style={{ fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)' }}>
                <Filter size={16} /> Filters
              </span>

              {/* Day Filter */}
              <div className="filter-item">
                <label>Weekday</label>
                <select className="filter-select" value={filterDay} onChange={(e) => setFilterDay(e.target.value)}>
                  <option value="All">All Days</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
              </div>

              {/* Meal Filter */}
              <div className="filter-item">
                <label>Course Type</label>
                <select className="filter-select" value={filterMeal} onChange={(e) => setFilterMeal(e.target.value)}>
                  <option value="All">All Courses</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Dinner">Dinner</option>
                </select>
              </div>

              {/* Rating Filter */}
              <div className="filter-item">
                <label>Score Tier</label>
                <select className="filter-select" value={filterRating} onChange={(e) => setFilterRating(e.target.value)}>
                  <option value="All">All Scores</option>
                  <option value="High">Exceptional (8+)</option>
                  <option value="Mid">Moderate (5-7)</option>
                  <option value="Low">Needs Attention (&lt;5)</option>
                </select>
              </div>
            </div>
          </div>

          {/* SVG CHARTS SUITE (Dynamic based on filtered reviews) */}
          <div className="analytics-dashboard-grid">
            <RatingDistributionChart reviews={filteredReviews} />
            <MealRatingsTrendChart reviews={filteredReviews} />
          </div>

          <div className="analytics-dashboard-grid">
            <HygieneQuantityProgressRings reviews={filteredReviews} />

            {/* Most Requested items */}
            <div className="charts-wrapper glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <h3 className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} style={{ color: 'var(--success)' }} />
                Desired Menu Items
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>These foods were highly requested by students in reviews with high quality ratings.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '10px' }}>
                {displayRequests.slice(0, 4).map((food, idx) => (
                  <div key={idx} style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Smile size={16} />
                    {food}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Comprehensive reviews data sheet (Table) */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={18} style={{ color: 'var(--primary)' }} />
              Audit Trail: Logged Student Reviews ({filteredReviews.length} records)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {filteredReviews.length === 0 ? (
                <div className="empty-state">No audits match your active filters. Try broadening the search.</div>
              ) : (
                filteredReviews.map((rev) => (
                  <div key={rev.id} className="review-feed-card glass-panel" style={{ background: 'var(--bg-secondary)' }}>
                    
                    <div className="review-card-top">
                      <div className="review-student-info">
                        <span className="review-student-name">{rev.studentName} ({rev.hostelId})</span>
                        <span className="review-meal-meta">{rev.day} • {rev.mealType} • {new Date(rev.timestamp).toLocaleString()}</span>
                      </div>

                      <div className={`review-rating-badge ${
                        rev.rating >= 8 ? 'rating-high' : 
                        rev.rating >= 5 ? 'rating-mid' : 'rating-low'
                      }`}>
                        {rev.rating}
                      </div>
                    </div>

                    <div className="review-ratings-row">
                      <span className="review-pill">Taste Audit: {rev.taste || 'N/A'}/5</span>
                      <span className="review-pill">Hygiene: {rev.hygiene || 'N/A'}/5</span>
                      <span className="review-pill">Portion size: {rev.quantity || 'N/A'}/5</span>
                    </div>

                    {/* Detailed Questions */}
                    {(rev.ratherHave || rev.howToImprove) && (
                      <div className="review-detail-grid">
                        {rev.ratherHave && (
                          <div className="review-detail-item">
                            <span className="review-detail-label">Desired Alternative</span>
                            <span className="review-detail-val">{rev.ratherHave}</span>
                          </div>
                        )}
                        {rev.howToImprove && (
                          <div className="review-detail-item">
                            <span className="review-detail-label">Recommended Fix</span>
                            <span className="review-detail-val">{rev.howToImprove}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {rev.comments && (
                      <div className="review-comment">
                        "{rev.comments}"
                      </div>
                    )}

                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* STUDENT DIRECTORY TAB */}
      {activeTab === 'students' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', animation: 'slideUp 0.3s ease' }}>
          
          {/* Header & Search Bar */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
              <div>
                <h2 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Users size={22} style={{ color: 'var(--primary)' }} />
                  Student Portal Accounts Directory
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
                  Review registered student accounts, room allocations, portal statuses, and audit histories.
                </p>
              </div>
              <span className="badge badge-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>
                Total Accounts: {users ? users.filter(u => u.role === 'student').length : 0} Students
              </span>
            </div>

            {/* Filter Controls Row */}
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Search input */}
              <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search students by name or hostel ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '15px', height: '42px', width: '100%' }}
                />
              </div>

              {/* Block Filter Select */}
              <div style={{ minWidth: '160px' }}>
                <select
                  value={hostelFilter}
                  onChange={(e) => setHostelFilter(e.target.value)}
                  className="filter-select"
                  style={{ height: '42px', width: '100%', margin: 0, paddingLeft: '12px' }}
                >
                  <option value="All">All Hostel Blocks</option>
                  <option value="Hostel G">Hostel G (Girls)</option>
                  <option value="Hostel H">Hostel H (Boys)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Student Grid / List */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {(() => {
              const students = (users || []).filter(u => u.role === 'student');
              
              const filteredStudents = students.filter(student => {
                const matchesSearch = 
                  student.username?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  student.hostelOrEmpId?.toLowerCase().includes(searchTerm.toLowerCase());
                
                let matchesBlock = true;
                if (hostelFilter === 'Hostel G') matchesBlock = student.hostelOrEmpId?.toUpperCase().startsWith('G');
                if (hostelFilter === 'Hostel H') matchesBlock = student.hostelOrEmpId?.toUpperCase().startsWith('H');

                return matchesSearch && matchesBlock;
              });

              if (filteredStudents.length === 0) {
                return (
                  <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <AlertCircle size={36} style={{ marginBottom: '12px', color: 'var(--text-muted)' }} />
                    <p style={{ fontSize: '15px', fontWeight: 600 }}>No students found matching your filters</p>
                    <p style={{ fontSize: '12px', marginTop: '4px' }}>Try entering another search term or switching the block filter.</p>
                  </div>
                );
              }

              return filteredStudents.map((student, index) => {
                // Get review count
                const reviewCount = reviews.filter(r => r.studentName?.toLowerCase() === student.username?.toLowerCase()).length;
                const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'S';
                
                // Beautiful randomized gradient backgrounds for student avatars
                const gradientIndex = index % 5;
                const avatarGradients = [
                  'linear-gradient(135deg, #6366f1, #4f46e5)',
                  'linear-gradient(135deg, #10b981, #059669)',
                  'linear-gradient(135deg, #ec4899, #db2777)',
                  'linear-gradient(135deg, #f59e0b, #d97706)',
                  'linear-gradient(135deg, #8b5cf6, #7c3aed)'
                ];
                const avatarBg = avatarGradients[gradientIndex];

                return (
                  <div key={student.username} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '15px', position: 'relative', overflow: 'hidden' }}>
                    {/* Background visual highlight */}
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', background: 'var(--primary-glow)', borderRadius: '0 0 0 100%', opacity: 0.3 }}></div>

                    {/* Student Info Top */}
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '16px' }}>
                        {getInitials(student.username)}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>{student.username}</h4>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '4px' }}>
                          <span className="badge badge-success" style={{ padding: '2px 8px', fontSize: '10px', height: '18px' }}>
                            Active
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {student.hostelOrEmpId}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ borderBottom: '1px solid var(--border-light)', margin: '5px 0' }}></div>

                    {/* Telemetry/Details Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Registered Location</span>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                          {student.hostelOrEmpId?.startsWith('G') ? 'Girls Hostel G' : student.hostelOrEmpId?.startsWith('H') ? 'Boys Hostel H' : 'General Campus'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-end' }}>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Audits Logged</span>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MessageSquare size={13} /> {reviewCount} submissions
                        </span>
                      </div>
                    </div>

                    {/* Card Footer Detail */}
                    <div style={{ background: 'var(--bg-tertiary)', padding: '8px 12px', borderRadius: '8px', fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>System Account</span>
                      <span>Verified Student</span>
                    </div>

                  </div>
                );
              });
            })()}
          </div>

        </div>
      )}

    </div>
  );
};

export default CatererPortal;
