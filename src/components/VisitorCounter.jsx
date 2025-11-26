import { useState, useEffect } from 'react';
import './VisitorCounter.css';

function VisitorCounter() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function trackVisitor() {
      try {
        // Check if this visitor has already been counted in this session
        const hasVisited = sessionStorage.getItem('visitor_counted');

        if (!hasVisited) {
          // New visitor - increment count
          const response = await fetch('/api/visitors', {
            method: 'POST'
          });

          if (!response.ok) {
            throw new Error('Failed to update visitor count');
          }

          const data = await response.json();
          setCount(data.count);
          sessionStorage.setItem('visitor_counted', 'true');
        } else {
          // Returning visitor in same session - just get count
          const response = await fetch('/api/visitors');

          if (!response.ok) {
            throw new Error('Failed to fetch visitor count');
          }

          const data = await response.json();
          setCount(data.count);
        }
      } catch (err) {
        console.error('Visitor counter error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    trackVisitor();
  }, []);

  if (loading) {
    return (
      <div className="visitor-counter">
        <div className="visitor-count loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return null; // Silently fail - don't show error to users
  }

  return (
    <div className="visitor-counter">
      <div className="visitor-count">
        <span className="count-number">{count.toLocaleString()}</span>
        <span className="count-label">visitors celebrating David's legacy</span>
      </div>
    </div>
  );
}

export default VisitorCounter;
