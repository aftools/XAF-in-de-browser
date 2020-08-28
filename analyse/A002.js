/*
* A000n.js
* Onderdeel van project xaf_analyse
* Voor uitleg en licentie zie bestand xaf_analyse.js.
*/

/**
 * Functie A002
 * Analyse A002 Dagboek - grootboek matrix 
 * Zie de functionele beschrijving 
 * {@link https://github.com/AnalyticsLibrary/Analytics/wiki/A002-Dagboek-grootboek-matrix}
**/
function A002(){
	// Maak een matrix, met in de rijen de grootboekrekening en in de kolommen het dagboek. Laatste kolom is eindsaldo.
	// Resultaat saldibalans wordt verzameld in de array 'mutaties'
	// Hulptabel voor gegevens van grootboekrekeningen in array 'rekeningen' en 'rekeningIndex'
	// Hulptabel voor gegevens van dagboeken in array 'dagboeken' en 'dagboekIndex'
	var mutaties = [];
	var rekeningen = [];
	var rekeningIndex = [];
	var dagboeken = [];
	var dagboekIndex = [];

	verzamelDagboeken();    	// 1 - Alle beschikbare dagboeken in de lijst 'dagboeken' (en 'dagboekIndex') zetten (uit tabel 'journal')
	telMutaties(); 	          // 2 - Tel de mutaties in tabel 'trLine' per grootboekrekening 'accID' (rijen) en per Dagboek 'jrnID' (kolommen).
	rekeningInfoToevoegen(); 	// 3 - Voeg gegevens uit tabel 'ledgerAccount' toe aan de saldilijst (inclusief beginbalans)
	renderHTML();             // 4 - Inhoud van object saldilijst naar html tabel
	// Klaar.


	//=======================
	// Subroutines
	//=======================

	function verzamelDagboeken(){
		// Alle beschikbare dagboeken in de lijst 'dagboeken' (en 'dagboekIndex') zetten (uit tabel 'journal')

		// - Dagboek     op positie 1-1=0 (jrnID)
		// - DagboekNaam op positie 2-1=1 (desc)
		var bronTabel = document.getElementById('journal');
		var aantalRijen = bronTabel.rows.length;
		for (var i = 1; i < aantalRijen; i++){
			dagboekIndex.push(bronTabel.rows.item(i).cells.item(0).innerHTML);
			dagboeken.push({
										jrnID: bronTabel.rows.item(i).cells.item(0).innerHTML,  // Dagboek
										desc: bronTabel.rows.item(i).cells.item(1).innerHTML,   // DagboekNaam
										aantMut: 0, debet: 0.0, credit: 0.0
										});
		}
	}

	function telMutaties(){
		// - Tel de mutaties in tabel 'trLine' per grootboekrekening 'accID' (rijen) en per Dagboek 'jrnID' (kolommen).
		//   - Dagboek           op positie  1-1= 0 (jrnID)
		//   - Grootboekrekening op positie  9-1= 8 (accID)
		//   - Bedrag            op positie 13-1=12 (amnt)
		//   - DC                op positie 14-1=13 (amntTp)
		var bronTabel = document.getElementById('trLine');
		var aantalRijen = bronTabel.rows.length;
		for (var i = 1; i < aantalRijen; i++){
			var dagboek  = bronTabel.rows.item(i).cells.item(0).innerHTML; // Dagboek (jrnID)
			var rekening = bronTabel.rows.item(i).cells.item(8).innerHTML; // Grootboekrekening (accID)
			var bedrag = parseFloat(bronTabel.rows.item(i).cells.item(12).innerHTML); // Bedrag (amnt)
			var dc = bronTabel.rows.item(i).cells.item(13).innerHTML; // DC (amntTp)
			var debet = 0.0;
			var credit = 0.0;
			if (dc==="C"){ credit+=bedrag; } else { debet+=bedrag; }
			// Dagboek opzoeken in de tabel dagboekIndex
			var posDagboek=dagboekIndex.indexOf(dagboek);
			if (posDagboek<0){alert("Error: Dagboek "+dagboek+" zit niet in de lijst met dagboeken");}
			// Rekening opzoeken in de tabel rekeningIndex
			var posRekening=rekeningIndex.indexOf(rekening);
			if (posRekening<0){
				// Rekening nog niet aanwezig, rekening toevoegen
				rekeningen.push({rekening: rekening, naam: "", soort: "", leadCode: "", aantMut: 0, debet: 0.0, credit: 0.0});
				rekeningIndex.push(rekening);
				posRekening=rekeningIndex.indexOf(rekening);
				// dagboekenummers aanmaken voor deze rekening
				var nieuweRekeningDagboeken = [];
				for (j=0; j<dagboeken.length; j++){
					nieuweRekeningDagboeken.push({jrnID: dagboeken[j], aantMut: 0, debet: 0.0, credit: 0.0});
				}
				mutaties.push(nieuweRekeningDagboeken);
			}
			// Waarden optellen voor de Rekening/Dagboek combinatie
			mutaties[posRekening][posDagboek].aantMut+=1;
			mutaties[posRekening][posDagboek].debet+=debet;
			mutaties[posRekening][posDagboek].credit+=credit;
			// Waarden optellen voor dit Dagboek (t.b.v. totalen op de onderste rij)
			dagboeken[posDagboek].aantMut+=1;
			dagboeken[posDagboek].debet+=debet;
			dagboeken[posDagboek].credit+=credit;
			// Waarden optellen voor deze rekening (t.b.v. totalen per rekening in de laatste kolom) (wordt niet gebruikt)
			rekeningen[posRekening].aantMut+=1;
			rekeningen[posRekening].debet+=debet;
			rekeningen[posRekening].credit+=credit;
		}
	}

	function rekeningInfoToevoegen(){
		//- Voeg gegevens uit tabel 'ledgerAccount' toe aan de saldilijst
		//   - Grootboekrekening op positie 1-1=0 (accID)
		//   - RekeningNaam      op positie 2-1=1 (accDesc)
		//   - RekeningSoort     op positie 3-1=2 (accType)
		//   - leadCode          is         6-1=5 (leadCode)
		var bronTabel = document.getElementById('ledgerAccount');
		var aantalRijen = bronTabel.rows.length;
		for (var i = 1; i < aantalRijen; i++){
			var rekening = bronTabel.rows.item(i).cells.item(0).innerHTML;
			var positie=rekeningIndex.indexOf(rekening);
			if (positie<0){
				// Geen mutaties voor deze rekening, negeren
			} else {
				// wel mutaties, rekeningnaam en soort invullen
				rekeningen[positie].naam = bronTabel.rows.item(i).cells.item(1).innerHTML;
				rekeningen[positie].soort = bronTabel.rows.item(i).cells.item(2).innerHTML;
				rekeningen[positie].leadCode = bronTabel.rows.item(i).cells.item(5).innerHTML;
			}
		}
	}


	function renderHTML(){
		// Resultaat schrijven naar HTML pagina
		var doel = document.getElementById('A002resultaat');
		doel.innerHTML=''; // doel leegmaken

		appendHTML(doel, sectie_FilterTabel());  // Filter mogelijkheid voor de navolgende tabel
		appendHTML(doel, sectie_Tabel());        // Tabel zelf aanmaken

		if (doel.className.indexOf("hor_scroll") == -1) {
			doel.className += " hor_scroll";
		}
		// tabel sorteerbaar maken (sorttable.js)
		sorttable.makeSortable(document.getElementById('tabel_A002'));

    //-------------------------------------------------------------


		function sectie_FilterTabel(){
			// Filter mogelijkheid voor de navolgende tabel
			var resultaat=''; // Variabele 'resultaat' verzamelt de HTML tekst
			resultaat+='<div><form class="w3-card-4 style="float">';
			resultaat+='<fieldset>&#x1F50E Kies een kolom en geef een zoeksleutel om gegevens in de tabel te filteren';
			resultaat+='<div>'
			resultaat+='<select class="w3-select w3-border w3-theme-l4 " id="A002_filterVeld" style="width:45%; float:left; padding:2px">';
			resultaat+='<optgroup label="Tekst">';
			resultaat+='<option value="Rekening" selected>Rekening</option>';
			resultaat+='<option value="Naam">Naam</option>';
			resultaat+='<option value="Soort">Soort</option>';
			resultaat+='<option value="leadCode">leadCode</option>';
			resultaat+='</optgroup>';
			resultaat+='<optgroup label="Getal">';
			for (var i = 0; i < dagboeken.length; i++) {
				var filterKolom      = '_filterKolom'+i+'_';
				var dagboekNaamtekst = dagboeken[i].jrnID+'-'+dagboeken[i].desc;
				resultaat +='<option value="'+filterKolom+'">'+dagboekNaamtekst+'</option>';
			}
			resultaat+='<option value="Som">Som</option>';
			resultaat+='</optgroup>';
			resultaat+='</select>';
			resultaat+='</div>';
			
			resultaat+='<select class="w3-select w3-border w3-theme-l4 " id="A002_criterium" style="width:10%; padding:2px">';
			resultaat+='<option value="{}" selected>bevat</option>';
			resultaat+='<option value="!{}">bevat niet</option>';
			resultaat+='<option value="==">is</option>';
			resultaat+='<option value=">">begint met</option>';
			resultaat+='<option value="<">eindigt op</option>';
			resultaat+='<option value="==">=</option>';
			resultaat+='<option value="!=">!=</option>';
			resultaat+='<option value=">">&gt;</option>';
			resultaat+='<option value=">=">&gt;=</option>';
			resultaat+='<option value="<">&lt;</option>';
			resultaat+='<option value="<=">&lt;=</option>';
			
			
			resultaat+='<input type="text" class="zoekVeld w3-input w3-border w3-theme-l4 w3-round-xlarge" id="filterInputA002" onkeyup="filterTabel(\'A002\', document.getElementById(\'A002_filterVeld\').value, document.getElementById(\'A002_criterium\').value)" placeholder="zoek.." style="width:45%; float:right; padding: 3px 10px 3px 40px">';
			resultaat+='</fieldset>';

			resultaat+='</form></div>';

			// oud: resultaat +='<input type="text" class="filterInput" id="filterInputA002" onkeyup="filterTabel(\'A002\')" placeholder="Search for names..">'
			return resultaat;
		}

		function sectie_Tabel(){
			// Gegevens in array 'mutaties' kopiëren naar de HTML tabel
			var resultaat=''; // Variabele 'resultaat' verzamelt de HTML tekst
			resultaat +='<table class="sortable" id="tabel_A002"><caption>A002 Dagboek - grootboek matrix</caption><thead><tr>';
			//resultaat +='<th>Rekening</th> <th>Naam</th> <th>Soort</th> <th>leadCode</th>';
			["Rekening", "Naam", "Soort", "leadCode"].forEach(function(item) { resultaat += "<th>"+item+"</th>";});
			for (var i = 0; i < dagboeken.length; i++) {
				var filterKolom      = '_filterKolom'+i+'_';
				var dagboekNaamtekst = dagboeken[i].jrnID+"<br>"+dagboeken[i].desc;
				resultaat += '<th class="'+filterKolom+'">'+dagboekNaamtekst+'</th>';
			}
			resultaat += "<th>Som</th>";
			resultaat += "</tr></thead> <tbody>";

			// Tabel rijen uit array 'rekeningen'
			for (j = 0; j < rekeningen.length; j++){
				resultaat += "<tr>";
				resultaat += "<td>"+rekeningen[j].rekening+"</td>"+
										 "<td>"+rekeningen[j].naam+"</td>"+
  			             "<td>"+rekeningen[j].soort+"</td>"+
  			             "<td>"+rekeningen[j].leadCode+"</td>";
				// dagboeken uit de array 'dagboeken'
				var rekeningSom=0.0;
				var saldo=0.00;
				for (var i = 0; i < dagboeken.length; i++) {
					//resultaat += "<td class='num'>"+mutaties[j][i].aantMut+"</td>";
					saldo = mutaties[j][i].debet-mutaties[j][i].credit;
					rekeningSom+=saldo;
					resultaat += "<td class='num"+(saldo<0 ? " Neg" : "")+(saldo==0 ? " nul" : "")+"'>" +saldo.toFixed(2)+"</td>";
				}
				//resultaat += "<td class='num'>"+rekeningen[j].aantMut+"</td>";
				resultaat += "<td class='num"+(rekeningSom<0 ? " Neg" : "")+"'>" +rekeningSom.toFixed(2)+"</td>";
				resultaat+="</tr>";
			}
			resultaat += "</tbody>";
			// Totalen regel
			resultaat += "<tfoot><tr>";
			resultaat += "<td>Totaal</td> <td></td> <td></td> <td></td>";
			var rekeningSom=0.0;
			var saldo=0.00;
			for (var i = 0; i < dagboeken.length; i++) {
				//resultaat += "<td class='num'>"+dagboeken[i].aantMut+"</td>";
				saldo = dagboeken[i].debet-dagboeken[i].credit;
				rekeningSom+=saldo;
				resultaat += "<td class='num"+(saldo<0 ? " Neg" : "")+"'>" +saldo.toFixed(2)+"</td>";
			}
			//resultaat += "<td class='num'>"+"???"+"</td>";
			resultaat += "<td class='num"+(rekeningSom<0 ? " Neg" : "")+"'>" +rekeningSom.toFixed(2)+"</td>";

			/*
			resultaat += "<td class='num'>"                              +somAantRek.toFixed(0)+"</td>";
			resultaat += "<td class='num'>"                              +somaantMut.toFixed(0)+"</td>";
			resultaat += "<td class='num"+(somDebet<0 ? " Neg" : "")+"'>" +somDebet.toFixed(2)+"</td>";
			resultaat += "<td class='num"+(somCredit<0 ? " Neg" : "")+"'>"+somCredit.toFixed(2)+"</td>";
			saldo     = somDebet-somCredit;
			resultaat += "<td class='num"+(Math.abs(saldo)>1 ? " Verschil" : " Ok")+"'>"+saldo.toFixed(2)+"</td>";
			*/
			resultaat += "</tr></tfoot></table>";
			resultaat += "<p></p>";

			return resultaat
		}
	}

	function appendHTML(doel, htmlTekst){
		var div1 = document.createElement("div");
		div1.innerHTML=htmlTekst;
		doel.appendChild(div1);
	}


}


//   EOF A002.js
