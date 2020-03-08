//Definition of the tree class.
function tree() {
  this.angle = 0;
  this.axiom = "F";
  this.sentence = this.axiom;
  this.generation = 1;
  this.len = 75;
  this.weight = [];
  this.branchValue = 1;
  this.alphabet = ["F", "f", "[", "]", "+", "-"];
  this.rules = {
    letter: "",
    becomes: ""
  };
  this.trials = [
    "F[-F]F[+F][F]",
    "FF[--F+F][+FF---F]",
    "FF[++F-F-F][-F+F+F]",
    "FF[++F-F-F][--F+F+F]",
    "FFF[++F-F-F][--F+F+F]",
    "FF[--F+FF+F][+F-F-F]",
    "FF[++F[-F]+F][--F[+F]-F]",
    "FF[++F[-F]+F][F[+F]-F][--F[+F]-F]",
    "FFF[++FF[--F][++F]][FF[++F][--F]][--FF[++F][--F]]"
  ];
}

function checkRule(rules, alphabet) {
  var check = false;
  var openCount = 0;
  var closeCount = 0;
  for (var i = 0; i < rules.length; i++) {
    var current = rules.charAt(i);
    check = false;
    for (var j = 0; j < alphabet.length; j++) {
      if (current == alphabet[j]) {
        check = true;
        break;
      }
    }
    if (check == false) {
      break;
    }
  }

  for (var i = 0; i < rules.length; i++) {
    var current = rules.charAt(i);
    if (current == "[") {
      openCount += 1;
    }
    if (current == "]") {
      closeCount += 1;
    }
  }
  if (check == false || openCount != closeCount) {
    return false;
  }
  return true;
}

//Generates the next sentence. It applies the rules to the current
//sentence to do so.
tree.prototype.generate = function() {
  if (!checkRule(this.rules.becomes, this.alphabet)) {
  } else {
    this.initialAssign(this.rules.becomes);
    if (this.generation < 1) {
      this.generation = 1;
    }
    for (let gen = 0; gen < this.generation; gen++) {
      this.branchValue += 1; //To ensure increased thickness of trunk.
      var nextSentence = "";
      for (var i = 0; i < this.sentence.length; i++) {
        var current = this.sentence.charAt(i);
        if (current == current.toLowerCase()) {
          current = current.toUpperCase();
        }
        var found = false;

        if (current == this.rules.letter) {
          found = true;
          nextSentence += this.rules.becomes;
        }

        if (!found) {
          nextSentence += current;
        }
      }
      this.sentence = nextSentence;
    }
  }
};

//Sets the required values for the tree.
tree.prototype.initialAssign = function(text) {
  this.branchValue = 1;
  this.sentence = this.axiom;
  this.rules.letter = "F";
  this.rules.becomes = text;
};

//Assigns colors to different parts of tree
tree.prototype.colorAssign = function() {
  var colorValue;
  if (this.branchValue > 5) {
    colorValue = document.getElementById("colorSet5").value;
  } else if (this.branchValue > 0) {
    colorValue = document.getElementById("colorSet" + this.branchValue).value;
  } else {
    colorValue = document.getElementById("colorSet1").value;
  }
  stroke(colorValue);
};

//The drawing of the tree.
tree.prototype.draw = function() {
  background(10);
  colorValue = color(document.getElementById("bgColorSet").value);
  fill(colorValue);
  resetMatrix();
  translate(width / 2, height);

  for (var i = 0; i < this.weight.length; i++) {
    this.weight[i] = document.getElementById("widthSet" + (i + 1)).value;
  }

  for (var i = 0; i < this.sentence.length; i++) {
    var current = this.sentence.charAt(i);

    if (current == "F" || current == "f") {
      if (this.branchValue > 5) strokeWeight(this.weight[4]);
      else if (this.branchValue > 0)
        strokeWeight(this.weight[this.branchValue - 1]);
      else strokeWeight(this.weight[0]);

      if (document.getElementById("trippyColor").checked == true) {
        var colorValue = getRandomColor();
        stroke(colorValue);
      } else {
        this.colorAssign();
      }

      let lineSize = -this.len * 0.64 ** this.generation;

      line(0, 0, 0, lineSize);
      translate(0, lineSize);
    } else if (current == "+") {
      rotate(this.angle);
    } else if (current == "-") {
      rotate(-this.angle);
    } else if (current == "[") {
      this.branchValue -= 1;
      push();
    } else if (current == "]") {
      this.branchValue += 1;
      pop();
    }
  }
};

//Returns a random color.
function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var colorValue = "#";
  for (var i = 0; i < 6; i++) {
    colorValue += letters[Math.floor(Math.random() * 16)];
  }
  return colorValue;
}

//On clicking on of the trial button, primary tree is generated.
function addToInput(text) {
  var input = document.getElementById("input");
  input.value = text;
  document.getElementById("primaryTree").click();
}

//Creates the button and appends to the list.
function create(text) {
  var li = document.createElement("LI");
  li.classList.add("row");
  li.classList.add("center");
  var newButton = document.createElement("BUTTON");
  newButton.classList.add("btn");
  newButton.classList.add("indigo");
  newButton.classList.add("waves-effect");

  newButton.value = text;
  newButton.innerHTML = text;
  newButton.onclick = function() {
    addToInput(text);
  };
  li.appendChild(newButton);
  document.getElementById("trials").appendChild(li);
}

//Runs on loading.
function setup() {
  var treeObject = new tree(); //creates object of the class tree.
  treeObject.angle = radians(25);
  for (var i = 0; i < 5; i++) {
    treeObject.weight[i] = i + 1;
  }

  var init = function() {
    var lengthSlider = document.getElementById("length-slider").noUiSlider;
    var angleSlider = document.getElementById("angle-slider").noUiSlider;
    var angle = angleSlider.get();
    treeObject.angle = radians(angle);
    treeObject.len = lengthSlider.get();
    treeObject.initialAssign(document.getElementById("input").value);
  };

  //Adds options if no options have been added before else displays all options.
  var trialNotEmpty = JSON.parse(localStorage.getItem("trials"));
  if (!trialNotEmpty) {
    localStorage.setItem("trials", JSON.stringify(treeObject.trials));
    for (var i = 0; i < treeObject.trials.length; i++) {
      create(treeObject.trials[i]);
    }
  } else {
    treeObject.trials = JSON.parse(localStorage.getItem("trials"));
    for (var i = 0; i < treeObject.trials.length; i++) {
      create(treeObject.trials[i]);
    }
  }

  var ruleExists = function() {
    if (
      treeObject.rules.becomes.length > 0 &&
      checkRule(treeObject.rules.becomes, treeObject.alphabet)
    ) {
      return true;
    }
    return false;
  };

  //Functionality for button to generate primary branch.
  var primaryTree = document.getElementById("primaryTree");
  primaryTree.addEventListener("click", function() {
    init();
    if (ruleExists()) {
      treeObject.generation = 1;
      treeObject.generate();
      treeObject.draw();
    } else {
      alert("Please Enter a Valid Rule");
    }
  });

  // Functionality for button to create next iteration of present tree.
  var nextButton = document.getElementById("nextgen");
  nextButton.addEventListener("click", function() {
    if (ruleExists()) {
        if(treeObject.generation > 4)
        {
            alert("Such Levels of iteration will cause lag!");
        }
      treeObject.generation += 1;
      treeObject.generate();
      treeObject.draw();
    } else {
      alert("Please Enter a Valid Rule");
    }
  });

  // Functionality for button to create previous iteration of present tree.
  var prevButton = document.getElementById("prevgen");
  prevButton.addEventListener("click", function() {
    if (ruleExists()) {
      treeObject.generation -= 1;
      treeObject.generate();
      treeObject.draw();
    } else {
      alert("Please Enter a Valid Rule");
    }
  });

  //Saves your rule to localStroage and adds to list.
  var saveButton = document.getElementById("saveButton");
  saveButton.addEventListener("click", function() {
    var input = document.getElementById("input").value;
    create(input);
    treeObject.trials.push(input);
    localStorage.setItem("trials", JSON.stringify(treeObject.trials));
  });

  var redraw = function() {
    init();
    if (ruleExists()) {
      treeObject.generate();
      treeObject.draw();
    }
  };

  // Redraws and accounts for any changes made to color and widths
  var reGen = document.getElementById("reGen");
  reGen.addEventListener("click", function() {
    redraw();
  });

  let cnv = createCanvas(
    document.getElementById("canvas").clientWidth * 0.99,
    windowHeight * 0.8
  );
  cnv.style("display", "block");
  cnv.parent("canvas");
  treeObject.draw();

  var lengthSlider = document.getElementById("length-slider");
  var angleSlider = document.getElementById("angle-slider");
  lengthSlider.noUiSlider.on("slide", redraw);
  angleSlider.noUiSlider.on("slide", redraw);

  document.getElementById("input").addEventListener("input", redraw);
}

function windowResized() {
  //   resizeCanvas(windowWidth, windowHeight);
  redraw();
}
