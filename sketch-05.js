const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1920 ], 
  animate: true
};


const sketch = ({ context, width, height }) => {
  const rectArray = [];
  const slicesArray = [];

  const cx = width * 0.5;
  const cy = height * 0.5;
  const w = width * 0.01;
  const h = height * 0.1;
  let x, y;

  const num = 50;
  const radius = width * 0.3;

  for (let i = 0; i < num; i++) {

    const sliceNum = math.degToRad(360 / num);
    const angle = sliceNum * i;

    x = cx + radius * Math.sin(angle);
    y = cy + radius * Math.cos(angle);

    //rechtecke
    rectArray.push(new Agent(angle, x, y, w, h, sliceNum));

    //slices
    slicesArray.push(new Agent(angle, x, y, w, h, sliceNum));
  }

  

  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    
    //rects.update();
    //circleslices.update();

    // rects
    rectArray.forEach(rect => {
      rect.updateRect();
      rect.drawRect(context, w, h);
      rect.bounceRect();
    });

    // slices
    slicesArray.forEach(slice => {
      slice.updateSlices();
      slice.drawSlices(context, cx, cy, radius);
    });
  };
};


class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Agent {
  constructor(angle, x, y, w, h, sliceNum) {
    this.w = w;
    this.h = h;
    this.sliceNum = sliceNum;
    this.angle = angle;
    this.pos = new Vector(x, y);

    this.randomscale_x = random.range(0.1,2);
    this.randomscale_y = random.range(0.2,0.5);
    this.randomrect_x = random.range(0,-w * 2);
    this.randomrect_y = random.range(0,-h * 0.5);

    this.randomlinewidth = random.range(0.2,4);
    this.randomradius = random.range(0.3, 2);
    this.randomslice_start = random.range(-8,0);
    this.randomslice_end = random.range(1,6);

    this.vel =  random.range(0.001, 0.02);
    this.tall =  random.range(-10,10);
  }
  updateRect() {
    this.h += this.tall;
  }

  bounceRect() {
    if (this.h >= 400 || this.h <= -200) this.tall *= -1;
  }

  updateSlices() {
    this.angle += this.vel;
  }

  drawRect(context){
      //rechtecke
      context.save();
      context.translate(this.pos.x,this.pos.y);
      context.rotate(-this.angle);
      context.scale(this.randomscale_x, this.randomscale_y);
      context.fillStyle = 'white';
      context.beginPath();
      context.rect(this.randomrect_x,this.randomrect_y,this.w,this.h);
      context.fill();
      context.restore();
  }

  drawSlices(context, cx, cy, radius){
    context.save();
    context.translate(cx,cy);
    context.rotate(-this.angle);
    context.lineWidth = this.randomlinewidth;
    context.beginPath();
    context.strokeStyle = 'white';
    context.arc(0,0, radius * this.randomradius, this.sliceNum * this.randomslice_start, this.sliceNum * this.randomslice_end);

    // context.arc(0,0, 400, 0, 10);
    context.stroke();
    context.restore();
  }
}


canvasSketch(sketch, settings);
