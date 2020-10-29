function start() {
  /*Quando Start for chamada, será ocultado o início
  e serão criadas 4 Div's*/
  $('#inicio').hide(); // só pode ser utilizado, caso utilize juntamente o jquerry

  $('#fundoGame').append("<div id='jogador' class='anima1'></div>");
  $('#fundoGame').append("<div id='inimigo1' class='anima2'></div>");
  $('#fundoGame').append("<div id='inimigo2'></div>");
  $('#fundoGame').append("<div id='amigo'></div>");
}
