import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CropInputForm from './components/CropInputForm';
import Dashboard from './components/Dashboard';
import Irrigation from './components/Irrigation';
import PricePrediction from './components/Price';

function App() {
  return (
    <Router> {/* Wrap the entire Routes inside Router */}
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/CropInputForm" element={<CropInputForm />} />
          <Route path="/Irrigation" element={<Irrigation />} />
          <Route path="/Price" element={<PricePrediction />} />
          {/* Add other routes here */}
          {/* <Route path="/blogs" element={<Blogs />} />
          <Route path="/exercises" element={<Exercise />} />
          <Route path="/podcast" element={<PodcastComponent />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/badges" element={<Badges />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
