// =====================================================
// The Power of Sequencing
// Same three images, two orders, two different stories.
// =====================================================


// ---------- GLOBAL VARIABLES ----------
// Declared OUTSIDE any function, so every function below can read and change them.

let folder = "images/";     // where the photos live
let extension = "svg";      // file type of every image
let totalSteps = 3;         // beginning, middle, end

let currentVersion = "A";   // which story is showing ("A" or "B")
let currentStep = 0;        // 0 = beginning, 1 = middle, 2 = end


// ---------- OBJECTS ----------
// Objects = variables (properties) + functions (methods).

// Each photo is an object with properties (nouns).
let packing = { name: "packing", alt: "Someone packing a suitcase" };
let station = { name: "station", alt: "A train platform" };
let hug     = { name: "hug",     alt: "Two people hugging" };

// Each story is an object too. Same three photos, different order and words.
let versionA = {
  title: "Coming Home",
  tagline: "Years away. One last train. Someone waiting at the end of the line.",
  color: "rgb(244, 236, 220)",   // warm background
  photos: [packing, station, hug],
  captions: [
    "After years away, the bags are finally packed.",
    "The last train of the journey pulls in.",
    "Someone has been waiting at the other end."
  ]
};

let versionB = {
  title: "Saying Goodbye",
  tagline: "One last hug. A life packed into a suitcase. A train that won't wait.",
  color: "rgb(222, 228, 236)",   // cool background
  photos: [hug, packing, station],
  captions: [
    "One last hug before everything changes.",
    "Packing a whole life into one suitcase.",
    "The platform, the train, and nobody left to wave."
  ]
};

// The viewer object has a property (step) and methods (behaviours, the verbs),
// just like ball.bounce() or book.getPage() from class.
let viewer = {
  stageNames: ["Beginning", "Middle", "End"],

  next: function () {
    if (currentStep < totalSteps - 1) {
      currentStep += 1;          // compound assignment: currentStep = currentStep + 1
      updateStep();
    }
  },

  previous: function () {
    if (currentStep > 0) {
      currentStep -= 1;          // currentStep = currentStep - 1
      updateStep();
    }
  },

  jumpTo: function (step) {
    currentStep = step;
    updateStep();
  }
};


// ---------- FUNCTIONS ----------

// Return value + string concatenation: "packing" becomes "images/packing.svg"
function getImageSrc(photo) {
  return folder + photo.name + "." + extension;
}

// Return value: picks the right story object for "A" or "B"
function getStory(version) {
  if (version === "A") {
    return versionA;
  } else {
    return versionB;
  }
}

// Parameters: put one photo and one caption into one frame
function fillFrame(index, photo, caption) {
  let img = document.getElementById("img" + index);   // local variable
  let cap = document.getElementById("cap" + index);   // local variable

  img.src = getImageSrc(photo);
  img.alt = photo.alt;
  cap.innerHTML = caption;
}

// Show a whole story: title, three frames, background colour, buttons
function showSequence(version) {
  currentVersion = version;
  currentStep = 0;

  let story = getStory(version);   // local variable, only exists in here

  document.getElementById("storyTitle").innerHTML = story.title;
  document.getElementById("storyTagline").innerHTML = story.tagline;
  document.title = story.title;   // browser tab title changes too
  document.body.style.backgroundColor = story.color;

  for (let i = 0; i < totalSteps; i++) {
    fillFrame(i, story.photos[i], story.captions[i]);
  }

  document.getElementById("btnA").classList.toggle("active", version === "A");
  document.getElementById("btnB").classList.toggle("active", version === "B");

  console.log("Showing version " + version + ": " + story.title);
  updateStep();
}

// Highlight the current frame, update the label and the progress bar
function updateStep() {
  let frames = document.getElementsByClassName("frame");

  for (let i = 0; i < frames.length; i++) {
    frames[i].classList.toggle("current", i === currentStep);
  }

  // String concatenation into the page
  document.getElementById("stepLabel").innerHTML =
    (currentStep + 1) + " of " + totalSteps + ": " + viewer.stageNames[currentStep];

  // Number + unit, like value + "px" from class
  let percent = (currentStep + 1) / totalSteps * 100;
  document.getElementById("progressFill").style.width = percent + "%";

  // Booleans: disable buttons at the start and end
  document.getElementById("prevBtn").disabled = currentStep === 0;
  document.getElementById("nextBtn").disabled = currentStep === totalSteps - 1;

  console.log("Step: " + viewer.stageNames[currentStep]);
}


// ---------- EVENT LISTENERS ----------

document.getElementById("btnA").addEventListener("click", function () {
  showSequence("A");
});

document.getElementById("btnB").addEventListener("click", function () {
  showSequence("B");
});

document.getElementById("nextBtn").addEventListener("click", viewer.next);
document.getElementById("prevBtn").addEventListener("click", viewer.previous);

// Clicking an image jumps straight to that step
let frameList = document.getElementsByClassName("frame");
for (let i = 0; i < frameList.length; i++) {
  frameList[i].addEventListener("click", function () {
    viewer.jumpTo(i);
  });
}

// Arrow keys also move through the story
document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowRight") viewer.next();
  if (event.key === "ArrowLeft") viewer.previous();
});


// ---------- START ----------
showSequence("A");
