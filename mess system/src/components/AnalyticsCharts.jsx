import React from 'react';

// 1. Rating Distribution SVG Bar Chart
export const RatingDistributionChart = ({ reviews }) => {
  // Categorize ratings
  const counts = { exceptional: 0, good: 0, average: 0, poor: 0 };
  
  reviews.forEach(r => {
    if (r.rating >= 9) counts.exceptional++;
    else if (r.rating >= 7) counts.good++;
    else if (r.rating >= 5) counts.average++;
    else counts.poor++;
  });

  const data = [
    { label: 'Exceptional (9-10)', count: counts.exceptional, color: 'var(--success)' },
    { label: 'Good (7-8)', count: counts.good, color: 'var(--primary)' },
    { label: 'Average (5-6)', count: counts.average, color: 'var(--warning)' },
    { label: 'Poor (1-4)', count: counts.poor, color: 'var(--danger)' },
  ];

  const maxCount = Math.max(...data.map(d => d.count), 1);
  const chartHeight = 160;
  const barHeight = 22;
  const gap = 16;

  return (
    <div className="charts-wrapper glass-panel">
      <h3 className="chart-title">Rating Breakdown</h3>
      <svg viewBox="0 0 400 160" className="svg-chart">
        {data.map((item, index) => {
          const y = index * (barHeight + gap) + 10;
          const barWidth = maxCount > 0 ? (item.count / maxCount) * 230 : 0;
          
          return (
            <g key={item.label} className="chart-bar-group">
              {/* Label */}
              <text 
                x="5" 
                y={y + 15} 
                className="chart-text" 
                style={{ fontWeight: 600, fontSize: '11px', fill: 'var(--text-primary)' }}
              >
                {item.label.split(' ')[0]}
              </text>
              
              {/* Track */}
              <rect 
                x="110" 
                y={y} 
                width="240" 
                height={barHeight} 
                rx="6" 
                fill="var(--bg-tertiary)" 
              />
              
              {/* Filled Bar */}
              <rect 
                x="110" 
                y={y} 
                width={barWidth} 
                height={barHeight} 
                rx="6" 
                fill={item.color}
                style={{ transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
              />
              
              {/* Value Count */}
              <text 
                x={120 + barWidth} 
                y={y + 15} 
                className="chart-text" 
                style={{ fontWeight: 700, fill: item.color }}
              >
                {item.count} {item.count === 1 ? 'review' : 'reviews'}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// 2. Average Meal Trends Line Chart
export const MealRatingsTrendChart = ({ reviews }) => {
  // Group ratings by meal type
  const mealSums = { Breakfast: 0, Lunch: 0, Snacks: 0, Dinner: 0 };
  const mealCounts = { Breakfast: 0, Lunch: 0, Snacks: 0, Dinner: 0 };

  reviews.forEach(r => {
    if (mealSums[r.mealType] !== undefined) {
      mealSums[r.mealType] += r.rating;
      mealCounts[r.mealType]++;
    }
  });

  const categories = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];
  const data = categories.map((meal) => {
    const avg = mealCounts[meal] > 0 ? (mealSums[meal] / mealCounts[meal]).toFixed(1) : 0;
    return { name: meal, value: parseFloat(avg) };
  });

  // SVG dimensions
  const width = 450;
  const height = 180;
  const padding = 35;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Grid coordinates helper (maps value 0-10 to Y, index to X)
  const getX = (index) => padding + (index / (data.length - 1)) * chartWidth;
  const getY = (val) => padding + chartHeight - (val / 10) * chartHeight;

  // Generate SVG Path
  const points = data.map((d, i) => `${getX(i)},${getY(d.value)}`).join(' ');
  const linePath = `M ${points}`;
  
  // Area closed path for gradient fill
  const areaPath = data.length > 0 
    ? `${linePath} L ${getX(data.length - 1)},${padding + chartHeight} L ${getX(0)},${padding + chartHeight} Z`
    : '';

  return (
    <div className="charts-wrapper glass-panel">
      <h3 className="chart-title">Average Ratings by Meal Course</h3>
      <svg viewBox={`0 0 ${width} ${height}`} className="svg-chart">
        <defs>
          <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Y Axis Gridlines (0, 2.5, 5.0, 7.5, 10) */}
        {[0, 2.5, 5, 7.5, 10].map((tick) => {
          const y = getY(tick);
          return (
            <g key={tick}>
              <line 
                x1={padding} 
                y1={y} 
                x2={width - padding} 
                y2={y} 
                className="chart-gridline" 
              />
              <text 
                x={padding - 10} 
                y={y + 3} 
                textAnchor="end" 
                className="chart-text"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* Area Fill */}
        {data.length > 0 && (
          <path d={areaPath} fill="url(#area-gradient)" style={{ transition: 'all 0.5s ease' }} />
        )}

        {/* Trend Line */}
        {data.length > 0 && (
          <polyline 
            points={points} 
            className="chart-line" 
            style={{ transition: 'all 0.5s ease' }}
          />
        )}

        {/* Data Circles & Text Labels */}
        {data.map((d, i) => {
          const cx = getX(i);
          const cy = getY(d.value);
          return (
            <g key={d.name}>
              {/* Dot */}
              <circle 
                cx={cx} 
                cy={cy} 
                r="5" 
                fill="var(--bg-secondary)" 
                stroke="var(--primary)" 
                strokeWidth="2" 
              />
              {/* Score label above dot */}
              <text 
                x={cx} 
                y={cy - 10} 
                textAnchor="middle" 
                className="chart-text" 
                style={{ fontWeight: 700, fill: 'var(--primary)' }}
              >
                {d.value > 0 ? d.value : 'N/A'}
              </text>
              {/* X Axis Label */}
              <text 
                x={cx} 
                y={padding + chartHeight + 20} 
                textAnchor="middle" 
                className="chart-text" 
                style={{ fontWeight: 600, fill: 'var(--text-primary)' }}
              >
                {d.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// 3. Hygiene, Taste, and Quantity Radial Progress Indicators
export const HygieneQuantityProgressRings = ({ reviews }) => {
  // Calculate averages (scores 1-5)
  let sumTaste = 0, sumHygiene = 0, sumQuantity = 0;
  let validCount = 0;

  reviews.forEach(r => {
    if (r.taste && r.hygiene && r.quantity) {
      sumTaste += r.taste;
      sumHygiene += r.hygiene;
      sumQuantity += r.quantity;
      validCount++;
    }
  });

  const avgTaste = validCount > 0 ? (sumTaste / validCount) : 4.0;
  const avgHygiene = validCount > 0 ? (sumHygiene / validCount) : 4.2;
  const avgQuantity = validCount > 0 ? (sumQuantity / validCount) : 4.1;

  // Convert 1-5 to percentage
  const tastePct = (avgTaste / 5) * 100;
  const hygienePct = (avgHygiene / 5) * 100;
  const quantityPct = (avgQuantity / 5) * 100;

  // Ring geometry properties
  const radius = 35;
  const circumference = 2 * Math.PI * radius;

  const renderRing = (label, percentage, ratingScore, color) => {
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="progress-ring-item">
        <svg width="90" height="90" className="progress-ring-svg">
          {/* Track Circle */}
          <circle 
            className="progress-ring-circle-bg"
            cx="45" 
            cy="45" 
            r={radius} 
          />
          {/* Filled Circle */}
          <circle 
            className="progress-ring-circle"
            cx="45" 
            cy="45" 
            r={radius} 
            stroke={color}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
          />
          {/* Text Center */}
          <text 
            x="45" 
            y="50" 
            textAnchor="middle" 
            className="progress-ring-text"
            style={{ transform: 'rotate(90deg)', transformOrigin: '45px 45px' }}
          >
            {ratingScore.toFixed(1)}
          </text>
        </svg>
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</span>
      </div>
    );
  };

  return (
    <div className="charts-wrapper glass-panel">
      <h3 className="chart-title">Cuisine Quality Audits</h3>
      <div className="progress-ring-container">
        {renderRing('Taste Rating', tastePct, avgTaste, 'var(--primary)')}
        {renderRing('Hygiene Standards', hygienePct, avgHygiene, 'var(--success)')}
        {renderRing('Portion Quantity', quantityPct, avgQuantity, 'var(--warning)')}
      </div>
    </div>
  );
};
