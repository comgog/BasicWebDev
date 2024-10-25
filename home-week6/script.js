document.addEventListener("DOMContentLoaded", () => {
  console.log(document.getElementById("plant1"));
  dragElement(document.getElementById("plant1"));
  dragElement(document.getElementById("plant2"));
  dragElement(document.getElementById("plant3"));
  dragElement(document.getElementById("plant4"));
  dragElement(document.getElementById("plant5"));
  dragElement(document.getElementById("plant6"));
  dragElement(document.getElementById("plant7"));
  dragElement(document.getElementById("plant8"));
  dragElement(document.getElementById("plant9"));
  dragElement(document.getElementById("plant10"));
  dragElement(document.getElementById("plant11"));
  dragElement(document.getElementById("plant12"));
  dragElement(document.getElementById("plant13"));
  dragElement(document.getElementById("plant14"));
});

let topPlant = "plant1";

function dragElement(terrariumElement) {
  let pos1 = 0,
    pos2 = 0,
    prevX = 0,
    prevY = 0;
  terrariumElement.setAttribute("dragable", true);

  terrariumElement.addEventListener("dragstart", pointerDragStart);
  terrariumElement.addEventListener("drag", pointerDrag);
  terrariumElement.addEventListener("dragover", (e) => {
    e.preventDefault();
  });
  terrariumElement.addEventListener("dragend", (e) => {
    e.preventDefault();
  });

  terrariumElement.addEventListener("dblclick", bringFront);

  function pointerDrag(e) {
    pos1 = prevX - e.clientX;
    pos2 = prevY - e.clientY;
    prevX = e.clientX;
    prevY = e.clientY;
    console.log(pos1, pos2, prevX, prevY);
    terrariumElement.style.top = terrariumElement.offsetTop - pos2 + "px";
    terrariumElement.style.left = terrariumElement.offsetLeft - pos1 + "px";
  }

  function pointerDragStart(e) {
    prevX = e.clientX;
    prevY = e.clientY;
  }

  function bringFront() {
    document.getElementById(topPlant).style.zIndex = 4;
    terrariumElement.style.zIndex = 5;
    topPlant = terrariumElement.id;
  }
}
