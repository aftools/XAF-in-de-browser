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
 * x9999.js
 * Onderdeel van project xaf_analyse
 * Voor uitleg en licentie zie bestand xaf_analyse.js.
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


/**
 * Functie X999
 * Analyse X999 Beschrijving van de analyse 
 * Zie de functionele beschrijving 
 * {@link https://github.com/xaf_analyse/Analytics/wiki/X999-Beschrijving-van-de-analyse}
**/
function X999(){
	//if(!checkXAF()){return;};
	//if(!checkDoel("X999resultaat")){return;};
	
	// Variabele 'resultaat' verzamelt de HTML tekst
	var resultaat='';
	
	
	

	// Foutmelding voor als nog niet beschikbaar
	var resultaat = '<p class="error"><img src="Werk in uitvoering.png" alt="Werk in uitvoering" height="52" width="60"> Nog niet klaar. Er wordt aan gewerkt.</p>';
	document.getElementById('X999resultaat').innerHTML=resultaat;
	
}


//   EOF X999.js
