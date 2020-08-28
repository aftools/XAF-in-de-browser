/*
* A001.js
* Onderdeel van project xaf_analyse
* Voor uitleg en licentie zie bestand xaf_analyse.js.
*/

/**
 * Functie A001
 * A001 Saldibalans per periode 
 * Zie de functionele beschrijving 
 * {@link https://github.com/AnalyticsLibrary/Analytics/wiki/A001-Mutaties-per-periode}
**/
function A001(){
	
	// Variabele 'resultaat' verzamelt de HTML tekst
	var resultaat='';
	
	// Maak een matrix, met in de rijen de grootboekrekening en in de kolommen de periode. Laatste kolom is eindsaldo.
	var rekeningen = [];
	var rekeningIndex = [];
	var perioden = [];
	var periodeIndex = [];
	var mutaties = [];
	
	// Alle beschikbare perioden in de lijst zetten (tabel 'period')
	// - Periode is positie 1-1=0 (periodNumber)
	// - PeriodeNaam is positie 2-1=1 (periodDesc)
	var bronTabel = document.getElementById('period');
	var aantalRijen = bronTabel.rows.length;
	for (i = 1; i < aantalRijen; i++){
		periodeIndex.push(bronTabel.rows.item(i).cells.item(0).innerHTML);
    perioden.push({periodNumber: bronTabel.rows.item(i).cells.item(0).innerHTML, 
    	             periodDesc: bronTabel.rows.item(i).cells.item(1).innerHTML,
									 aantMut: 0, debet: 0.0, credit: 0.0});
 	}
 
	// - Tel de mutaties in tabel 'trLine' per grootboekrekening 'accID' (rijen) en per periode 'periodNumber' (kolommen).
  //   - Periode is positie 5-1=4 (periodNumber)
	//   - Grootboekrekening is positie 9-1=8 (accID)
	//   - Bedrag is positie 13-1=12 (amnt)
	//   - DC is positie 14-1=13 (amntTp)
	var bronTabel = document.getElementById('trLine');
	var aantalRijen = bronTabel.rows.length;
	for (i = 1; i < aantalRijen; i++){
		var periode  = bronTabel.rows.item(i).cells.item(4).innerHTML; // Periode (periodNumber)
  	var rekening = bronTabel.rows.item(i).cells.item(8).innerHTML; // Grootboekrekening (accID)
  	var bedrag = parseFloat(bronTabel.rows.item(i).cells.item(12).innerHTML); // Bedrag (amnt)
  	var dc = bronTabel.rows.item(i).cells.item(13).innerHTML; // DC (amntTp)
  	var debet = 0.0;
  	var credit = 0.0;
  	if (dc==="C"){ credit+=bedrag } else {debet+=bedrag};
  	// Periode opzoeken in de tabel periodeIndex
  	var posPeriode=periodeIndex.indexOf(periode);
  	if (posPeriode<0){
  		alert("Error: periode "+periode+" zit niet in de lijst met perioden");
  	}	
  	// Rekening opzoeken in de tabel rekeningIndex
  	var posRekening=rekeningIndex.indexOf(rekening);
  	if (posRekening<0){
  		// Rekening nog niet aanwezig, rekening toevoegen
  		rekeningen.push({rekening: rekening, naam: "", soort: "", leadCode: "", aantMut: 0, debet: 0.0, credit: 0.0});
  		rekeningIndex.push(rekening);
    	posRekening=rekeningIndex.indexOf(rekening);
    	// Periodenummers aanmaken voor deze rekening
    	var nieuweRekeningPerioden = [];
  		for (j=0; j<perioden.length; j++){
  		   nieuweRekeningPerioden.push({periodNumber: perioden[j], aantMut: 0, debet: 0.0, credit: 0.0});
  		}
  		mutaties.push(nieuweRekeningPerioden);
  	}	
    // Waarden optellen voor de Rekening/Periode combinatie
    mutaties[posRekening][posPeriode].aantMut+=1;
    mutaties[posRekening][posPeriode].debet+=debet;
    mutaties[posRekening][posPeriode].credit+=credit;
    // Waarden optellen voor deze periode (t.b.v. totalen op de onderste rij)
    perioden[posPeriode].aantMut+=1;
    perioden[posPeriode].debet+=debet;
    perioden[posPeriode].credit+=credit;
    // Waarden optellen voor deze rekening (t.b.v. totalen per rekening in de laatste kolom) (wordt niet gebruikt)
    rekeningen[posRekening].aantMut+=1;
    rekeningen[posRekening].debet+=debet;
    rekeningen[posRekening].credit+=credit;
	}

	//- Voeg gegevens uit tabel 'ledgerAccount' toe aan de saldilijst
		//   - Grootboekrekening is positie 1-1=0 (accID)
		//   - RekeningNaam      is positie 2-1=1 (accDesc)
		//   - RekeningSoort     is         3-1=2 (accType)
		//   - leadCode          is         6-1=5 (leadCode)
	var bronTabel = document.getElementById('ledgerAccount');
	var aantalRijen = bronTabel.rows.length;
	for (i = 1; i < aantalRijen; i++){
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
  
  // Gegevens in array 'mutaties' kopiëren naar de HTML tabel	
	resultaat +='<p></p><table class="sortable" id="tabel_A001"><caption>A001 - Saldibalans per periode</caption><thead><tr>';
	//resultaat +='<th>Rekening</th> <th>Naam</th> <th>Soort</th> <th>leadCode</th>';
	["Rekening", "Naam", "Soort", "leadCode"].forEach(function(item) { resultaat += "<th>"+item+"</th>";});

  for (i = 0; i < perioden.length; i++) {
  	resultaat += "<th>"+perioden[i].periodNumber+"<br>"+perioden[i].periodDesc+"</th>";
  }
 	resultaat += "<th>Som</th>";
  resultaat += "</tr></thead> <tbody>"
  
  // Tabel rijen uit array 'rekeningen'
  for (j = 0; j < rekeningen.length; j++){
  	resultaat += "<tr>"
  	resultaat += "<td>"+rekeningen[j].rekening+"</td>"+
  	             "<td>"+rekeningen[j].naam+"</td>"+
  	             "<td>"+rekeningen[j].soort+"</td>"+
  	             "<td>"+rekeningen[j].leadCode+"</td>";
    // Perioden uit de array 'perioden'
    var rekeningSom=0.0;
    var saldo=0.00;
    for (i = 0; i < perioden.length; i++) {
	  	//resultaat += "<td class='num'>"+mutaties[j][i].aantMut+"</td>";
	  	saldo = mutaties[j][i].debet-mutaties[j][i].credit;
	  	rekeningSom+=saldo;
	  	resultaat += "<td class='num"+(saldo<0 ? " Neg" : "")+(saldo==0 ? " nul" : "")+"'>" +saldo.toFixed(2)+"</td>";
  	}
	  //resultaat += "<td class='num'>"+rekeningen[j].aantMut+"</td>";
	  resultaat += "<td class='num"+(rekeningSom<0 ? " Neg" : "")+"'>" +rekeningSom.toFixed(2)+"</td>";
  	resultaat+="</tr>";
  }
  resultaat += "</tbody>"
  // Totalen regel
  resultaat += "<tfoot><tr>";
  resultaat += "<td>Totaal</td> <td></td> <td></td> <td></td>";
  var rekeningSom=0.0;
  var saldo=0.00;
  for (i = 0; i < perioden.length; i++) {
	  	//resultaat += "<td class='num'>"+perioden[i].aantMut+"</td>";
	  	saldo = perioden[i].debet-perioden[i].credit;
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
  resultaat += "<p></p>"

	document.getElementById('A001resultaat').innerHTML=resultaat;
	// tabel sorteerbaar maken (sorttable.js)
  sorttable.makeSortable(document.getElementById('tabel_A001'));
	
}

//   EOF A001.js
