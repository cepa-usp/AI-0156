var scorm = pipwerks.SCORM; // Seção SCORM
scorm.version = "2004"; // Versão da API SCORM

var state = {};

var respondidos = {};

$(document).ready(init); // Inicia a AI.
$(window).unload(uninit); // Encerra a AI.

/*
 * Inicia a Atividade Interativa (AI)
 */ 
function init () {
	preFetchConfig();
	state = fetch();
	posFetchConfig();
}

/*
 * Encerra a Atividade Interativa (AI)
 */ 
function uninit () {
  scorm.quit();
}

/*
 * Configurações INDEPENDENTES do status da AI
 */
function preFetchConfig () {
	
  // Oculta o aviso de javascript desabilitado
  $("#javascript-warning").hide();
  
  // Configura as caixa de diálogo de seleção dos animais (imagens).
  $(".image-selection-dialog").dialog({
    autoOpen: false,
    modal: true,
    width: 500
  });
  
  // Configura os tooltips (nomes científicos)
  $('.botao').tooltip({
    track: true,
  	delay: 0,
  	extraClass: "decoration",
  	fixPNG: true,
  	opacity: 0.9
  });
  
  // Configura o botão "enviar"
	  $("#send").button().click(function () {
		showAnswer();
	  });
  
  
  // Desabilita o botão "ver resposta"
  $("#answer").button({disabled: true});	
}

/*
 * Configurações DEPENDENTES do status da AI 
 */
function posFetchConfig () {
	
	  if (state.standalone) {
	    $("#standalone-warning").show();
	  }
	
	  // Configura a seleção de um animal (imagem) 
	  $(".botao").button().click(function () {
		openDialog(this.id);
	  });
		
		// Adiciona o nome do usuário
	if (state.learner != "") {
  	var prename = state.learner.split(",")[1];
  	$("#learner-prename").html(prename + ",");
  }
		
  // cmi.completion_status = completed
  if (state.completed) {
  
  	// Exibe a mensagem de AI completa
  	$(".completion-message").show();
  	
  	// Restaura a pontuação
  	$(".count").html(state.count);
  	
  	// Exibe a pontuação
  	$(".score").show();
  }
  // cmi.completion_status = incomplete, not attempted ou unknown
  else {
    
  	// Oculta a mensagem de AI completa
  	$(".completion-message").hide();
  	
  	// Restaura a pontuação
  	$(".count").html(state.count);
  	
  	// Oculta a pontuação
  	$(".score").hide();
  }	
}


var currentId;
function openDialog(dialogId){
	currentId = dialogId;
	
	var img1 = getImg(dialogId, 1);
	var img2 = getImg(dialogId, 2);
	
	$("#imagem").html("<img width='230' src='" + img1 + "'/> <img id='answerImg' width='230' src='" + img2 + "'/>");
	
	$("#answerImg").hide();
	
	if(respondidos[dialogId] != undefined){
		$("#userAnswer").val(respondidos[dialogId]);
		showAnswer();
	}else {
		$("#userAnswer").val("");
		$("#resposta").val("");
	}
	
	$("#botao-dialog").dialog("open");
}

function getImg(dialogId, soma){
	
	var nDialog = parseInt(dialogId.split("botao")[1]);
	
	if(nDialog >= 3 && nDialog < 4){
		nDialog += 1;
	}else if(nDialog >=4){
		nDialog += 2;
	}
	
	var img1Num = 2 * nDialog + soma;
	
	var imgPath;
	if(img1Num < 10){
		imgPath = "http://midia.atp.usp.br/imagens/redefor/EnsinoBiologia/Zoo/2011-2012/top03_fig0" + img1Num + "w.jpg";
	}else{
		imgPath = "http://midia.atp.usp.br/imagens/redefor/EnsinoBiologia/Zoo/2011-2012/top03_fig" + img1Num + "w.jpg";
	}
	
	return imgPath;
}

function showAnswer(){
	
	respondidos[currentId] = $("#userAnswer").val();
	
	var ans;
	
	switch (currentId)
	{
		case "botao1":
			ans = "Teste resposta 1";
			break;
		case "botao2":
			ans = "Teste resposta 2";
			break;
		case "botao3":
			ans = "Teste resposta 3";
			break;
		
		default:
			ans = "Teste resposta geral";
			break;
	}
	
	$("#resposta").val(ans);
	$("#answerImg").show();
}


/*
 * Finaliza a atividade
 */
function finish () {

	if (!state.try_completed) {
	
		state.try_completed = true;
		
		if (state.tries < 2) ++state.tries;
		
		state.completed = state.try_completed && state.tries == 2;

		var current_count = state.count;
		
		if (!state.completed) {
			state.choices = [];
			state.count = 0;
		}
		
		var success = commit(state);
		
		if (success) {
			$("#enviar").button("option", "disabled", true);
			$("#answer").button("option", "disabled", false);
			$(".completion-message").show();
			$("#after-finish-dialog").dialog("open");
			$(".count").html(current_count);
      $(".score").show();
		}
		else {
			alert("Falha ao enviar dados para o LMS.");
		}
	}
}

/*
 * Inicia a conexão SCORM.
 */ 
function fetch () {
 
  var ans = {};
  ans.completed = false;
  ans.try_completed = false;
  ans.count = 0;
  ans.score = 0;
  ans.choices = [];
  ans.learner = "";
  ans.connected = false;
  ans.standalone = true;
  ans.tries = 0;
  
  // Conecta-se ao LMS
  session_connected = scorm.init();
  session_standalone = !session_connected;
  
  if (session_standalone) {
  
      var stream = localStorage.getItem("ai_0006_redefor-memento");
      if (stream != null) ans = JSON.parse(stream);
      
      ans.try_completed = ans.completed;
  }
  else {
  
    // Verifica se a AI já foi concluída.
    var completionstatus = scorm.get("cmi.completion_status");
    
    // A AI já foi concluída.
    switch (completionstatus) {
    
      // Primeiro acesso à AI
      case "not attempted":
      case "unknown":
      default:
        ans.learner = scorm.get("cmi.learner_name");
      	//ans.completed = <valor padrão>;
      	//ans.try_completed = <valor padrão>;
      	//ans.count = <valor padrão>;
      	//ans.score = <valor padrão>;
      	//ans.choices = <valor padrão>;
      	ans.connected = session_connected;
      	ans.standalone = session_standalone;
      	//ans.tries = <valor padrão>;
        break;
        
      // Continuando a AI...
      case "incomplete":
        var stream = scorm.get("cmi.location");
        if (stream != "") ans = JSON.parse(stream);
        
        ans.learner = scorm.get("cmi.learner_name");
        ans.completed = false;
        ans.try_completed = false;
        //ans.count = <obtido de cmi.location>;
        //ans.score = <obtido de cmi.location>;
        //ans.choices = <obtido de cmi.location>;
        ans.connected = session_connected;
        ans.standalone = session_standalone;
        //ans.tries = <obtido de cmi.location>;
        break;
        
      // A AI já foi completada.
      case "completed":
        var stream = scorm.get("cmi.location");
        if (stream != "") ans = JSON.parse(stream);
        
        ans.learner = scorm.get("cmi.learner_name");
        ans.completed = true;
        ans.try_completed = true;
        //ans.count = <obtido de cmi.location>;
        //ans.score = <obtido de cmi.location>;
        //ans.choices = <obtido de cmi.location>;
        ans.connected = session_connected;
        ans.standalone = session_standalone;
        //ans.tries = <obtido de cmi.location>;
        break;
    }    
  }
  
  return ans;
}

/*
 * Salva cmi.score.raw, cmi.location e cmi.completion_status no LMS
 */ 
function commit (data) {

  var success = false;

  // Garante que a nota do usuário é um inteiro entre 0 e 100.
  data.score = Math.max(0, Math.min(Math.ceil(data.count * 100 / N_ANSWERS), 100));
  
  // Se estiver rodando como stand-alone, usa local storage (HTML 5)
  if (data.standalone) {
	
    var stream = JSON.stringify(data);
    localStorage.setItem("ai_0006_redefor-memento", stream);
    
    success = true;
  }
  // Se estiver conectado a um LMS, usa SCORM
  else {  

    //if (scorm.connection.isActive) {
    if (data.connected) {
    
      // Salva no LMS a nota do aluno.
      success = scorm.set("cmi.score.raw", data.score);
      
      // Salva no LMS o status da atividade: completada ou não.
      success = scorm.set("cmi.completion_status", (data.completed ? "completed" : "incomplete"));
      
      // Salva no LMS os demais dados da atividade.
      var stream = JSON.stringify(data);      
      success = scorm.set("cmi.location", stream);
    }
  }
  
  return success;
}

/*
 * Verifica se list contém object.
 */ 
function contains (list, object) {
  var ans = false;
  for (var i = 0; i < list.length && ans == false; i++) ans = (object == list[i]);
  return ans;
}