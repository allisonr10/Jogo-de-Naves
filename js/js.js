function start() {
  /*Quando Start for chamada, será ocultado o início
  e serão criadas 4 Div's*/
  $('#inicio').hide(); // só pode ser utilizado, caso utilize juntamente o jquerry

  $('#fundoGame').append("<div id='jogador' class='anima1'></div>");
  $('#fundoGame').append("<div id='inimigo1' class='anima2'></div>");
  $('#fundoGame').append("<div id='inimigo2'></div>");
  $('#fundoGame').append("<div id='amigo' class='anima3'></div>");
  $('#fundoGame').append("<div id='placar'></div>");
  $('#fundoGame').append("<div id='energia'></div>");

  /********************** Variáveis do jogo*/

  var jogo = {};
  var tecla = { W: 87, S: 83, D: 68 };
  var velocidade = 4;
  var velocidade2 = 3;
  var posicaoY = parseInt(Math.random() * 334) + 50;
  var podeAtirar = true;
  var fimdejogo = false;

  var pontos = 0;
  var salvos = 0;
  var perdidos = 0;

  var energiaAtual = 3;

  var somDisparo = document.getElementById('somDisparo');
  var somExplosao = document.getElementById('somExplosao');
  var musica = document.getElementById('musica');
  var somGameover = document.getElementById('somGameover');
  var somPerdido = document.getElementById('somPerdido');
  var somResgate = document.getElementById('somResgate');

  //Música em loop
  musica.addEventListener(
    'ended',
    function () {
      musica.currentTime = 0;
      musica.play();
    },
    false
  );
  musica.play();

  jogo.pressionou = [];

  /********************** Verificar se tecla foi pressionada **********************/

  $(document).keydown(function (e /* Verifica se foi pressionado a tecla*/) {
    jogo.pressionou[e.which] = true;
  });
  $(document).keyup(function (e /* Verifica se não foi pressionado a tecla*/) {
    jogo.pressionou[e.which] = false;
  });

  /**********************  Inicio loop do fundo **********************/

  jogo.timer = setInterval(loop, 10);

  function loop() {
    movefundo();
    movejogador();
    moveinimigo1();
    moveinimigo2();
    moveamigo();
    colisao();
    placar();
    energia();
  }
  /* Fim loop do fundo */

  /**********************  Função para movimentar o fundo **********************/

  function movefundo() {
    esquerda = parseInt($('#fundoGame').css('background-position'));
    $('#fundoGame').css('background-position', esquerda - 1);
  } /* Fim função para movimentar o fundo */

  /**********************  Função para movimentar o helicoptero ********************* */
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

  /********************** Movimentar inimigo 1 ********************* */

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

  /********************** Movimentar inimigo 2 ********************* */

  function moveinimigo2() {
    posicaoX = parseInt($('#inimigo2').css('left'));
    $('#inimigo2').css('left', posicaoX - velocidade2);

    if (posicaoX <= 0) {
      $('#inimigo2').css('left', 775);
    }
  } // Fim da função moveinimigo2

  /**********************  Movimentar Amigo ********************* */

  function moveamigo() {
    posicaoX = parseInt($('#amigo').css('left'));
    $('#amigo').css('left', posicaoX + 1);

    if (posicaoX > 906) {
      $('#amigo').css('left', 0);
    }
  } // fim da função moveamigo

  /**********************  Função atirar ********************* */

  function disparo() {
    somDisparo.play();
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

  /**********************  Colisão ********************* */

  function colisao() {
    var colisao1 = $('#jogador').collision($('#inimigo1'));
    var colisao2 = $('#jogador').collision($('#inimigo2'));
    var colisao3 = $('#disparo').collision($('#inimigo1'));
    var colisao4 = $('#disparo').collision($('#inimigo2'));
    var colisao5 = $('#jogador').collision($('#amigo'));
    var colisao6 = $('#inimigo2').collision($('#amigo'));

    /********************** Colisão do jogador com inimigo 1 ********************* */

    if (colisao1.length > 0) {
      energiaAtual--;
      pontos -= 25; // Perde pontos caso bata no helicóptero
      inimigo1X = parseInt($('#inimigo1').css('left'));
      inimigo1Y = parseInt($('#inimigo1').css('top'));
      explosao1(inimigo1X, inimigo1Y);

      posicaoY = parseInt(Math.random() * 334) + 50;
      $('#inimigo1').css('left', 694);
      $('#inimigo1').css('top', posicaoY);
    }

    /**********************  jogador com o inimigo2 **********************/

    if (colisao2.length > 0) {
      energiaAtual--;
      pontos -= 75; // Perde pontos caso bata no caminhão
      inimigo2X = parseInt($('#inimigo2').css('left'));
      inimigo2Y = parseInt($('#inimigo2').css('top'));
      explosao2(inimigo2X, inimigo2Y);

      $('#jogador').remove(); // remove jogador
      $('#inimigo2').remove(); // remove inimigo 2

      var tempoColisao4 = window.setInterval(reposiciona4, 5000);
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
    } /********************** Fim jogador com o inimigo2 **********************/

    /********************** Dispara inimigo 1 **********************/

    if (colisao3.length > 0) {
      pontos += 100; // Pontuação a cada vez que acertar o helicóptero

      inimigo1X = parseInt($('#inimigo1').css('left'));
      inimigo1Y = parseInt($('#inimigo1').css('top'));

      explosao1(inimigo1X, inimigo1Y);
      $('#disparo').css('left', 950);

      posicaoY = parseInt(Math.random() * 334) + 50;
      $('#inimigo1').css('left', 694);
      $('#inimigo1').css('top', posicaoY);
    } /********************** Fim Dispara inimigo 1 **********************/

    /**********************  Dispara inimigo 2  **********************/

    if (colisao4.length > 0) {
      pontos += 50; // Pontuação a cada vez que acertar o caminhão

      inimigo2X = parseInt($('#inimigo2').css('left'));
      inimigo2Y = parseInt($('#inimigo2').css('top'));
      $('#inimigo2').remove();

      explosao2(inimigo2X, inimigo2Y);
      $('#disparo').css('left', 950);

      var tempoColisao5 = window.setInterval(reposiciona5, 5000); // tempo de inimigo2 jogador = 5s

      function reposiciona5() {
        // função para retornar inimigo2
        window.clearInterval(tempoColisao5);
        tempoColisao5 = null;

        if (fimdejogo == false) {
          $('#fundoGame').append('<div id=inimigo2></div');
        }
      }
    } /********************** Fim Dispara inimigo 2   **********************/

    /******************* jogador com o amigo ***************/

    if (colisao5.length > 0) {
      salvos++; // Quando eu resgatar meu amigo
      if (salvos % 5 == 0) {
        // Ganha uma vida cada vez que resgatar 5 vezes o amigo
        energiaAtual++;
      }
      /*Aumentar dificuldade */
      if (salvos > 3) {
        // Aumenta a dificuldade do jogo quando salvar 3 vezes o amigo
        velocidade = velocidade + 0.5;
        velocidade2 = velocidade2 + 0.5;
      }
      if (salvos > 6) {
        // Aumenta a dificuldade do jogo quando salvar 6 vezes o amigo
        velocidade = velocidade + 0.5;
        velocidade2 = velocidade2 + 0.5;
      }
      if (salvos > 9) {
        // Aumenta a dificuldade do jogo quando salvar 9 vezes o amigo
        velocidade = velocidade + 0.5;
        velocidade2 = velocidade2 + 0.5;
      }
      somResgate.play();
      reposicionaAmigo();
      $('#amigo').remove();
    }

    /******************* Inimigo 2 (caminhão) com amigo ***************/

    if (colisao6.length > 0) {
      perdidos++; // Quando o caminhão atropelar meu amigo
      pontos -= 50;
      amigoX = parseInt($('#amigo').css('left'));
      amigoY = parseInt($('#amigo').css('top'));
      explosao3(amigoX, amigoY);
      $('#amigo').remove();

      reposicionaAmigo();
    }
  } /******************* Fim Inimigo 2 (caminhão) com amigo ***************/

  /**********************  Explosão **********************/

  function explosao1(inimigo1X, inimigo1Y) {
    $('#fundoGame').append("<div id='explosao1'></div");
    $('#explosao1').css('background-image', 'url(imgs/explosao.png)');
    var div = $('#explosao1');
    div.css('top', inimigo1Y);
    div.css('left', inimigo1X);
    div.animate({ width: 200, opacity: 0 }, 'slow');

    var tempoExplosao = window.setInterval(removeExplosao, 400);

    somExplosao.play();

    function removeExplosao() {
      div.remove();
      window.clearInterval(tempoExplosao);
      tempoExplosao = null;
    }
  } // Fim da função explosao1

  /********************** Explosão 2 **********************/

  function explosao2(inimigo2X, inimigo2Y) {
    $('#fundoGame').append("<div id='explosao2'></div");
    $('#explosao2').css('background-image', 'url(imgs/explosao.png)');
    var div2 = $('#explosao2');
    div2.css('top', inimigo2Y);
    div2.css('left', inimigo2X);
    div2.animate({ width: 200, opacity: 0 }, 'slow');

    var tempoExplosao2 = window.setInterval(removeExplosao2, 1000);

    somExplosao.play();

    function removeExplosao2() {
      div2.remove();
      window.clearInterval(tempoExplosao2);
      tempoExplosao2 = null;
    }
  } /********************** Fim Explosão 2 **********************/

  /********************** Reposiciona Amigo **********************/

  function reposicionaAmigo() {
    var tempoAmigo = window.setInterval(reposiciona6, 3000);

    function reposiciona6() {
      window.clearInterval(tempoAmigo);
      tempoAmigo = null;

      if (fimdejogo == false) {
        $('#fundoGame').append("<div id='amigo' class='anima3'></div>");
      }
    }
  } /********************** Fim Reposiciona Amigo *********************/

  /********************** Explosão 3 **********************/

  function explosao3(amigoX, amigoY) {
    somPerdido.play();

    $('#fundoGame').append("<div id='explosao3' class='anima4'></div");
    $('#explosao3').css('top', amigoY);
    $('#explosao3').css('left', amigoX);
    var tempoExplosao3 = window.setInterval(resetaExplosao3, 1000);
    function resetaExplosao3() {
      $('#explosao3').remove();
      window.clearInterval(tempoExplosao3);
      tempoExplosao3 = null;
    }
  } /********************** Fim Explosão 3 **********************/

  /********************** Placar **********************/

  function placar() {
    $('#placar').html(
      '<h2> Pontos: ' +
        pontos +
        ' Salvos: ' +
        salvos +
        ' Perdidos: ' +
        perdidos +
        '</h2>'
    );
  } /********************** Fim Placar **********************/

  /********************** Barra de Energia **********************/

  function energia() {
    if (energiaAtual == 3) {
      $('#energia').css('background-image', 'url(imgs/energia3.png)');
    }

    if (energiaAtual == 2) {
      $('#energia').css('background-image', 'url(imgs/energia2.png)');
    }

    if (energiaAtual == 1) {
      $('#energia').css('background-image', 'url(imgs/energia1.png)');
    }

    if (energiaAtual == 0) {
      $('#energia').css('background-image', 'url(imgs/energia0.png)');

      gameOver(); //Game Over
    }
  } /********************** Barra de Energia **********************/

  //Função GAME OVER
  function gameOver() {
    fimdejogo = true;
    musica.pause();
    somGameover.play();

    window.clearInterval(jogo.timer); // irá para o loop do jogo
    jogo.timer = null;

    $('#jogador').remove();
    $('#inimigo1').remove();
    $('#inimigo2').remove();
    $('#amigo').remove();

    $('#fundoGame').append("<div id='fim'></div>");

    $('#fim').html(
      '<h1> Game Over </h1><p>Sua pontuação foi: ' +
        pontos +
        '</p>' +
        '<p> Seu amigo foi salvo ' +
        salvos +
        ' vezes </p>' +
        "<button id='reinicia' onClick=reiniciaJogo()><h3>Jogar Novamente</h3></button>"
    );
  } /********************** Fim Game Over **********************/
} /********************** Fim Start **********************/

/********************** Reinicia Jogo **********************/

function reiniciaJogo() {
  somGameover.pause();
  $('#fim').remove();
  start();
} /********************** Fim Reinicia Jogo **********************/
