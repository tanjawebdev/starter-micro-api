const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ], 
  animate: true
};

let manager;
let img;

let text = 'B';
let fontSize = 1200;
let fontFamily = 'Bigilla';
let fontWeight = 'normal';

const typeCanvas = document.createElement('canvas');
const typeContext = typeCanvas.getContext('2d');

const imageCanvas = document.createElement('canvas');
const imageContext = imageCanvas.getContext('2d');

const sketch = ({ context, width, height }) => {
  const cell = 10;
  const cols = Math.floor(width / cell); 
  const rows = Math.floor(height / cell);
  const numCells = cols * rows;

  imageCanvas.width = cols;
  imageCanvas.height = rows;


  return ({ context, width, height }) => {
    imageContext.fillStyle = 'red';
    imageContext.fillRect(0, 0, rows, cols);
    fontSize = cols;

    const startImage = async () => {
      const img = await loadMeSomeImage(url);
      console.log('image width', img.width);  
      //imageContext.drawImage(img, 0, 0);

      // object fit cover image
      var hRatio = cols  / img.width;
      var vRatio =  rows / img.height;
      var ratio  = Math.max ( hRatio, vRatio );
      var centerShift_x = ( width - img.width*ratio ) / 2;
      var centerShift_y = ( height - img.height*ratio ) / 2;  
      imageContext.clearRect(0, 0, width, height);
      imageContext.drawImage(img, 0,0, cols, rows);  

      //context.drawImage(img, 0, 0);

      const typeData = imageContext.getImageData(0,0,cols,rows).data;
      console.log(typeData);

      context.fillStyle = '#000000';
      context.fillRect(0, 0, width, height);

      context.textBaseline = 'middle';
      context.textAlign = 'center';

      for (let i = 0; i < numCells; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);

        const x = col * cell;
        const y = row * cell;

        const r = typeData[i * 4 + 0];
        const g = typeData[i * 4 + 1];
        const b = typeData[i * 4 + 2];
        const a = typeData[i * 4 + 3];

        const rgba = [r,g,b,a];

        //for (let i = 0; i < 4; i++) {
          const glyph = getGlyph(rgba[2]);
          context.font = `${cell * 0.5}px ${fontFamily}`;
          if (Math.random() < 0.1) context.font = `${cell * 1}px ${fontFamily}`;
          context.fillStyle = `rgba(${r},${g},${b},${a})`;

          context.save();
          context.translate(x, y);
          context.translate(cell/2, cell/2);
          context.fillText(glyph,0,0);
          context.restore();
        //}
      }
    };
    
    startImage();
  };
};

const getGlyph = (v) => {
  if (v < 50) return '';
  if (v < 100) return '.';
  if (v < 150) return '*';
  if (v < 200) return 'l';

  const glyphs = '_=*@0'.split('');

  return random.pick(glyphs);
}

const onKeyUp = (e) => {
  text = e.key.toUpperCase();
  manager.render();
}

document.addEventListener('keyup', onKeyUp);

const start = async () => {
  manager = await canvasSketch(sketch, settings);
}

start();







/// beispiel async and sync functions

const url= 'images/logo-tk.jpg';

const loadMeSomeImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject();
    img.src = url;
  });
}

// const startImage = async () => {
//   const img = await loadMeSomeImage(url);
//   console.log('image width', img.width);
// };

//startImage();

// const startImage = () => {
//   loadMeSomeImage(url).then(img => {
//     console.log('image width', img.width);
//   });
//   console.log('this line');
// };



