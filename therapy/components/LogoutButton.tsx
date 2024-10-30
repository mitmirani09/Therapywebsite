// app/components/LogoutButton.tsx
import useUserStore from '../../store/useUserStore';

const LogoutButton = () => {
  const logout = useUserStore((state) => state.logout);

  return <button onClick={logout}>Logout</button>;
};

export default LogoutButton;
