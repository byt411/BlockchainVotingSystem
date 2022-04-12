import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import PublishResults from "./pages/PublishResults";
import Results from "./pages/Results";
import Voting from "./pages/Voting";
import Verification from "./pages/Verification";
import Deploy from "./pages/Deploy";

export default function App() {
  return (
    <Router>
      <div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Routes>
          <Route path="/" element={<Voting />}></Route>
          <Route path="/results" element={<Results />}></Route>
          <Route path="/publishresults" element={<PublishResults />}></Route>
          <Route path="/verification" element={<Verification />}></Route>
          <Route path="/deploy" element={<Deploy />}></Route>
        </Routes>
      </div>
    </Router>
  );
}
