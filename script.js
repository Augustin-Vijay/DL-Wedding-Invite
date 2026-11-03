const eventDetails = {
  title: "Wedding reception of Dhashindar and Linda",
  start: "20261122T130000Z",
  location: "Thuraiyur Nadar Thirumana Mandabam, SRP Koil St N, New Kamaraj Nagar, Agaram, Perambur, Chennai, Tamil Nadu 600082",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Thuraiyur+Nadar+Thirumana+Mandabam%2C+SRP+Koil+St+N%2C+New+Kamaraj+Nagar%2C+Agaram%2C+Perambur%2C+Chennai%2C+Tamil+Nadu+600082"
};

const story = [
  {
    icon: "📱💛",
    title: "A Snapchat hello",
    text: "One little snap brought Dhashindar and Linda into each other's lives."
  },
  {
    icon: "💬✨",
    title: "Two hearts connect",
    text: "Across Karnataka and Tamil Nadu, their conversations turned into something special."
  },
  {
    icon: "👨‍👩‍👧‍👦🌼",
    title: "Families bring us together",
    text: "With blessings from S. Sagayaraj, Latha, Lakshmanan, and Sheeba, their families arranged a beautiful beginning."
  },
  {
    icon: "💍🎊",
    title: "Let's celebrate",
    text: "Join Dhashindar and Linda for their reception on November 22, 2026, at 6:30 PM."
  }
];

const intro = document.querySelector("#cinematic-intro");
const header = document.querySelector("#site-header");
const main = document.querySelector("#main-content");
const footer = document.querySelector(".site-footer");
const openInvitationButton = document.querySelector("#open-invitation");
let introTimer;
let musicFadeFrame;
let activeStory = 0;

document.body.classList.add("intro-active");

function showIntroScene(scene) {
  intro.dataset.scene = scene;
  document.querySelectorAll(".intro-scene").forEach(section => {
    const active = section.classList.contains(`intro-scene-${scene}`);
    section.setAttribute("aria-hidden", String(!active));
    section.inert = !active;
  });
}

showIntroScene("one");

function showEnvelope() {
  window.clearTimeout(introTimer);
  showIntroScene("three");
  openInvitationButton.focus({ preventScroll: true });
}

document.querySelector("#skip-intro").addEventListener("click", showEnvelope);

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  showEnvelope();
} else {
  introTimer = window.setTimeout(() => {
    showIntroScene("two");
    introTimer = window.setTimeout(showEnvelope, 3000);
  }, 2600);
}

function revealMainWebsite() {
  intro.classList.add("is-complete");
  intro.inert = true;
  [header, main, footer].forEach(section => { section.inert = false; });
  document.body.classList.remove("intro-active");
  document.querySelector("#music-widget").hidden = false;
  window.setTimeout(() => {
    intro.remove();
    document.querySelector("#hero-title").setAttribute("tabindex", "-1");
    document.querySelector("#hero-title").focus({ preventScroll: true });
  }, 950);
}

openInvitationButton.addEventListener("click", () => {
  if (openInvitationButton.disabled) return;
  openInvitationButton.disabled = true;
  window.clearTimeout(introTimer);
  intro.classList.add("is-opening-envelope");
  const musicStart = startBackgroundMusic();
  window.setTimeout(() => {
    revealMainWebsite();
    musicStart.then(started => {
      if (started && !manuallyPausedMusic) fadeMusicTo(Number(musicVolume.value));
    });
  }, 850);
});

for (let index = 0; index < 24; index += 1) {
  const particle = document.createElement("span");
  particle.className = "intro-particle";
  particle.style.left = `${Math.random() * 100}%`;
  particle.style.setProperty("--duration", `${6 + Math.random() * 7}s`);
  particle.style.setProperty("--delay", `${Math.random() * -12}s`);
  particle.style.width = `${2 + Math.random() * 3}px`;
  particle.style.height = particle.style.width;
  document.querySelector(".intro-particles").append(particle);
}

const countdown = document.querySelector("#countdown");
const countdownTarget = new Date(countdown.dataset.target);
const countdownFields = {
  days: countdown.querySelector('[data-count="days"]'),
  hours: countdown.querySelector('[data-count="hours"]'),
  minutes: countdown.querySelector('[data-count="minutes"]'),
  seconds: countdown.querySelector('[data-count="seconds"]')
};

function updateCountdown() {
  const remaining = countdownTarget.getTime() - Date.now();
  if (remaining <= 0) {
    Object.values(countdownFields).forEach(field => { field.textContent = "00"; });
    countdown.setAttribute("aria-label", "The reception celebration is here");
    return;
  }

  const totalSeconds = Math.floor(remaining / 1000);
  countdownFields.days.textContent = String(Math.floor(totalSeconds / 86400)).padStart(3, "0");
  countdownFields.hours.textContent = String(Math.floor((totalSeconds % 86400) / 3600)).padStart(2, "0");
  countdownFields.minutes.textContent = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  countdownFields.seconds.textContent = String(totalSeconds % 60).padStart(2, "0");
}

updateCountdown();
window.setInterval(updateCountdown, 1000);

const storyCard = document.querySelector("#story-card");
if (storyCard) {
  const illustration = document.querySelector("#story-illustration");
  const chapter = document.querySelector("#story-chapter");
  const heading = document.querySelector("#story-heading");
  const storyText = document.querySelector("#story-text");
  const progress = document.querySelector("#story-progress");

  story.forEach((_, index) => {
    const segment = document.createElement("button");
    segment.className = "progress-segment";
    segment.type = "button";
    segment.setAttribute("aria-label", `Show story ${index + 1}`);
    segment.addEventListener("click", () => showStory(index));
    progress.append(segment);
  });

  function showStory(index) {
    activeStory = (index + story.length) % story.length;
    const snap = story[activeStory];
    storyCard.dataset.scene = activeStory;
    illustration.textContent = snap.icon;
    chapter.textContent = `Story ${activeStory + 1} of ${story.length}`;
    heading.textContent = snap.title;
    storyText.textContent = snap.text;
    [...progress.children].forEach((segment, segmentIndex) => {
      segment.classList.toggle("done", segmentIndex < activeStory);
      segment.classList.toggle("active", segmentIndex === activeStory);
      segment.setAttribute("aria-current", segmentIndex === activeStory ? "step" : "false");
    });
  }

  document.querySelector("#previous-story").addEventListener("click", () => showStory(activeStory - 1));
  document.querySelector("#next-story").addEventListener("click", () => showStory(activeStory + 1));
  showStory(0);
}

const menuToggle = document.querySelector("#menu-toggle");
const primaryNav = document.querySelector("#primary-nav");

function closeMobileMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  primaryNav.classList.remove("is-open");
}

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
  primaryNav.classList.toggle("is-open", !isExpanded);
});
primaryNav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMobileMenu));
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeMobileMenu();
});

const scrollHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
window.addEventListener("scroll", scrollHeader, { passive: true });
scrollHeader();

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(element => revealObserver.observe(element));
} else {
  document.querySelectorAll(".reveal").forEach(element => element.classList.add("is-visible"));
}

const artworkDialog = document.querySelector("#artwork-dialog");
const dialogImage = document.querySelector("#dialog-image");
document.querySelectorAll(".artwork-preview").forEach(button => {
  button.addEventListener("click", () => {
    dialogImage.src = button.dataset.preview;
    dialogImage.alt = button.dataset.alt;
    artworkDialog.showModal();
  });
});
document.querySelector("#close-preview").addEventListener("click", () => artworkDialog.close());
artworkDialog.addEventListener("click", event => {
  if (event.target === artworkDialog) artworkDialog.close();
});

function escapeCalendarText(value) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

document.querySelector("#download-calendar").addEventListener("click", () => {
  const now = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const calendar = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Dhashindar and Linda//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:dhashindar-linda-reception-20261122@wedding-invitation`,
    `DTSTAMP:${now}`,
    `DTSTART:${eventDetails.start}`,
    `SUMMARY:${escapeCalendarText(eventDetails.title)}`,
    `LOCATION:${escapeCalendarText(eventDetails.location)}`,
    `DESCRIPTION:${escapeCalendarText("Reception begins at 6:30 PM India Standard Time. Directions: " + eventDetails.mapsUrl)}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
  const file = new Blob([calendar], { type: "text/calendar;charset=utf-8" });
  const downloadUrl = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = "Dhashindar-Linda-Reception.ics";
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(downloadUrl);
});

document.querySelector("#share-invitation").addEventListener("click", async () => {
  const shareData = {
    title: "Dhashindar & Linda | Wedding Invitation",
    text: "Two States, Two Traditions, One Beautiful Journey. Join us on November 22, 2026.",
    url: window.location.href.split("#")[0]
  };
  const shareStatus = document.querySelector("#share-status");

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      shareStatus.textContent = "Thank you for sharing our invitation.";
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }

  try {
    await navigator.clipboard.writeText(shareData.url);
    shareStatus.textContent = "Invitation link copied. Share it with your loved ones.";
  } catch (error) {
    shareStatus.textContent = "Copy the invitation link from your browser address bar to share it.";
  }
});

const audio = document.querySelector("#wedding-audio");
const musicWidget = document.querySelector("#music-widget");
const musicToggle = document.querySelector("#music-toggle");
const musicMute = document.querySelector("#music-mute");
const musicVolume = document.querySelector("#music-volume");
const musicStatus = document.querySelector("#music-status");
const musicNotice = document.querySelector("#music-notice");
let manuallyPausedMusic = false;
let musicAvailable = true;

audio.volume = Number(musicVolume.value);

function showMusicNotice(message) {
  musicNotice.textContent = message;
  musicNotice.hidden = false;
  window.clearTimeout(showMusicNotice.timeout);
  showMusicNotice.timeout = window.setTimeout(() => { musicNotice.hidden = true; }, 7000);
}

audio.addEventListener("error", () => {
  musicAvailable = false;
  const errorCode = audio.error ? audio.error.code : 0;
  musicStatus.textContent = errorCode === 3 || errorCode === 4 ? "Audio format unavailable" : "Audio unavailable";
  musicToggle.setAttribute("aria-label", "Music file unavailable");
  musicToggle.setAttribute("aria-pressed", "false");
  musicWidget.classList.remove("is-playing");
});

audio.addEventListener("playing", () => {
  musicStatus.textContent = "Now playing · tap pause";
  musicToggle.setAttribute("aria-label", "Pause background music");
  musicToggle.setAttribute("aria-pressed", "true");
  musicWidget.classList.add("is-playing");
});

audio.addEventListener("pause", () => {
  musicStatus.textContent = musicAvailable ? "Paused · tap play" : "Audio unavailable";
  musicToggle.setAttribute("aria-label", "Play background music");
  musicToggle.setAttribute("aria-pressed", "false");
  musicWidget.classList.remove("is-playing");
});

function fadeMusicTo(targetVolume, duration = 2500) {
  window.cancelAnimationFrame(musicFadeFrame);
  const startVolume = audio.volume;
  const startedAt = performance.now();
  const animate = now => {
    const progress = Math.min((now - startedAt) / duration, 1);
    audio.volume = startVolume + (targetVolume - startVolume) * progress;
    if (progress < 1) musicFadeFrame = window.requestAnimationFrame(animate);
  };
  musicFadeFrame = window.requestAnimationFrame(animate);
}

function startBackgroundMusic() {
  if (manuallyPausedMusic || !musicAvailable) return Promise.resolve(false);
  audio.volume = 0;
  return audio.play().then(() => true).catch(() => {
    if (!musicAvailable) return false;
    musicStatus.textContent = "Tap to play music";
    showMusicNotice("Music is ready when you are. Tap the music control to try playing it.");
    return false;
  });
}

musicToggle.addEventListener("click", () => {
  if (!musicAvailable) {
    showMusicNotice("The supplied audio file could not be played. Try converting it to a standard MP3 or AAC audio format.");
    return;
  }
  if (audio.paused) {
    manuallyPausedMusic = false;
    audio.play().then(() => fadeMusicTo(Number(musicVolume.value))).catch(() => {
      musicStatus.textContent = "Tap to play music";
      showMusicNotice("Your browser could not start the music. Try tapping the music button again.");
    });
  } else {
    manuallyPausedMusic = true;
    window.cancelAnimationFrame(musicFadeFrame);
    audio.pause();
  }
});

musicMute.addEventListener("click", () => {
  audio.muted = !audio.muted;
  musicMute.setAttribute("aria-pressed", String(audio.muted));
  musicMute.setAttribute("aria-label", audio.muted ? "Unmute music" : "Mute music");
  musicMute.textContent = audio.muted ? "×" : "◖";
});

musicVolume.addEventListener("input", () => {
  audio.volume = Number(musicVolume.value);
  if (audio.volume > 0 && audio.muted) {
    audio.muted = false;
    musicMute.setAttribute("aria-pressed", "false");
    musicMute.setAttribute("aria-label", "Mute music");
    musicMute.textContent = "◖";
  }
});

document.querySelectorAll(".primary-nav a, .site-brand, .hero-section a, .final-section a").forEach(link => {
  link.addEventListener("click", () => {
    if (primaryNav.classList.contains("is-open")) closeMobileMenu();
  });
});
