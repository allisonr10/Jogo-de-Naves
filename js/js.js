function start() {
  /*Quando Start for chamada, será ocultado o início
  e serão criadas 4 Div's*/
  $('#inicio').hide(); // só pode ser utilizado, caso utilize juntamente o jquerry

  $('#fundoGame').append("<div id='jogador' class='anima1'></div>");
  $('#fundoGame').append("<div id='inimigo1' class='anima2'></div>");
  $('#fundoGame').append("<div id='inimigo2'></div>");
  $('#fundoGame').append("<div id='amigo' class='anima3'></div>");

  /*Variáveis do jogo*/

  var jogo = {};
  var tecla = { W: 87, S: 83, D: 68 };
  var velocidade = 4;
  var posicaoY = parseInt(Math.random() * 334);
  var podeAtirar = true;
  var fimdejogo = false;

  jogo.pressionou = [];

  /*Verificar se tecla foi pressionada */

  $(document).keydown(function (e /* Verifica se foi pressionado a tecla*/) {
    jogo.pressionou[e.which] = true;
  });
  $(document).keyup(function (e /* Verifica se não foi pressionado a tecla*/) {
    jogo.pressionou[e.which] = false;
  });

  /* Inicio loop do fundo */

  jogo.timer = setInterval(loop, 10);

  function loop() {
    movefundo();
    movejogador();
    moveinimigo1();
    moveinimigo2();
    moveamigo();
    colisao();
  }
  /* Fim loop do fundo */

  /* Função para movimentar o fundo */

  function movefundo() {
    esquerda = parseInt($('#fundoGame').css('background-position'));
    $('#fundoGame').css('background-position', esquerda - 1);
  } /* Fim função para movimentar o fundo */

  /* Função para movimentar o helicoptero */
  function movejogador() {
    if (jogo.pressionou[tecla.W]) {
      var vertical = parseInt(
        $('#jogador').css('top')
      ); /*pega o valor da posição do jogador e transforma em número*/
      $('#jogador').css(
        'top',
        vertical - 10
      ); /* Pega o valor da posição e tira 10, fazendo movimentar para cima */
      if (vertical <= 50) {
        $('#jogador').css('top', (vertical = 50));
      }
    }

    if (jogo.pressionou[tecla.S]) {
      var vertical = parseInt($('#jogador').css('top'));
      $('#jogador').css('top', vertical + 10);
      if (vertical >= 454) {
        $('#jogador').css('top', (vertical = 454));
      }
    }

    if (jogo.pressionou[tecla.D]) {
      disparo();
    }
  } // fim da função movejogador()

  /*Movimentar inimigo 1 */

  function moveinimigo1() {
    posicaoX = parseInt($('#inimigo1').css('left'));
    $('#inimigo1').css('left', posicaoX - velocidade);
    $('#inimigo1').css('top', posicaoY);

    if (posicaoX <= 0) {
      posicaoY = parseInt(Math.random() * 334) + 50;
      $('#inimigo1').css('left', 694);
      $('#inimigo1').css('top', posicaoY);
    }
  } // Fim da função moveinimigo1

  /*Movimentar inimigo 2 */

  function moveinimigo2() {
    posicaoX = parseInt($('#inimigo2').css('left'));
    $('#inimigo2').css('left', posicaoX - 3);

    if (posicaoX <= 0) {
      $('#inimigo2').css('left', 775);
    }
  } // Fim da função moveinimigo2

  /*Movimentar Amigo */

  function moveamigo() {
    posicaoX = parseInt($('#amigo').css('left'));
    $('#amigo').css('left', posicaoX + 1);

    if (posicaoX > 906) {
      $('#amigo').css('left', 0);
    }
  } // fim da função moveamigo

  /* Função atirar */

  function disparo() {
    if (podeAtirar == true) {
      podeAtirar = false;

      topo = parseInt($('#jogador').css('top'));
      posicaoX = parseInt($('#jogador').css('left'));
      tiroX = posicaoX + 190;
      topoTiro = topo + 37;
      $('#fundoGame').append(
        "<div id='disparo'></div"
      ); /*append = insere um comando em html*/
      $('#disparo').css('top', topoTiro);
      $('#disparo').css('left', tiroX);

      var tempoDisparo = window.setInterval(executaDisparo, 30);
    } //Fecha podeAtirar

    function executaDisparo() {
      posicaoX = parseInt($('#disparo').css('left'));
      $('#disparo').css('left', posicaoX + 15);

      if (posicaoX > 900) {
        window.clearInterval(tempoDisparo);
        tempoDisparo = null;
        $('#disparo').remove();
        podeAtirar = true;
      }
    } // Fecha executaDisparo()
  } // Fecha disparo()

  /* Colisão */

  function colisao() {
    var colisao1 = $('#jogador').collision($('#inimigo1'));
    var colisao2 = $('#jogador').collision($('#inimigo2'));
    var colisao3 = $('#disparo').collision($('#inimigo1'));
    var colisao4 = $('#disparo').collision($('#inimigo2'));
    var colisao5 = $('#jogador').collision($('#amigo'));
    var colisao6 = $('#inimigo2').collision($('#amigo'));

    /*Colisão do jogador com inimigo 1 */

    if (colisao1.length > 0) {
      inimigo1X = parseInt($('#inimigo1').css('left'));
      inimigo1Y = parseInt($('#inimigo1').css('top'));
      explosao1(inimigo1X, inimigo1Y);

      posicaoY = parseInt(Math.random() * 334) + 50;
      $('#inimigo1').css('left', 694);
      $('#inimigo1').css('top', posicaoY);
    }
    // jogador com o inimigo2
    if (colisao2.length > 0) {
      inimigo2X = parseInt($('#inimigo2').css('left'));
      inimigo2Y = parseInt($('#inimigo2').css('top'));
      explosao2(inimigo2X, inimigo2Y);

      $('#jogador').remove(); // remove jogador
      $('#inimigo2').remove(); // remove inimigo 2

      var tempoColisao4 = window.setInterval(reposiciona4, 3000); // tempo de espera jogador = 3s
      var tempoColisao5 = window.setInterval(reposiciona5, 5000); // tempo de inimigo2 jogador = 5s

      function reposiciona4() {
        // função para retornar jogador e animação do mesmo
        window.clearInterval(tempoColisao4);
        tempoColisao4 = null;

        if (fimdejogo == false) {
          $('#fundoGame').append('<div id=jogador class=anima1></div');
        }
      }
      function reposiciona5() {
        // função para retornar inimigo2
        window.clearInterval(tempoColisao5);
        tempoColisao5 = null;

        if (fimdejogo == false) {
          $('#fundoGame').append('<div id=inimigo2></div');
        }
      }
    }
    // jogador com o amigo

    if (colisao5.length > 0) {
      reposicionaAmigo();
      $('#amigo').remove();
    }
  } //Fim da função colisao()

  /* Explosão */

  //Explosão 1
  function explosao1(inimigo1X, inimigo1Y) {
    $('#fundoGame').append("<div id='explosao1'></div");
    $('#explosao1').css('background-image', 'url(imgs/explosao.png)');
    var div = $('#explosao1');
    div.css('top', inimigo1Y);
    div.css('left', inimigo1X);
    div.animate({ width: 200, opacity: 0 }, 'slow');

    var tempoExplosao = window.setInterval(removeExplosao, 400);

    function removeExplosao() {
      div.remove();
      window.clearInterval(tempoExplosao);
      tempoExplosao = null;
    }
  } // Fim da função explosao1

  //Explosão2

  function explosao2(inimigo2X, inimigo2Y) {
    $('#fundoGame').append("<div id='explosao2'></div");
    $('#explosao2').css('background-image', 'url(imgs/explosao.png)');
    var div2 = $('#explosao2');
    div2.css('top', inimigo2Y);
    div2.css('left', inimigo2X);
    div2.animate({ width: 200, opacity: 0 }, 'slow');

    var tempoExplosao2 = window.setInterval(removeExplosao2, 1000);

    function removeExplosao2() {
      div2.remove();
      window.clearInterval(tempoExplosao2);
      tempoExplosao2 = null;
    }
  } // Fim da função explosao2
}
