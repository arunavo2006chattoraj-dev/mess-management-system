import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { GraduationCap, ChefHat, ArrowRight } from 'lucide-react';

const LandingPage = ({ onSelectRole }) => {
  const { theme } = useContext(AppContext);

  return (
    <div className="landing-container">
      <div className="landing-header">
        <h1>Co-Mess Manager</h1>
        <p>A smart, digital hub designed for college hostels. Access menus, submit instant meal reviews, update items in real time, and view detailed analytics in one unified dashboard.</p>
      </div>

      <div className="landing-cards">
        <div 
          className="landing-card glass-panel"
          onClick={() => onSelectRole('student')}
        >
          <div className="landing-card-icon">
            <GraduationCap size={40} />
          </div>
          <h2>Student Portal</h2>
          <p>
            View today's meals, check menu timetables, rate food quality, give suggestions, and participate in discussion meetings & voting polls.
          </p>
          <div className="landing-card-action">
            Enter Portal <ArrowRight size={16} />
          </div>
        </div>

        <div 
          className="landing-card glass-panel"
          onClick={() => onSelectRole('caterer')}
        >
          <div className="landing-card-icon">
            <ChefHat size={40} />
          </div>
          <h2>Caterer Portal</h2>
          <p>
            Manage weekly menus, update timings, read student feedback, monitor hygiene standards, and track metrics with visual analytics charts.
          </p>
          <div className="landing-card-action">
            Enter Portal <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
