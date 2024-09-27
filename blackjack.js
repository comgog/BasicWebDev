// blackjack.js
let cardOne = 7;
let cardTwo = 5;
let userSum = cardOne + cardTwo;

let cardOneBank = 7;
let cardTwoBank = 5;
let bankSum = cardOneBank + cardTwoBank;

// 처음 2장 결과
if (userSum === 21) {
  if (bankSum === 21) {
    console.log("DRAW");
  } else console.log("User win");
}

while (userSum !== 21 && bankSum !== 21) {
  let cardThree = 7;
  let cardThreeBank = 6;

  userSum += cardThree;
  bankSum += cardThreeBank;
  console.log(`You have ${userSum} points, dealer has ${bankSum}`);

  if (bankSum >= 17) {
    if (bankSum > 21 || (userSum <= 21 && userSum > bankSum)) {
      console.log("You win");
      break;
    }
    if (userSum === bankSum) {
      console.log("Draw");
      break;
    } else {
      console.log("You lose");
      break;
    }
  }

  if (userSum > 21) {
    console.log("You lost");
    break;
  }
}
