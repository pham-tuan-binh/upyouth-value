const width = 540;
const height = 540;

const nameElement = document.getElementById("core-value-name");
const descriptionElement = document.getElementById("core-value-description");

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
    this.setSize(38, 38);

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
    console.log(nameElement);

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
    this.load.image("cat", "animals/cat.png");
    this.load.image("chicken", "animals/chicken.png");
    this.load.image("cow", "animals/cow.png");
    this.load.image("cub", "animals/cub.png");
    this.load.image("dog", "animals/dog.png");
    this.load.image("fish", "animals/fish.png");
    this.load.image("frog", "animals/frog.png");
    this.load.image("lion", "animals/lion.png");
    this.load.image("bg", "background/upyouth-matrix.png");
  }

  create() {
    this.add.image(270, 270, "bg");
    for (let i = 0; i < coreValues.length; i++) {
      let container = new CoreValueSprite(
        this,
        (this.layoutPadding + 15) * (i + 1),
        (this.layoutPadding + 15) * (i + 1),
        coreValues[i].name,
        coreValues[i].description,
        coreValues[i].emoji
      );
    }
  }
}

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
