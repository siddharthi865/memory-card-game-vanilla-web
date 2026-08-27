const CARD_SYMBOLS = ["🍕", "🚀", "🎧", "🌈", "⚽", "🎮", "🍩", "🐼"];

const gameBoard = document.querySelector("#game-board");
const movesDisplay = document.querySelector("#moves");
const matchesDisplay = document.querySelector("#matches");
const statusDisplay = document.querySelector("#game-status");
const restartButton = document.querySelector("#restart-button");

let firstCard = null;
let secondCard = null;
let moves = 0;
let matchedPairs = 0;
let boardLocked = false;

function shuffleCards(cards) {
  const shuffledCards = [...cards];

  for (let index = shuffledCards.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));

    [shuffledCards[index], shuffledCards[randomIndex]] = [
      shuffledCards[randomIndex],
      shuffledCards[index],
    ];
  }

  return shuffledCards;
}

function createCard(symbol, index) {
  const button = document.createElement("button");

  button.type = "button";
  button.className = "memory-card";
  button.dataset.symbol = symbol;
  button.dataset.index = String(index);
  button.setAttribute("aria-label", `Hidden memory card ${index + 1}`);
  button.setAttribute("aria-pressed", "false");

  const cardInner = document.createElement("span");
  cardInner.className = "card-inner";

  const cardFront = document.createElement("span");
  cardFront.className = "card-face card-front";
  cardFront.setAttribute("aria-hidden", "true");

  const cardBack = document.createElement("span");
  cardBack.className = "card-face card-back";
  cardBack.textContent = symbol;
  cardBack.setAttribute("aria-hidden", "true");

  cardInner.append(cardFront, cardBack);
  button.append(cardInner);

  button.addEventListener("click", () => handleCardClick(button));

  return button;
}

function updateScore() {
  movesDisplay.textContent = String(moves);
  matchesDisplay.textContent = `${matchedPairs} / ${CARD_SYMBOLS.length}`;
}

function flipCard(card) {
  card.classList.add("is-flipped");
  card.setAttribute("aria-pressed", "true");
  card.setAttribute(
    "aria-label",
    `Card ${Number(card.dataset.index) + 1}: ${card.dataset.symbol}`,
  );
}

function hideCard(card) {
  card.classList.remove("is-flipped");
  card.setAttribute("aria-pressed", "false");
  card.setAttribute(
    "aria-label",
    `Hidden memory card ${Number(card.dataset.index) + 1}`,
  );
}

function resetSelectedCards() {
  firstCard = null;
  secondCard = null;
  boardLocked = false;
}

function markMatch() {
  firstCard.classList.add("is-matched");
  secondCard.classList.add("is-matched");

  firstCard.disabled = true;
  secondCard.disabled = true;

  firstCard.setAttribute(
    "aria-label",
    `Matched card: ${firstCard.dataset.symbol}`,
  );
  secondCard.setAttribute(
    "aria-label",
    `Matched card: ${secondCard.dataset.symbol}`,
  );

  matchedPairs += 1;
  updateScore();

  if (matchedPairs === CARD_SYMBOLS.length) {
    statusDisplay.textContent = `You matched every pair in ${moves} ${moves === 1 ? "move" : "moves"}!`;
  } else {
    statusDisplay.textContent = "Match found! Choose another card.";
  }

  resetSelectedCards();
}

function hideMismatchedCards() {
  boardLocked = true;
  statusDisplay.textContent = "Not a match. Try again.";

  window.setTimeout(() => {
    hideCard(firstCard);
    hideCard(secondCard);
    resetSelectedCards();

    if (matchedPairs < CARD_SYMBOLS.length) {
      statusDisplay.textContent = "Choose another pair.";
    }
  }, 800);
}

function checkForMatch() {
  const isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;

  if (isMatch) {
    markMatch();
    return;
  }

  hideMismatchedCards();
}

function handleCardClick(card) {
  if (
    boardLocked ||
    card === firstCard ||
    card.classList.contains("is-matched")
  ) {
    return;
  }

  flipCard(card);

  if (!firstCard) {
    firstCard = card;
    statusDisplay.textContent = "Now select a second card.";
    return;
  }

  secondCard = card;
  moves += 1;
  updateScore();
  checkForMatch();
}

function resetGameState() {
  firstCard = null;
  secondCard = null;
  moves = 0;
  matchedPairs = 0;
  boardLocked = false;

  updateScore();
  statusDisplay.textContent = "Select a card to begin.";
}

function startGame() {
  resetGameState();

  const cardPairs = [...CARD_SYMBOLS, ...CARD_SYMBOLS];
  const shuffledCards = shuffleCards(cardPairs);

  gameBoard.replaceChildren();

  const fragment = document.createDocumentFragment();

  shuffledCards.forEach((symbol, index) => {
    fragment.append(createCard(symbol, index));
  });

  gameBoard.append(fragment);

  const firstPlayableCard = gameBoard.querySelector(".memory-card");

  if (firstPlayableCard) {
    firstPlayableCard.focus();
  }
}

restartButton.addEventListener("click", startGame);

startGame();
