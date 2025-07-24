import { AuthProvider } from './context/AuthProvider';
import AppRoutes from './routers';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
