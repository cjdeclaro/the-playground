const characters = [];

function spawnCharacter() {
  const playground = document.getElementById("playground");

  const character = document.createElement("div");
  character.classList.add("character");

  const size = 50;
  const maxX = playground.clientWidth - size;
  const maxY = playground.clientHeight - size;

  // Initial random position (with collision check)
  let x, y;
  do {
    x = Math.random() * maxX;
    y = Math.random() * maxY;
  } while (isOverlapping(x, y, size, character));

  character.style.left = x + "px";
  character.style.top = y + "px";
  playground.appendChild(character);
  characters.push(character);

  function moveRandomly() {
    if (character.dataset.paused === "true") {
      // Try again shortly if paused
      setTimeout(moveRandomly, 500);
      return;
    }

    const currentX = parseFloat(character.style.left);
    const currentY = parseFloat(character.style.top);

    const deltaX = (Math.random() - 0.5) * 300;
    const deltaY = (Math.random() - 0.5) * 300;

    let newX = Math.max(0, Math.min(maxX, currentX + deltaX));
    let newY = Math.max(0, Math.min(maxY, currentY + deltaY));

    // Try a few times to find a non-overlapping spot
    let attempts = 5;
    while (isOverlapping(newX, newY, size, character) && attempts-- > 0) {
      newX = Math.random() * maxX;
      newY = Math.random() * maxY;
    }

    const duration = (Math.random() * 1.2 + 0.8).toFixed(2);
    character.style.transition = `left ${duration}s ease, top ${duration}s ease`;
    character.style.left = newX + "px";
    character.style.top = newY + "px";

    // Check for communication
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
      speak(character, "Hi!", 5000);
      speak(other, "Hello!", 5000);
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
