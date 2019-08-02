import React, {Component} from 'react';
import './App.sass';



let counter = 0;

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      wasCreated: false,
      // your can easily change number of cells, just change 'size' and 'sizeWord' properties for any available (f.e size=3, sizeWord='three')
      size: 4, // for now available 3 and 4
      sizeName: 'four' // for now available 'three' and 'four'
    }
  }

  componentDidMount() {
    this.buildLabyrinth();
    this.startGame();
  };


  buildLabyrinth = () => {

    let size = this.state.size;
    let container = document.getElementsByClassName('labyrinth')[0]

    // create labyrinth with property number of cells
    for (let i = 0; i < size * size; i++) {
      let cell = document.createElement('div');
      cell.setAttribute('number', i + 1)
      cell.classList.add(`${this.state.sizeName}-in-row`, 'cell')
      container.appendChild(cell);
    }

    // set restricts for sides
    let cells = document.getElementsByClassName('cell');

    // top
    for (let i = 0; i < size; i++) {
      cells[i].classList.add('top');
    }

    // right
    for (let i = size - 1; i < size * size; i = i + size) {
      cells[i].classList.add('right');
    }

    // bottom
    for (let i = size * size - size; i < size * size; i++) {
      cells[i].classList.add('bottom')
    }

    // left
    for (let i = 0; i <= 1 + size * (size - 1); i = i + size) {
      cells[i].classList.add('left')
    }

  };

  startGame = () => {
    let size = this.state.size;
    let cells = document.getElementsByClassName('cell');

    // getting random cell to start
    this.setState({
      randomNumber: Math.floor(Math.random() * size * size)
    }, () => {
      let startCell = cells[this.state.randomNumber]
      startCell.classList.add('start');
      startCell.innerHTML = 'Start';
      this.createSteps();
    });
  };

  // show steps with delay
  createSteps = () => {

    let {size} = this.state;
    let cells = document.getElementsByClassName('cell');
    let direction = ['top', 'right', 'bottom', 'left'];
    let steps = document.getElementsByClassName('container')[0];

    // remove direction if not available for current position (for example we cannot move right if current position is on the right side)
    cells[this.state.randomNumber].classList.contains('top') && direction.splice(direction.indexOf('top'), 1);
    cells[this.state.randomNumber].classList.contains('right') && direction.splice(direction.indexOf('right'), 1);
    cells[this.state.randomNumber].classList.contains('bottom') && direction.splice(direction.indexOf('bottom'), 1);
    cells[this.state.randomNumber].classList.contains('left') && direction.splice(direction.indexOf('left'), 1);
    let randomSide = direction[Math.floor(Math.random() * direction.length)];

    // change current position according to new step
    switch (randomSide) {
      case 'top':
        this.setState({
          randomNumber: this.state.randomNumber - size
        });
        break;
      case 'right':
        this.setState({
          randomNumber: this.state.randomNumber + 1
        });
        break;
      case 'bottom':
        this.setState({
          randomNumber: this.state.randomNumber + size
        });
        break;
      case 'left':
        this.setState({
          randomNumber: this.state.randomNumber - 1
        });
        break;
      default:
        return null;
    }

    counter++;

    let newStep = document.createElement('div');
    newStep.classList.add(randomSide);
    steps.appendChild(newStep);

    if (counter < 10) setTimeout(() => {
      this.createSteps();
    }, 100);
    else {
      setTimeout(() => {
        cells[this.state.randomNumber].setAttribute('finish', 'true');
        this.checkIfTrue(cells[this.state.randomNumber]);
      }, 1000)
    }

  };

  checkIfTrue = (correctElem) => {

    let cells = document.getElementsByClassName('cell')
    for (let i = 0; i < cells.length; i++) {
      cells[i].addEventListener('click', (event) => {

        // prevent additional try
        if (this.state.clicked) return false;

        if (+event.target.getAttribute('number') === this.state.randomNumber + 1) {
          event.target.classList.add('correct');
        } else {
          event.target.classList.add('wrong');
          correctElem.classList.add('show')
        }
        this.setState({clicked: true});
      })
    }

  };

  newGame = () => {
    window.location.reload()
  };

  render() {
    const {size} = this.state;

    return (
      <div className="App">
        <h1>Labyrinth on {size * size} cells </h1>
        <div className="again">
          <button onClick={this.newGame}>Play again</button>
        </div>

        <div className="labyrinth"></div>
        <div className="steps">
          <h2>Steps</h2>
          <div className="container"></div>
        </div>

      </div>
    );
  }

}

export default App;
