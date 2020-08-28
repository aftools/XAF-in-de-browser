/*
 * ====================================================================
 * xaf_analyse.js
 * ====================================================================
 * xaf_analyse.js is een (poging tot) implementatie van de 
 * analyses op auditfiles zoals genoemd in de 'Analyticslibrary'.
 * Zie: <a href="http://www.analyticslibrary.nl</a>
 * ====================================================================
 * Licence
 * ====================================================================
 * Javascript library xaf_analyse.js is free software 
 * licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

/* 
 * Individuele analyses elk in een eigen .js bestand
 * zie de afzonderlike bestanden A000.js, A001.js etc.
 * 
 * Elke analyse heeft een HTML table als resultaat.
 * Het resultaat wordt in het aanroepende HTML document ingevoegd.
 * De plaats van invoegen moet overeenkomen met de naam van de analyse.
 * Bijvoorbeeld: De tabel van analyse A001 komt in een div met id="A001resultaat"
 * de 'div' moet tevoren zijn gemaakt in het HTML document.
 */

/* 
 * Elke analyse haalt zijn informatie uit een ingelezen auditfile.
 * Resultaat van de auditfile is een reeks van tabellen.
 * De volgende tabellen worden gebruikt (selectie uit een XAF 3.2):
 * 
 *  'header'        	= Header 
 *  'company'       	= Bedrijf
 *  'ledgerAccount' 	= Rekeningschema
 *  'taxonomy'        = Betekenis van grootboekrekeningen
 *  'vatCode'       	= Btw codes
 *  'period'        	= Periodes
 *  'openingBalance'  = Totalen van de openingsbalans
 *  'obLine'          = Mutatieregels openingsbalans
 *  'customerSupplier'= Debiteuren/Crediteuren
 *  'journal'					= Dagboeken
 *  'transactions'    = Totaaltelling van transacties
 *  'transaction'			= Transacties (journaalposten/boekingen)
 *  'trLine'					= Transactieregels (journaalpostregels/boekingsregels)
 */

//======================
// subroutines
// Dit bestand xaf_analyse.js bevat voornamelijk generieke functies die door de analyses worden gebruikt
//======================

function xaf_analyse(){}
xaf_analyse.VERSION = "0.1";
xaf_analyse.VER_DATE= "sept 2017";



/**
 * Variabele lijst_analyses
 * Beschreven analyses op 'analyticslibrary.nl'
 * A000 is niet beschreven op analyticslibrary.nl, maar is zelf toegeveogd
 * Niet alle analyses zijn in het project xaf_analyse.js geïmplementeerd.
 * De variabele 'lijst_analyses' wordt o.a. gebruikt voor het opbouwen van de 'harmonica' structuur
 * in onderdeel 'Analyses' van de webpagina.
**/
var lijst_analyses = [
	{"domein": "A", "oms": "A - Verkennende analyses", "analyses": [
  	{"code": "A000n", "oms": "A000n Proefbalans/Saldibalans",    "website": "https://github.com/aftools/XAF-in-de-browser/wiki/A000-Proefbalans-Saldibalans"},
  	{"code": "A001", "oms": "A001 Saldibalans per periode",    "website": "https://github.com/AnalyticsLibrary/Analytics/wiki/A001-Mutaties-per-periode"},
  	{"code": "A002", "oms": "A002 Dagboek - grootboek matrix", "website": "https://github.com/AnalyticsLibrary/Analytics/wiki/A002-Dagboek-grootboek-matrix"},
  	{"code": "A003", "oms": "A003 Overzicht memoriaal boekingen", "website": "https://github.com/AnalyticsLibrary/Analytics/wiki/A003-Overzicht-memoriaal-boekingen"},
  	{"code": "A004", "oms": "A004 Inzicht in inkopen/verkopen per relatie", "website": "https://github.com/AnalyticsLibrary/Analytics/wiki/A004-Inzicht-in-inkopen-verkopen-per-relatie"},
  	{"code": "A005", "oms": "A005 Inzicht in masterdata relaties", "website": "https://github.com/AnalyticsLibrary/Analytics/wiki/A005-masterdata-relaties"}
  	]
  },
  {"domein": "B", "oms": "B - Basishygiëne",	"analyses": [
  	{"code": "B001", "oms": "B001 Teruggedraaide en dubbele boekingen", "website": "https://github.com/AnalyticsLibrary/Analytics/wiki/B001-Terug-gedraaide-en-dubbele-boekingen"},
  	{"code": "B002", "oms": "B002 Journaalposten met niet standaard waarde", "website": "https://github.com/AnalyticsLibrary/Analytics/wiki/B002-Journaalposten-met-niet-standaard-waarde"},
  	{"code": "B003", "oms": "B003 Afwijkende boekingen op debiteuren of crediteuren", "website": "https://github.com/AnalyticsLibrary/Analytics/wiki/B003-Afwijkende-boekingen-op-debiteuren-of-crediteuren"},
  	{"code": "B004", "oms": "B004 Controle negatieve kas", "website": "https://github.com/AnalyticsLibrary/Analytics/wiki/B004-Controle-negatieve-kas"},
  	{"code": "B005", "oms": "B005 Controle ongebruikelijke kastransacties", "website": "https://github.com/AnalyticsLibrary/Analytics/wiki/B005-Controle-ongebruikelijke-contante-trx"},
  	{"code": "B006", "oms": "B006 Overzicht creditnota's verkopen", "website": "https://github.com/AnalyticsLibrary/Analytics/wiki/B006-Credit-notas-verkopen"},
  	{"code": "B007", "oms": "B007 Overzicht creditnota's inkopen", "website": "https://github.com/AnalyticsLibrary/Analytics/wiki/B007-Credit-notas-inkopen"},
  	{"code": "B008", "oms": "B008 Aansluiting subadministratie debiteuren", "website": "https://github.com/AnalyticsLibrary/Analytics/wiki/B008-Aansluiting-sub-deb"},
  	{"code": "B009", "oms": "B009 Aansluiting subadministratie crediteuren", "website": "https://github.com/AnalyticsLibrary/Analytics/wiki/B009-Aansluiting-sub-cred"},
  	{"code": "B010", "oms": "B010 Boekingen buiten periode", "website": "https://github.com/AnalyticsLibrary/Analytics/wiki/B010-Boekingen-buiten-periode"},
  	{"code": "B011", "oms": "B011 Afwijkende boekingen leveranciers", "website": "https://github.com/AnalyticsLibrary/Analytics/wiki/B011-Afwijkende-boekingen-leveranciers"}
  ]
  },
  {"domein": "C", "oms": "C - Financiëring en werkkapitaal", "analyses": [
  	{"code": "C001", "oms": "C001 Overzicht van ratio's per maand", "website": "https://github.com/AnalyticsLibrary/Analytics/wiki/C001-Overzicht-van-ratio's-per-maand"},
  	{"code": "C002", "oms": "C002 Overzicht werkelijke betaaltermijnen relaties", "website": "https://github.com/AnalyticsLibrary/Analytics/wiki/C002-Overzicht-werkelijke-betaaltermijnen"},
  	{"code": "C003", "oms": "C003 Overzicht werkelijke betaaltermijnen facturen", "website": "https://github.com/AnalyticsLibrary/Analytics/wiki/C003-Overzicht-werkelijke-betaaltermijnen"},
  	{"code": "C004", "oms": "C004 Ouderdomsanalyse debiteuren", "website": "https://github.com/AnalyticsLibrary/Analytics/wiki/C004-ouderdom_deb"},
  	{"code": "C005", "oms": "C005 Ouderdomsanalyse crediteuren", "website": "https://github.com/AnalyticsLibrary/Analytics/wiki/C005-ouderdom_cred"},
  	{"code": "C006", "oms": "C006 Beoordeling gehanteerde valutakoersen", "website": "https://github.com/AnalyticsLibrary/Analytics/wiki/C006-valutakoersen"},
  	{"code": "C007n", "oms": "C007n Regelmaat van de omzet", "website": "https://github.com/aftools/XAF-in-de-browser/wiki/C007n-Regelmaat-van-de-omzet"}
 		]
 	},
  {"domein": "G", "oms": "G - Salaris en loonheffing",	"analyses": [
  	{"code": "G001", "oms": "G001 Cijferbeoordeling ingehouden loonheffing per periode", "website": "https://github.com/AnalyticsLibrary/Analytics/wiki/G001-Cijferbeoordeling-ingehouden-loonbelasting"},
  	{"code": "G002", "oms": "G002 Inschatting werkkostenregeling", "website": "https://github.com/AnalyticsLibrary/Analytics/wiki/G002-Inschatting-werkkostenregeling"},
  	{"code": "G003", "oms": "G003 Controle op inhouding werknemersverzekeringen", "website": "https://github.com/AnalyticsLibrary/Analytics/wiki/G003-Controle-op-inhouding-werknemersverzekeringen"}
  	]
  },
  {"domein": "H", "oms": "H - Omzetbelasting",	"analyses": [
  	{"code": "H001", "oms": "H001 Transacties met afnemers en leveranciers met afwijkend BTW percentage", "website": "https://github.com/AnalyticsLibrary/Analytics/wiki/H001-afwijkende-BTW"},
  	{"code": "H002", "oms": "H002 Transacties met niet-Nederlandse afnemers en leveranciers met BTW", "website": "https://github.com/AnalyticsLibrary/Analytics/wiki/H002-BTW-niet_Nederlandse-relaties"},
  	{"code": "H003", "oms": "H003 Overzicht van omzet en BTW per afnemer", "website": "https://github.com/AnalyticsLibrary/Analytics/wiki/H003-Overzicht-van-omzet-en-btw-per-afnemer"},
  	{"code": "H004", "oms": "H004 Aansluiting aangifte BTW", "website": "https://github.com/AnalyticsLibrary/Analytics/wiki/H004-aansluiting-aangifte-btw"},
  	{"code": "H005", "oms": "H005 Totalen per BTW code", "website": "https://github.com/AnalyticsLibrary/Analytics/wiki/H005-totalen-per_btw-code"}
  ]
  }
];


/**
 * functie analyse_uitvoeren()
 * Tussen-functie voor het uitvoeren van een analyse, 
 * controleert <ul>
 * <li> of de analyse wel aanwezig is
 * <li> of het doelgebied voor de analyse bestaat
 * <li> of er al een auditfile is ingelezen
 * </ul> en rapporteert over eventuele fouten
 *
 * @param {analyse} de naam van de analyse die moet worden uitgevoert.
**/
function analyse_uitvoeren(analyse){
  var resultaat = ''; // Verzamel resultaat foutmeldingen 
  var allesOk = true;
  // Check of het doel-gebied (bijvoorbeeld de div met id="A000resultaat") bestaat. Zo nee dan afbreken met foutmelding.
	if(!checkDoel(analyse+"resultaat")){return;};

	// Check of de analyse bestaat
	if (typeof(window[analyse]) !== 'function'){
	  // Foutmelding voor als nog niet beschikbaar
	  resultaat += '<p class="error"><img src="Werk in uitvoering.png" alt="Werk in uitvoering" height="52" width="60"> Nog niet beschikbaar. Er wordt aan gewerkt.</p>';
		allesOk=false;
  }

	// Check of een auditfile is ingelezen
  if (!checkXAF()){
	  // Foutmelding voor als auditfile nog niet is ingelezen
		resultaat += '<p class="hint"> ! Hint: Je kunt de analyses pas uitvoeren nadat een XAF auditfile is ingelezen. <br><b>Lees eerst een auditfile in!</b></p>';
		allesOk=false;
  }

	if (allesOk){
		// Voer de analyse uit (naam van de uit te voeren analyse zit in variabele 'analyse'
		window[analyse]();
	} else {
		// Foutmelding naar scherm
    document.getElementById(analyse+'resultaat').innerHTML=resultaat;
  }	
}



/**
 * functie checkXAF()
 * Controleer of een XAF is geladen. Voorlopig alleen check op bestaan van tabel 'header'
 * @return true of false
**/
function checkXAF(){
	if (document.getElementById('header')==null) {
		//alert("Je kunt de analyses pas uitvoeren nadat een XAF auditfile is ingelezen. \nLees eerst een auditfile in!" );
		return(false);
	} else {
		return(true);
	}
}


/**
 * functie checkDoel()
 * Controleer het doel in de webpagina bestaat.
 * @param {doel} het id van de 'div' waar het resultaat van de analyse moet worden geplaatst
 * @return true of false
**/
function checkDoel(doel){
	if (document.getElementById(doel)==null) {
		alert("Doel voor '"+doel+"' is niet gevonden. \nEr is iets mis met deze webpagina." );
		return(false);
	} else {
		return(true);
	}
}


/**
 * functie maak_accordeon_analyse
 * Maak de 'accordeon' met de verschillende analyses gegroepeerd per domein
 * Resultaat wordt direct geïnjecteerd in de html pagina op div id=
**/
function maak_accordeon_analyse(){
	// Gebruik variabele lijst_analyses voor het genereren van balken, sub-balken, knoppen en doel-divs voor de analyses.
	
	/*
	 * De hoofd-balk per 'domein' ziet er zo uit:
	 * <button onclick="accordeon('A')" class="w3-btn w3-block w3-left-align w3-border w3-theme-l4 w3-hover-theme">A - Verkennende analyses</button>
   * <div id="A" class="w3-container w3-hide">
   * ...
   * &nbsp;
   * </div> <!-- einde van de div A -->
   *
   * binnen die div (op de '...' de balken per analyse, en (indien een analyse beschikbaar is) een knop om de analyse uit te voeren.
   *   <button onclick="accordeon('A000')" class="w3-btn w3-block w3-left-align w3-border w3-theme-l4 w3-hover-theme">A000 - Proefbalans/Saldibalans</button>
   *   <div id="A000" class="w3-container w3-hide">
   * 	   Zie de beschrijving op <a href="https://github.com/aftools/XAF-in-de-browser/wiki/A000-Proefbalans-Saldibalans" target="_blank">A000 - Proefbalans/Saldibalans</a>
   *     <!-- de knop alleen plaatsen als de functie A000 ook werkelijk aanwezig is -->
   *     <br><button type="button" onclick="analyse_uitvoeren('A000')" class="w3-button w3-theme-l4 w3-hover-theme">Uitvoeren</button> 
   *     <!-- div A000resultaat is het 'doelbereik' van de analyse -->
   *     <div id="A000resultaat"><p></p></div>
   *     <p></p>
   *   </div> <!-- einde van de div A000 -->
   */

	var resultaat=''; // Variabele 'resultaat' verzamelt de HTML tekst
	for (i=0; i<lijst_analyses.length; i++){
		var domeinCode = lijst_analyses[i].domein;
		var domeinOms  = lijst_analyses[i].oms;

		// Maak een Button voor dit domein en het eerste deel van de div Accordeon per domein
		resultaat+='<button onclick="accordeon(\''+domeinCode+'\')" class="w3-btn w3-block w3-left-align w3-border w3-theme-l4 w3-hover-theme">'+domeinOms+'</button>';
		resultaat+='<div id="'+domeinCode+'" class="w3-container w3-hide">';

		// Loop door de analyses in dit domein
		var domeinAnalyses = lijst_analyses[i].analyses;
		for(j=0; j<domeinAnalyses.length; j++){
			analyseCode = domeinAnalyses[j].code;
			analyseOms  = domeinAnalyses[j].oms;
			analyseWeb  = domeinAnalyses[j].website;
			// Voor elke analyse een accordeon-balk aanmaken

			var functieBestaat = (typeof(window[analyseCode]) === 'function'); // check of de functie in variabele 'analyseCode' bestaat.
			resultaat+='<button onclick="accordeon(\''+analyseCode+'\')" class="w3-btn w3-block w3-left-align w3-border w3-theme-l4 w3-hover-theme">'+ (functieBestaat ? "" : "\u2A2F ")+analyseOms+'</button>';
			resultaat+='<div id="'+analyseCode+'" class="w3-container w3-hide">';
			resultaat+='Zie de beschrijving op <a href="'+analyseWeb+'" target="_blank">'+analyseOms+'</a>';

			// De knop alleen plaatsen als de functie voor deze analyse ook werkelijk aanwezig is
			if (functieBestaat){
				resultaat+='<br><button type="button" onclick="analyse_uitvoeren(\''+analyseCode+'\')" class="w3-button w3-theme-l4 w3-hover-theme">'+analyseCode+' Uitvoeren</button>';
			} else {
				resultaat += '<p class="hint"> \u2A2F Analyse \''+analyseOms+'\' is nog niet gemaakt. Hint: Zelf zin om bij te dragen?</b></p>';
			}

			// Maak een 'resultaat' div als doelbereik voor de analyse
			resultaat+='<div id="'+analyseCode+'resultaat"><p></p></div><p></p>';
			resultaat+='</div> <!-- einde van de div '+analyseCode+' -->';
		}

		// Alle analyses gehad voor dit domein, maak het einde van de div Accordeon per domein
		resultaat+='&nbsp;';
		resultaat+='</div> <!-- einde van de div'+domeinCode+' -->';
	}

	// Resultaat toevoegen aan pagina
	document.getElementById('analyse_accordeon').innerHTML=resultaat;
	
}


// functie voor het dynamisch koppelen van de afzonderlijke analyses als aparte .js file
// (wordt niet gebruikt!, scripts worden statisch gekoppeld in header van de HTML pagina)
function importJS(){
	document.write('<scr'+'ipt type="text/javascript" src="A000.js" ></scr'+'ipt>');
	document.write('<scr'+'ipt type="text/javascript" src="A001.js" ></scr'+'ipt>');
	document.write('<scr'+'ipt type="text/javascript" src="A002.js" ></scr'+'ipt>');
	document.write('<scr'+'ipt type="text/javascript" src="A003.js" ></scr'+'ipt>');
}


//   EOF xaf_analyse.js
