import React, { Component } from 'react';
import { render } from 'react-dom';
import Hello from './Hello';
import './style.css';

class App extends Component {
  componentDidMount () {
    const columns = 50
    const rows = 50
    const snakeMovementTime = 30
    drawGrid(this.gridWrapper, columns, rows, { drawLines: false })

    let snake = initSnake(
      Math.floor((columns / 2)) + 1,
      Math.floor((rows / 2)) + 1
    )

    let direction = 'down'
  }

  render() {
    return (
      <div ref={gridWrapper => this.gridWrapper = gridWrapper}>
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));


document.onkeydown = checkKey;

function checkKey(e) {
  if (e.keyCode == '38') {
    direction = 'up'
  }
  else if (e.keyCode == '40') {
    direction = 'down'
  }
  else if (e.keyCode == '37') {
    direction = 'left'
  }
  else if (e.keyCode == '39') {
    direction = 'right'
  }
}

function moveSnake () {
  const head = snake[0]
  const x = head.x
  const y = head.y
  if (direction === 'up') {
    moveSnakePiece(snake[snake.length - 1], x, y - 1)
  } else if (direction === 'down') {
    moveSnakePiece(snake[snake.length - 1], x, y + 1)
  } else if (direction === 'left') {
    moveSnakePiece(snake[snake.length - 1], x - 1, y)
  } else if (direction === 'right') {
    moveSnakePiece(snake[snake.length - 1], x + 1 , y)
  }
  snake.unshift(snake[snake.length - 1])
  snake.splice(snake.length - 1, 1)
}

function moveSnakePiece (piece, x, y) {
  piece.x = x
  piece.y = y
}

function initSnake (x, y) {
  let snake = []
  const snakeHead = getNewSnakePiece(x, y)
  snake.push(snakeHead)
  return snake
}


function activateSnakePiece (x, y) {
  const index = (y * 20) + x
  setStylesOnElemetn({
    background: '#333'
  }, blocks[index])
}

function growSnake () {
  const lastSnakePiece = snake[snake.length - 1]
  const x = lastSnakePiece.position.x
  const y = lastSnakePiece.position.y
  snake.push(getNewSnakePiece(x, y))
}


  
function drawGrid (gridWrapper, columns, rows, opts = {}) {
  gridWrapper.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  gridWrapper.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  
  if (opts.drawLines) {
    for (let i = 1; i <= columns * rows; i++) {
     gridWrapper.appendChild(document.createElement('div')) 
    }

    const divs = gridWrapper
      .children

    for (let i = 0; i < divs.length; i++) {
      divs[i].innerHTML = `x: ${((i + 1) % columns || columns)}<br/>y: ${Math.floor(i / columns) + 1}`
      divs[i].style.gridColumn = `${((i + 1) % columns || columns)}`
      divs[i].style.gridRow = `${Math.floor(i / columns) + 1}`
      divs[i].style.background = '#EEE'
      divs[i].style.opacity = '0.7'
      divs[i].style.zIndex = -1
    } 
  }
}

function setStylesOnElement (styles, element) {
    Object.assign(element.style, styles);
}
