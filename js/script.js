function spawnCharacter() {
  const playground = document.getElementById("playground");

  const character = document.createElement("div");
  character.classList.add("character");
  character.style.width = "50px";
  character.style.height = "50px";
  character.style.backgroundColor = "white";
  character.style.position = "absolute";
  character.style.left = Math.random() * (playground.clientWidth - 50) + "px";
  character.style.top = Math.random() * (playground.clientHeight - 50) + "px";

  playground.appendChild(character);

  function moveRandomly() {
    const maxX = playground.clientWidth - 50;
    const maxY = playground.clientHeight - 50;

    const currentX = parseFloat(character.style.left);
    const currentY = parseFloat(character.style.top);

    // Larger range ±150px
    const deltaX = (Math.random() - 0.5) * 500;
    const deltaY = (Math.random() - 0.5) * 500;

    let newX = Math.max(0, Math.min(maxX, currentX + deltaX));
    let newY = Math.max(0, Math.min(maxY, currentY + deltaY));

    // Random movement duration: 0.8s to 2s
    const duration = (Math.random() * 1.2 + 0.8).toFixed(2);
    character.style.transition = `left ${duration}s ease, top ${duration}s ease`;

    character.style.left = newX + "px";
    character.style.top = newY + "px";

    // Decide next move delay (normal or idle)
    const isIdle = Math.random() < 0.2; // 20% chance to idle
    const nextMoveDelay = isIdle
      ? Math.random() * 2000 + 2000  // 2s–4s idle
      : Math.random() * 1000 + 800; // 0.8s–1.8s normal move

    setTimeout(moveRandomly, nextMoveDelay);
  }

  moveRandomly(); // Start the movement loop
}
