'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function PublicProfile() {
  const params = useParams();
  const username = params.username;
  
  const [user, setUser] = useState(null);
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Fetch all users from internal API (avoids CORS)
        const response = await fetch('/api/users');
        const users = await response.json();
        
        // Find user by matching name (convert to slug format)
        const foundUser = Array.isArray(users) ? users.find(u => {
          const slug = u.name?.toLowerCase().replace(/\s+/g, '-');
          return slug === username.toLowerCase();
        }) : null;
        
        if (foundUser) {
          setUser(foundUser);
          // Fetch sermons from internal API
          const sermonsResponse = await fetch('/api/sermons');
          const allSermons = await sermonsResponse.json();
          setSermons(Array.isArray(allSermons) ? allSermons.filter(s => s.user_id === foundUser.id) : []);
        } else {
          setError('Profile not found');
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile');
      }
      setLoading(false);
    };
    
    loadProfile();
  }, [username]);

  const getYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: '#1a1a1a',
      color: '#F7F3E9',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    header: {
      background: 'linear-gradient(135deg, #535E4A, #3d4638)',
      padding: '60px 20px',
      textAlign: 'center',
    },
    avatar: {
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      background: '#1a1a1a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '48px',
      fontWeight: '600',
      margin: '0 auto 20px',
    },
    name: {
      fontFamily: "'Bebas Neue', sans-serif",
      fontSize: '36px',
      letterSpacing: '2px',
      marginBottom: '8px',
    },
    tagline: {
      fontSize: '16px',
      opacity: 0.8,
      fontStyle: 'italic',
    },
    content: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '40px 20px',
    },
    section: {
      marginBottom: '40px',
    },
    sectionTitle: {
      fontFamily: "'Bebas Neue', sans-serif",
      fontSize: '24px',
      letterSpacing: '1px',
      marginBottom: '20px',
      borderBottom: '2px solid #535E4A',
      paddingBottom: '10px',
    },
    bio: {
      lineHeight: '1.8',
      color: 'rgba(247,243,233,0.8)',
    },
    info: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
    },
    infoItem: {
      background: 'rgba(247,243,233,0.05)',
      padding: '16px',
      borderRadius: '8px',
    },
    infoLabel: {
      fontSize: '12px',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      opacity: 0.5,
      marginBottom: '4px',
    },
    socialLinks: {
      display: 'flex',
      gap: '16px',
      flexWrap: 'wrap',
    },
    socialLink: {
      background: 'rgba(247,243,233,0.1)',
      padding: '12px 20px',
      borderRadius: '8px',
      color: '#F7F3E9',
      textDecoration: 'none',
      fontSize: '14px',
      transition: 'background 0.2s',
    },
    sermonGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
    },
    sermonCard: {
      background: 'rgba(247,243,233,0.05)',
      borderRadius: '12px',
      overflow: 'hidden',
    },
    sermonInfo: {
      padding: '16px',
    },
    bookButton: {
      display: 'inline-block',
      background: '#535E4A',
      color: '#F7F3E9',
      padding: '16px 32px',
      borderRadius: '8px',
      textDecoration: 'none',
      fontFamily: "'Bebas Neue', sans-serif",
      fontSize: '18px',
      letterSpacing: '1px',
      marginTop: '20px',
    },
    loading: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontSize: '18px',
    },
  };

  if (loading) {
    return <div style={styles.container}><div style={styles.loading}>Loading profile...</div></div>;
  }

  if (error || !user) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '48px', marginBottom: '16px' }}>Profile Not Found</h1>
            <p style={{ opacity: 0.6 }}>The speaker profile you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.avatar}>{user.name?.charAt(0) || 'S'}</div>
        <h1 style={styles.name}>{user.name}</h1>
        {user.tagline && <p style={styles.tagline}>{user.tagline}</p>}
        {user.location && <p style={{ marginTop: '12px', opacity: 0.7 }}>{user.location}</p>}
      </div>

      <div style={styles.content}>
        {user.bio && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>ABOUT</h2>
            <p style={styles.bio}>{user.bio}</p>
          </div>
        )}

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>INFO</h2>
          <div style={styles.info}>
            {user.year_started && user.year_started > 0 && (
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Preaching Since</div>
                <div>{user.year_started}</div>
              </div>
            )}
            {user.location && (
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Based In</div>
                <div>{user.location}</div>
              </div>
            )}
          </div>
        </div>

        {(user.youtube || user.instagram || user.twitter || user.facebook || user.linkedin || user.website) && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>CONNECT</h2>
            <div style={styles.socialLinks}>
              {user.youtube && <a href={user.youtube.startsWith('http') ? user.youtube : `https://youtube.com/${user.youtube}`} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>YouTube</a>}
              {user.instagram && <a href={user.instagram.startsWith('http') ? user.instagram : `https://instagram.com/${user.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>Instagram</a>}
              {user.twitter && <a href={user.twitter.startsWith('http') ? user.twitter : `https://twitter.com/${user.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>X / Twitter</a>}
              {user.facebook && <a href={user.facebook.startsWith('http') ? user.facebook : `https://facebook.com/${user.facebook}`} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>Facebook</a>}
              {user.linkedin && <a href={user.linkedin.startsWith('http') ? user.linkedin : `https://linkedin.com/in/${user.linkedin}`} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>LinkedIn</a>}
              {user.website && <a href={user.website.startsWith('http') ? user.website : `https://${user.website}`} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>Website</a>}
            </div>
          </div>
        )}

        {sermons.length > 0 && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>SERMONS</h2>
            <div style={styles.sermonGrid}>
              {sermons.map((sermon, i) => {
                const videoId = getYouTubeId(sermon.url);
                return (
                  <div key={sermon.id || i} style={styles.sermonCard}>
                    {videoId && (
                      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                        <iframe
                          src={`https://www.youtube.com/embed/${videoId}`}
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}
                    <div style={styles.sermonInfo}>
                      <h3 style={{ fontWeight: '500', marginBottom: '4px' }}>{sermon.title}</h3>
                      {sermon.date && <p style={{ fontSize: '12px', opacity: 0.5 }}>{new Date(sermon.date).toLocaleDateString()}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <a href={`/?booking=${user.id}`} style={styles.bookButton}>BOOK {user.name?.split(' ')[0]?.toUpperCase()}</a>
        </div>
      </div>
    </div>
  );
}
