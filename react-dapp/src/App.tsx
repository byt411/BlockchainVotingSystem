import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Results from "./Results";
import Voting from "./Voting";

export default function App() {
  return (
    <Router>
      <div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Routes>
          <Route path="/" element={<Voting />}></Route>
          <Route path="/results" element={<Results />}>
            {" "}
          </Route>
        </Routes>
      </div>
    </Router>
  );
}
