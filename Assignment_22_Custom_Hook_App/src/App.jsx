import React from 'react';
import useFetch from './hooks/useFetch';
import { motion } from 'framer-motion';

const UserCard = ({ user }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="glass-card"
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
      <span className="badge">User #{user.id}</span>
      <span style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>@{user.username}</span>
    </div>
    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{user.name}</h3>
    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{user.email}</p>
    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '1rem', fontSize: '0.9rem' }}>
      <p>🏢 {user.company.name}</p>
      <p>📍 {user.address.city}</p>
    </div>
  </motion.div>
);

const PostCard = ({ post }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card"
  >
    <span className="badge" style={{ background: 'rgba(217, 70, 239, 0.1)', color: 'var(--accent-secondary)' }}>Post #{post.id}</span>
    <h3 style={{ fontSize: '1.3rem', margin: '1rem 0', textTransform: 'capitalize' }}>{post.title}</h3>
    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{post.body}</p>
  </motion.div>
);

function App() {
  const { data: users, loading: usersLoading, error: usersError } = useFetch('https://jsonplaceholder.typicode.com/users');
  const { data: posts, loading: postsLoading, error: postsError } = useFetch('https://jsonplaceholder.typicode.com/posts?_limit=8');

  return (
    <div className="container">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="title-gradient"
      >
        Custom Hook Engine
      </motion.h1>

      <section style={{ marginBottom: '6rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          👥 Users <span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-secondary)' }}>({users?.length || 0})</span>
        </h2>
        
        {usersLoading && <div style={{ textAlign: 'center', padding: '4rem' }}><span className="loader"></span></div>}
        {usersError && <div className="error-msg">Error loading users: {usersError}</div>}
        
        <div className="grid">
          {users?.map(user => <UserCard key={user.id} user={user} />)}
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          📝 Latest Posts <span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-secondary)' }}>({posts?.length || 0})</span>
        </h2>
        
        {postsLoading && <div style={{ textAlign: 'center', padding: '4rem' }}><span className="loader"></span></div>}
        {postsError && <div className="error-msg">Error loading posts: {postsError}</div>}
        
        <div className="grid">
          {posts?.map(post => <PostCard key={post.id} post={post} />)}
        </div>
      </section>
    </div>
  );
}

export default App;
