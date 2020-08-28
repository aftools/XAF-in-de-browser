/*
* B010.js
* Onderdeel van project xaf_analyse
* Voor uitleg en licentie zie bestand xaf_analyse.js.
*/

/**
* Functie B010
* Analyse B010 Boekingen buiten periode
* Zie de functionele beschrijving
* {@link https://github.com/AnalyticsLibrary/Analytics/wiki/B010-Boekingen-buiten-periode}
*
* Het eerste deel van B010 vraagt bevestiging of mutatie aan de periodetabel.
* het tweede deel (functie B010_deel2) voert daarna de feitelijke analyse uit.
**/
function B010(){

	// Variabele 'div_resultaat' verzamelt DOM objecten
	var div_resultaat = document.createElement("div");

	// Maak twee div's, voor deel 1 en voor deel 2
	var divB010deel1 = document.createElement("div");
	divB010deel1.setAttribute("id","B010deel1");
	div_resultaat.appendChild(divB010deel1);
	var divB010deel2 = document.createElement("div");
	divB010deel2.setAttribute("id","B010deel2");
	div_resultaat.appendChild(divB010deel2);

	// Plak 'div_resultaat' in het 'resultaatgebied' voor B010
	var doel = document.getElementById('B010resultaat');
	doel.innerHTML = "";
	doel.appendChild(div_resultaat);

	// Voer deel 1 uit: stel de vraag (de knop 'uitvoeren' in deel1 voert vervolgens deel2 uit)
	//B010_deel1();
	// Neen, meteen door naar deel 2, ToDo: daar t.z.t. optie voor aanpassen periodetabel
	B010_deel2();
	return;



	function B010_deel1(){
		// Geef de mogelijkheid de tabel 'periode' te wijzigen of aan te vullen.
		// zet de vraag in div met id 'B010deel1'

		var divB010deel1 = document.getElementById('B010deel1');

		// Variabele 'resultaat' verzamelt de HTML tekst
		var resultaat='';
		resultaat+='<p></p><div class="w3-card-4"><div class="w3-container w3-theme-l4">';
		resultaat+="Beoordeel of de lijst 'Periode' overeenstemt met de verwachting";
		resultaat+='</div>';
		resultaat+='<form class="w3-container w3-card-4" action="">';

		// Tabel 'period' kopiëren
		var periodeTabel = document.getElementById("period").innerHTML;
		resultaat+="<table>"+periodeTabel+"</table>";

		resultaat+='<p></p><button type="button" onclick="B010_deel2(document.getElementById(\'B010_keuze\').value)" class="w3-button w3-theme-l4 w3-hover-theme">Uitvoeren</button>';
		resultaat+='<p></p></form></div>';

		var div1 = document.createElement("div");
		div1.innerHTML=resultaat;
		divB010deel1.appendChild(div1);
	}
}

function B010_deel2(){
	// Voer de feitelijke analyse uit.
	// zet het resultaat in div met id 'B010deel2'

	// Maak een matrix, met in de rijen de periodes en in de kolommen de periodenummers afgeleid van mutatiedatum (trDt).
	// Resultaat aantal mutaties per periode-combinatie wordt verzameld in de array 'matrix'
	// Hulptabel voor periodes in array 'periodes' en 'periodeIndex'
	// Hulptabel voor periode uit trDat in array 'perUitDatums' en 'perUitDatIndex'
	var periodes       = [];
	var periodeIndex   = [];
	var perUitDatums   = [];
	var perUitDatIndex = [];
	var matrix         = [];

	var legePeriode     = {period: "", desc: "", startDate: "", endDate: "", aantMut: 0};
	var legePerUitDatum = {perUitDat: "", startDate: "", endDate: "", aantMut: 0,};
	var legeMutatie     = {aantMut: 0};

	verzamelperiodes();     // 1 - Alle benoemde periodes in de lijst 'periodes' (en 'periodeIndex') zetten uit tabel 'periode'.
	verzamelPerUitDat();   	// 2 - Alle benoemde periodes in tabel 'periode' in de lijst perUitDatums (en perUitDatIndex) zetten. Aanvullen met een periode vóór de eerste en ná de laatste.
	matrixVullen();					// matrix vullen met lege waarden
	telMutaties(); 	        // 3 - Tel de mutaties in tabel 'trLine' per periode 'period' (rijen) en per 'periode uit datum' (trDt).
	renderHTML();           // 4 - Inhoud van array 'matrix' naar html tabel

	// Klaar.


	//=======================
	// Subroutines
	//=======================



	function verzamelperiodes(){
		// Alle benoemde periodes in de lijst 'periodes' (en 'periodeIndex') zetten uit tabel 'periode'.
		// - periodNumber     op positie 1-1=0 (periodNumber)
		// - periodDesc       op positie 2-1=1 (periodDesc)
		// - startDatePeriod  op positie 3-1=2 (startDatePeriod)
		// - endDatePeriod    op positie 5-1=4 (startDatePeriod)
		// ToDo: periodetabel eerst sorteren: op nummer of op begindatum+einddatum
		var bronTabel = document.getElementById('period');
		var aantalRijen = bronTabel.rows.length;
		for (var i = 1; i < aantalRijen; i++){
			periodeIndex.push(bronTabel.rows.item(i).cells.item(0).innerHTML); // periodNumber
			periodes.push({
				period: bronTabel.rows.item(i).cells.item(0).innerHTML, // periodNumber
				desc: bronTabel.rows.item(i).cells.item(1).innerHTML,   // periodDesc
				startDatePeriod: bronTabel.rows.item(i).cells.item(2).innerHTML,   // startDate
				endDatePeriod: bronTabel.rows.item(i).cells.item(4).innerHTML,   // endDate
				aantMut: 0
			});
		}
	}

	function verzamelPerUitDat(){
		// Alle benoemde periodes in tabel 'periode' in de lijst perUitDatums (en perUitDatIndex) zetten.
		//   -> Aanvullen met een periode vóór de eerste en ná de laatste.
		// - periodNumber     op positie 1-1=0 (periodNumber)
		// - periodDesc       op positie 2-1=1 (periodDesc)
		// - startDatePeriod  op positie 3-1=2 (startDatePeriod)
		// - endDatePeriod    op positie 5-1=4 (startDatePeriod)
		// ToDo: periodetabel eerst sorteren: op nummer of op begindatum+einddatum
		var bronTabel = document.getElementById('period');
		var aantalRijen = bronTabel.rows.length;
		// Periode vóór de eerste
		var periodeCode = "< "+bronTabel.rows.item(1).cells.item(0).innerHTML; // vóór eerste periodNumber
		perUitDatIndex.push(periodeCode); // periodNumber
		var eindDatum = new Date(bronTabel.rows.item(1).cells.item(2).innerHTML);   // endDate is startDate eerste periode (min 1)
		eindDatum.setTime(eindDatum.getTime() - 1000*60*60*24*1); // Milliseconden voor -1 dag
		perUitDatums.push({
			period: periodeCode, // periodNumber
			startDatePeriod: 0,   // startDate
			endDatePeriod: eindDatum,   // endDate is startDate eerste periode (min 1)
			aantMut: 0
		});
		// Normale periodes
		for (var i = 1; i < aantalRijen; i++){
			perUitDatIndex.push(bronTabel.rows.item(i).cells.item(0).innerHTML); // periodNumber
			perUitDatums.push({
				period: bronTabel.rows.item(i).cells.item(0).innerHTML, // periodNumber
				startDatePeriod: new Date(bronTabel.rows.item(i).cells.item(2).innerHTML),   // startDate
				endDatePeriod: new Date(bronTabel.rows.item(i).cells.item(4).innerHTML),   // endDate
				aantMut: 0
			});
		}
		// Periode ná de laatste
		periodeCode = "> "+bronTabel.rows.item(aantalRijen-1).cells.item(0).innerHTML; // ná laatste periodNumber
		perUitDatIndex.push(periodeCode); // periodNumber
		var beginDatum = new Date(bronTabel.rows.item(aantalRijen-1).cells.item(4).innerHTML);   // startDate is endDate laatste periode (plus 1)
		beginDatum.setTime(beginDatum.getTime() + 1000*60*60*24*1); // Milliseconden voor +1 dag
		perUitDatums.push({
			period: periodeCode, // periodNumber
			startDatePeriod: beginDatum,   // startDate is endDate laatste periode (plus 1)
			endDatePeriod: 0,   // endDate
			aantMut: 0
		});
	}

	function matrixVullen(){
		for (var r=0;r<periodes.length; r++){
			var nieuweRij=[];
			for (var k=0; k<perUitDatums.length; k++){
				nieuweRij.push({aantMut: 0});
			}
			matrix.push(nieuweRij);
		}

	}


	function telMutaties(){
		// - Tel de mutaties in tabel 'transaction' per periode 'period' (rijen) en per 'periode uit datum' (trDt).
		//   - periode           is positie  5-1= 4 (periodNumber)
		//   - datum             is positie  6-1= 5 (trDt)
		var bronTabel = document.getElementById('transaction');
		var aantalRijen = bronTabel.rows.length;
		for (var i = 1; i < aantalRijen; i++){
			var periode = bronTabel.rows.item(i).cells.item(4).innerHTML; // Periode (periodNumber)
			var posPeriodeVer = periodeIndex.indexOf(periode);
			var datum    = bronTabel.rows.item(i).cells.item(5).innerHTML; // Datum (trDt)
			// Periode bepalen op basis datum
			var perUitDat = periodeUitDatum(new Date(datum));
			// Positie periode in horizontale richting
			var posPeriodeHor=perUitDatIndex.indexOf(perUitDat);
			if (posPeriodeHor<0){alert("Error: Periode "+perUitDat+" zit niet in de lijst met periodes");}
			waardenOptellen(posPeriodeVer, posPeriodeHor);  // Waarden optellen
		}
	}


	// Periode bepalen van een Datum (tabel perUitDatIndex). Retourneer het periodenummer.
	function periodeUitDatum(datum){
		var periodeCode = "??";
		var laatstePeriode = perUitDatums.length-1;
		if (datum<=perUitDatums[0].endDatePeriod){
			periodeCode=perUitDatums[0].period;
		}
		else if(datum>=perUitDatums[laatstePeriode].startDatePeriod){
			periodeCode=perUitDatums[laatstePeriode].period;
		}
		else {
			for(var i=1; i<laatstePeriode; i++){
				if ((datum>=perUitDatums[i].startDatePeriod) && (datum<=perUitDatums[i].endDatePeriod)){
					periodeCode=perUitDatums[i].period;
					break;
				}
			}
		}
		return periodeCode;
	}


	function waardenOptellen(posPeriode, posPerUitDat){
		// Waarden optellen voor de Datum/Dagboek combinatie (array 'matrix')
		matrix[posPeriode][posPerUitDat].aantMut+=1;
		// Waarden optellen voor deze Dagboek (t.b.v. totalen op de onderste rij)
		periodes[posPeriode].aantMut+=1;
		// Waarden optellen voor deze Datum (t.b.v. totalen per Datum in de laatste kolom) (wordt niet gebruikt)
		perUitDatums[posPerUitDat].aantMut+=1;
	}






	function renderHTML(){
		// Inhoud van array 'matrix' naar html tabel
		// Resultaat schrijven naar HTML pagina
		var doel = document.getElementById('B010resultaat');
		doel.innerHTML=''; // doel leegmaken

		appendHTML(doel, sectie_Tabel());        // Tabel zelf aanmaken

		if (doel.className.indexOf("hor_scroll") == -1) {
			doel.className += " hor_scroll";
		}
		// tabel sorteerbaar maken (sorttable.js)
		//sorttable.makeSortable(document.getElementById('tabel_B010'));
		// neen, deze tabel éénmalig gesorteerd op datum. Het heeft geen nut deze anders te sorteren.
		return;
		// Klaar.



		//=======================
		// Subroutines binnen renderHTML
		// - sectie_Tabel
		// - samenv_acctTp
		// - vergel_transactions
		//=======================

		function sectie_Tabel(){
			// Gegevens in array 'matrix' kopiëren naar de HTML tabel

			var resultaat=''; // Variabele 'resultaat' verzamelt de HTML tekst

			// Gegevens in array 'matrix' kopiëren naar de HTML tabel
			resultaat +='<table id="tabel_B010"><caption>B010 Boekingen buiten periode</caption><thead><tr>';
			
			resultaat +='<th colspan="3">Periodes uit tabel "periode"</th>';
			resultaat +='<th colspan="'+(perUitDatums.length+1)+'">Aantal mutaties per berekende periode uit "trDt"</th>';
			resultaat +='</tr><tr>';
			
			resultaat +='<th>Periode</th> <th>BeginDatum</th> <th>EindDatum</th>';
			for (var i = 0; i < perUitDatums.length; i++) {
				var filterKolom      = '_filterKolom'+i+'_';
				var periodeCode = perUitDatums[i].period;
				resultaat += '<th class="'+filterKolom+'">'+periodeCode+'</th>';
			}
			resultaat += '<th class="_filterKolom'+(i++)+'_">Som</th>';
			resultaat += "</tr></thead> <tbody>";

			// Tabelrijen uit array 'periodes': periodNumber, startDatePeriod en endDatePeriod
			for (var j = 0; j < periodes.length; j++){
				resultaat += "<tr>";
				resultaat += "<td>"+periodes[j].period+"</td>"+"<td>"+periodes[j].startDatePeriod+"</td>"+"<td>"+periodes[j].endDatePeriod+"</td>";
				// periode uit datum in de array 'perUitDatums'
				for (var i = 0; i < perUitDatums.length; i++) {
					var aantMut = matrix[j][i].aantMut;
					// ToDo: hier reageren als aantMut<>0 en i<>j+1
					resultaat += "<td class='num"+(aantMut<0 ? " Neg" : "")+(aantMut==0 ? " nul" : "")+"'>" +aantMut+"</td>";
				}
				// Som per periode toevoegen, zit in array 'periodes'
				resultaat += "<td class='num"+(periodes[j].aantMut<0 ? " Neg" : "")+"'>" +periodes[j].aantMut+"</td>";
				resultaat+="</tr>";
			}
			resultaat += "</tbody>";
			// Totalen regel, uit perUitDatums
			resultaat += "<tfoot><tr>";
			//resultaat += "<td>Som</td> <td></td> <td></td> ";
			resultaat += '<td colspan="3">Som</td> ';

			for (var i = 0; i < perUitDatums.length; i++) {
				resultaat += "<td class='num' >" +perUitDatums[i].aantMut+"</td>";
			}
			resultaat += "<td> </td>";

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
	* functie geefperUitDatIndexNr
	* Zoek in array 'perUitDatIndex' naar de datum
	* - als die bestaat, retourneer dan simpelweg het indexnummer.
	* - als de datum nog niet bestaat, voeg dan de datum toe in array 'perUitDatIndex' en array 'datums'
	*   en retourneer daarna het nieuwe indexnummer.
	* @param {string} datum - De datum die gezocht wordt in formaat YYYY-MM-DD
	* @returns {int} - het indexnummer van de datum in arrays 'perUitDatIndex' en 'datums'
	**/
	function geefperUitDatIndexNr(datum){
	}


	/**
	* functie geefperiodeIndexNr
	* Zoek in array 'periodeIndex' naar het dagboek
	* - als die bestaat, retourneer dan simpelweg het indexnummer.
	* - als de datum nog niet bestaat, voeg dan de datum toe in array 'periodeIndex' en array 'periodes'
	*   en retourneer daarna het nieuwe indexnummer.
	* @param {string} dagboek - Het dagboek dat gezocht wordt in de vorm van veld 'jrnID' in 'journal'
	* @returns {int} - het indexnummer van het dagboek in arrays 'periodeIndex' en 'periodes'
	**/
	function geefperiodeIndexNr(datum){
	}



	// Specifieke conversiefunctie voor Date naar tekst formaat YYYY-DD-MMM
	function datumString(datum){
		// Converteer datum naar een string in formaat YYYY-MM-DD
		return(''+datum.getFullYear() + '-' + ('00'+(datum.getMonth()+1)).slice(-2) + '-' + ('00'+datum.getDate()).slice(-2) );
	}

}

//   EOF B010.js
