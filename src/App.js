import "./App.css";
import Header from "./components/common/header/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./components/about/About";
import CourseHome from "./components/allcourses/CourseHome";
import Team from "./components/team/Team";
import Pricing from "./components/pricing/Pricing";
import Blog from "./components/blog/Blog";
import Contact from "./components/contact/Contact";
import Footer from "./components/common/footer/Footer";
import Home from "./components/home/Home";
import Govscheme from "./components/govscheme/Apps";
import ProductionCostCalculator from "./components/costpredictor/App"
import DiseaseDetector from "./components/plantdiseasedetection/App";
import CropInputForm from "./components/ntpip/components/CropInputForm";
import Irrigation from "./components/ntpip/components/Irrigation";
import PricePrediction from "./components/ntpip/components/Price";
import Dashboard from "./components/ntpip/components/Dashboard";
import ResponsePage from "./components/plantdiseasedetection/ResponsePage";
// import Blogpost from "./components/blogpost/Blog";
import Cropsuggests from "./components/cropsuggest/Cropsuggest";
 

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<CourseHome />} />
          <Route path="/team" element={<Team />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/journal" element={<Blog />} />
          <Route path="/govscheme" element={<Govscheme />} />
          <Route path="/costpredict" element={<ProductionCostCalculator />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pdd" element={<DiseaseDetector />} />
          <Route path="/CropInputForm" element={<CropInputForm />} />
          <Route path="/irrigation" element={<Irrigation />} />
          <Route path="/price" element={<PricePrediction />} />
          <Route path="/explore" element={<Dashboard />} />
          <Route path="/response" element={<ResponsePage />} />
          <Route path="/crop" element={<Cropsuggests />} />
          {/* <Route path="/blogpost" element={<Blogpost />} /> */}
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
