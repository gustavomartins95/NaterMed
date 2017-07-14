window.onload = function () {
	// Loader
	loader = document.getElementById("loader");
	loader.style.display = 'none';
	// Conteúdo
	conteudo = document.getElementById("conteudo");
	setTimeout(function () {
		conteudo.style.opacity = '1';
		document.getElementById("conteudo").style.overflowX = "visible";
	}, 50);
}

function loading() {
	document.getElementById("conteudo").style.overflowX = "hidden";
	newDiv = document.createElement("div");
	newDiv.id = "loader";
	conteudoDiv = document.getElementById("conteudo");
	document.body.insertBefore(newDiv, conteudoDiv);
}
