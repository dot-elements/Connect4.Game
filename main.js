$(document).ready(function(){
    const connect4=new Connect4('#connect4');

    connect4.playerSwitch=function(){
        $('#player').text(connect4.player);
    }
    $('#restart').click(function(){
        connect4.restart();
    })
});


class Connect4{
    constructor(selector){
        this.ROWS=6;
        this.COLS=7;
        this.player='red';
        this.playerSwitch=function(){}; 
        this.isGameOver=false;
        this.selector=selector;
        this.createGrid();
        this.setupEventListeners();
    }
    createGrid(){
        const $board= $(this.selector); 
        $board.empty();
        this.isGameOver=false;
        this.player='red';
        
        for(let row=0;row<this.ROWS;row++){
            const $row= $('<div>')
                .addClass('row');
            for(let col=0;col<this.COLS;col++){
                const $col= $('<div>').addClass('col empty').attr('data-col',col).attr('data-row',row);
                $row.append($col);
            }
            $board.append($row);
        }
        
    }
    setupEventListeners(){
        const $board = $(this.selector);
        const that=this;
        function gasesteLastEmptyCell(col){
            const cells=$(`.col[data-col='${col}']`);
            for(let i=cells.length-1;i>=0;i--){
                const $cell=$(cells[i]);
                if($cell.hasClass('empty')){
                    return $cell;
                }
            }
            return null;
        }
        $board.on('mouseenter','.col.empty',function(){

            if(that.isGameOver)return;


            const col=$(this).data('col');
            const $lastEmptyCell = gasesteLastEmptyCell(col);
            $lastEmptyCell.addClass(`next-${that.player}`);
            
        });
        $board.on('mouseleave','.col',function(){
            $('.col').removeClass(`next-${that.player}`);
        });
        $board.on('click','.col.empty',function(){
            const col=$(this).data('col');
            const $lastEmptyCell = gasesteLastEmptyCell(col);
            $lastEmptyCell.removeClass(`empty next-${that.player}`);
            $lastEmptyCell.addClass(that.player);
            $lastEmptyCell.data('player',that.player);


            const winner = that.checkForWinner($lastEmptyCell.data('row'),$lastEmptyCell.data('col'));
            if(winner){
                that.isGameOver=true;
                alert(`Game Over! Player ${that.player} has won!`);
                $('.col.empty').removeClass('empty');
                return;
            }
            
            that.player=(that.player==='red')? 'black':'red';
            that.playerSwitch();
            $(this).trigger('mouseenter');
            
        });
    }
    checkForWinner(row,col){
        const that=this;
        function $getCell(i,j){
            return $(`.col[data-row='${i}'][data-col='${j}']`);
        }
        function checkDirectie(directie){
            let total=0;
            let i=row+directie.i;
            let j=col+directie.j;
            let $next=$getCell(i,j);
            while(i>=0 && i<that.ROWS&&j>=0&&j<that.COLS && $next.data('player')===that.player){
                total++;
                i+=directie.i;
                j+=directie.j;
                $next=$getCell(i,j);
            }
            return total;
        }
        function checkWin(directieA,directieB){
            const total=1+
                checkDirectie(directieA)+
                checkDirectie(directieB);
            if(total >= 4){
                return that.player;
            }else{
                return null;
            }
        }
        function checkDiagonalaStangaJosLaDreaptaSus(){
            return checkWin({i:1,j:-1},{i:1,j:1});
        }
        function checkDiagonalaStangaSusLaDreaptaJos(){
            return checkWin({i:1,j:1},{i:-1,j:-1});
        }
        function checkVerticala(){
            return checkWin({i:-1,j:0},{i:1,j:0});
        }
        function checkOrizontala(){
            return checkWin({i:0,j:-1},{i:0,j:1});
        }
        return checkVerticala()||checkOrizontala()||checkDiagonalaStangaJosLaDreaptaSus()||checkDiagonalaStangaSusLaDreaptaJos();
    }
    restart(){
        this.createGrid();
        this.playerSwitch();
    }
}