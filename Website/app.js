// base Url 
const baseUrl = "https://api.openweathermap.org/data/2.5/weather?zip=";

// Personal API Key for OpenWeatherMap API
//&units=metric to display the temperature in celsius not kelvin 
const apiKey = ",&appid=f0f2adef85e0d7c10542ba6a577d91ad&units=metric";

const server = "http://127.0.0.1:8000";

// create a date dynamically with js
let date = new Date();
let newDate = date.toDateString();

// showing the error who write wrong zip code
const error = document.getElementById("error");

// Add Event listener to add function
document.getElementById("generate").addEventListener("click", generateData);

/* Function called by event listener */
// generateData fuction
function generateData() {
    //get user input values 
    const zipcode = document.getElementById("zip").value;
    const feelings = document.getElementById("feelings").value;

    weatherData(zipcode).then((data) => {
        if (data) {
            const {
            main: { temp },
            name: city,
            weather: [{ description }],
            } = data;
    
            const info = {
            newDate,
            city,
            temp: Math.round(temp), // to get integer number
            description,
            feelings,
            };
    
            postData(server + "/add", info);

        console.log(postData);
        // post request data
        postData(server + "/add", info)
        updateUI();
        }
    })
};



/* Function to GET Web API Data*/
const weatherData = async (zipcode) => {
    try {
        const res = await fetch(baseUrl + zipcode + apiKey);
        const data = await res.json();
        if (data.code != 200) {
            //display error message
            error.innerHTML = data.message;

            setTimeout(()=> {
                error.innerHTML = ""
            }, 1500);
        }
        return data;
    }
    catch (error) {
        //appropriately handle error
        console.log("error" ,error);
    }
};

/* Function to POST data */
const postData = async (url = "", info = {}) => {
    const res = await fetch(url, {
        method: "POST", 
        headers: {
            "content-type": "application/json",
        },
    // body data type must match "Content-Type" header        
        body: JSON.stringify(info),
    });

    try {
        const newData = await res.json();
        console.log(newData);
        return newData;
    }
    catch (error) {
        console.log("error" ,error);
    }
};


/* Function to GET Project Data */
// ubdate Ui
const updateUI = async () => {
    const res = await fetch(server + "/all");
    try {
        const allData = await res.json();
        console.log(allData);

        // Write updated data to DOM elements
        document.getElementById("date").innerHTML = `${allData.newDate}`;
        document.getElementById("temp").innerHTML = `${allData.temp} °C`;
        document.getElementById("city").innerHTML =  allData.city ;
        document.getElementById("description").innerHTML = allData.description;
        document.getElementById("content").innerHTML = `I feel ${allData.feelings}`;
    }
    catch (error) {
        console.log("error" ,error);
    }
};