import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';
import Landing from "./components/Landing";

import 'bootstrap/dist/css/bootstrap.css';
require('bootstrap');
require('popper.js');



function App() {
  return (
    <Router>
      <div className="App">
        <Route exact path="/" component={Landing} />  
      </div>
    </Router>
    
  );
}

export default App;
