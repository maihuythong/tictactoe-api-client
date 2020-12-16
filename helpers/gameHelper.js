const nrows = 20;
const ncols = 20;

class GameHelper {
  constructor(data) {
    this.matrix = new Array(nrows).fill(0).map(row => new Array(ncols).fill(0));
    if(data){
      for (let i = 0; i < data.length; i++) {
        let x = data[i].x;
        let y = data[i].y;
        let value = data[i].value; // 1-2
        this.matrix[i][y] = value;
      }
    }
  }

  play(x, y, value) {
    if (matrix[x][y] !== 0){
      return false;
    }else{

    }
  } 

  display(){
    for (let i = 0; i < nrows; i++) {
      for (let j = 0; j < ncols; j++) {
        console.log( this.matrix[i][j]);
      }
    }
  }


}