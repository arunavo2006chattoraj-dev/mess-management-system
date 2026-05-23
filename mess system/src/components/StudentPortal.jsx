import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Clock, Calendar, User, MessageSquare, Heart, Send, CheckCircle2,
  AlertCircle, ChevronRight, MessageCircle, Info, Star, PlusCircle, Volume2, X
} from 'lucide-react';

const StudentPortal = ({ activeTab, setIsSidebarOpen }) => {
  const { 
    menu, reviews, addReview, discussions, addDiscussion, addReply, 
    likeDiscussion, polls, voteInPoll, currentUser 
  } = useContext(AppContext);

  // Time States
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const currentDayName = currentTime.toLocaleDateString('en-US', { weekday: 'long' });

  // Today's Menu
  const todaysMenu = menu[currentDayName] || {};

  // Feedback Modal State
  const [selectedMeal, setSelectedMeal] = useState(null); // 'Breakfast', 'Lunch', etc.
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  
  // Feedback Form State
  const [overallRating, setOverallRating] = useState(7);
  const [tasteRating, setTasteRating] = useState(4);
  const [hygieneRating, setHygieneRating] = useState(4);
  const [quantityRating, setQuantityRating] = useState(4);
  const [ratherHave, setRatherHave] = useState('');
  const [howToImprove, setHowToImprove] = useState('');
  const [comments, setComments] = useState('');

  // Check if student already reviewed today's meals
  const hasReviewedMeal = (mealType) => {
    const todayStr = new Date().toDateString();
    return reviews.some(r => 
      r.studentName === currentUser?.fullName && 
      r.mealType === mealType && 
      r.day === currentDayName &&
      new Date(r.timestamp).toDateString() === todayStr
    );
  };

  const handleMealCheckboxChange = (mealType) => {
    if (hasReviewedMeal(mealType)) return; // Already reviewed
    setSelectedMeal(mealType);
    // Reset form
    setOverallRating(7);
    setTasteRating(4);
    setHygieneRating(4);
    setQuantityRating(4);
    setRatherHave('');
    setHowToImprove('');
    setComments('');
    setShowFeedbackModal(true);
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!selectedMeal) return;

    addReview({
      day: currentDayName,
      mealType: selectedMeal,
      rating: overallRating,
      taste: Number(tasteRating),
      hygiene: Number(hygieneRating),
      quantity: Number(quantityRating),
      ratherHave,
      howToImprove,
      comments
    });

    setShowFeedbackModal(false);
    setSelectedMeal(null);
  };

  // Discussion Form State
  const [discTitle, setDiscTitle] = useState('');
  const [discContent, setDiscContent] = useState('');
  const [discTag, setDiscTag] = useState('General');
  const [activeCommentsDiscId, setActiveCommentsDiscId] = useState(null);
  const [replyText, setReplyText] = useState({});

  const handleCreateDiscussion = (e) => {
    e.preventDefault();
    if (!discTitle.trim() || !discContent.trim()) return;
    addDiscussion(discTitle, discContent, discTag);
    setDiscTitle('');
    setDiscContent('');
    setDiscTag('General');
  };

  const handleReplySubmit = (e, discId) => {
    e.preventDefault();
    const text = replyText[discId];
    if (!text || !text.trim()) return;
    addReply(discId, text);
    setReplyText(prev => ({ ...prev, [discId]: '' }));
  };

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      {/* Mobile Top Header */}
      <header className="portal-header">
        <button className="mobile-hamburger" onClick={() => setIsSidebarOpen(true)}>
          <ChevronRight size={20} />
        </button>
        <div className="portal-title">
          <h1>Student Hub</h1>
          <p>Logged in: {currentUser?.fullName}</p>
        </div>
      </header>

      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Welcome Info Board */}
          <div className="glass-panel" style={{ padding: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', background: 'linear-gradient(135deg, var(--primary-glow) 0%, transparent 100%)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="badge badge-primary">
                <Clock size={12} /> Live Kitchen Clock
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Welcome, {currentUser?.username}!</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Help us improve! Please mark the checkbox below once you complete a meal to submit quality feedback.</p>
            </div>
            
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--primary)' }}>
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {formatDate(currentTime)}
              </div>
            </div>
          </div>

          {/* Today's Meals Section */}
          <div>
            <div className="meals-section-header">
              <h2 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={22} style={{ color: 'var(--success)' }} />
                Today's Menu ({currentDayName})
              </h2>
              <span className="badge badge-success">Kitchen Operational</span>
            </div>

            <div className="meals-grid">
              {['Breakfast', 'Lunch', 'Snacks', 'Dinner'].map((mealType) => {
                const mealInfo = todaysMenu[mealType] || { items: 'No Menu Seeding', time: 'N/A' };
                const reviewed = hasReviewedMeal(mealType);
                
                return (
                  <div key={mealType} className="meal-card glass-panel" style={{ borderLeft: reviewed ? '4px solid var(--success)' : '1px solid var(--glass-border)' }}>
                    <div className="meal-card-header">
                      <div className="meal-title-group">
                        <span className="meal-icon">
                          <Star size={16} />
                        </span>
                        <h3>{mealType}</h3>
                      </div>
                      {reviewed && <span className="badge badge-success">Reviewed</span>}
                    </div>

                    <div className="meal-time">
                      <Clock size={13} /> {mealInfo.time}
                    </div>

                    <p className="meal-items">{mealInfo.items}</p>

                    <div className="meal-feedback-prompt">
                      <label className="checkbox-custom">
                        <input 
                          type="checkbox" 
                          checked={reviewed}
                          onChange={() => handleMealCheckboxChange(mealType)}
                          disabled={reviewed}
                        />
                        <span className="checkbox-checkmark"></span>
                        <span style={{ fontSize: '12px', fontWeight: 600 }}>
                          {reviewed ? 'Meal feedback submitted' : 'Did you have this meal today?'}
                        </span>
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TIMETABLE TAB */}
      {activeTab === 'weekly' && (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Calendar size={22} style={{ color: 'var(--primary)' }} />
              Weekly Mess Timetable
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>Click or edit items in the Caterer Portal to change the display dynamically.</p>
          </div>

          <div className="timetable-grid">
            {Object.keys(menu).map((dayName) => {
              const dayMeals = menu[dayName];
              const isToday = dayName === currentDayName;
              return (
                <div 
                  key={dayName} 
                  className="timetable-day-card glass-panel" 
                  style={{ border: isToday ? '2px solid var(--primary)' : '1px solid var(--glass-border)', boxShadow: isToday ? 'var(--card-shadow-hover)' : 'var(--card-shadow)' }}
                >
                  <div className="timetable-day-title">
                    {dayName}
                    {isToday && <span className="badge badge-primary">Today</span>}
                  </div>

                  <div className="timetable-meals-list">
                    {['Breakfast', 'Lunch', 'Snacks', 'Dinner'].map((meal) => (
                      <div key={meal} className="timetable-row">
                        <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                          {meal} ({dayMeals[meal]?.time})
                        </span>
                        <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginTop: '2px' }}>
                          {dayMeals[meal]?.items}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DISCUSSION & POLL TAB */}
      {activeTab === 'forum' && (
        <div className="forum-layout">
          
          {/* Forum Left Side (Topics stream) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Create Topic Card */}
            <div className="create-disc-card glass-panel">
              <div className="create-disc-header">
                <PlusCircle size={18} style={{ color: 'var(--primary)' }} />
                Initiate New Discussion Topic
              </div>

              <form className="create-disc-form" onSubmit={handleCreateDiscussion}>
                <div className="create-disc-grid">
                  <div className="form-group">
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Topic Title (e.g., Quality of Paneer on Fridays)"
                      value={discTitle}
                      onChange={(e) => setDiscTitle(e.target.value)}
                      style={{ paddingLeft: '15px' }}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <select 
                      className="form-control"
                      value={discTag}
                      onChange={(e) => setDiscTag(e.target.value)}
                      style={{ paddingLeft: '15px' }}
                    >
                      <option value="General">General Category</option>
                      <option value="Menu Suggestion">Menu Suggestion</option>
                      <option value="Hygiene Complaint">Hygiene Complaint</option>
                      <option value="Announcement">Announcement</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <textarea 
                    className="textarea-custom"
                    placeholder="Elaborate your request or details so that caterers and other students can participate..."
                    value={discContent}
                    onChange={(e) => setDiscContent(e.target.value)}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: 'fit-content', marginLeft: 'auto' }}>
                  Post Discussion Thread
                </button>
              </form>
            </div>

            {/* Discussions Stream */}
            <div className="forum-threads">
              {discussions.map((disc) => {
                const hasLiked = currentUser && disc.likedBy.includes(currentUser.username);
                return (
                  <div key={disc.id} className="forum-thread-card glass-panel">
                    
                    <div className="thread-header">
                      <div className="thread-author-meta">
                        <div className="thread-author-avatar">
                          {disc.author.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="thread-author-name">{disc.author}</span>
                          {disc.role === 'caterer' && <span className="badge badge-primary" style={{ fontSize: '9px', padding: '2px 6px', marginLeft: '6px' }}>Caterer Admin</span>}
                          <div className="thread-time">{new Date(disc.timestamp).toLocaleString()}</div>
                        </div>
                      </div>
                      
                      <span className={`badge ${
                        disc.tag === 'Announcement' ? 'badge-primary' : 
                        disc.tag === 'Hygiene Complaint' ? 'badge-danger' : 'badge-success'
                      }`}>
                        {disc.tag === 'Announcement' && <Volume2 size={11} style={{ marginRight: '4px' }} />}
                        {disc.tag}
                      </span>
                    </div>

                    <h3 className="thread-title">{disc.title}</h3>
                    <p className="thread-content">{disc.content}</p>

                    <div className="thread-footer">
                      <button 
                        className={`thread-action-btn ${hasLiked ? 'liked' : ''}`}
                        onClick={() => likeDiscussion(disc.id)}
                      >
                        <Heart size={16} fill={hasLiked ? 'var(--danger)' : 'transparent'} /> 
                        <span>{disc.likes} Likes</span>
                      </button>

                      <button 
                        className="thread-action-btn"
                        onClick={() => setActiveCommentsDiscId(activeCommentsDiscId === disc.id ? null : disc.id)}
                      >
                        <MessageCircle size={16} />
                        <span>{disc.replies.length} Comments</span>
                      </button>
                    </div>

                    {/* Replies Collapsible section */}
                    {activeCommentsDiscId === disc.id && (
                      <div className="replies-section">
                        <div className="replies-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {disc.replies.length === 0 ? (
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '10px' }}>
                              No comments yet. Start the conversation!
                            </p>
                          ) : (
                            disc.replies.map((reply) => (
                              <div key={reply.id} className="reply-item">
                                <div className="reply-header">
                                  <span className="reply-author">
                                    {reply.author} 
                                    {reply.role === 'caterer' && <span style={{ color: 'var(--primary)', fontSize: '9px', fontWeight: 700 }}> (Staff)</span>}
                                  </span>
                                  <span className="reply-time">{new Date(reply.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </div>
                                <p className="reply-content">{reply.content}</p>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Reply Form */}
                        <form className="reply-form" onSubmit={(e) => handleReplySubmit(e, disc.id)}>
                          <input 
                            type="text" 
                            className="reply-input" 
                            placeholder="Write a helpful response..."
                            value={replyText[disc.id] || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setReplyText(prev => ({ ...prev, [disc.id]: val }));
                            }}
                            required
                          />
                          <button type="submit" className="btn btn-primary" style={{ padding: '8px 12px' }}>
                            <Send size={14} />
                          </button>
                        </form>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>

          </div>

          {/* Forum Right Side (Menu Poll Card) */}
          <div className="forum-sidebar">
            {polls.map((poll) => {
              const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);
              const alreadyVoted = currentUser && poll.voters.includes(currentUser.id);

              return (
                <div key={poll.id} className="poll-card glass-panel">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700, fontSize: '15px' }}>
                    <Info size={18} />
                    Menu Ballot
                  </div>
                  
                  <h3 style={{ fontSize: '16px', fontWeight: 800 }}>{poll.question}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {alreadyVoted ? 'You have recorded your vote. Live tallies are detailed below.' : 'Cast your vote below to influence next Sunday’s kitchen selections.'}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                    {poll.options.map((opt) => {
                      const votePercent = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                      return (
                        <div key={opt.id} className="poll-option-row">
                          <button 
                            className="poll-option-btn" 
                            disabled={alreadyVoted}
                            onClick={() => voteInPoll(poll.id, opt.id)}
                            style={{ cursor: alreadyVoted ? 'default' : 'pointer' }}
                          >
                            {/* Animated Background Progress bar */}
                            <div 
                              className="poll-option-progress" 
                              style={{ width: `${votePercent}%` }}
                            ></div>
                            
                            <div className="poll-option-content">
                              <span style={{ maxWidth: '80%' }}>{opt.text}</span>
                              <span className="poll-option-percentage">{votePercent}%</span>
                            </div>
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="poll-footer">
                    Total responses: {totalVotes} voters
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* FEEDBACK SYSTEM MODAL OVERLAY */}
      {showFeedbackModal && selectedMeal && (
        <div className="modal-overlay">
          <div className="modal-card glass-panel">
            
            <div className="modal-header">
              <h2>Feedback: {selectedMeal}</h2>
              <button className="modal-close-btn" onClick={() => setShowFeedbackModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Slider 1-10 */}
              <div className="rating-slider-group">
                <div className="rating-header">
                  <span>Rate Taste & Experience</span>
                  <span>{overallRating}/10</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  className="slider-input"
                  value={overallRating}
                  onChange={(e) => setOverallRating(Number(e.target.value))}
                />
                <div className="slider-ticks">
                  <span>1 (Disaster)</span>
                  <span>5 (Average)</span>
                  <span>10 (Excellent)</span>
                </div>
              </div>

              {/* Sub-Ratings Dropdowns */}
              <div className="sub-ratings-grid">
                <div className="sub-rating-item">
                  <label>Taste Audit</label>
                  <select 
                    className="sub-rating-select"
                    value={tasteRating}
                    onChange={(e) => setTasteRating(e.target.value)}
                  >
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Good</option>
                    <option value="3">3 - Average</option>
                    <option value="2">2 - Poor</option>
                    <option value="1">1 - Terrible</option>
                  </select>
                </div>

                <div className="sub-rating-item">
                  <label>Hygiene Standard</label>
                  <select 
                    className="sub-rating-select"
                    value={hygieneRating}
                    onChange={(e) => setHygieneRating(e.target.value)}
                  >
                    <option value="5">5 - Spotless</option>
                    <option value="4">4 - Clean</option>
                    <option value="3">3 - Acceptable</option>
                    <option value="2">2 - Greasy</option>
                    <option value="1">1 - Dirty</option>
                  </select>
                </div>

                <div className="sub-rating-item">
                  <label>Portion Quantity</label>
                  <select 
                    className="sub-rating-select"
                    value={quantityRating}
                    onChange={(e) => setQuantityRating(e.target.value)}
                  >
                    <option value="5">5 - Abundant</option>
                    <option value="4">4 - Sufficient</option>
                    <option value="3">3 - Moderate</option>
                    <option value="2">2 - Insufficient</option>
                    <option value="1">1 - Starying</option>
                  </select>
                </div>
              </div>

              {/* Question 1 */}
              <div className="form-group">
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  What would you rather have today instead?
                </label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="e.g. Masala Dosa, French Fries, Chicken Biryani"
                  value={ratherHave}
                  onChange={(e) => setRatherHave(e.target.value)}
                  style={{ paddingLeft: '15px' }}
                />
              </div>

              {/* Question 2 */}
              <div className="form-group">
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  How can we improve this meal in the future?
                </label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="e.g. Reduce oil, Serve food hotter, Less spicy curry"
                  value={howToImprove}
                  onChange={(e) => setHowToImprove(e.target.value)}
                  style={{ paddingLeft: '15px' }}
                />
              </div>

              {/* Comments Textbox */}
              <div className="form-group">
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Additional thoughts or comments?
                </label>
                <textarea 
                  className="textarea-custom"
                  placeholder="Write details or compliments for the kitchen team..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowFeedbackModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  Submit Meal Review
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default StudentPortal;
