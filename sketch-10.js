const canvasSketch = require("canvas-sketch");

// Parameters for this artwork
const settings = {
  // Choose a paper size
  dimensions: [ 1080, 1080 ],
  // Artwork Orientation
  orientation: "portrait",
  // Print-ready size
  pixelsPerInch: 72,
  // You can work in 'cm', 'in' or 'px'
  units: "px"
};

// Your sketch, which simply returns the shader
const sketch = ({ canvas, update }) => {
  const mouse = createMouse(canvas, {
    onMove: () => update()
  });
  return {
    render(props) {
      const { context, width, height, styleWidth, styleHeight } = props;

      // Normalize pixel mouse opsition to 0..1 UV coordinates
      const u = mouse.position[0] / styleWidth;
      const v = mouse.position[1] / styleHeight;

      // Un-normalize to our rendering units
      const x = u * width;
      const y = v * height;

      context.clearRect(0, 0, width, height);
      context.beginPath();
      context.arc(x, y, 50, 0, Math.PI * 2);
      context.fill();
    },
    unload() {
      mouse.dispose();
    }
  };
};

// Setup the artwork
canvasSketch(sketch, settings);

function createMouse(canvas, opts = {}) {
  const mouse = {
    moved: false,
    position: [0, 0],
    normalized: [0, 0],
    dispose
  };

  window.addEventListener("mousemove", move);

  return mouse;

  function move(ev) {
    mouseEventOffset(ev, canvas, mouse.position);
    if (opts.onMove) opts.onMove();
  }

  function dispose() {
    window.removeEventListener("mousemove", move);
  }
}

function mouseEventOffset(ev, target, out = [0, 0]) {
  target = target || ev.currentTarget || ev.srcElement;
  const cx = ev.clientX || 0;
  const cy = ev.clientY || 0;
  const rect = target.getBoundingClientRect();
  out[0] = cx - rect.left;
  out[1] = cy - rect.top;
  return out;
}
