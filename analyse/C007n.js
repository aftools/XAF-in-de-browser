/*
* C007n.js
* Onderdeel van project xaf_analyse
* Voor uitleg en licentie zie bestand xaf_analyse.js.
*/

/**
* Functie C007n
* Analyse C007n Regelmaat van de omzet
* Zie de functionele beschrijving
* {@link https://github.com/aftools/XAF-in-de-browser/wiki/C007n-Regelmaat-van-de-omzet}
*
* Het eerste deel van C007n vraagt welk grootboekrekening moet worden getoetst.
* het tweede deel (functie C007n_deel2) voert daarna de feitelijke analyse uit.
**/
function C007n(){

	// Variabele 'div_resultaat' verzamelt DOM objecten
	var div_resultaat = document.createElement("div");

	// Maak twee div's, voor deel 1 en voor deel 2
	var divC007ndeel1 = document.createElement("div");
	divC007ndeel1.setAttribute("id","C007n_deel1");
	div_resultaat.appendChild(divC007ndeel1);
	var divC007ndeel2 = document.createElement("div");
	divC007ndeel2.setAttribute("id","C007n_deel2");
	div_resultaat.appendChild(divC007ndeel2);

	// Plak 'div_resultaat' in het 'resultaatgebied' voor C007n
	var doel = document.getElementById('C007nresultaat');
	doel.innerHTML = "";
	doel.appendChild(div_resultaat);

	// Voer deel 1 uit: stel de vraag
	C007n_deel1();




	function C007n_deel1(){
		// vraag welke grootboekrekening moet worden getoetst.
		// zet de vraag in div met id 'C007ndeel1'
		// ToDo: Vraag uitbreiden met: selectie op Grootboekrekening en selectie op RGS code

		var divC007ndeel1 = document.getElementById('C007n_deel1');
		var resultaat='';

		resultaat+='<p></p><div class="w3-card-4"><div class="w3-container w3-theme-l4">';
		resultaat+='&#x1F50E Welke (omzet-) grootboekrekening wil je op regelmaat controleren?';
		resultaat+='</div>';
		resultaat+='<form class="w3-container w3-card-4" action="">';
		resultaat+='<select class="w3-select w3-border w3-theme-l4 " id="C007n_keuze">';
		resultaat+='<option value="" disabled selected>&#x1F50E Kies de grootboekrekening</option>';

		// Alle beschikbare grootboekrekeningen in de lijst zetten (tabel 'ledgerAccount')
		// - accountID      is positie 1-1=0 (accountID)
		// - accountDesc    is positie 2-1=1 (accountDesc)
		// - accountType    is positie 3-1=2 (accountType)
		// - leadReference  is positie 6-1=5 (leadReference) RGS code
		// Grootboekrekeningen ophalen uit tabel 'ledgerAccount'?
		var bronTabel = document.getElementById('ledgerAccount');
		var aantalRijen = bronTabel.rows.length;
		for (var i = 1; i < aantalRijen; i++){
			var regel = '';
			var rekening = bronTabel.rows.item(i).cells.item(0).innerHTML;
			regel+= '<option value="'+rekening+'">';
			regel+= rekening; //accountID
			regel+= ' - '+bronTabel.rows.item(i).cells.item(1).innerHTML; //accountDesc
			regel+= ', Soort: '+bronTabel.rows.item(i).cells.item(2).innerHTML; //accountType
			var rgs = bronTabel.rows.item(i).cells.item(5).innerHTML;
			if (rgs.length>0){
				regel+= ', RGS code: '+bronTabel.rows.item(i).cells.item(5).innerHTML; // leadReference / RGS code
			}
			regel+= '</option>';
			resultaat+= regel;
			// ToDo: Dropdown met 'zoek' toevoegen op basis van https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_js_dropdown_filter
		}

		resultaat+='</select>';
		resultaat+='<p></p><button type="button" onclick="C007n_deel2(document.getElementById(\'C007n_keuze\').value)" class="w3-button w3-theme-l4 w3-hover-theme">Uitvoeren</button>';
		resultaat+='<p></p></form></div>';

		var div1 = document.createElement("div");
		div1.innerHTML=resultaat;
		divC007ndeel1.appendChild(div1);
	}
}

function C007n_deel2(geselecteerdeRekening){
	// Voer de feitelijke analyse uit, nu Grootboekrekening bekend is
	// zet het resultaat in div met id 'C007ndeel2'

	// Maak een matrix, met in de rijen de week en in de kolommen het de dag. Laatste kolom is weeksom.
	// Resultaat mutaties per week wordt verzameld in de array 'matrix'
	// Hulptabel voor gegevens van weken in array 'weken' en 'weekIndex'
	var weken       = [];
	var weekIndex   = [];
	var dagen       = [];
	var matrix      = [];
	var dagNamen    = ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'];


	maakDagen();            // 1 - Maak array 'dagen' voor het verzamelen de som per weekdag
	maakWeken();      	    // 3 - Alle beschikbare weken in de lijst weken en weekIndex zetten (begin- en einddatum in tabel 'header')
	telMutaties(); 	        // 4 - Tel de mutaties in tabel 'trLine' per week 'effDate' (rijen) en per dagboek 'jrnID' (kolommen).
	//     met filter op grootboekrekening 'rekening'. Gegevens verzamelen in de array 'matrix'
	sorteerMatrix();        // 6 - Sorteer de matrix op week.
	renderHTML();           // 7 - Inhoud van array 'matrix' naar html tabel

	// Klaar.


	//=======================
	// Subroutines van C007n_deel2
	// - maakDagen   // dagen in een array, horizontale as van de matrix
	// - maakWeken   // weken in een array, vertcale as van de matrix
	// - telMutaties // tel mutaties per week / per dag, data van de matrix
	// - sorteerMatrix // sorteer de matrix op weeknummer (verticaal)
	// - renderHTML // Inhoud van array 'matrix' naar html tabel
	//=======================

	function maakDagen(){
		// Maak array 'dagen' voor het verzamelen de som per weekdag
		for (var i=0; i<7; i++)	{
			dagen.push({dag: i, dagNaam: dagNamen[i], aantMut: 0, debet: 0.0, credit: 0.0});
		}
	}

	function maakWeken(){
		// Alle beschikbare weken in de lijst weken en weekIndex zetten (begin- en einddatum in tabel 'header')
		// - startDate  is rij 2-1=1 (startDate) kolom 2-1=1
		// - endDate    is rij 3-1=2 (endDate)   kolom 2-1=1
		var bronTabel = document.getElementById('header');
		var begindatum = new Date(bronTabel.rows.item(1).cells.item(1).innerHTML);
		var einddatum = new Date(bronTabel.rows.item(2).cells.item(1).innerHTML);
		var datumLijst = getDates(begindatum, einddatum);
		datumLijst.forEach(function(jsDatum){
			weekOpzoeken(jsDatum);
		});
	}


	function telMutaties(){
		// - Tel de mutaties in tabel 'trLine' per week 'effDate' (rijen) en per dag 'effDate' (kolommen).
		//   filter op grootboekrekening 'rekening'
		//   - Grootboekrekening is positie  9-1= 8 (accID)
		//   - Datum             is positie 11-1=10 (effDate)
		//   - Bedrag            is positie 13-1=12 (amnt)
		//   - DC                is positie 14-1=13 (amntTp)
		var bronTabel = document.getElementById('trLine');
		var aantalRijen = bronTabel.rows.length;
		for (var i = 1; i < aantalRijen; i++){
			var rekening = bronTabel.rows.item(i).cells.item(8).innerHTML; // Grootboekrekening (accID)
			if(rekening===geselecteerdeRekening){
				var datum    = bronTabel.rows.item(i).cells.item(10).innerHTML; // Datum (effDate)
				var jsDatum  = new Date(datum);
				//var week     = weekString(jsDatum);
				var weekdag  = jsDatum.getDay();
				var bedrag   = parseFloat(bronTabel.rows.item(i).cells.item(12).innerHTML); // Bedrag (amnt)
				var dc       = bronTabel.rows.item(i).cells.item(13).innerHTML; // DC (amntTp)
				var debet    = 0.0;
				var credit   = 0.0;
				if (dc==="C"){ credit+=bedrag; } else {debet+=bedrag; }
				// Week opzoeken in de tabel weekIndex
				var posWeek=weekOpzoeken(jsDatum);
				waardenOptellen(posWeek, weekdag, debet, credit);  // Waarden optellen
			} // endif rekening=geselecteerdeRekening
		}
	}

	// Week opzoeken in de tabel weekIndex (toevoegen als nog niet aanwezig)
	/**
	* functie weekOpzoeken
	* Zoek in array 'weekIndex' naar de datum
	* - als die bestaat, retourneer dan simpelweg het indexnummer.
	* - als de datum nog niet bestaat, voeg dan de datum toe in array 'weekIndex' en array 'weken'
	*   en retourneer daarna het nieuwe indexnummer.
	* @param {Date} datum - De datum die gezocht wordt als JavaScript Date waarde
	* @returns {int} - het indexnummer van de datum in arrays 'weekIndex' en 'weken'
	**/
	function weekOpzoeken(jsDatum){
		//var datumTekst = datumString(jsDatum);
		var week = weekString(jsDatum);
		//var weekdag = jsDatum.getDay();
		var posWeek=weekIndex.indexOf(week);
		if (posWeek<0){
			// Week nog niet aanwezig, Week toevoegen aan weken en weekIndex
			weekIndex.push(week);
			weken.push({week: week, aantMut: 0, debet: 0.0, credit: 0.0 }); // voor de weektotalen
			// In array 'matrix' veld aanmaken voor deze week en de dagen van de week
			var nieuweWeekDagen = [];
			for (var j=0; j<7; j++){
				nieuweWeekDagen.push({week: week, dagnr: j, aantMut: 0, debet: 0.0, credit: 0.0});
			}
			matrix.push(nieuweWeekDagen);
		  posWeek=weekIndex.length-1;
		}
		return posWeek;
	}


	function waardenOptellen(posWeek, posDag, debet, credit){
		// Waarden optellen voor de Datum/Dagboek combinatie (array 'matrix')
		matrix[posWeek][posDag].aantMut+=1;
		matrix[posWeek][posDag].debet+=debet;
		matrix[posWeek][posDag].credit+=credit;
		// Waarden optellen voor deze Dagboek (t.b.v. totalen op de onderste rij)
		dagen[posDag].aantMut+=1;
		dagen[posDag].debet+=debet;
		dagen[posDag].credit+=credit;
		// Waarden optellen voor deze Datum (t.b.v. totalen per Datum in de laatste kolom) (wordt niet gebruikt)
		weken[posWeek].aantMut+=1;
		weken[posWeek].debet+=debet;
		weken[posWeek].credit+=credit;
	}


	function sorteerMatrix(){
		// Sorteer de matrix op week
		// matrix bevat 52 rijen (weken), elke rij bevat 7 dagen. met a[0].week sorteer ik op de week aanduiding van de eerste dag.
		matrix.sort(function (a,b){
			if (a[0].week < b[0].week) return -1;
			if (a[0].week > b[0].week) return 1;
			return 0;
		});
		// - voor de goede orde ook array 'weken' sorteren op veld datum
		weken.sort(function (a,b){
			return (a.week - b.week);
		});
	}




	function renderHTML(){             // 4 - Inhoud van array 'matrix' naar html tabel
		// Resultaat schrijven naar HTML pagina
		var doel = document.getElementById('C007nresultaat');
		doel.innerHTML=''; // doel leegmaken

		appendHTML(doel, sectie_FilterTabel());  // Filter mogelijkheid voor de navolgende tabel
		appendHTML(doel, sectie_Tabel());        // Tabel zelf aanmaken

		if (doel.className.indexOf("hor_scroll") == -1) {
			doel.className += " hor_scroll";
		}
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
			resultaat+='<select class="w3-select w3-border w3-theme-l4 " id="C007n_filterVeld" style="width:45%; float:left; padding:2px">';
			resultaat+='<optgroup label="Tekst">';
			resultaat+='<option value="Week" selected>Week</option>';
			resultaat+='</optgroup>';
			resultaat+='<optgroup label="Getal">';
			for (var i = 0; i < 7; i++) {
				var filterKolom      = '_filterKolom'+i+'_';
				//var dagTekst = dagen[i].dag+'-'+dagen[i].dagNaam;
				var dagTekst = (dagen[i].dag+1)+'-'+dagen[i].dagNaam;
				resultaat +='<option value="'+filterKolom+'">'+dagTekst+'</option>';
			}
			resultaat+='<option value="_filterKolom'+(i++)+'_">Som mutaties</option>';
			resultaat+='</optgroup>';
			resultaat+='</select>';
			resultaat+='</div>';

			resultaat+='<select class="w3-select w3-border w3-theme-l4 " id="C007n_criterium" style="width:10%; padding:2px">';
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

			resultaat+='<input type="text" class="zoekVeld w3-input w3-border w3-theme-l4 w3-round-xlarge" id="filterInputC007n" onkeyup="filterTabel(\'C007n\', document.getElementById(\'C007n_filterVeld\').value, document.getElementById(\'C007n_criterium\').value)" placeholder="zoek.." style="width:45%; float:right; padding: 3px 10px 3px 40px">';
			resultaat+='</fieldset>';

			resultaat+='</form></div>';

			// oud: resultaat +='<input type="text" class="filterInput" id="filterInputC007n" onkeyup="filterTabel(\'C007n\')" placeholder="Search for names..">'
			return resultaat;
		}


		function sectie_Tabel(){
			// Gegevens in array 'matrix' kopiëren naar de HTML tabel
			var resultaat=''; // Variabele 'resultaat' verzamelt de HTML tekst

			resultaat = '';

			var weekSom=0.0;
			var saldo=0.00;

			// // Tabel filterbaar maken
			// resultaat +='<input type="text" class="zoekVeld w3-input w3-theme-l4 w3-round-xlarge w3-border" id="filterInputC007n" onkeyup="filterTabel(\'C007n\')" placeholder="Search for names..">';
			// bovenstaande zoekveld vervangen door ingewikkelder model
			// Gegevens in array 'matrix' kopiëren naar de HTML tabel
			resultaat +='<table id="tabel_C007n"><caption>C007n Regelmaat boekingen op rekening \''+geselecteerdeRekening+'\'</caption><thead><tr>';
			resultaat +='<th>Week</th> ';
			for (var i = 0; i < 7; i++) {
				var filterKolom      = '_filterKolom'+i+'_';
				var dagTekst = dagen[i].dagNaam;
				resultaat += '<th class="'+filterKolom+'">'+dagTekst+'</th>';
			}
			resultaat += '<th class="_filterKolom'+(i++)+'_">Som<br>mutaties</th>';
			resultaat += "</tr></thead> <tbody>";

			// Tabelrijen uit array 'weken': Week, Dag en Datum
			for (var j = 0; j < weken.length; j++){
				resultaat += "<tr>";
				resultaat += "<td>"+weken[j].week+"</td>";
				// dagen uit de array 'dagen'
				weekSom=0.0;
				saldo=0.00;
				for (var i = 0; i < 7; i++) {
					saldo = matrix[j][i].debet-matrix[j][i].credit;
					weekSom+=saldo;
					resultaat += "<td class='num"+(saldo<0 ? " Neg" : "")+(saldo==0 ? " nul" : "")+"'>" +saldo.toFixed(2)+"</td>";
				}
				resultaat += "<td class='num"+(weekSom<0 ? " Neg" : "")+"'>" +weekSom.toFixed(2)+"</td>";
				resultaat+="</tr>";
			}
			resultaat += "</tbody>";
			// Totalen regel
			resultaat += "<tfoot><tr>";
			resultaat += "<td>Totaal</td> ";
			weekSom=0.0;
			saldo=0.00;
			for (var i = 0; i < 7; i++) {
				saldo = dagen[i].debet-dagen[i].credit;
				weekSom+=saldo;
				resultaat += "<td class='num"+(saldo<0 ? " Neg" : "")+"'>" +saldo.toFixed(2)+"</td>";
			}
			resultaat += "<td class='num"+(weekSom<0 ? " Neg" : "")+"'>" +weekSom.toFixed(2)+"</td>";

			resultaat += "</tr></tfoot></table>";
			resultaat += "<p></p>";

			// Hint voor handmatige vervolgactie:
			resultaat += '<p class="hint">! Hint: Stel vast dat het patroon in de omzet overeenstemt met verwachtingen op basis van bedrijfsverkenning.</p>';

			return resultaat;
		}

		function appendHTML(doel, htmlTekst){
			var div1 = document.createElement("div");
			div1.innerHTML=htmlTekst;
			doel.appendChild(div1);
		}

	}



	// addDays en getDates bron: https://stackoverflow.com/questions/4413590/javascript-get-array-of-dates-between-2-dates
	// Geef een array met alle dagen tussen twee weken (inclusief)
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

	// Specifieke conversiefunctie voor Date naar weeknummer: YYYY.WW (voorloopnul voor weeknr)
	function weekString(datum){
		return(''+datum.getWeekYear()+'.' + ('00'+(datum.getWeek())).slice(-2) );
	}

}

// EOF C007n.js
