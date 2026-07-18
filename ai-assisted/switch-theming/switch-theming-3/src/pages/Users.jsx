import { Plus, Mail, Phone, Shield } from 'lucide-react';

const users = [
  { id: 1, name: 'Kenny Estrella', email: 'kenny@snagzy.com', role: 'Admin', status: 'Active', avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1' },
  { id: 2, name: 'Sarah Chen', email: 'sarah@snagzy.com', role: 'Manager', status: 'Active', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1' },
  { id: 3, name: 'Marcus Johnson', email: 'marcus@snagzy.com', role: 'Staff', status: 'Active', avatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1' },
  { id: 4, name: 'Priya Patel', email: 'priya@snagzy.com', role: 'Staff', status: 'Inactive', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1' },
  { id: 5, name: 'David Kim', email: 'david@snagzy.com', role: 'Manager', status: 'Active', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1' },
];

export default function Users() {
  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Users</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Manage team members and permissions</p>
        </div>
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white"
          style={{ background: 'var(--accent)' }}
        >
          <Plus size={15} /> Invite User
        </button>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: 'var(--bg-badge)' }}>
              <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--text-secondary)' }}>User</th>
              <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--text-secondary)' }}>Email</th>
              <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--text-secondary)' }}>Role</th>
              <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--text-secondary)' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover" />
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded"
                    style={{ background: 'var(--tag-user-bg)', color: 'var(--tag-user-text)' }}>
                    <Shield size={11} />
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded"
                    style={{
                      background: u.status === 'Active' ? 'var(--green-bg)' : 'var(--red-bg)',
                      color: u.status === 'Active' ? 'var(--green)' : 'var(--red)',
                    }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: u.status === 'Active' ? 'var(--green)' : 'var(--red)' }} />
                    {u.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
