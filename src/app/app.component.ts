import { Component, OnInit } from '@angular/core';
import { Cell } from './cell.model';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  cells: Cell[][];
  maxRow = 30;
  maxCol = 30;
  subscription: Subscription;

  ngOnInit(): void {
    this.randomSeed().then(cells => {
      this.cells = cells;

      // Every second apply rules
      const tik = interval(100);
      this.subscription = tik.subscribe(val => this.applyRules());
    });

    
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async randomSeed(): Promise<Cell[][]> {
    var cells = [];
    for (var i=0; i < this.maxRow; ++i) {
      var col = [];
      for (var j = 0; j < this.maxCol; ++j) {
        var alive = Math.round(Math.random());
        var cell = {alive: alive};
        col.push(cell);
      }
      cells.push(col);
    }
    return cells;
  }

  checkNeighbors(row, col): number {
    let neighbors = 0;


    for (var i = row-1; i <= row+1; ++i) {
      for (var j = col-1; j <= col+1; ++j) {
        if ((i != row || j != col) && this.cells[(i+this.maxRow)%this.maxRow][(j+this.maxCol)%this.maxCol].alive) {
            neighbors++;
          }
      }
    }

    return neighbors;
  }

  applyRules(): void {
    var next = JSON.parse(JSON.stringify(this.cells));
    
    for (var i=0; i < this.maxRow; ++i) {
      for (var j = 0; j < this.maxCol; ++j) {
        let neighbors = this.checkNeighbors(i, j);

        // Any live cell with two or three neighbors survives.
        if (this.cells[i][j].alive && (neighbors < 2 || neighbors > 3)) next[i][j].alive = false;
        // Any dead cell with three live neighbors becomes a live cell.
        if (!this.cells[i][j].alive && neighbors == 3) next[i][j].alive = true;

        // All other live cells die in the next generation. Similarly, all other dead cells stay dead.
      }
    }

    this.cells = next;
  }
  
}
