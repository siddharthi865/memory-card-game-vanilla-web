const emojis = ["🍎", "🍌", "🍇", "🍒", "🍉", "🍍", "🥝", "🍓"];
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let lockBoard = false;

const board = document.getElementById("game-board");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart-btn");

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function createCards() {
  const duplicated = [...emojis, ...emojis];
  cards = shuffle(duplicated);
}

function createBoard() {
  board.innerHTML = "";
  cards.forEach((emoji, index) => {
    const card = document.createElement("button");
    card.className = "card w-full";
    card.setAttribute("data-value", emoji);
    card.setAttribute("aria-label", "Memory card");

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-front">?</div>
        <div class="card-face card-back">${emoji}</div>
      </div>
    `;

    card.addEventListener("click", () => handleFlip(card));
    board.appendChild(card);
  });
}

function handleFlip(card) {
  if (lockBoard || card.classList.contains("flipped")) return;

  card.classList.add("flipped");
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    checkMatch();
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  const isMatch = card1.dataset.value === card2.dataset.value;

  if (isMatch) {
    matchedPairs++;
    flippedCards = [];
    updateStatus();

    if (matchedPairs === emojis.length) {
      statusText.textContent = "🎉 You won!";
    }
  } else {
    lockBoard = true;
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      flippedCards = [];
      lockBoard = false;
    }, 800);
  }
}

function updateStatus() {
  statusText.textContent = `Matches: ${matchedPairs}/${emojis.length}`;
}

function initGame() {
  matchedPairs = 0;
  flippedCards = [];
  lockBoard = false;
  createCards();
  createBoard();
  updateStatus();
}

restartBtn.addEventListener("click", initGame);

initGame();
