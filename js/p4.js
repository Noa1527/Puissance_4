class P4{
    constructor(selector){
        this.COL = 7;
        this.LGN = 6;
        this.selector = selector;
        this.player = 'red';


        this.drawGame();
        this.ecoute();
        this.checkWin();
        
    }


    // Affichage du jeux 
    drawGame(){
        const $jeu = $(this.selector);

        for(let lgn = 0; lgn < this.LGN; lgn++){
            const $lgn = $('<div>').addClass('lgn');
            for(let col = 0; col < this.COL; col++){
                const $col = $('<div>').addClass('col empty').attr("data-col", col).attr("data-lgn", lgn);
                $lgn.append($col);
            }
            $jeu.append($lgn);
        }
    }

    ecoute(){
        // on cherche la derniere case libre 
        const $jeu = $(this.selector);
        const that = this;
        function lastCase(col){
            const $cells = $(`.col[data-col='${col}']`);
            for(let i = $cells.length - 1; i >= 0; i-- ){
                const $cell = $($cells[i]);
                if($cell.hasClass("empty")){
                    return $cell;
                };
            }
            return null;
        };
        // sourris sur la dive
        $jeu.on('mouseenter', '.col.empty', function(){
            
            const $col = $(this).data("col")
            const $last = lastCase($col)
            if ($last != null){
                $last.addClass(`p${that.player}`)
            }
        });
        // sourris sort de la div
        $jeu.on('mouseleave', '.col', function(){
            $('.col').removeClass(`p${that.player}`)
        });
        // quand tu clique la div devien rouge 

        $jeu.on('click', '.col.empty', function(){
            const $col = $(this).data("col")
            const $last = lastCase($col)
            $last.addClass(`${that.player}`).removeClass(`empty p${that.player}`).data('player', `${that.player}`);
            
            const winner = that.checkWin($last.data('lgn'), $last.data('col'));
            
            that.player = (that.player === 'red') ? 'yellow' : 'red';

            
            if (winner) {
                $('#gagnant').append(`
                    <div class="rougeOuJaune">
                        <p>les ${winner} ont ganger la partit</p>
                    </div>
                `);
                $('#restart').css('visibility', 'visible');
                return;
            }
        });
    }
    checkWin(lgn, col){
        const that = this;

        function getCell(i, j){
            return $(`.col[data-lgn='${i}'][data-col='${j}']`)
        }

        function checkDirection(direction){
            let total = 0;
            let i = lgn + direction.i
            let j = col + direction.j
            let $next = getCell(i, j);
            while (i >= 0 && i < that.LGN && j >= 0 && j < that.COL && $next.data('player') === that.player) {
                total++;
                i += direction.i;
                j += direction.j;
                $next = getCell(i, j);
            }

            
            return total;
        }

        function checkWin(directionA, directionB){
            const total = 1 + checkDirection(directionA) + checkDirection(directionB);
            
            if (total >= 4){
                return that.player;
            } else {
                return null;
            }
        }

        function checkHorizontal(){
            return checkWin({i:0 , j:-1} , {i:0 , j:1})
        }
        
        function checkVertical(){
            return checkWin({i:-1 , j:0} , {i:1 , j:0})
        }
        function checkDiagonal1(){
            return checkWin({i:1 , j:1} , {i:-1 , j:-1})
        }
        function checkDiagonal2(){
            return checkWin({i:1 , j:-1} , {i:-1 , j:0})
        }
        return checkHorizontal() || checkVertical() || checkDiagonal1() || checkDiagonal2();

        

    }
    

}