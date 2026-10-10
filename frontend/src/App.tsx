import { useCallback, useEffect, useMemo, useState } from 'react'

type UserLogin = { id: number; username: string; email: string }
type LoadState = 'loading' | 'ready' | 'error'

function parseLogins(body: string): UserLogin[] {
  return body.split(/\r?\n/).slice(1).flatMap((line) => {
    const match = line.match(/^ID:\s*(\d+)\s*\|\s*Username:\s*(.*?)\s*\|\s*Email:\s*(.+)$/)
    if (!match) return []
    return [{ id: Number(match[1]), username: match[2], email: match[3] }]
  })
}

function initials(username: string) {
  return username.trim().split(/[\s._-]+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('') || '?'
}

function App() {
  const [users, setUsers] = useState<UserLogin[]>([])
  const [state, setState] = useState<LoadState>('loading')
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const loadUsers = useCallback(async () => {
    setState('loading')
    setError('')
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL ?? ''
      const response = await fetch(`${apiBase}/user-logins`, { headers: { Accept: 'text/plain' } })
      if (!response.ok) throw new Error(`The server responded with ${response.status}.`)
      const body = await response.text()
      setUsers(parseLogins(body))
      setLastUpdated(new Date())
      setState('ready')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not load user records.')
      setState('error')
    }
  }, [])

  useEffect(() => { void loadUsers() }, [loadUsers])

  const filteredUsers = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return users
    return users.filter((user) => `${user.id} ${user.username} ${user.email}`.toLowerCase().includes(normalized))
  }, [query, users])

  const updatedLabel = lastUpdated
    ? `Updated at ${lastUpdated.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
    : 'Waiting for data'

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#home" aria-label="Northstar home">
          <span className="brand-mark"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3.5 19.2 12.8 28.5 16l-9.3 3.2L16 28.5l-3.2-9.3L3.5 16l9.3-3.2L16 3.5Z" fill="currentColor"/><circle cx="16" cy="16" r="2.4" fill="#fff"/></svg></span>
          <span>northstar<span className="brand-period">.</span></span>
        </a>
        <div className="nav-label">WORKSPACE</div>
        <nav className="nav-list" aria-label="Main navigation">
          <a className="nav-item" href="#overview"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/></svg>Overview</a>
          <a className="nav-item active" href="#user-logins" aria-current="page"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3.5"/><path d="M3 20v-1.5a6 6 0 0 1 12 0V20M16 4.8a3.5 3.5 0 0 1 0 6.5M18 14a5.5 5.5 0 0 1 3 5v1"/></svg>User logins<span className="nav-count">{users.length}</span></a>
        </nav>
        <div className="sidebar-bottom">
          <div className="workspace-card"><span className="workspace-dot"/><div><strong>Workspace</strong><span>Personal account</span></div><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 8 3 3 3-3"/></svg></div>
          <div className="profile"><div className="profile-avatar">S</div><div className="profile-copy"><strong>Siddhuja</strong><span>Administrator</span></div><button className="more-button" aria-label="More profile options">···</button></div>
        </div>
      </aside>

      <main className="main-content" id="user-logins">
        <header className="topbar"><div className="breadcrumb"><span>Workspace</span><span className="crumb-slash">/</span><strong>User logins</strong></div><div className="topbar-right"><span className="system-status"><span/>All systems normal</span><button className="icon-button" aria-label="Notifications"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg><i/></button><div className="top-avatar">S</div></div></header>

        <div className="page-wrap">
          <section className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line"/>DIRECTORY</div><h1>User logins</h1><p className="subtitle">A clear view of the people in your workspace.</p></div><button className="refresh-button" onClick={() => void loadUsers()} disabled={state === 'loading'}><svg className={state === 'loading' ? 'spinning' : ''} viewBox="0 0 20 20" aria-hidden="true"><path d="M16.5 8A6.7 6.7 0 0 0 4.7 5.5L3 7.2M3 3.5v3.8h3.8M3.5 12a6.7 6.7 0 0 0 11.8 2.5l1.7-1.7m0 3.7v-3.8h-3.8"/></svg>Refresh</button></section>

          <section className="stats-grid" aria-label="Login summary">
            <article className="stat-card"><div className="stat-top"><span>Total users</span><span className="stat-icon purple"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3.2"/><path d="M3.5 20v-1.3a5.5 5.5 0 0 1 11 0V20M16 5a3.2 3.2 0 0 1 0 6M17.5 14a5 5 0 0 1 3 4.7V20"/></svg></span></div><div className="stat-value">{state === 'error' ? '—' : users.length.toLocaleString()}</div><div className="stat-note"><span className="status-dot"/>Registered accounts</div></article>
            <article className="stat-card"><div className="stat-top"><span>Directory status</span><span className="stat-icon green"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg></span></div><div className="stat-value status-value">{state === 'error' ? 'Offline' : state === 'loading' ? 'Syncing' : 'Connected'}</div><div className="stat-note">{state === 'error' ? 'Unable to reach the API' : 'Live connection to your API'}</div></article>
            <article className="stat-card updated-card"><div className="stat-top"><span>Last refreshed</span><span className="stat-icon blue"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/></svg></span></div><div className="stat-value updated-value">{lastUpdated ? lastUpdated.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : '—'}</div><div className="stat-note">{updatedLabel}</div></article>
          </section>

          <section className="directory-card" aria-labelledby="directory-title"><div className="directory-header"><div className="directory-title-wrap"><div className="directory-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3.2"/><path d="M3.5 20v-1.3a5.5 5.5 0 0 1 11 0V20M16 5a3.2 3.2 0 0 1 0 6M17.5 14a5 5 0 0 1 3 4.7V20"/></svg></div><div><h2 id="directory-title">All users <span className="total-pill">{users.length}</span></h2><p>Manage and review workspace accounts</p></div></div><label className="search-box"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.8" cy="8.8" r="5.8"/><path d="m13 13 4 4"/></svg><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search users..." aria-label="Search users"/><kbd>⌘ K</kbd></label></div>

            <div className="table-wrap"><table><thead><tr><th>USER</th><th>EMAIL ADDRESS</th><th>USER ID</th><th>STATUS</th></tr></thead><tbody>
              {state === 'loading' && users.length === 0 && <tr><td colSpan={4}><div className="message-state"><span className="loader"/>Loading user records…</div></td></tr>}
              {state === 'error' && <tr><td colSpan={4}><div className="message-state error-state"><span className="error-mark">!</span><div><strong>Couldn’t load the directory</strong><span>{error} Check that the Spring Boot API is running, then try again.</span><button onClick={() => void loadUsers()}>Try again</button></div></div></td></tr>}
              {state === 'ready' && filteredUsers.map((user, index) => <tr key={user.id}><td><div className="user-cell"><div className={`user-avatar avatar-${index % 5}`}>{initials(user.username)}</div><span className="username">{user.username}</span></div></td><td><a className="email-link" href={`mailto:${user.email}`}>{user.email}</a></td><td><span className="id-chip">#{String(user.id).padStart(4, '0')}</span></td><td><span className="active-status"><span/>Active</span></td></tr>)}
              {state === 'ready' && filteredUsers.length === 0 && <tr><td colSpan={4}><div className="message-state empty-state">{users.length ? 'No users match your search.' : 'No user records found.'}</div></td></tr>}
            </tbody></table></div>
            <footer className="table-footer"><span>Showing <strong>{filteredUsers.length ? 1 : 0}–{filteredUsers.length}</strong> of <strong>{filteredUsers.length}</strong> {filteredUsers.length === 1 ? 'user' : 'users'}</span><span className="footer-updated"><span/> {updatedLabel}</span></footer>
          </section>
          <footer className="page-footer"><span>© 2025 Northstar workspace</span><span><a href="#help">Help center</a><i/>Made for your team</span></footer>
        </div>
      </main>
    </div>
  )
}

export default App
