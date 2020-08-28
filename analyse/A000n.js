/*
* A000n.js
* Onderdeel van project xaf_analyse
* Voor uitleg en licentie zie bestand xaf_analyse.js.
*/

/**
* Functie A000n
* Analyse A000n Kolommenbalans/Saldibalans
* Zie de functionele beschrijving
* {@link https://github.com/aftools/XAF-in-de-browser/wiki/A000-Proefbalans-Saldibalans}
**/
function A000n(){
	// Maak een matrix, met in de rijen de grootboekrekening, in de kolommen de dagboeken en in de waarden de som van mutaties,
	// laatste kolom is eindsaldo.
	// Resultaat saldilijst wordt verzameld in de array 'matrix'
	// Hulptabel voor gegevens van grootboekrekeningen in array 'rekeningIndex'
	var rekeningIndex = [];
	var matrix = [];

	// structuur van elk matrix-record: rekening, naam, soort, leadCode, aantBb, saldoBb, aantMut, debet, credit, saldoMut, saldoEind
	function legeMatrix(accID){this.rekening=accID; this.naam=""; this.soort="", this.leadCode="", this.aantBb=0; this.saldoBb=0.0; this.aantMut=0; this.debet=0.0; this.credit=0.0; this.saldoMut=0.0; this.saldoEind=0.0;}

	telMutaties(); 	          // 1 - Tel de mutaties in tabel 'trLine' per grootboekrekening 'accID'
	telBeginbalans();       	// 2 - Voeg gegevens beginbalans uit tabel 'obLine' toe aan de saldilijst
	rekeningInfoToevoegen(); 	// 3 - Voeg gegevens uit tabel 'ledgerAccount' toe aan de saldilijst (inclusief beginbalans)
	renderHTML();             // 4 - Inhoud van array 'matrix' naar html tabel
	// Klaar.


	//=======================
	// Subroutines
	//=======================

	function telMutaties(){
		// - Tel de mutaties in tabel 'trLine' per grootboekrekening 'accID'. Update velden aantMut, debet en credit.
		//   - Grootboekrekening is positie 9-1=8
		//   - Bedrag is positie 13-1=12
		//   - DC is positie 14-1=13
		var bronTabel = document.getElementById('trLine');
		var aantalRijen = bronTabel.rows.length;
		for (var i = 1; i < aantalRijen; i++){
			var rekening = bronTabel.rows.item(i).cells.item(8).innerHTML;
			var bedrag = parseFloat(bronTabel.rows.item(i).cells.item(12).innerHTML);
			var dc = bronTabel.rows.item(i).cells.item(13).innerHTML;
			var debet = 0.0;
			var credit = 0.0;
			if (dc==="C"){ credit+=bedrag; } else {debet+=bedrag;}
			var positie=rekeningIndex.indexOf(rekening);
			if (positie<0){
				// Nog niet aanwezig, toevoegen
				rekeningIndex.push(rekening);
				matrix.push(new legeMatrix(rekening));
				positie=rekeningIndex.indexOf(rekening);
			}
			// Optellen
			matrix[positie].aantMut+=1;
			matrix[positie].debet+=debet;
			matrix[positie].credit+=credit;
		}
	}

	function telBeginbalans(){
		//- Voeg gegevens beginbalans uit tabel 'obLine' toe aan de saldilijst, update velden aantBb en saldoBb.
		//   - Grootboekrekening is positie 2-1=1
		//   - Bedrag            is positie 5-1=4
		//   - DC                is positie 6-1=5
		var bronTabel = document.getElementById('obLine');
		var aantalRijen = bronTabel.rows.length;
		for (var i = 1; i < aantalRijen; i++){
			var rekening = bronTabel.rows.item(i).cells.item(1).innerHTML;
			var bedrag = parseFloat(bronTabel.rows.item(i).cells.item(4).innerHTML);
			var dc = bronTabel.rows.item(i).cells.item(5).innerHTML;
			var debet = 0.0;
			var credit = 0.0;
			if (dc==="C"){ credit+=bedrag; } else {debet+=bedrag;}
			var positie=rekeningIndex.indexOf(rekening);
			if (positie<0){
				// Geen eerdere mutaties voor deze rekening, kennelijk alleen beginbalans. Matrixregel toevoegen voor beginbalans
				rekeningIndex.push(rekening);
				matrix.push(new legeMatrix(rekening));
				positie=rekeningIndex.indexOf(rekening);
			}
			// beginbalans gegevens toevoegen
			matrix[positie].saldoBb += debet-credit;
			matrix[positie].aantBb  += 1;
		}
	}

	function rekeningInfoToevoegen(){
		//- Voeg gegevens uit tabel 'ledgerAccount' toe aan de saldilijst (inclusief beginbalans)
		//   - Grootboekrekening is positie 1-1=0 (acct)
		//   - RekeningNaam      is positie 2-1=1
		//   - RekeningSoort     is         3-1=2
		//   - leadCode          is         6-1=5
		var bronTabel = document.getElementById('ledgerAccount');
		var aantalRijen = bronTabel.rows.length;
		for (var i = 1; i < aantalRijen; i++){
			var rekening = bronTabel.rows.item(i).cells.item(0).innerHTML;
			var positie=rekeningIndex.indexOf(rekening);
			if (positie<0){
				// Geen mutaties of beginbalans voor deze rekening, negeren
			} else {
				// wel mutaties, gegevens toevoegen
				matrix[positie].naam = bronTabel.rows.item(i).cells.item(1).innerHTML;
				matrix[positie].soort = bronTabel.rows.item(i).cells.item(2).innerHTML;
				matrix[positie].leadCode = bronTabel.rows.item(i).cells.item(5).innerHTML;
			}
		}
	}

	// - Inhoud van de array 'matrix' naar html tabel
	function renderHTML(){
		// Resultaat schrijven naar HTML pagina
		var doel = document.getElementById('A000nresultaat');
		doel.innerHTML=''; // doel leegmaken

	  // Tellingen die in meerdere tabellen worden gebruikt	
		var somAantMut = 0;
		var somDebet   = 0.0;
		var somCredit  = 0.0;

		appendHTML(doel, sectie_Tabel());         // Tabel A000n aanmaken
		appendHTML(doel, samenv_acctTp());        // Maak samenvatting op acctTp
		appendHTML(doel, vergelijk_transactions());  // Maak de vergelijking met totalen in Transactions

		// doelgebied horizontaal scrollbaar maken
		if (doel.className.indexOf("hor_scroll") == -1) {
			doel.className += " hor_scroll";
		}

		// tabellen sorteerbaar maken (sorttable.js)
		sorttable.makeSortable(document.getElementById('tabel_A000n'));
		sorttable.makeSortable(document.getElementById('tabel_A000n_samenv_acctTp'));
		sorttable.makeSortable(document.getElementById('tabel_A000n_vergelijk_transactions'));
		return;
		// Klaar.

		//=======================
		// Subroutines binnen renderHTML
		// - sectie_Tabel
		// - samenv_acctTp
		// - vergelijk_transactions
		// - appendHTML
		//=======================

		function sectie_Tabel(){
			var somBB      = 0.0;
			var saldoMut   = 0.0;
			var saldoEind  = 0.0;
			var resultaat  = '';
			var tmpBedrag  = 0.0
			// Header van de tabel
			resultaat +='<p></p><table class="sortable" id="tabel_A000n"><caption>A000n - Kolommenbalans/Saldibalans</caption><thead><tr>';
			["Rekening", "Naam", "Soort", "leadCode", "BeginBalans", "Aantal Mut", "ProefDebet", "ProefCredit", "Saldo Mut", "Eindsaldo"].forEach(function(item) { resultaat += "<th>"+item+"</th>";});

			resultaat += "</tr></thead> <tbody>";
			for (var i = 0; i < matrix.length; i++){
				saldoMut  = matrix[i].debet-matrix[i].credit;
				saldoEind = matrix[i].saldoBb + saldoMut;
				resultaat += "<tr>";
				resultaat += "<td>"+matrix[i].rekening+"</td>";
				resultaat += "<td>"+matrix[i].naam+"</td>";
				resultaat += "<td>"+matrix[i].soort+"</td>";
				resultaat += "<td>"+matrix[i].leadCode+"</td>";
				if (matrix[i].aantBb>0){ // Beginbalans alleen weergeven indien er BB mutaties zijn.
					resultaat += "<td class='num"+(matrix[i].saldoBb<0 ? " Neg" : "")+"'>"    +matrix[i].saldoBb.toFixed(2)+"</td>";
				} else {
					resultaat += "<td></td>";
				}
				if (matrix[i].aantMut>0){ // Mutatiegegevens alleen weergeven als er mutaties zijn.
					resultaat += "<td class='num'>"+matrix[i].aantMut+"</td>";
					tmpBedrag = matrix[i].debet;
					resultaat += "<td class='num"+(tmpBedrag<0 ? " Neg" : "")+(tmpBedrag==0 ? " nul" : "")+"'>" +tmpBedrag.toFixed(2)+"</td>";
					tmpBedrag = matrix[i].credit;
					resultaat += "<td class='num"+(tmpBedrag<0 ? " Neg" : "")+(tmpBedrag==0 ? " nul" : "")+"'>" +tmpBedrag.toFixed(2)+"</td>";
				} else {
					resultaat += "<td></td><td></td><td></td>";
				}
				resultaat += "<td class='num"+(saldoMut<0 ? " Neg" : "")+"'>"+saldoMut.toFixed(2)+"</td>";
				resultaat += "<td class='num"+(saldoEind<0 ? " Neg" : "")+"'>"+saldoEind.toFixed(2)+"</td>";
				resultaat += "</tr>";
				somBB       +=matrix[i].saldoBb;
				somAantMut  +=matrix[i].aantMut;
				somDebet    +=matrix[i].debet;
				somCredit   +=matrix[i].credit;
			}
			resultaat += "</tbody><tfoot><tr>";
			resultaat += "<td>Totaal</td>";
			resultaat += "<td></td><td></td>";
			resultaat += "<td class='num"+(Math.abs(somBB)>1 ? " Verschil" : " Ok")+"'>"+somBB.toFixed(2)+"</td>";
			resultaat += "<td class='num'>"                               +somAantMut.toFixed(0)+"</td>";
			resultaat += "<td class='num"+(somDebet<0 ? " Neg" : "")+"'>" +somDebet.toFixed(2)+"</td>";
			resultaat += "<td class='num"+(somCredit<0 ? " Neg" : "")+"'>"+somCredit.toFixed(2)+"</td>";
			saldoMut  = somDebet-somCredit;
			resultaat += "<td class='num"+(Math.abs(saldoMut)>1 ? " Verschil" : " Ok")+"'>"+saldoMut.toFixed(2)+"</td>";
			saldoEind = somBB + saldoMut;
			resultaat += "<td class='num"+(Math.abs(saldoEind)>1 ? " Verschil" : " Ok")+"'>"+saldoEind.toFixed(2)+"</td>";
			resultaat += "</tr></tfoot></table>";


			// - Geef een oordeel: Debet-Credit in evenwicht ?
			if (Math.abs(somBB)>1){
				resultaat += '<p class="error">\u2A2F Fout: Debet-Credit in Beginbalans is NIET in evenwicht.</p>';
			} else {
				resultaat += '<p class="ok">\u2713 Ok: Debet-Credit in Beginbalans is in evenwicht.</p>';
			}
			if (Math.abs(saldoMut)>1){
				resultaat += '<p class="error">\u2A2F Fout: Debet-Credit in Mutaties is NIET in evenwicht.</p>';
			} else {
				resultaat += '<p class="ok">\u2713 Ok: Debet-Credit in Mutaties is in evenwicht.</p>';
			}
			if (Math.abs(saldoEind)>1){
				resultaat += '<p class="error">\u2A2F Fout: Debet-Credit in Eindsaldo is NIET in evenwicht.</p>';
			} else {
				resultaat += '<p class="ok">\u2713 Ok: Debet-Credit in Eindsaldo is in evenwicht.</p>';
			}

			// Hint voor handmatige vervolgactie:
			resultaat += '<p class="hint">! Hint: Stel vast dat de saldilijst aansluit bij de gegevens in het bronsysteem.</p>';
			return resultaat;
		} // einde maakTabel

		function samenv_acctTp(){
			// - Gegevens samenvatten per rekeningsoort 'accTp'
			//   -> gebruik de totalen in 'matrix' als bron
			var matrixSoort = [];
			var soortIndex   = [];
			var legeSoort = {soort: "", AantRek: 0, aantMut: 0, debet: 0.0, credit: 0.0};

			var resultaat='';

			matrix.forEach(function(rij) {
				var positie=soortIndex.indexOf(rij.soort);
				if (positie<0){
					// Soort nog niet aanwezig, toevoegen
					soortIndex.push(rij.soort);
					//matrixSoort.push(legeSoort);
					matrixSoort.push({soort: "", AantRek: 0, aantMut: 0, debet: 0.0, credit: 0.0});
					positie=soortIndex.indexOf(rij.soort);
					matrixSoort[positie].soort = rij.soort;
				}
				// Optellen
				matrixSoort[positie].AantRek+=1;
				matrixSoort[positie].aantMut+=rij.aantMut;
				matrixSoort[positie].debet+=rij.debet;
				matrixSoort[positie].credit+=rij.credit;
			});

			//   Array naar een tabel transformeren
			resultaat +='<p></p><table class="sortable" id="tabel_A000n_samenv_acctTp"><caption>Samenvatting mutaties op soort (veld accTp in tabel ledgerAccount)</caption><thead><tr>';
			["Soort rekening ('accTp')", "Aantal rekeningen", "Aantal mutatieregels", "Telling Debet", "Telling Credit", "Saldo"].forEach(function(item) { resultaat += "<th>"+item+"</th>";});
			resultaat += "</tr></thead> <tbody>";

			var somAantRek = 0;
			var somAantMut = 0;
			var somDebet   = 0.0;
			var somCredit  = 0.0;
			var saldoMut;

			for (var i = 0; i < matrixSoort.length; i++){
				resultaat += "<tr>";
				resultaat += "<td>"+matrixSoort[i].soort+"</td>";
				resultaat += "<td class='num'>"+matrixSoort[i].AantRek+"</td>";
				resultaat += "<td class='num'>"+matrixSoort[i].aantMut+"</td>";
				resultaat += "<td class='num'>"+matrixSoort[i].debet.toFixed(2)+"</td>";
				resultaat += "<td class='num'>"+matrixSoort[i].credit.toFixed(2)+"</td>";
				saldoMut     = matrixSoort[i].debet-matrixSoort[i].credit;
				resultaat += "<td class='num"+(saldoMut<0 ? " Neg" : "")+"'>"+(saldoMut).toFixed(2)+"</td>";
				resultaat += "</tr>";
				somAantRek  +=matrixSoort[i].AantRek;
				somAantMut  +=matrixSoort[i].aantMut;
				somDebet    +=matrixSoort[i].debet;
				somCredit   +=matrixSoort[i].credit;
			}
			resultaat += "</tbody><tfoot><tr>";
			resultaat += "<td>Totaal</td>";
			resultaat += "<td class='num'>"                              +somAantRek.toFixed(0)+"</td>";
			resultaat += "<td class='num'>"                              +somAantMut.toFixed(0)+"</td>";
			resultaat += "<td class='num"+(somDebet<0 ? " Neg" : "")+"'>" +somDebet.toFixed(2)+"</td>";
			resultaat += "<td class='num"+(somCredit<0 ? " Neg" : "")+"'>"+somCredit.toFixed(2)+"</td>";
			saldoMut     = somDebet-somCredit;
			resultaat += "<td class='num"+(Math.abs(saldoMut)>1 ? " Verschil" : " Ok")+"'>"+saldoMut.toFixed(2)+"</td>";
			resultaat += "</tr></tfoot></table>";

			return resultaat;
		}

		function vergelijk_transactions(){
			// - Totalen uit 'transactions' reproduceren. Maar dan 'netjes' met juiste uitlijning getallen.
			//   - Aantal     is positie 1-1=0
			//   - Som Debet  is positie 2-1=1
			//   - Som Credit is positie 3-1=2
			var bronTabel = document.getElementById('transactions');

			var resultaat='';

			resultaat +='<p></p><table class="sortable" id="tabel_A000n_vergelijk_transactions"><caption>Vergelijk som mutaties met totalen uit tabel Transactions</caption><thead><tr>';
			["Bron", "Aantal mutatieregels", "Telling Debet", "Telling Credit"].forEach(function(item) { resultaat += "<th>"+item+"</th>";});
			resultaat += "</tr></thead> <tbody>";

			// er is maar één rij om uit te lezen
			var checkAantMut   = parseInt(bronTabel.rows.item(1).cells.item(0).innerHTML);
			var checkDebet     = parseFloat(bronTabel.rows.item(1).cells.item(1).innerHTML);
			var checkCredit    = parseFloat(bronTabel.rows.item(1).cells.item(2).innerHTML);
			// Telling uit Transactieregels netjes naar nieuwe tabel
			resultaat += "<tr>";
			resultaat += "<td>Telling uit transactieregels (IST)</td>";
			resultaat += "<td class='num"+(somAantMut<0 ? " Neg" : "")+"'>"+somAantMut.toFixed(0)+"</td>";
			resultaat += "<td class='num"+(somDebet  <0 ? " Neg" : "")+"'>"+somDebet.toFixed(2)+"</td>";
			resultaat += "<td class='num"+(somCredit <0 ? " Neg" : "")+"'>"+somCredit.toFixed(2)+"</td>";
			resultaat += "</tr>";
			// data uit tabel 'Transactions' netjes naar nieuwe tabel
			resultaat += "<tr>";
			resultaat += "<td>Totalen uit tabel 'Transactions' (SOLL)</td>";
			resultaat += "<td class='num"+(checkAantMut<0 ? " Neg" : "")+"'>"+checkAantMut.toFixed(0)+"</td>";
			resultaat += "<td class='num"+(checkDebet  <0 ? " Neg" : "")+"'>"+checkDebet.toFixed(2)+"</td>";
			resultaat += "<td class='num"+(checkCredit <0 ? " Neg" : "")+"'>"+checkCredit.toFixed(2)+"</td>";
			resultaat += "</tr>";
			// Verschil is IST-SOLL in de footer
			var verschilAantMut = somAantMut-checkAantMut;
			var verschilDebet   = somDebet    -checkDebet;
			var verschilCredit  = somCredit   -checkCredit;
			resultaat += "</tbody><tfoot><tr>";
			resultaat += "<td>Verschil (IST-SOLL)</td>";
			resultaat += "<td class='num"+(Math.abs(verschilAantMut)>0 ? " Verschil" : " Ok")+"'>"+verschilAantMut.toFixed(0)+"</td>";
			resultaat += "<td class='num"+(Math.abs(verschilDebet  )>1 ? " Verschil" : " Ok")+"'>"+verschilDebet.toFixed(2)+"</td>";
			resultaat += "<td class='num"+(Math.abs(verschilCredit )>1 ? " Verschil" : " Ok")+"'>"+verschilCredit.toFixed(2)+"</td>";
			resultaat += "</tr></tfoot></table>";

			// - Geef een oordeel: Sluiten de totalen aan ?
			if ( (Math.abs(verschilAantMut)>0) || (Math.abs(verschilDebet)>1) || (Math.abs(verschilCredit)>1) ){
				resultaat += '<p class="error">\u2A2F Telling van mutaties sluit NIET aan met totalen uit tabel Transactions.</p>';
			} else {
				resultaat += '<p class="ok">\u2713 Telling van mutaties sluit aan met totalen uit tabel Transactions.</p>';
			}
			resultaat += "<p></p>";

			return resultaat;
		}

	}
		
	function appendHTML(doel, htmlTekst){
		var div1 = document.createElement("div");
		div1.innerHTML=htmlTekst;
		doel.appendChild(div1);
	}

}

//   EOF A000n.js
