const quotes = [
  "When you have eliminated the impossible, whatever remains, however improbable, must be the truth.",
  "There is nothing more deceptive than an obvious fact.",
  "I ought to know by this time that when a fact appears to be opposed to a long train of deductions it invariably proves to be capable of bearing some other interpretation.",
  "I never make exceptions. An exception disproves the rule.",
  "What one man can invent another can discover.",
  "Nothing clears up a case so much as stating it to another person.",
  "Education never ends, Watson. It is a series of lessons, with the greatest for the last.",
];

let words = [];
let wordIndex = 0;
let startTime = Date.now();

const quoteElement = document.getElementById("quote");
const messageElement = document.getElementById("message");
const typedValueElement = document.getElementById("typed-value");
const startButton = document.getElementById("start");

document.getElementById("start").addEventListener("click", () => {
  const quoteIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[quoteIndex];
  words = quote.split(" ");
  wordIndex = 0;
  const spanWords = words.map(function (word) {
    return `<span>${word} </span>`;
  });
  quoteElement.innerHTML = spanWords.join("");
  quoteElement.childNodes[0].className = "highlight";
  messageElement.innerText = "";
  typedValueElement.value = "";
  typedValueElement.focus();
  startTime = new Date().getTime();
  typedValueElement.disabled = false;
  startButton.disabled = true;
});

let isTyping = null;
typedValueElement.addEventListener("input", () => {
  const currentWord = words[wordIndex];
  const typedValue = typedValueElement.value;

  if (isTyping !== null) {
    clearTimeout(isTyping);
    typedValueElement.classList.remove("animated");
    isTyping = null;
    setTimeout(() => {
      typedValueElement.classList.add("animated");
    }, 10);
  } else {
    typedValueElement.classList.add("animated");
  }

  isTyping = setTimeout(() => {
    typedValueElement.classList.remove("animated");
    isTyping = null;
  }, 500);

  if (typedValue === currentWord && wordIndex === words.length - 1) {
    const elapsedTime = new Date().getTime() - startTime;
    const message = `CONGRATULATIONS! You finished in ${
      elapsedTime / 1000
    } seconds.`;
    messageElement.innerText = message;
    typedValueElement.disabled = true;
    startButton.disabled = false;
    showResultModal(elapsedTime / 1000);
    typedValueElement.classList.remove("error");
  } else if (typedValue.endsWith(" ") && typedValue.trim() === currentWord) {
    //
    typedValueElement.value = "";
    wordIndex++;
    for (const wordElement of quoteElement.childNodes) {
      wordElement.className = "";
    }
    quoteElement.childNodes[wordIndex].className = "highlight";
    typedValueElement.classList.remove("error");
  } else if (currentWord.startsWith(typedValue)) {
    typedValueElement.classList.remove("error");
  } else {
    typedValueElement.classList.add("error");
    requestAnimationFrame(() => {
      typedValueElement.classList.remove("error");
      typedValueElement.classList.add("error"); // 오류 클래스 다시 추가 (흔들림 효과 적용)
    });
  }
});

// 최고 점수 불러오기
let highScore = localStorage.getItem("highScore") || 0;

// 게임 종료 후 결과 표시 및 모달 창 열기
function showResultModal(finalScore) {
  document.getElementById(
    "final-score"
  ).innerText = `이번 점수: ${finalScore}초`;

  // 최고 점수 업데이트
  if (!highScore || finalScore < highScore) {
    highScore = finalScore;
    localStorage.setItem("highScore", highScore);
  }
  document.getElementById("high-score").innerText = `최고 점수: ${highScore}초`;

  // 모달 표시
  document.getElementById("result-modal").classList.remove("hidden");
}

// 모달 닫기 버튼 이벤트 추가
document.getElementById("close-modal").addEventListener("click", () => {
  document.getElementById("result-modal").classList.add("hidden");
});
