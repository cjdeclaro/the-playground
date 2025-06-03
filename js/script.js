const characters = [];
const names = ["Alex", "Sam", "Juno", "Kai", "Zane", "Max", "Luna"];
const greetings = [
  "Hey there!",
  "Hello!",
  "Nice to see you!",
  "Howdy!",
  "What’s up?",
  "Hi friend!"
];

function getRandomColor() {
  const colors = ["red", "blue", "green", "orange", "purple", "pink", "brown"];
  return colors[Math.floor(Math.random() * colors.length)];
}

function spawnCharacter() {
  const playground = document.getElementById("playground");
  const character = document.createElement("div");
  character.classList.add("character");

  // === Personality ===
  const personality = {
    name: names[Math.floor(Math.random() * names.length)],
    color: getRandomColor(),
    speed: Math.random() * 0.7 + 0.5, // between 0.5s and 1.2s per move
    hasHat: Math.random() < 0.3,
    openingStatement: greetings[Math.floor(Math.random() * greetings.length)],
    money: Math.floor(Math.random() * 501)
  };

  character.talkedTo = new Set();
  character.dataset.personality = JSON.stringify(personality);
  character.style.backgroundColor = personality.color;

  if (personality.hasHat) {
    const hat = document.createElement("div");
    hat.classList.add("hat");
    character.appendChild(hat);
  }

  // === Initial Position ===
  const size = 50;
  const maxX = playground.clientWidth - size;
  const maxY = playground.clientHeight - size;

  let x, y;
  do {
    x = Math.random() * maxX;
    y = Math.random() * maxY;
  } while (isOverlapping(x, y, size, character));

  character.style.left = x + "px";
  character.style.top = y + "px";
  playground.appendChild(character);
  characters.push(character);

  // === Movement ===
  function moveRandomly() {
    if (character.dataset.paused === "true") {
      setTimeout(moveRandomly, 500);
      return;
    }

    const currentX = parseFloat(character.style.left);
    const currentY = parseFloat(character.style.top);

    const deltaX = (Math.random() - 0.5) * 300;
    const deltaY = (Math.random() - 0.5) * 300;

    let newX = Math.max(0, Math.min(maxX, currentX + deltaX));
    let newY = Math.max(0, Math.min(maxY, currentY + deltaY));

    let attempts = 5;
    while (isOverlapping(newX, newY, size, character) && attempts-- > 0) {
      newX = Math.random() * maxX;
      newY = Math.random() * maxY;
    }

    const {
      speed
    } = JSON.parse(character.dataset.personality);
    character.style.transition = `left ${speed}s ease, top ${speed}s ease`;
    character.style.left = newX + "px";
    character.style.top = newY + "px";

    checkForNearbyCharacters(character);

    const isIdle = Math.random() < 0.2;
    const nextDelay = isIdle ? Math.random() * 2000 + 2000 : Math.random() * 1000 + 800;
    setTimeout(moveRandomly, nextDelay);
  }

  moveRandomly();
}

function isOverlapping(x, y, size, current) {
  return characters.some(other => {
    if (other === current) return false;
    const ox = parseFloat(other.style.left);
    const oy = parseFloat(other.style.top);
    return (
      x < ox + size &&
      x + size > ox &&
      y < oy + size &&
      y + size > oy
    );
  });
}

function checkForNearbyCharacters(character) {
  const cx = parseFloat(character.style.left);
  const cy = parseFloat(character.style.top);
  const range = 80;

  characters.forEach(other => {
    if (other === character) return;

    const ox = parseFloat(other.style.left);
    const oy = parseFloat(other.style.top);
    const dx = cx - ox;
    const dy = cy - oy;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < range) {
      const p1 = JSON.parse(character.dataset.personality);
      const p2 = JSON.parse(other.dataset.personality);

      speak(character, `${p1.name}: ${p1.openingStatement}`, 2500);
      speak(other, `${p2.name}: ${p2.openingStatement}`, 2500);
    }
  });
}

function speak(character, message, pauseDuration) {
  if (character.dataset.paused === "true") return;

  character.dataset.paused = "true";

  const bubble = document.createElement("div");
  bubble.classList.add("speech");
  bubble.innerText = message;

  const x = parseFloat(character.style.left);
  const y = parseFloat(character.style.top);
  bubble.style.left = (x + 25) + "px";
  bubble.style.top = (y - 20) + "px";

  setTimeout(() => {
    document.getElementById("playground").appendChild(bubble);
  }, 1000);

  setTimeout(() => {
    bubble.remove();
    character.dataset.paused = "false";
  }, pauseDuration);
}
