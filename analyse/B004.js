/*
* B004.js
* Onderdeel van project xaf_analyse
* Voor uitleg en licentie zie bestand xaf_analyse.js.
*/

/**
* Functie B004
* Analyse B004 Controle negatieve kas
* Zie de functionele beschrijving
* {@link https://github.com/AnalyticsLibrary/Analytics/wiki/B004-Controle-negatieve-kas}
*
* Het eerste deel van B004 vraagt welk dagboek bij de grootboekrekening KAS hoort.
* het tweede deel (functie B004_deel2) voert daarna de feitelijke analyse uit.
**/
function B004(){

	// Variabele 'div_resultaat' verzamelt DOM objecten
	var div_resultaat = document.createElement("div");

	// Maak twee div's, voor deel 1 en voor deel 2
	var divB004deel1 = document.createElement("div");
	divB004deel1.setAttribute("id","B004deel1");
	div_resultaat.appendChild(divB004deel1);
	var divB004deel2 = document.createElement("div");
	divB004deel2.setAttribute("id","B004deel2");
	div_resultaat.appendChild(divB004deel2);

	// Plak 'div_resultaat' in het 'resultaatgebied' voor B004
	var doel = document.getElementById('B004resultaat');
	doel.innerHTML = "";
	doel.appendChild(div_resultaat);

	// Voer deel 1 uit: stel de vraag (de knop 'uitvoeren' in deel1 voert vervolgens deel2 uit)
	B004_deel1();
  return;



	function B004_deel1(){
		// vraag welk dagboek bij de grootboekrekening KAS hoort.
		// zet de vraag in div met id 'B004deel1'
		// ToDo: Vraag uitbreiden met: selectie op Grootboekrekening en selectie op RGS code

		var divB004deel1 = document.getElementById('B004deel1');
		/*
		// Test om te zien of het toevoegen van elementen via het DOM model beter is.
		// Antwoord: nee. Wordt alleen maar ingewikkelder. Todo: verwijderen.
		var textnode = document.createTextNode("Welk dagboek is verbonden met de rekening KAS die je wilt controleren?<br>");
		divB004deel1.appendChild(textnode);

		var btn = document.createElement("button");
		btn.setAttribute("type", "button");
		btn.setAttribute("text","Uitvoeren");
		btn.setAttribute("class", "w3-button w3-theme-l4 w3-hover-theme");
		btn.setAttribute("onclick", "B004_deel2()");
		divB004deel1.appendChild(btn);
		*/

		//var datefield=document.createElement("input");
		//datefield.setAttribute("type", "date");
		//div_resultaat.appendChild(datefield);

		// Variabele 'resultaat' verzamelt de HTML tekst
		var resultaat='';
		resultaat+='<p></p><div class="w3-card-4"><div class="w3-container w3-theme-l4">';
		resultaat+='&#x1F50E Welk dagboek is verbonden met de rekening KAS die je wilt controleren?';
		resultaat+='</div>';
		resultaat+='<form class="w3-container w3-card-4" action="">';
		resultaat+='<select class="w3-select w3-border w3-theme-l4 " id="B004_keuze">';
		resultaat+='<option value="" disabled selected>&#x1F50E Kies het dagboek met de gewenste tegenrekening</option>';

		// Alle beschikbare dagboeken in de lijst zetten (tabel 'journal')
		// - Dagboek       is positie 1-1=0 (jrnID)
		// - DagboekNaam   is positie 2-1=1 (desc)
		// - Soort         is positie 3-1=2 (jrnTp)
		// - Tegenrekening is positie 4-1=3 (offsetAccID)
		// Rekening naam ophalen uit tabel 'ledgerAccount'?
		var bronTabel = document.getElementById('journal');
		var aantalRijen = bronTabel.rows.length;
		for (var i = 1; i < aantalRijen; i++){
			var regel = '';
			var tegenrek = bronTabel.rows.item(i).cells.item(3).innerHTML;
			regel+= '<option value="'+tegenrek+'">';
			regel+= bronTabel.rows.item(i).cells.item(0).innerHTML; //jrnID
			regel+= ' - '+bronTabel.rows.item(i).cells.item(1).innerHTML; //desc
			regel+= ', Soort: '+bronTabel.rows.item(i).cells.item(2).innerHTML; //jrnTp
			regel+= ', Tegenrekening: '+tegenrek; //offsetAccountID
			regel+= '</option>';
			resultaat+= regel;
		}

		resultaat+='</select>';
		//	resultaat+='<p></p><button type="button" onclick="B004_deel2(document.getElementById(\'B004_keuze\')[document.getElementById(\'B004_keuze\').selectedIndex].value)" class="w3-button w3-theme-l4 w3-hover-theme">Uitvoeren</button>';
		resultaat+='<p></p><button type="button" onclick="B004_deel2(document.getElementById(\'B004_keuze\').value)" class="w3-button w3-theme-l4 w3-hover-theme">Uitvoeren</button>';
		resultaat+='<p></p></form></div>';

		var div1 = document.createElement("div");
		div1.innerHTML=resultaat;
		divB004deel1.appendChild(div1);
	}
}

function B004_deel2(geselecteerdeRekening){
	// Voer de feitelijke analyse uit, nu Grootboekrekening bekend is
	// zet het resultaat in div met id 'B004deel2'

	// Maak een matrix, met in de rijen de datum en in de kolommen het dagboek. Laatste kolom is eindsaldo.
	// Resultaat mutaties per datum wordt verzameld in de array 'matrix'
	// Hulptabel voor gegevens van datums in array 'datums' en 'datumIndex'
	// Hulptabel voor gegevens van dagboeken in array 'dagboeken' en 'dagboekIndex'
	// array beginBalans verzamelt gegevens van de beginbalans, om ze later als pseuto-mutaties te verwwerken
	var datums       = [];
	var datumIndex   = [];
	var dagboeken    = [];
	var dagboekIndex = [];
	var matrix       = [];

	var legeDatum   = {};
	var legeDagboek = {};
	var legeMutatie = {};
	var beginBalans = { jrnID: "(BB)", desc: "BeginBalans", datum: "", aantMut: 0, debet: 0.0, credit: 0.0 };

	verzamelBeginbalans();  // 1 - Gegevens verzamelen uit tabel 'obLine', later toevoegen aan de matrix
	verzamelDagboeken();    // 2 - Alle beschikbare dagboeken in de lijst 'dagboeken' (en 'dagboekIndex') zetten (uit tabel 'journal')
	verzamelDatums();     	// 3 - Alle beschikbare datums in de lijst datums en datumIndex zetten (begin- en einddatum in tabel 'header')
	telMutaties(); 	        // 4 - Tel de mutaties in tabel 'trLine' per datum 'effDate' (rijen) en per dagboek 'jrnID' (kolommen).
													//     met filter op grootboekrekening 'rekening'. Gegevens verzamelen in de array 'matrix'
	beginbalansToevoegen();	// 5 - Beginbalans toevoegen als mutaties. Waarden uit array 'beginBalans' gebruiken.
	sorteerMatrix();        // 6 - Sorteer de matrix op datum.
	renderHTML();           // 7 - Inhoud van array 'matrix' naar html tabel

	// Klaar.


	//=======================
	// Subroutines
	//=======================


	function verzamelBeginbalans(){
		// Begin met de beginbalans. Gegevens verzamelen uit tabel 'obLine' in tijdelijke array 'beginBalans', later toevoegen aan de matrix
		// - Rekening      op positie 2-1=1 (accID)
		// - Datum         op positie 3-1=2 (opBalDate)
		// - Omscrijving   op positie 4-1=3 (opBalDesc)
		// - Bedrag        is positie 5-1=4 (amnt)
		// - DC            is positie 6-1=5 (amntTp)
		var bronTabel = document.getElementById('obLine');
		var aantalRijen = bronTabel.rows.length;
		for (var i = 1; i < aantalRijen; i++){
			var rekening = bronTabel.rows.item(i).cells.item(1).innerHTML; // Grootboekrekening (accID)
			if(rekening===geselecteerdeRekening){
				var datum    = bronTabel.rows.item(i).cells.item(2).innerHTML; // Datum (opBalDate)
				var desc     = bronTabel.rows.item(i).cells.item(3).innerHTML; // omschrijving
				var bedrag   = parseFloat(bronTabel.rows.item(i).cells.item(4).innerHTML); // Bedrag (amnt)
				var dc       = bronTabel.rows.item(i).cells.item(5).innerHTML; // DC (amntTp)
				var debet  = 0.0;
				var credit = 0.0;
				if (dc==="C"){ credit+=bedrag; } else {debet+=bedrag; }
				if (beginBalans.aantMut==0){ // Als beginbalans nog niet gevuld is, dan nu vullen
					beginBalans.datum = datum;
					beginBalans.desc = desc;
					// Ook een regel aanmaken in 'dagboeken' voor dagboek 'beginbalans'
					dagboekIndex.push(beginBalans.jrnID);
					dagboeken.push({jrnID: beginBalans.jrnID, desc: beginBalans.desc, aantMut: 0, debet: 0.0, credit: 0.0});
				}
				beginBalans.aantMut+=1;
				beginBalans.debet+=debet;
				beginBalans.credit+=credit;
			}
		}
	}

	function verzamelDagboeken(){
		// Alle beschikbare dagboeken in de lijst 'dagboeken' (en 'dagboekIndex') zetten (uit tabel 'journal')
		//   later worden de niet-gebruikte dagboeken verwijderd/niet gerapporteerd.
		// - Dagboek     op positie 1-1=0 (jrnID)
		// - DagboekNaam op positie 2-1=1 (desc)
		var bronTabel = document.getElementById('journal');
		var aantalRijen = bronTabel.rows.length;
		for (var i = 1; i < aantalRijen; i++){
			dagboekIndex.push(bronTabel.rows.item(i).cells.item(0).innerHTML);
			dagboeken.push({jrnID: bronTabel.rows.item(i).cells.item(0).innerHTML, // Dagboek
				desc: bronTabel.rows.item(i).cells.item(1).innerHTML,   // DagboekNaam
			aantMut: 0, debet: 0.0, credit: 0.0});
		}
	}

	function verzamelDatums(){
		// Alle beschikbare datums in de lijst datums en datumIndex zetten (begin- en einddatum in tabel 'header')
		// - startDate  is rij 2-1=1 (startDate) kolom 2-1=1
		// - endDate    is rij 3-1=2 (endDate)   kolom 2-1=1
		var bronTabel = document.getElementById('header');
		var begindatum = new Date(bronTabel.rows.item(1).cells.item(1).innerHTML);
		var einddatum = new Date(bronTabel.rows.item(2).cells.item(1).innerHTML);
		var datumLijst = getDates(begindatum, einddatum);
		datumLijst.forEach(function(jsDatum){
			var datumTekst = datumString(jsDatum);
			var week = jsDatum.getWeekYear()+'.'+jsDatum.getWeek();
			var weekdag = jsDatum.getDay();
			datumIndex.push(datumTekst);
			datums.push({datum: datumTekst, dag: jsDatum, weekNr: week, weekDag: weekdag,
			aantMut: 0, debet: 0.0, credit: 0.0});
			// In array 'matrix' Dagboekrecords aanmaken voor deze Datum
			var nieuweDatumDagboek = [];
			for (var j=0; j<dagboeken.length; j++){
				nieuweDatumDagboek.push({jrnID: dagboeken[j], aantMut: 0, debet: 0.0, credit: 0.0});
			}
			matrix.push(nieuweDatumDagboek);
		});
	}


	function telMutaties(){
		// - Tel de mutaties in tabel 'trLine' per datum 'effDate' (rijen) en per dagboek 'jrnID' (kolommen).
		//   filter op grootboekrekening 'rekening'
		//   - Grootboekrekening is positie  9-1= 8 (accID)
		//   - Datum             is positie 11-1=10 (effDate)
		//   - Dagboek           is positie  1-1= 0 (jrnID)
		//   - Bedrag            is positie 13-1=12 (amnt)
		//   - DC                is positie 14-1=13 (amntTp)
		var bronTabel = document.getElementById('trLine');
		var aantalRijen = bronTabel.rows.length;
		for (var i = 1; i < aantalRijen; i++){
			var rekening = bronTabel.rows.item(i).cells.item(8).innerHTML; // Grootboekrekening (accID)
			if(rekening===geselecteerdeRekening){
				var datum    = bronTabel.rows.item(i).cells.item(10).innerHTML; // Datum (effDate)
				var dagboek  = bronTabel.rows.item(i).cells.item(0).innerHTML; // Dagboek (jrnID)
				var bedrag   = parseFloat(bronTabel.rows.item(i).cells.item(12).innerHTML); // Bedrag (amnt)
				var dc       = bronTabel.rows.item(i).cells.item(13).innerHTML; // DC (amntTp)
				var debet  = 0.0;
				var credit = 0.0;
				if (dc==="C"){ credit+=bedrag; } else {debet+=bedrag; }
				// Dagboek opzoeken in de tabel dagboekIndex
				var posDagboek=dagboekIndex.indexOf(dagboek);
				if (posDagboek<0){alert("Error: Dagboek "+dagboek+" zit niet in de lijst met Dagboeken");}
				// Datum opzoeken in de tabel datumIndex (toevoegen als nog niet aanwezig)
				posDatum=datumOpzoeken(datum);
				waardenOptellen(posDatum, posDagboek, debet, credit);  // Waarden optellen
			} // endif rekening=geselecteerdeRekening
		}
	}

	function beginbalansToevoegen(){
		// Beginbalans toevoegen als mutaties van dagboek (BB). Waarden uit array 'beginBalans' gebruiken.
		if (beginBalans.aantMut>0){
			// Dagboek opzoeken in de tabel dagboekIndex
			var posDagboek=dagboekIndex.indexOf(beginBalans.jrnID);
			// Datum opzoeken in de tabel datumIndex (toevoegen als nog niet aanwezig)
			var posDatum=datumOpzoeken(beginBalans.datum);
		}
		waardenOptellen(posDatum, posDagboek, beginBalans.debet, beginBalans.credit);  // Waarden optellen
		if (beginBalans.aantMut>1){
			// Aanpassen van aantal mutaties indien aantMut van beginBalans >1 is
			matrix[posDatum][posDagboek].aantMut+=(beginBalans.aantMut-1);
			dagboeken[posDagboek].aantMut+=(beginBalans.aantMut-1);
			datums[posDatum].aantMut+=(beginBalans.aantMut-1);
		}
	}


	// Datum opzoeken in de tabel datumIndex (toevoegen als nog niet aanwezig)
	function datumOpzoeken(datum){
		var posDatum=datumIndex.indexOf(datum);
		if (posDatum<0){
			var jsDatum = new Date(datum);
			var week = jsDatum.getWeekYear()+'.'+jsDatum.getWeek();
			var weekdag = jsDatum.getDay();
			datums.push({datum: datum, dag: jsDatum, weekNr: week, weekDag: weekdag,
			aantMut: 0, debet: 0.0, credit: 0.0});
			datumIndex.push(datum);
			// Dagboeken aanmaken voor deze Datum
			var nieuweDatumregel = [];
			for (var j=0; j<dagboeken.length; j++){
				nieuweDatumregel.push({jrnID: dagboeken[j], aantMut: 0, debet: 0.0, credit: 0.0});
			}
			matrix.push(nieuweDatumregel);
			posDatum=datumIndex.length-1;
		}
		return posDatum;
	}

	function waardenOptellen(posDatum, posDagboek, debet, credit){
		// Waarden optellen voor de Datum/Dagboek combinatie (array 'matrix')
		matrix[posDatum][posDagboek].aantMut+=1;
		matrix[posDatum][posDagboek].debet+=debet;
		matrix[posDatum][posDagboek].credit+=credit;
		// Waarden optellen voor deze Dagboek (t.b.v. totalen op de onderste rij)
		dagboeken[posDagboek].aantMut+=1;
		dagboeken[posDagboek].debet+=debet;
		dagboeken[posDagboek].credit+=credit;
		// Waarden optellen voor deze Datum (t.b.v. totalen per Datum in de laatste kolom) (wordt niet gebruikt)
		datums[posDatum].aantMut+=1;
		datums[posDatum].debet+=debet;
		datums[posDatum].credit+=credit;
	}


	function sorteerMatrix(){
		// Sorteer de matrix op datum
		// - datumveld toevoegen aan matrix, in het eerste 'record'van matrix[i]....
		for (var i=0; i<datums.length; i++){
			matrix[i][0].dag = datums[i].dag;
		}
		// - sorteren op het nieuw toegevoegde veld
		matrix.sort(function (a,b){
			return (a[0].dag - b[0].dag);
		});
		// - voor de goede orde ook array 'datums' sorteren op veld datum
		datums.sort(function (a,b){
			return (a.dag - b.dag);
		});
	}



	// Hoe kan ik alle dagboeken zonder mutaties verwijderen?
	// Geen moeite doen, slechts overslaan bij het aanmaken van de tabel.

	function renderHTML(){             // 4 - Inhoud van array 'matrix' naar html tabel
		// Resultaat schrijven naar HTML pagina
		var doel = document.getElementById('B004resultaat');
		doel.innerHTML=''; // doel leegmaken

		appendHTML(doel, sectie_FilterTabel());  // Filter mogelijkheid voor de navolgende tabel
		appendHTML(doel, sectie_Tabel());        // Tabel zelf aanmaken

		if (doel.className.indexOf("hor_scroll") == -1) {
			doel.className += " hor_scroll";
		}
		// tabel sorteerbaar maken (sorttable.js)
		//sorttable.makeSortable(document.getElementById('tabel_B004'));
		// neen, deze tabel éénmalig gesorteerd op datum. Het heeft geen nut deze anders te sorteren.
		return;
		// Klaar.

		//=======================
		// Subroutines binnen renderHTML
		// - sectie_FilterTabel
		// - sectie_Tabel
		// - samenv_acctTp
		// - vergel_transactions
		//=======================


		function sectie_FilterTabel(){
			// Filter mogelijkheid voor de navolgende tabel
			var resultaat=''; // Variabele 'resultaat' verzamelt de HTML tekst
			resultaat+='<div><form class="w3-card-4 style="float">';
			resultaat+='<fieldset>&#x1F50E Kies een kolom en geef een zoeksleutel om gegevens in de tabel te filteren';
			resultaat+='<div>';
			resultaat+='<select class="w3-select w3-border w3-theme-l4 " id="B004_filterVeld" style="width:45%; float:left; padding:2px">';
			resultaat+='<optgroup label="Tekst">';
			resultaat+='<option value="Week" selected>Week</option>';
			resultaat+='<option value="Dag">Dag</option>';
			resultaat+='<option value="Datum">Datum</option>';
			resultaat+='</optgroup>';
			resultaat+='<optgroup label="Getal">';
			for (var i = 0; i < dagboeken.length; i++) {
				if (dagboeken[i].aantMut>0){ // Alleen de dagboeken selecteren waarvoor mutaties zijn
					var filterKolom      = '_filterKolom'+i+'_';
					var dagboekNaamtekst = dagboeken[i].jrnID+'-'+dagboeken[i].desc;
					resultaat +='<option value="'+filterKolom+'">'+dagboekNaamtekst+'</option>';
				}
			}
			resultaat+='<option value="_filterKolom'+(i++)+'_">Som mutaties</option>';
			resultaat+='<option value="_filterKolom'+(i++)+'_">Cumulatief saldo</option>';
			resultaat+='</optgroup>';
			resultaat+='</select>';
			resultaat+='</div>';

			resultaat+='<select class="w3-select w3-border w3-theme-l4 " id="B004_criterium" style="width:10%; padding:2px">';
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

			resultaat+='<input type="text" class="zoekVeld w3-input w3-border w3-theme-l4 w3-round-xlarge" id="filterInputB004" onkeyup="filterTabel(\'B004\', document.getElementById(\'B004_filterVeld\').value, document.getElementById(\'B004_criterium\').value)" placeholder="zoek.." style="width:45%; float:right; padding: 3px 10px 3px 40px">';
			resultaat+='</fieldset>';

			resultaat+='</form></div>';

			// oud: resultaat +='<input type="text" class="filterInput" id="filterInputB004" onkeyup="filterTabel(\'B004\')" placeholder="Search for names..">'
			return resultaat;
		}


		function sectie_Tabel(){
			// Gegevens in array 'matrix' kopiëren naar de HTML tabel
			var resultaat=''; // Variabele 'resultaat' verzamelt de HTML tekst

			resultaat = '';

			var dagNamen=['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'];
			var datumSom=0.0;
			var saldo=0.00;
			var saldoCumulatief = 0.0;

			// // Tabel filterbaar maken
			// resultaat +='<input type="text" class="zoekVeld w3-input w3-theme-l4 w3-round-xlarge w3-border" id="filterInputB004" onkeyup="filterTabel(\'B004\')" placeholder="Search for names..">';
			// bovenstaande zoekveld vervangen door ingewikkelder model
			// Gegevens in array 'matrix' kopiëren naar de HTML tabel
			resultaat +='<table id="tabel_B004"><caption>B004 Controle negatieve saldi rekening \''+geselecteerdeRekening+'\'</caption><thead><tr>';
			resultaat +='<th>Week</th> <th>Dag</th> <th>Datum</th>';
			for (var i = 0; i < dagboeken.length; i++) {
				if (dagboeken[i].aantMut>0){ // Alleen de dagboeken selecteren waarvoor mutaties zijn
					var filterKolom      = '_filterKolom'+i+'_';
					//var dagboekNaamtekst = dagboeken[i].jrnID+'-'+dagboeken[i].desc;
					var dagboekNaamtekst = dagboeken[i].jrnID+":<br>"+dagboeken[i].desc;
					resultaat += '<th class="'+filterKolom+'">'+dagboekNaamtekst+'</th>';
				}
			}
			resultaat += '<th class="_filterKolom'+(i++)+'_">Som<br>mutaties</th>';
			resultaat += '<th class="_filterKolom'+(i++)+'_">Cumulatief<br>saldo</th>';
			resultaat += "</tr></thead> <tbody>";

			saldoCumulatief = 0.0;
			// Tabelrijen uit array 'datums': Week, Dag en Datum
			for (var j = 0; j < datums.length; j++){
				resultaat += "<tr>";
				resultaat += "<td>"+datums[j].weekNr+"</td>"+"<td>"+dagNamen[ datums[j].weekDag ]+"</td>"+"<td>"+datums[j].datum+"</td>";
				// dagboeken uit de array 'dagboeken'
				datumSom=0.0;
				saldo=0.00;
				for (var i = 0; i < dagboeken.length; i++) {
					if (dagboeken[i].aantMut>0){ // Alleen de dagboeken selecteren waarvoor mutaties zijn
						saldo = matrix[j][i].debet-matrix[j][i].credit;
						datumSom+=saldo;
						resultaat += "<td class='num"+(saldo<0 ? " Neg" : "")+(saldo==0 ? " nul" : "")+"'>" +saldo.toFixed(2)+"</td>";
					}
				}
				resultaat += "<td class='num"+(datumSom<0 ? " Neg" : "")+"'>" +datumSom.toFixed(2)+"</td>";
				saldoCumulatief+=datumSom;
				resultaat += "<td class='num"+(saldoCumulatief<0 ? " Neg" : "")+"'>" +saldoCumulatief.toFixed(2)+"</td>";
				resultaat+="</tr>";
			}
			resultaat += "</tbody>";
			// Totalen regel
			resultaat += "<tfoot><tr>";
			resultaat += "<td>Totaal</td> <td></td> <td></td> ";
			datumSom=0.0;
			saldo=0.00;
			for (var i = 0; i < dagboeken.length; i++) {
				if (dagboeken[i].aantMut>0){ // Alleen de dagboeken selecteren waarvoor mutaties zijn
					saldo = dagboeken[i].debet-dagboeken[i].credit;
					datumSom+=saldo;
					resultaat += "<td class='num"+(saldo<0 ? " Neg" : "")+"'>" +saldo.toFixed(2)+"</td>";
				}
			}
			resultaat += "<td class='num"+(datumSom<0 ? " Neg" : "")+"'>" +datumSom.toFixed(2)+"</td>";
			resultaat += "<td class='num"+(saldoCumulatief<0 ? " Neg" : "")+"'>" +saldoCumulatief.toFixed(2)+"</td>";

			resultaat += "</tr></tfoot></table>";
			resultaat += "<p></p>";

			return resultaat;
		}

		function appendHTML(doel, htmlTekst){
			var div1 = document.createElement("div");
			div1.innerHTML=htmlTekst;
			doel.appendChild(div1);
		}
	}

	/**
	* functie geefDatumIndexNr
	* Zoek in array 'datumIndex' naar de datum
	* - als die bestaat, retourneer dan simpelweg het indexnummer.
	* - als de datum nog niet bestaat, voeg dan de datum toe in array 'datumIndex' en array 'datums'
	*   en retourneer daarna het nieuwe indexnummer.
	* @param {string} datum - De datum die gezocht wordt in formaat YYYY-MM-DD
	* @returns {int} - het indexnummer van de datum in arrays 'datumIndex' en 'datums'
	**/
	function geefDatumIndexNr(datum){
	}


	/**
	* functie geefDagboekIndexNr
	* Zoek in array 'dagboekIndex' naar het dagboek
	* - als die bestaat, retourneer dan simpelweg het indexnummer.
	* - als de datum nog niet bestaat, voeg dan de datum toe in array 'dagboekIndex' en array 'dagboeken'
	*   en retourneer daarna het nieuwe indexnummer.
	* @param {string} dagboek - Het dagboek dat gezocht wordt in de vorm van veld 'jrnID' in 'journal'
	* @returns {int} - het indexnummer van het dagboek in arrays 'dagboekIndex' en 'dagboeken'
	**/
	function geefDagboekIndexNr(datum){
	}


	// addDays en getDates bron: https://stackoverflow.com/questions/4413590/javascript-get-array-of-dates-between-2-dates
	// Geef een array met alle dagen tussen twee datums (inclusief)
	function getDates(startDate, stopDate) {
		var dateArray = [];
		var currentDate = new Date(startDate);
		while (currentDate <= stopDate) {
			dateArray.push( new Date (currentDate) );
			//currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
			currentDate.setDate(currentDate.getDate() + 1);
		}
		return dateArray;
	}

	// Specifieke conversiefunctie voor Date naar tekst formaat YYYY-DD-MMM
	function datumString(datum){
		// Converteer datum naar een string in formaat YYYY-MM-DD
		return(''+datum.getFullYear() + '-' + ('00'+(datum.getMonth()+1)).slice(-2) + '-' + ('00'+datum.getDate()).slice(-2) );
	}

}

//   EOF B004.js
