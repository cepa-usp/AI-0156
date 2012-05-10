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
	resizable: false,
    width: 500
  });
  
  // Configura o botão "enviar"
	  $("#btCreditos").click(function () {
		$("#creditos").dialog({ position: ['center',150] });
		$("#creditos").dialog("open");
	  });
  
  
  $("#creditos").dialog({
	autoOpen: false,
    modal: true,
	resizable: false,
    width: 600
  });
  
  //$('#resposta').attr("disabled", true);
  $('#resposta').hide();
  
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
  
  $("#userAnswer").keypress(function(event) {
	 if ( event.which == 13 ) {
		showAnswer();
	  }
	});
  
  recoverStatus(state.memento);
}

var nPecas = 18;
function recoverStatus(memento){
	respondidos = memento;
	for(var i = 1; i <= nPecas; i++){
		if(respondidos["botao"+i] != undefined){
			dialogId = "botao"+i;
			currentId = dialogId;
			$("#userAnswer").val(respondidos[dialogId]);
			showAnswer();
		}
	}
	dialogId = "";
	currentId = "";
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
		//$("#resposta").val("");
		$("#resposta").hide();
		$("#userAnswer").attr("disabled", false);
		$("#send").button({disabled: false});
	}
	
	$("#botao-dialog").dialog({ position: ['center',100] });
	$("#botao-dialog").dialog("open");
}

function getImg(dialogId, soma){
	
	var nDialog = parseInt(dialogId.split("botao")[1]);
	
	if(nDialog >= 3 && nDialog < 4){
		nDialog += 1;
	}else if(nDialog >=4){
		nDialog += 2;
	}
	
	var imgNum = 2 * nDialog + soma;
	
	var imgPath;
	if(imgNum < 10){
		imgPath = "http://midia.atp.usp.br/imagens/redefor/EnsinoBiologia/Zoo/2011-2012/top03_fig0" + imgNum + "w.jpg";
	}else{
		imgPath = "http://midia.atp.usp.br/imagens/redefor/EnsinoBiologia/Zoo/2011-2012/top03_fig" + imgNum + "w.jpg";
	}
	
	return imgPath;
}

function showAnswer(){
	
	if($("#userAnswer").val() == ""){
		alert("Você precisa digitar algo para ser avaliado.");
		return;
	}
	
	respondidos[currentId] = $("#userAnswer").val();
	
	var ans = [];
	
	switch (currentId)
	{
		case "botao1":
			ans = ["Hidra"];
			break;
		case "botao2":
			ans = ["Ancilóstoma", "Ancilostoma", "Verme amarelao", "Verme amarelão"];
			break;
		case "botao3":
			ans = ["Lagosta"];
			break;
		case "botao4":
			ans = ["Polvo"];
			break;
		case "botao5":
			ans = ["Megaloptera", "Inseto"];
			break;
		case "botao6":
			ans = ["Aranha", "Tarântula", "Tarantula"];
			break;
		case "botao7":
			ans = ["Mosca", "Mosca doméstica", "Mosca domestica"];
			break;
		case "botao8":
			ans = ["Traça", "Traca"];
			break;
		case "botao9":
			ans = ["Água viva", "Agua viva", "Medusa"];
			break;
		case "botao10":
			ans = ["Lagarta"];
			break;
		case "botao11":
			ans = ["Mariposa"];
			break;
		case "botao12":
			ans = ["Gafanhoto"];
			break;
		case "botao13":
			ans = ["Ameba"];
			break;
		case "botao14":
			ans = ["Estrela-do-mar", "Estrela do mar"];
			break;
		case "botao15":
			ans = ["Esponja-do-mar", "Esponja do mar"];
			break;
		case "botao16":
			ans = ["Copépode", "Copepode"];
			break;
		case "botao17":
			ans = ["Ciliado"];
			break;
		case "botao18":
			ans = ["Copépode", "Copepode"];
			break;
		
		default:
			ans = ["Ops, algo errado."];
			break;
	}
	
	var minDist = 999999;
	var indexAnswer;
	for(var i = 0; i < ans.length; i++){
		var dist = computeLevenshteinDistance($("#userAnswer").val().toLowerCase(), ans[i].toLowerCase());
		if(dist < minDist){
			minDist = dist;
			indexAnswer = i;
		}
	}
	
	if(minDist <= 2){
		$("#"+currentId+"certo").show();
		$("#resposta").html('<p style="color:green">Correto, é um(a) ' + ans[indexAnswer].toLowerCase() + " (figura acima).</p>");
	}else{
		$("#"+currentId+"errado").show();
		$("#resposta").html('<p style="color:red;">Ops! O correto seria ' + ans[0].toLowerCase() + " (figura acima).</p>");
	}
	
	//$("#resposta").val(ans);
	
	$("#resposta").show();
	$("#answerImg").show();
	
	$("#userAnswer").attr("disabled", true);
	$("#send").button({disabled: true});
	
	saveStatus()
}

function minimum(a, b, c) {
	return Math.min(Math.min(a, b), c);
}
 
function computeLevenshteinDistance(str1, str2) {
	
	var distance = new Array(str1.length + 1);
	for (var a = 0; a < str1.length + 1; a++){
		distance[a] = new Array(str2.length + 1);
	}

	for (var i = 0; i <= str1.length; i++) distance[i][0] = i;
	for (var j = 0; j <= str2.length; j++) distance[0][j] = j;

	for (i = 1; i <= str1.length; i++){
		for (j = 1; j <= str2.length; j++){
			distance[i][j] = minimum(distance[i - 1][j] + 1, distance[i][j - 1] + 1, distance[i - 1][j - 1] + ((str1.charAt(i - 1) == str2.charAt(j - 1)) ? 0 : 1));
		}
	}

	return distance[str1.length][str2.length];
}

function saveStatus(){
	state.completed = true;
	state.score = 100;
	for(var i = 1; i <= nPecas; i++){
		if(respondidos["botao"+i] != undefined){
			
		}else{
			state.completed = false;
			state.score = 0;
			break;
		}
	}
	
	state.memento = respondidos;
	commit(state);
}

/*
 * Inicia a conexão SCORM.
 */ 
function fetch () {
 
  var ans = {};
  ans.completed = false;
  ans.score = 0;
  ans.learner = "";
  ans.connected = false;
  ans.standalone = true;
  ans.memento = {};
  
  // Conecta-se ao LMS
  session_connected = scorm.init();
  session_standalone = !session_connected;
  
  if (session_standalone) {
  
      var stream = localStorage.getItem("ai_0156-memento");
      if (stream != null) ans = JSON.parse(stream);
      
      ans.try_completed = ans.completed;
  }
  else {
  
	  scorm.set("cmi.exit", "suspend");
    // Verifica se a AI já foi concluída.
    var completionstatus = scorm.get("cmi.completion_status");
	
    // A AI já foi concluída.
    switch (completionstatus) {
    
      // Primeiro acesso à AI
      case "not attempted":
      case "unknown":
      default:
        ans.learner = scorm.get("cmi.learner_name");
      	ans.connected = session_connected;
      	ans.standalone = session_standalone;
        break;
        
      // Continuando a AI...
      case "incomplete":
        var stream = scorm.get("cmi.location");
        if (stream != "") ans = JSON.parse(stream);
        
        ans.learner = scorm.get("cmi.learner_name");
        ans.connected = session_connected;
        ans.standalone = session_standalone;
        break;
        
      // A AI já foi completada.
      case "completed":
        var stream = scorm.get("cmi.location");
        if (stream != "") ans = JSON.parse(stream);
        
        ans.learner = scorm.get("cmi.learner_name");
        ans.completed = true;
        ans.connected = session_connected;
        ans.standalone = session_standalone;
        break;
    }    
  }
  
  return ans;
}

/*
 * Salva cmi.score.raw, cmi.location e cmi.completion_status no LMS
 */ 
function commit (data) {

	if(scorm.get("cmi.mode") != "normal") return;
  var success = false;

  // Garante que a nota do usuário é um inteiro entre 0 e 100.
  //data.score = Math.max(0, Math.min(Math.ceil(data.count * 100 / N_ANSWERS), 100));
  
  // Se estiver rodando como stand-alone, usa local storage (HTML 5)
  if (data.standalone) {
	
    var stream = JSON.stringify(data);
    localStorage.setItem("ai_0156-memento", stream);
    
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