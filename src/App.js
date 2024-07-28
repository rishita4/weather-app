import React, { useEffect, useState } from 'react';
import WeatherDisplay from './components/WeatherDisplay';
import './App.css';


function App() {
  const [threshold, setthreshold] = useState(35)

  useEffect(() => {

    // On page reload or App startup it check if any value exists in local storage
    // If yes then it sets the value in threshold input field else the default value (35) gets set
    if(localStorage.getItem("threshold")&&localStorage.getItem("threshold")!==null){
      setthreshold(localStorage.getItem("threshold"))
    }

  }, [])
  


  return (
    
    <div className="App">
      <WeatherDisplay threshold={threshold} setthreshold={setthreshold}/>
    </div>
  );
}

export default App;
