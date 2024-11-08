import axios from "../node_modules/axios";

// form fields
const form = document.querySelector(".form-data");
const region1 = document.querySelector(".region-name1");
const region2 = document.querySelector(".region-name2");
const region3 = document.querySelector(".region-name3");
const apiKey = document.querySelector(".api-key");
// results
const errors = document.querySelector(".errors");
const loading = document.querySelector(".loading");
const results1 = document.querySelector(".result-container1");
const results2 = document.querySelector(".result-container2");
const results3 = document.querySelector(".result-container3");
const usage = document.querySelector(".carbon-usage");
const fossilfuel = document.querySelector(".fossil-fuel");
const myregion = document.querySelector(".my-region");
const clearBtn = document.querySelector(".clear-btn");

const calculateColor = async (value) => {
  let co2Scale = [0, 150, 600, 750, 800];
  let colors = ["#2AA364", "#F5EB4D", "#9E4229", "#381D02", "#381D02"];
  let closestNum = co2Scale.sort((a, b) => {
    return Math.abs(a - value) - Math.abs(b - value);
  })[0];
  console.log(value + " is closest to " + closestNum);
  let num = (element) => element > closestNum;
  let scaleIndex = co2Scale.findIndex(num);
  let closestColor = colors[scaleIndex];
  console.log(scaleIndex, closestColor);
  chrome.runtime.sendMessage({
    action: "updateIcon",
    value: { color: closestColor },
  });
};

const displayCarbonUsage = async (apiKey, region, resultContainer) => {
  try {
    await axios
      .get("https://api.co2signal.com/v1/latest", {
        params: {
          countryCode: region,
        },
        headers: {
          //please get your own token from CO2Signal https://www.co2signal.com/
          "auth-token": apiKey,
        },
      })
      .then((response) => {
        let CO2 = Math.floor(response.data.data.carbonIntensity);
        let fossilFuelPercentage =
          response.data.data.fossilFuelPercentage.toFixed(2);
        calculateColor(CO2);
        loading.style.display = "none";
        form.style.display = "none";
        resultContainer.querySelector(
          ".my-region"
        ).textContent = `Region: ${region}`;
        resultContainer.querySelector(
          ".carbon-usage"
        ).textContent = `CO2 Intensity: ${CO2} grams`;
        resultContainer.querySelector(
          ".fossil-fuel"
        ).textContent = `Fossil Fuel Usage: ${fossilFuelPercentage}%`;
        resultContainer.style.display = "block";
      });
  } catch (error) {
    console.log(error);
    loading.style.display = "none";
    results1.style.display = "none";
    results2.style.display = "none";
    results3.style.display = "none";
    errors.textContent =
      "Sorry, we have no data for the region you have requested.";
  }
};

function setUpUser(apiKey, regionName, resultContainer) {
  localStorage.setItem("apiKey", apiKey);
  localStorage.setItem("regionName", regionName);
  loading.style.display = "block";
  errors.textContent = "";
  clearBtn.style.display = "block";
  displayCarbonUsage(apiKey, regionName, resultContainer);
}

function handleSubmit(e) {
  e.preventDefault();
  setUpUser(apiKey.value, region1.value, results1);
  setUpUser(apiKey.value, region2.value, results2);
  setUpUser(apiKey.value, region3.value, results3);
}

function init() {
  const storedApiKey = localStorage.getItem("apiKey");
  const storedRegion = localStorage.getItem("regionName");
  //set icon to be generic green
  chrome.runtime.sendMessage({
    action: "updateIcon",
    value: {
      color: "green",
    },
  });
  //todo
  if (storedApiKey === null || storedRegion === null) {
    form.style.display = "block";
    results1.style.display = "none";
    results2.style.display = "none";
    results3.style.display = "none";
    loading.style.display = "none";
    clearBtn.style.display = "none";
    errors.textContent = "";
  } else {
    displayCarbonUsage(storedApiKey, storedRegion);
    results1.style.display = "none";
    results2.style.display = "none";
    results3.style.display = "none";
    form.style.display = "none";
    clearBtn.style.display = "block";
  }
}

function reset(e) {
  e.preventDefault();
  localStorage.removeItem("regionName1");
  localStorage.removeItem("regionName2");
  localStorage.removeItem("regionName3");
  init();
}

form.addEventListener("submit", (e) => handleSubmit(e));
clearBtn.addEventListener("click", (e) => reset(e));
init();
