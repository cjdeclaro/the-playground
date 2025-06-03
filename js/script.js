const characters = [];
const names = ["Alex", "Sam", "Juno", "Kai", "Zane", "Max", "Luna", "Rio", "Nova", "Echo"];

const personalityTraits = {
  extroversion: ["outgoing", "social", "talkative", "shy", "quiet", "reserved"],
  agreeableness: ["friendly", "kind", "competitive", "stubborn", "helpful", "selfish"],
  creativity: ["artistic", "logical", "dreamy", "practical", "innovative", "traditional"],
  energy: ["energetic", "calm", "hyperactive", "lazy", "motivated", "tired"]
};

const moodTypes = {
  happy: {
    color: "#FFD700",
    emoji: "😊",
    energy: 1.2
  },
  sad: {
    color: "#4169E1",
    emoji: "😢",
    energy: 0.7
  },
  angry: {
    color: "#FF4500",
    emoji: "😠",
    energy: 1.5
  },
  excited: {
    color: "#FF69B4",
    emoji: "🤩",
    energy: 1.8
  },
  calm: {
    color: "#90EE90",
    emoji: "😌",
    energy: 0.8
  },
  anxious: {
    color: "#9370DB",
    emoji: "😰",
    energy: 1.3
  },
  curious: {
    color: "#20B2AA",
    emoji: "🤔",
    energy: 1.1
  },
  lonely: {
    color: "#708090",
    emoji: "😔",
    energy: 0.6
  }
};

const conversations = {
  greetings: {
    happy: ["Hey! Beautiful day, isn't it?", "Hi there! I'm feeling great!", "Hello! Want to be friends?"],
    sad: ["Oh, hi...", "Hello... I guess", "Hi... not feeling great today"],
    angry: ["What do you want?", "Oh, it's you again", "Hmph, hello"],
    excited: ["OMG HI THERE!", "HELLO! This is AMAZING!", "HEY! You look awesome!"],
    calm: ["Hello, nice to see you", "Hi, how are you doing?", "Good day to you"],
    anxious: ["Um, h-hello...", "Hi... is everything okay?", "Hello... you seem nice"],
    curious: ["Hello! What's your story?", "Hi! Tell me about yourself!", "Hey, what are you thinking?"],
    lonely: ["Hi... I'm glad someone noticed me", "Hello... want to chat?", "Hi... I've been alone"]
  },
  responses: {
    positive: ["That's wonderful!", "I love that!", "Amazing!", "How exciting!", "That makes me happy!"],
    negative: ["Oh no...", "That's terrible", "I'm sorry to hear that", "That's frustrating", "Ugh, I hate that"],
    neutral: ["I see", "Interesting", "Tell me more", "Hmm, okay", "That's something"],
    empathetic: ["I understand", "I feel you", "That must be hard", "I'm here for you", "We've all been there"]
  },
  topics: {
    weather: ["Nice weather today!", "I love sunny days", "Rain makes me sad", "Perfect temperature!"],
    food: ["I'm hungry!", "Love pizza!", "Cake is the best!", "Need some snacks"],
    friendship: ["You're a good friend", "I enjoy our talks", "Friends are important", "Let's hang out more"],
    dreams: ["I had weird dreams", "I want to travel", "Sometimes I wonder...", "What's my purpose?"],
    memories: ["Remember when we...", "I was thinking about...", "That reminds me of...", "Good times"]
  }
};

function getRandomColor() {
  const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FECA57", "#FF9FF3", "#54A0FF"];
  return colors[Math.floor(Math.random() * colors.length)];
}

function generatePersonality() {
  const traits = {};
  Object.keys(personalityTraits).forEach(category => {
    const options = personalityTraits[category];
    traits[category] = options[Math.floor(Math.random() * options.length)];
  });
  return traits;
}

function spawnCharacter() {
  const playground = document.getElementById("playground");
  const character = document.createElement("div");
  character.classList.add("character");

  const personality = {
    name: names[Math.floor(Math.random() * names.length)],
    color: getRandomColor(),
    speed: Math.random() * 0.7 + 0.5,
    hasHat: Math.random() < 0.3,
    money: Math.floor(Math.random() * 501),
    traits: generatePersonality(),
    mood: Object.keys(moodTypes)[Math.floor(Math.random() * Object.keys(moodTypes).length)],
    energy: 50 + Math.random() * 50,
    happiness: 50 + Math.random() * 50,
    social: 50 + Math.random() * 50,
    relationships: {},
    memories: [],
    thoughtTimer: 0,
    conversationHistory: [],
    lastInteraction: Date.now(),
    personalityScore: {
      extroversion: Math.random(),
      agreeableness: Math.random(),
      openness: Math.random(),
      neuroticism: Math.random()
    }
  };

  // Initialize character properties
  character.talkedTo = new Set();
  character.dataset.personality = JSON.stringify(personality);
  character.style.backgroundColor = personality.color;
  character.innerHTML = moodTypes[personality.mood].emoji;

  // Add mood indicator
  const moodIndicator = document.createElement("div");
  moodIndicator.classList.add("mood-indicator");
  moodIndicator.style.backgroundColor = moodTypes[personality.mood].color;
  character.appendChild(moodIndicator);

  character.addEventListener("click", () => showCharacterInfo(character));

  if (personality.hasHat) {
    const hat = document.createElement("div");
    hat.classList.add("hat");
    character.appendChild(hat);
  }

  // Position character
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

  startCharacterLife(character);
}

function startCharacterLife(character) {
  // Movement
  function moveRandomly() {
    if (character.dataset.paused === "true") {
      setTimeout(moveRandomly, 500);
      return;
    }

    const personality = JSON.parse(character.dataset.personality);
    const moodData = moodTypes[personality.mood];

    // Mood affects movement
    const energyMultiplier = moodData.energy;
    const moveDistance = 200 * energyMultiplier;

    const currentX = parseFloat(character.style.left);
    const currentY = parseFloat(character.style.top);
    const deltaX = (Math.random() - 0.5) * moveDistance;
    const deltaY = (Math.random() - 0.5) * moveDistance;

    const maxX = document.getElementById("playground").clientWidth - 50;
    const maxY = document.getElementById("playground").clientHeight - 50;

    let newX = Math.max(0, Math.min(maxX, currentX + deltaX));
    let newY = Math.max(0, Math.min(maxY, currentY + deltaY));

    let attempts = 5;
    while (isOverlapping(newX, newY, 50, character) && attempts-- > 0) {
      newX = Math.random() * maxX;
      newY = Math.random() * maxY;
    }

    character.style.transition = `left ${personality.speed}s ease, top ${personality.speed}s ease`;
    character.style.left = newX + "px";
    character.style.top = newY + "px";

    updateMoodAnimation(character, personality.mood);
    checkForNearbyCharacters(character);

    const nextDelay = Math.random() * 2000 + 1000;
    setTimeout(moveRandomly, nextDelay);
  }

  // Thinking process
  function think() {
    const personality = JSON.parse(character.dataset.personality);
    personality.thoughtTimer++;

    if (personality.thoughtTimer > 5 && Math.random() < 0.3) {
      const thoughts = [
        "What's the meaning of life?",
        "I wonder what others think of me...",
        "Maybe I should try something new",
        "I miss my old friends",
        "Life is pretty good right now",
        "I'm feeling a bit lonely",
        "What if I could fly?",
        "Time moves so fast...",
        "I should make more friends"
      ];

      const thought = thoughts[Math.floor(Math.random() * thoughts.length)];
      showThought(character, thought);
      personality.thoughtTimer = 0;

      // Thoughts can affect mood
      if (Math.random() < 0.2) {
        changeMood(character, getRandomMoodBasedOnThought(thought));
      }
    }

    // Mood decay over time
    if (Math.random() < 0.1) {
      moodDecay(character);
    }

    character.dataset.personality = JSON.stringify(personality);
    setTimeout(think, 3000 + Math.random() * 2000);
  }

  moveRandomly();
  think();
}

function checkForNearbyCharacters(character) {
  const cx = parseFloat(character.style.left);
  const cy = parseFloat(character.style.top);
  const range = 80;

  characters.forEach(other => {
    if (other === character || other.dataset.paused === "true") return;

    const ox = parseFloat(other.style.left);
    const oy = parseFloat(other.style.top);
    const distance = Math.sqrt((cx - ox) ** 2 + (cy - oy) ** 2);

    if (distance < range) {
      initiateConversation(character, other);
    }
  });
}

function initiateConversation(char1, char2) {
  const p1 = JSON.parse(char1.dataset.personality);
  const p2 = JSON.parse(char2.dataset.personality);

  // Check if they've talked recently
  const now = Date.now();
  if (now - p1.lastInteraction < 5000) return;

  p1.lastInteraction = now;
  p2.lastInteraction = now;

  // Generate contextual conversation
  const greeting1 = getContextualMessage(p1, "greeting");
  const response2 = getContextualResponse(p2, p1, greeting1);

  speak(char1, `${p1.name}: ${greeting1}`, 3000);
  setTimeout(() => {
    speak(char2, `${p2.name}: ${response2}`, 3000);
  }, 1500);

  // Update relationships
  updateRelationship(char1, char2, p1, p2);

  // Save conversation to memory
  p1.conversationHistory.push({
    with: p2.name,
    said: greeting1,
    heard: response2,
    time: now
  });
  p2.conversationHistory.push({
    with: p1.name,
    said: response2,
    heard: greeting1,
    time: now
  });

  char1.dataset.personality = JSON.stringify(p1);
  char2.dataset.personality = JSON.stringify(p2);
}

function getContextualMessage(personality, type) {
  const mood = personality.mood;
  const messages = conversations[type === "greeting" ? "greetings" : "responses"][mood] ||
    conversations.greetings.calm;
  return messages[Math.floor(Math.random() * messages.length)];
}

function getContextualResponse(responder, initiator, message) {
  const mood = responder.mood;
  let responseType = "neutral";

  // Analyze relationship and message sentiment
  const relationship = responder.relationships?.[initiator.name] || 0;

  if (relationship > 60) responseType = "positive";
  else if (relationship < 30) responseType = "negative";
  else if (mood === "happy" || mood === "excited") responseType = "positive";
  else if (mood === "sad" || mood === "angry") responseType = "negative";
  else if (mood === "anxious" || mood === "lonely") responseType = "empathetic";

  const responses = conversations.responses[responseType] || conversations.responses.neutral;
  return responses[Math.floor(Math.random() * responses.length)];
}

function updateRelationship(char1, char2, p1, p2) {
  // Initialize relationships if they don't exist
  if (!p1.relationships) p1.relationships = {};
  if (!p2.relationships) p2.relationships = {};

  const compatibility = calculateCompatibility(p1, p2);
  const currentRel1 = p1.relationships[p2.name] || 50;
  const currentRel2 = p2.relationships[p1.name] || 50;

  // Update based on mood compatibility and personality
  const change = (compatibility - 0.5) * 10 + Math.random() * 10 - 5;

  p1.relationships[p2.name] = Math.max(0, Math.min(100, currentRel1 + change));
  p2.relationships[p1.name] = Math.max(0, Math.min(100, currentRel2 + change));

  char1.talkedTo.add(p2.name);
  char2.talkedTo.add(p1.name);
}

function calculateCompatibility(p1, p2) {
  let compatibility = 0.5;

  // Mood compatibility
  const moodMatch = {
    happy: ["happy", "excited", "calm"],
    sad: ["sad", "lonely", "calm"],
    angry: ["angry", "excited"],
    excited: ["excited", "happy", "curious"],
    calm: ["calm", "happy", "sad"],
    anxious: ["anxious", "calm"],
    curious: ["curious", "excited", "happy"],
    lonely: ["lonely", "sad", "calm"]
  };

  if (moodMatch[p1.mood]?.includes(p2.mood)) {
    compatibility += 0.3;
  }

  // Personality trait compatibility
  if (p1.traits.agreeableness === p2.traits.agreeableness) compatibility += 0.2;
  if (p1.traits.extroversion === p2.traits.extroversion) compatibility += 0.1;

  return Math.max(0, Math.min(1, compatibility));
}

function changeMood(character, newMood) {
  const personality = JSON.parse(character.dataset.personality);
  personality.mood = newMood;

  const moodData = moodTypes[newMood];
  character.innerHTML = moodData.emoji;

  const moodIndicator = character.querySelector('.mood-indicator');
  if (moodIndicator) {
    moodIndicator.style.backgroundColor = moodData.color;
  }

  updateMoodAnimation(character, newMood);
  character.dataset.personality = JSON.stringify(personality);
}

function updateMoodAnimation(character, mood) {
  character.className = "character " + mood;
}

function getRandomMoodBasedOnThought(thought) {
  if (thought.includes("lonely") || thought.includes("miss")) return "lonely";
  if (thought.includes("good") || thought.includes("fly")) return "happy";
  if (thought.includes("meaning") || thought.includes("wonder")) return "curious";
  return Object.keys(moodTypes)[Math.floor(Math.random() * Object.keys(moodTypes).length)];
}

function moodDecay(character) {
  const personality = JSON.parse(character.dataset.personality);
  const moods = Object.keys(moodTypes);
  const currentMoodIndex = moods.indexOf(personality.mood);

  // Slowly drift towards neutral moods
  const neutralMoods = ["calm", "curious"];
  if (Math.random() < 0.3 && !neutralMoods.includes(personality.mood)) {
    changeMood(character, neutralMoods[Math.floor(Math.random() * neutralMoods.length)]);
  }
}

function speak(character, message, duration) {
  if (character.dataset.paused === "true") return;

  character.dataset.paused = "true";

  const bubble = document.createElement("div");
  bubble.classList.add("speech");
  bubble.innerText = message;

  const x = parseFloat(character.style.left);
  const y = parseFloat(character.style.top);
  bubble.style.left = (x + 25) + "px";
  bubble.style.top = (y - 30) + "px";

  document.getElementById("playground").appendChild(bubble);

  setTimeout(() => {
    bubble.remove();
    character.dataset.paused = "false";
  }, duration);
}

function showThought(character, thought) {
  const bubble = document.createElement("div");
  bubble.classList.add("thought");
  bubble.innerText = "💭 " + thought;

  const x = parseFloat(character.style.left);
  const y = parseFloat(character.style.top);
  bubble.style.left = (x + 55) + "px";
  bubble.style.top = (y - 10) + "px";

  document.getElementById("playground").appendChild(bubble);

  setTimeout(() => {
    bubble.remove();
  }, 4000);
}

function showCharacterInfo(character) {
  const info = JSON.parse(character.dataset.personality);
  const infoCard = document.getElementById("infoCard");

  let relationshipsHtml = "";
  if (info.relationships && Object.keys(info.relationships).length > 0) {
    relationshipsHtml = "<u>Relationships:</u><br/>";
    for (let [name, value] of Object.entries(info.relationships)) {
      const color = value > 70 ? "#4CAF50" : value > 40 ? "#FFC107" : "#F44336";
      relationshipsHtml += `
                        <div style="margin: 2px 0;">
                            ${name}: 
                            <div class="relationship-bar">
                                <div class="relationship-fill" style="width: ${value}%; background-color: ${color};"></div>
                            </div>
                            ${Math.round(value)}%
                        </div>
                    `;
    }
  }

  let recentThoughts = "";
  if (info.conversationHistory && info.conversationHistory.length > 0) {
    recentThoughts = "<u>Recent Conversations:</u><br/>";
    info.conversationHistory.slice(-3).forEach(conv => {
      recentThoughts += `<small>With ${conv.with}: "${conv.said}"</small><br/>`;
    });
  }

  infoCard.innerHTML = `
                <strong>${info.name}</strong> ${moodTypes[info.mood].emoji}<br/>
                <div class="stats">
                    <div class="stat-item">Mood<br/><strong>${info.mood}</strong></div>
                    <div class="stat-item">Energy<br/><strong>${Math.round(info.energy)}%</strong></div>
                    <div class="stat-item">Social<br/><strong>${Math.round(info.social)}%</strong></div>
                    <div class="stat-item">Money<br/><strong>₱${info.money}</strong></div>
                </div>
                <br/>
                <u>Personality:</u><br/>
                ${Object.entries(info.traits).map(([key, value]) => `${key}: ${value}`).join('<br/>')}
                <br/><br/>
                ${relationshipsHtml}
                <br/>
                ${recentThoughts}
            `;
  infoCard.style.display = "block";
}

function triggerEvent(eventType) {
  characters.forEach(character => {
    const personality = JSON.parse(character.dataset.personality);

    switch (eventType) {
      case 'party':
        changeMood(character, Math.random() > 0.3 ? 'happy' : 'excited');
        speak(character, `${personality.name}: Party time!`, 2000);
        break;
      case 'storm':
        changeMood(character, Math.random() > 0.5 ? 'anxious' : 'sad');
        speak(character, `${personality.name}: This storm is scary!`, 2000);
        break;
      case 'food':
        changeMood(character, 'happy');
        speak(character, `${personality.name}: Food! I'm so hungry!`, 2000);
        break;
    }
  });
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

function clearAll() {
  characters.forEach(char => char.remove());
  characters.length = 0;
  document.getElementById("infoCard").style.display = "none";
}

// Initialize with some characters
for (let i = 0; i < 3; i++) {
  setTimeout(() => spawnCharacter(), i * 500);
}
