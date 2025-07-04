// --- Deck, Shuffle, Deal ---
class Deck {
  constructor() {
    this.cards = [];
    const suits = ['S','H','D','C'];
    const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
    suits.forEach(suit => 
      ranks.forEach(rank => this.cards.push(rank + suit))
    );
  }
  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }
  deal(n) {
    return this.cards.splice(0, n);
  }
}

// --- Global Değişkenler & Elementler ---
const deck = new Deck();
let playerHand = [], cpuHand = [], communityCards = [];
let stage = 'idle'; // idle, preflop, flop, turn, river

const dealBtn      = document.getElementById('deal-btn');
const checkBtn     = document.getElementById('check-btn');
const betBtn       = document.getElementById('bet-btn');
const foldBtn      = document.getElementById('fold-btn');
const playerDiv    = document.getElementById('player-hand');
const communityDiv = document.getElementById('community-cards');

// --- UI Güncelleme ---
function updateUI() {
  // Kartları ve buton durumunu güncelle
  renderCards(playerDiv, playerHand);
  renderCards(communityDiv, communityCards);

  // Buton etkinlikleri
  dealBtn.disabled  = (stage !== 'idle');
  checkBtn.disabled = (stage === 'idle');
  betBtn.disabled   = (stage === 'idle');
  foldBtn.disabled  = (stage === 'idle');
}

// Kartları çiz
function renderCards(container, arr) {
  container.innerHTML = '';
  arr.forEach(code => {
    const img = document.createElement('img');
    img.src = `assets/cards/${code}.png`;
    container.appendChild(img);
  });
}

// --- Oyun Akışı ---
function startGame() {
  deck.cards = new Deck().cards; // reset deck
  deck.shuffle();
  playerHand = deck.deal(2);
  cpuHand    = deck.deal(2);
  communityCards = [];
  stage = 'preflop';
  updateUI();
}

function nextStage() {
  if (stage === 'preflop') {
    communityCards = deck.deal(3);
    stage = 'flop';
  } else if (stage === 'flop') {
    communityCards.push(...deck.deal(1));
    stage = 'turn';
  } else if (stage === 'turn') {
    communityCards.push(...deck.deal(1));
    stage = 'river';
  } else if (stage === 'river') {
    showdown();
    return;
  }
  updateUI();
}

function showdown() {
  const p = PokerEvaluator.evalHand([...playerHand, ...communityCards]);
  const c = PokerEvaluator.evalHand([...cpuHand, ...communityCards]);
  let msg;
  if (p.value > c.value)        msg = `Kazandın! (${p.handName})`;
  else if (p.value < c.value)   msg = `Kaybettin. CPU: ${c.handName}`;
  else                           msg = `Berabere!`;
  alert(msg);
  resetGame();
}

function resetGame() {
  stage = 'idle';
  playerHand = cpuHand = communityCards = [];
  updateUI();
}

// --- Event Listeners ---
dealBtn.addEventListener('click', startGame);
checkBtn.addEventListener('click', nextStage);
betBtn.addEventListener('click', nextStage);
foldBtn.addEventListener('click', () => {
  alert('Fold ettin! Oyun bitti.');
  resetGame();
});

// İlk durumda UI’yı ayarla
updateUI();
