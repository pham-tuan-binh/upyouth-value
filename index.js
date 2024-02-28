let width = window.innerWidth;
let height = window.innerHeight;

class CoreValueSprite extends Phaser.GameObjects.Container {
  constructor(scene, x, y, name, description, image) {
    super(scene, x, y);

    let imageElement = scene.add.image(0, 0, image);

    this.add([imageElement]);

    this.setSize(100, 100);

    this.setInteractive({ draggable: true });

    this.on(
      "dragstart",
      function (pointer, gameObject) {
        //  This will bring the selected gameObject to the top of the list
        scene.children.bringToTop(this);

        scene.current_name.setText(name);
        scene.current_description.setText(description);
      },
      this
    );

    this.on("drag", (pointer, dragX, dragY) => this.setPosition(dragX, dragY));

    scene.add.existing(this);
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
    this.load.image("bg", "https://labs.phaser.io/assets/skies/gradient13.png");
    this.load.path = "assets/";
    this.load.image("cat", "animals/cat.png");
    this.load.image("chicken", "animals/chicken.png");
    this.load.image("cow", "animals/cow.png");
    this.load.image("cub", "animals/cub.png");
    this.load.image("dog", "animals/dog.png");
    this.load.image("fish", "animals/fish.png");
    this.load.image("frog", "animals/frog.png");
    this.load.image("lion", "animals/lion.png");
  }

  create() {
    for (let i = 0; i < coreValues.length; i++) {
      let container = new CoreValueSprite(
        this,
        (this.layoutPadding + 15) * (i + 1),
        this.layoutPadding,
        coreValues[i].name,
        coreValues[i].description,
        coreValues[i].emoji
      );
    }

    let matrixContainer = this.add.container(
      this.layoutPadding,
      this.layoutPadding
    );

    matrixContainer.width = width - 2 * this.layoutPadding;
    matrixContainer.height =
      height * (1 - this.layoutDivider) - 2 * this.layoutPadding;

    let verticalLine = this.add.line(
      matrixContainer.width / 2 + this.layoutPadding,
      this.layoutPadding,
      0,
      0,
      0,
      matrixContainer.height,
      0x6666ff,
      0.5
    );

    let horizontalLine = this.add.line(
      matrixContainer.width / 2 +
        this.layoutPadding -
        matrixContainer.height / 2,
      matrixContainer.height / 2 + this.layoutPadding,
      0,
      0,
      matrixContainer.height,
      0,
      0x6666ff,
      0.5
    );

    verticalLine.setOrigin(0);
    horizontalLine.setOrigin(0);

    let tag = this.add.text(
      matrixContainer.width / 2 + this.layoutPadding,
      matrixContainer.height / 2 + this.layoutPadding,
      "UpYouth Matrix"
    );

    tag.setOrigin(0.5);

    let cantlearn = this.add.text(
      matrixContainer.width / 2 +
        this.layoutPadding -
        matrixContainer.height / 2,
      matrixContainer.height / 2 + this.layoutPadding,
      "Can't Learn"
    );

    cantlearn.setOrigin(0.5);

    let easytolearn = this.add.text(
      matrixContainer.width / 2 +
        this.layoutPadding +
        matrixContainer.height / 2,
      matrixContainer.height / 2 + this.layoutPadding,
      "Easy to learn"
    );

    easytolearn.setOrigin(0.5);

    let nousage = this.add.text(
      matrixContainer.width / 2 + this.layoutPadding,
      matrixContainer.height,
      "Haven't use this at all"
    );

    nousage.setOrigin(0.5);

    let lotsusage = this.add.text(
      matrixContainer.width / 2 + this.layoutPadding,
      this.layoutPadding * 2,
      "Use this all the time"
    );

    lotsusage.setOrigin(0.5);

    this.current_name = this.add
      .text(
        this.layoutPadding,
        height * (1 - this.layoutDivider),
        "Click an animal to see its thing."
      )
      .setFontSize(24)
      .setShadow(1, 1);

    this.current_description = this.add
      .text(
        this.layoutPadding,
        height * (1 - this.layoutDivider) + this.layoutPadding * 2,
        "Click an animal to see its thing.",
        {
          font: "25px Helvetica",
          fill: "white",
          wordWrap: { width: window.innerWidth / 2 },
        }
      )
      .setFontSize(24)
      .setShadow(1, 1);
  }
}

const config = {
  type: Phaser.AUTO,
  scale: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  parent: "phaser-example",
  scene: Example,
};

const game = new Phaser.Game(config);
