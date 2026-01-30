// UserMenu.tsx
interface User {
  username: string;
  is_staff: boolean;
}

interface UserMenuProps {
  user: User | null;
  onLoginSuccess: (userData: User) => void;
  onLogout: () => void;
  onAdminClick: () => void;
  onUploadClick: () => void;
  onMyUploadsClick: () => void;
}

export const UserMenu = ({
  user,
  onLoginSuccess,
  onLogout,
  onAdminClick,
  onUploadClick,
  onMyUploadsClick
}: UserMenuProps) => {

  // Mock Login: ADMIN
  const fakeLoginAdmin = () => {
    onLoginSuccess({ username: 'Admin', is_staff: true });
  };

  // Mock Login: USER
  const fakeLoginUser = () => {
    onLoginSuccess({ username: 'User', is_staff: false });
  };

  // LOGGED IN STATE
  if (user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span style={{ color: '#fff', fontWeight: '500' }}>Hi, {user.username}!</span>

        {/* My Uploads Link */}
        <button
          onClick={onMyUploadsClick}
          style={{
            background: 'none',
            border: 'none',
            color: '#aadaff',
            cursor: 'pointer',
            textDecoration: 'underline',
            fontSize: '0.9rem'
          }}
        >
          My Uploads
        </button>

        {/* Upload Button */}
        <button className="nav-btn-upload" onClick={onUploadClick}>
          Upload Meme
        </button>

        {/* Admin Button (Only if staff) */}
        {user.is_staff && (
          <button
            onClick={onAdminClick}
            title="Go to Admin Panel"
            style={{
              background: '#ff4757',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(255, 71, 87, 0.3)'
            }}
          >
            Admin
          </button>
        )}

        {/* LOGOUT ICON BUTTON - JUST THE ICON */}
        <button
          onClick={onLogout}
          title="Logout"
          style={{
            background: 'none',
            border: 'none',
            color: '#ccc',
            padding: '0',
            cursor: 'pointer',
            transition: 'color 0.2s',
            display: 'flex',
            alignItems: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ff4757';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#ccc';
          }}
        >
          <i className="bi bi-box-arrow-right" style={{ fontSize: '1.4rem' }}></i>
        </button>
      </div>
    );
  }

  // LOGGED OUT STATE (Variant 2: SHIFT+click = Admin test)
  return (
    <div>
      <button
        onClick={(e) => {
          if (e.shiftKey) fakeLoginAdmin();
          else fakeLoginUser();
        }}
        className="btn-login"
        title="Tip: SHIFT+click = Admin (test)"
      >
        Login
      </button>
    </div>
  );
};
