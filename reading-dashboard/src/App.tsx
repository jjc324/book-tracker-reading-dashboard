import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/UI';
import Dashboard from './pages/Dashboard';
import BookLibrary from './pages/BookLibrary';
import BookDetail from './pages/BookDetail';
import Analytics from './pages/Analytics';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/books" element={<BookLibrary />} />
          <Route path="/books/:bookId" element={<BookDetail />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
