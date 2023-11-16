const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ]
};

// const degToRad = (degree) => {
//   return degree / 180 * Math.PI;
// };

// const randomRange = (min, max) =>
// {
//   return Math.random() * (max - min) + min;
// }

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    const cx = width * 0.5;
    const cy = height * 0.5;
    const w = width * 0.01;
    const h = height * 0.1;
    let x, y;

    const num = 50;
    const radius = width * 0.3;

    for (let i = 0; i < num; i++) {
      const slice = math.degToRad(360 / num);
      const angle = slice * i;

      x = cx + radius * Math.sin(angle);
      y = cy + radius * Math.cos(angle);

      // rechtecke
      context.save();
      context.translate(x,y);
      context.rotate(-angle);
      context.scale(random.range(0.1,2), random.range(0.2,0.5));
      //context.scale(random.range(0.05,3), random.range(0.05,4));
      context.fillStyle = 'white';
      context.beginPath();
      context.rect(random.range(0,-w * 2),random.range(0,-h * 0.5),w,h);
      context.fill();
      context.restore();
      
      //slices
      context.save();
      context.translate(cx,cy);
      context.rotate(-angle);

      context.lineWidth = random.range(1,20);
      context.beginPath();
      context.strokeStyle = 'white';
      context.arc(0,0, radius * random.range(0.7, 3), slice * random.range(-8,0), slice * random.range(1,6));
      context.stroke();
      context.restore();

      //circles
      context.save();
      context.translate(cx,cy);
      context.rotate(-angle);
      context.fillStyle = 'white';
      context.beginPath();
      context.arc(radius * random.range(1,3) * 0.5,-radius, random.range(1,25), 0, 2 * Math.PI);
      context.fill();
      context.restore();
    }
  };
};

canvasSketch(sketch, settings);
