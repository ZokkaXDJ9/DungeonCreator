let canvas;
let canvasWidth = window.innerWidth
let canvasHeight = window.innerHeight
let modifier = 50
let userinteractX = modifier * 10
let userinteractY = modifier * 10

const controls = {
  view: { x: 0, y: 0, zoom: 1 },
  viewPos: { prevX: null, prevY: null, isDragging: false },
}

function setup() {
  canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.mouseWheel(e => Controls.zoom(controls).worldZoom(e))
}

function draw() {
  background(255)
  translate(controls.view.x, controls.view.y);
  scale(controls.view.zoom)

  for (let x = 0; x < userinteractX; x += modifier) {
    for (let y = 0; y < userinteractY; y += modifier) {
      rect(x, y, modifier, modifier);
    }
  }
}

window.mousePressed = e => Controls.move(controls).mousePressed(e)
window.mouseDragged = e => Controls.move(controls).mouseDragged(e);
window.mouseReleased = e => Controls.move(controls).mouseReleased(e)


class Controls {
  static move(controls) {
    function mousePressed(e) {
      controls.viewPos.isDragging = true;
      controls.viewPos.prevX = e.clientX;
      controls.viewPos.prevY = e.clientY;
    }

    function mouseDragged(e) {
      const { prevX, prevY, isDragging } = controls.viewPos;
      if (!isDragging) return;

      const pos = { x: e.clientX, y: e.clientY };
      const dx = pos.x - prevX;
      const dy = pos.y - prevY;

      if (prevX || prevY) {
        controls.view.x += dx;
        controls.view.y += dy;
        controls.viewPos.prevX = pos.x, controls.viewPos.prevY = pos.y
      }
    }

    function mouseReleased(e) {
      controls.viewPos.isDragging = false;
      controls.viewPos.prevX = null;
      controls.viewPos.prevY = null;
    }

    return {
      mousePressed,
      mouseDragged,
      mouseReleased
    }
  }

  static zoom(controls) {
    // function calcPos(x, y, zoom) {
    //   const newX = width - (width * zoom - x);
    //   const newY = height - (height * zoom - y);
    //   return {x: newX, y: newY}
    // }

    function worldZoom(e) {
      const { x, y, deltaY } = e;
      const direction = deltaY > 0 ? -1 : 1;
      const factor = 0.05;
      const zoom = 1 * direction * factor;

      const wx = (x - controls.view.x) / (width * controls.view.zoom);
      const wy = (y - controls.view.y) / (height * controls.view.zoom);

      controls.view.x -= wx * width * zoom;
      controls.view.y -= wy * height * zoom;
      controls.view.zoom += zoom;
    }

    return { worldZoom }
  }
}