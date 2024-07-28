export async function getCurrentWeather(lat,long){

    const url = `https://api.openweathermap.org/data/3.0/onecall?units=metric&lat=${lat}&lon=${long}&appid=68f3d72141d593f1587c10eae9e3f2fb`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

            
      const timestamp = data.current.dt;
      const humanReadableTime = new Date(timestamp * 1000).toLocaleString();
      data.current.dt = humanReadableTime
      
      data.current.sunrise = new Date(data.current.sunrise * 1000).toLocaleTimeString();
      data.current.sunset = new Date(data.current.sunset * 1000).toLocaleTimeString();

      return data;
    } catch (error) {
      
      console.error('There was a problem with the fetch operation:', error.message);
    }

  }


  export async function getAreaName(lat,long){
    const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${long}&format=json&apiKey=52c294f77e46464582133452bd15493e`

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
           
      return data;
    } catch (error) {
      
      console.error('There was a problem with the fetch operation:', error.message);
    }
  }


