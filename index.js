const width = 540;
const height = 540;

const nameElement = document.getElementById("core-value-name");
const descriptionElement = document.getElementById("core-value-description");
const submitButtonElement = document.getElementById("submit-button");
const departmentChoiceElement = document.getElementById("department-choice");

let surveyAnswers = [];

class CoreValueSprite extends Phaser.GameObjects.Container {
  constructor(scene, x, y, name, description, image) {
    super(scene, x, y);

    // Set Var
    this.learningCurve = 0;
    this.usageFrequency = 0;
    this.name = name;
    this.description = description;

    // Set item
    this.imageElement = scene.add.image(0, 0, image);
    this.imageElement.setScale(0.9);

    // Set horizontal guide
    this.horizontalGuide = scene.add.line(
      this.x,
      this.y,
      0,
      0,
      width / 2 - this.x,
      0,
      0xffffff,
      0.75
    );
    this.horizontalGuide.setOrigin(0);
    this.horizontalGuide.setVisible(0);

    this.horizontalGuideText = scene.add.text(
      width / 2,
      this.y,
      width / 2 - this.x
    );
    this.horizontalGuideText.setVisible(0);

    // Set vertical guide
    this.verticalGuide = scene.add.line(
      this.x,
      this.y,
      0,
      0,
      0,
      height / 2 - this.y,
      0xffffff,
      0.75
    );
    this.verticalGuide.setOrigin(0);
    this.verticalGuide.setVisible(0);

    this.verticalGuideText = scene.add.text(
      this.x,
      height / 2,
      height / 2 - this.y
    );
    this.verticalGuideText.setVisible(0);

    // Set Container
    this.add([this.imageElement]);
    this.setSize(56, 56);

    // Set Interaction
    this.setInteractive({ draggable: true });
    this.on("dragstart", this.onDragStart);
    this.on("dragend", this.onDragEnd);
    this.on("drag", this.onDrag);

    scene.add.existing(this);
  }

  onDrag(pointer, dragX, dragY) {
    this.setPosition(dragX, dragY);
    this.horizontalGuide.setPosition(this.x, this.y);
    this.horizontalGuide.setTo(0, 0, width / 2 - this.x, 0);

    this.verticalGuide.setPosition(this.x, this.y);
    this.verticalGuide.setTo(0, 0, 0, height / 2 - this.y);

    this.horizontalGuideText.setPosition(width / 2, this.y);
    this.verticalGuideText.setPosition(this.x, height / 2);

    this.usageFrequency = Math.floor(((height / 2 - this.y) / 248) * 100);
    this.learningCurve = Math.floor(((this.x - width / 2) / 248) * 100);

    this.horizontalGuideText.setText(this.usageFrequency);
    this.verticalGuideText.setText(this.learningCurve);
  }

  onDragEnd(pointer, gameObject) {
    this.horizontalGuide.setVisible(0);
    this.verticalGuide.setVisible(0);

    this.verticalGuideText.setVisible(0);
    this.horizontalGuideText.setVisible(0);
  }

  onDragStart(pointer, gameObject) {
    this.scene.children.bringToTop(this);
    this.horizontalGuide.setVisible(1);
    this.verticalGuide.setVisible(1);

    this.verticalGuideText.setVisible(1);
    this.horizontalGuideText.setVisible(1);

    nameElement.innerHTML = this.name;
    descriptionElement.innerHTML = this.description;
  }
}

class DescriptionPanel extends Phaser.GameObjects.Container {
  constructor(scene, x, y, name, description, image) {}
}

class Example extends Phaser.Scene {
  constructor() {
    super();

    this.gameWidth = window.innerWidth;
    this.gameHeight = window.innerHeight;

    this.layoutDivider = 0.3;
    this.layoutPadding = 24;
  }

  preload() {
    this.load.path = "assets/";
    this.load.image("vu", "leaders/vu.png");
    this.load.image("thile", "leaders/thile.png");
    this.load.image("thanh", "leaders/thanh.png");
    this.load.image("bg", "background/upyouth-matrix.png");
  }

  create() {
    this.add.image(270, 270, "bg");
    for (let i = 0; i < coreValues.length; i++) {
      surveyAnswers.push(
        new CoreValueSprite(
          this,
          this.layoutPadding * 2 + 64 * i,
          50,
          coreValues[i].name,
          coreValues[i].description,
          coreValues[i].emoji
        )
      );
    }
  }
}

function getAnswers(answersArray) {
  let arrayResult = [];
  for (let elem of answersArray) {
    if (elem.learningCurve == 0 && elem.usageFrequency == 0) {
      return false;
    }

    arrayResult.push({
      name: elem.name.toLowerCase().replace(/ /g, "-"),
      learningCurve: elem.learningCurve,
      usageFrequency: elem.usageFrequency,
    });
  }

  let result = {
    answers: arrayResult,
    department: departmentChoiceElement.value,
  };

  return result;
}

submitButtonElement.addEventListener("click", function (data) {
  let result = getAnswers(surveyAnswers);

  if (result === false) {
    alert("Finish your mission first!");
    return;
  }

  submitButtonElement.innerText = "Loading...";
  this.disabled = true;

  fetch(
    "https://script.google.com/macros/s/AKfycbwcdg4VAg8Z8zC3VIAT4T79XfOePPxybpAVL-4gmpehdehBfBr3lkEVMK1EJz7gGXD6eg/exec",
    {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
        "X-Master-key":
          "$2a$10$UPENydFvCI4YhSlXJbof7.y7L/e9wVT7wZvzoo8LiVdJkr62/8D/G", // Your master key here
      },
      body: JSON.stringify(result),
    }
  )
    .then((response) => {
      submitButtonElement.innerText = "Thank you for your service.";
    })
    .catch((error) => console.error("Error:", error));
});

const config = {
  type: Phaser.AUTO,
  scale: {
    width: width,
    height: height,
  },
  parent: "canvas-container",
  scene: Example,
};

const game = new Phaser.Game(config);
