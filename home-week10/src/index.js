import axios from "../node_modules/axios";

// form fields
const form = document.querySelector(".form-data");
// results
const errors = document.querySelector(".errors");
const loading = document.querySelector(".loading");
const results = document.querySelector(".result-container");


const tmiApiKey = 'input apiKey'; // API 키

const displayTMI = async () => {
  try {
    const response = await axios.get(`https://api.api-ninjas.com/v1/facts`, {
      headers: {
        'X-Api-Key': tmiApiKey,
        'Content-Type': 'application/json'
      }
    });
    
    // 받은 데이터를 결과 창에 출력하기
    const data = response.data;
    if (data && data.length > 0) {
      // 첫 번째 결과를 출력
      results.querySelector(
        ".TMI"
      ).textContent = `${data[0].fact}`;
    } else {
      // 만약 데이터가 없으면 에러 메시지 표시
      errors.style.display = 'block';
      errors.innerHTML = 'No data found';
    }
    
  } catch (error) {
    console.error('Error: ', error.response?.data || error.message);
    errors.style.display = 'block';
    errors.innerHTML = 'An error occurred while fetching data';
  }
};


function handleSubmit(e) {
  e.preventDefault();
  console.log("TTMI");
  displayTMI();
}

form.addEventListener("submit", (e) => handleSubmit(e));
