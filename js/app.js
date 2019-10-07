'use strict';

let words = {};

try {
  words = JSON.parse(localStorage.getItem('words')) || wordList;
} catch(e) { console.log("No Words"); }

console.log(words);

let backboard = document.getElementById('backboard');
let backboardTop = backboard.offsetTop;
let backboardLeft = backboard.offsetLeft;
let backboardHeight = backboard.scrollHeight - backboardTop * 2;
let backboardWidth = backboard.scrollWidth - backboardLeft * 2;

let currentMagnet;

Object.keys(words).forEach(word => {
  let magnet = addMagnet(word);
  positionMagnet(magnet);
});

backboard.addEventListener('mousemove', dragIt);
backboard.addEventListener('mouseup', dropMagnet);

function dragIt(e) {
  e.preventDefault();
  if ( ! currentMagnet ) { return; }
  let top = e.pageY - backboardTop - (currentMagnet.offsetHeight/2) + "px";
  let left = e.pageX - backboardLeft - (currentMagnet.offsetWidth/1.2) + "px";

  // Visually move it
  currentMagnet.style.top = top;
  currentMagnet.style.left = left;
}

function dropMagnet(e) {
  e.preventDefault();
  if ( ! currentMagnet ) { return; }
  words[currentMagnet.textContent].top = currentMagnet.style.top;
  words[currentMagnet.textContent].left = currentMagnet.style.left;
  save();
  currentMagnet = null;
}

function grabIt(e) {
  currentMagnet = e.target;
  e.preventDefault();
}

function save() {
  localStorage.setItem('words', JSON.stringify(words));
}

function addMagnet(word) {
  let magnet = addElement('span', word, backboard);
  magnet.classList.add('magnet');
  magnet.addEventListener('mousedown', grabIt);
  return magnet;
}

function positionMagnet(magnet) {

  let magnets = document.getElementsByClassName('magnet');
  let word = magnet.textContent;
  if ( words[word].top && words[word].left ) {
    magnet.style.top = words[word].top;
    magnet.style.left = words[word].left;
    return;
  }

  let rendered = false;

  while(! rendered) {
    let isCollision = false;
    let top =randomNumberBetween(backboardTop, backboardHeight) + 'px';
    let left = randomNumberBetween(backboardLeft, backboardWidth) + 'px';
    magnet.style.top = top;
    magnet.style.left = left;

    for(let i=0; i<=magnets.length; i++) {
      if ( magnets[i] === magnet ) { continue; }
      isCollision = collisionBetween(magnet, magnets[i]);
      if( isCollision ) { break; }
    }
    rendered = ! isCollision;
  }
}

function collisionBetween(element1, element2) {

    if ( ! element1 || ! element2 ) { return false; }

    var rect1 = element1.getBoundingClientRect();
    var rect2 = element2.getBoundingClientRect();

    return !(
      rect1.top > rect2.bottom ||
      rect1.right < rect2.left ||
      rect1.bottom < rect2.top ||
      rect1.left > rect2.right
    );
}

function addElement(element, content, parent) {
  var newElement = document.createElement(element);
  var newContent = document.createTextNode(content);
  newElement.appendChild(newContent);
  parent.appendChild(newElement);
  return newElement;
}

function randomNumberBetween(min, max) {
  var randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber;
}
