import { ImageUpload } from "./home";
import React from "react";
// import { Home } from "./home.js";
import Hero from "../home/hero/Hero";
import Back from "../common/back/Back";

function DiseaseDetector() {
  return (
    <>
    <Back title= 'Plant Disease Detection'/>
    <ImageUpload />
    <br />
    </>
  );
  // return <Home />;
}

export default DiseaseDetector;
