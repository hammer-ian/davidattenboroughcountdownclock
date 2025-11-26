import { useState, useEffect } from 'react';
import './BirthdayWishes.css';

function BirthdayWishes() {
  const [wishes, setWishes] = useState([]);
  const [visitorName, setVisitorName] = useState('');
  const [theme, setTheme] = useState('');
  const [memory, setMemory] = useState('');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  // Load wishes on component mount
  useEffect(() => {
    fetchWishes();
  }, []);

  async function fetchWishes() {
    try {
      setLoading(true);
      const response = await fetch('/api/wishes');

      if (!response.ok) {
        throw new Error('Failed to fetch wishes');
      }

      const data = await response.json();
      setWishes(data.wishes);
    } catch (err) {
      console.error('Error fetching wishes:', err);
      setError('Unable to load birthday wishes');
    } finally {
      setLoading(false);
    }
  }

  async function generateWish(e) {
    e.preventDefault();
    setGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/wishes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          visitorName: visitorName.trim() || null,
          theme: theme || null,
          memory: memory.trim() || null
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate wish');
      }

      const data = await response.json();

      // Add new wish to the top of the list
      setWishes([data.wish, ...wishes]);

      // Clear the form
      setVisitorName('');
      setTheme('');
      setMemory('');
    } catch (err) {
      console.error('Error generating wish:', err);
      setError('Unable to generate wish. Please try again.');
    } finally {
      setGenerating(false);
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  return (
    <div className="birthday-wishes">
      <h2 className="wishes-title">Birthday Wishes for Sir David</h2>

      <div className="wish-generator">
        <p className="generator-intro">
          Generate a heartfelt AI-powered birthday wish celebrating David Attenborough's incredible legacy
        </p>

        <form onSubmit={generateWish} className="wish-form">
          <div className="form-group">
            <label htmlFor="theme-select" className="form-label">What do you love most about Sir David?</label>
            <select
              id="theme-select"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="theme-select"
              disabled={generating}
              required
            >
              <option value="">-- Choose a theme --</option>
              <option value="voice">His iconic voice and narration</option>
              <option value="documentaries">His groundbreaking documentaries</option>
              <option value="wildlife">His passion for wildlife</option>
              <option value="conservation">His conservation work</option>
              <option value="curiosity">His endless curiosity about nature</option>
              <option value="education">His ability to educate and inspire</option>
              <option value="wonder">The wonder he brings to viewers</option>
              <option value="dedication">His lifetime dedication to our planet</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="memory-input" className="form-label">Add a personal touch (optional)</label>
            <input
              id="memory-input"
              type="text"
              placeholder="e.g., 'watched Planet Earth with my kids' or 'inspired me to become a biologist'"
              value={memory}
              onChange={(e) => setMemory(e.target.value)}
              maxLength={80}
              className="name-input"
              disabled={generating}
            />
            <span className="input-hint">{memory.length}/80 characters</span>
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Your name (optional)"
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
              maxLength={100}
              className="name-input"
              disabled={generating}
            />
          </div>

          <button
            type="submit"
            disabled={generating}
            className="generate-button"
          >
            {generating ? (
              <>
                <span className="spinner"></span>
                Generating Wish...
              </>
            ) : (
              '✨ Generate Birthday Wish'
            )}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="wishes-list">
        <h3 className="list-title">
          {wishes.length} {wishes.length === 1 ? 'Wish' : 'Wishes'} Shared
        </h3>

        {loading && <div className="loading">Loading wishes...</div>}

        {!loading && wishes.length === 0 && (
          <p className="no-wishes">
            Be the first to share a birthday wish for Sir David!
          </p>
        )}

        <div className="wishes-grid">
          {wishes.map((wish) => (
            <div key={wish.id} className="wish-card">
              <p className="wish-message">{wish.message}</p>
              <div className="wish-meta">
                {wish.visitor_name && (
                  <span className="wish-author">— {wish.visitor_name}</span>
                )}
                <span className="wish-date">{formatDate(wish.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BirthdayWishes;
