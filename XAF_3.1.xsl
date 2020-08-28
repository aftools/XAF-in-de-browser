<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xaf="http://www.auditfiles.nl/XAF/3.1" exclude-result-prefixes="xaf" >

<!-- XSL voor het converteren van een XAF Auditfile Financieel versie 3.1 naar een HTML pagina voor weergave in de browser -->
<xsl:output method="html" />

<xsl:template match="/">
  <html>
  <body>


  	<!-- Inhoudsopgaaf -->
  	<table id="inhoudsopgaaf">
  		<caption>Inhoud</caption>
  		<thead><tr><th>Tabel</th><th>Omschrijving</th><th></th></tr></thead>
  		<tbody>
  			<tr><td><a href="#XheaderX">header</a></td><td>Algemene gegevens over de auditfile</td><td></td></tr>
  			<tr><td><a href="#XcompanyX">company</a></td><td>Gegevens van het bedrijf</td><td></td></tr>
  			<tr><td><a href="#XledgerAccountX">ledgerAccount</a></td><td>Rekeningschema</td><td class='num'></td></tr>
  			<tr><td><a href="#XtaxonomyX">taxonomy</a></td><td>Betekenis van grootboekrekeningen</td><td class='num'></td></tr>
  			<tr><td><a href="#XbasicX">basic</a></td><td>Basics</td><td class='num'></td></tr>
  			<tr><td><a href="#XvatCodeX">vatCode</a></td><td>Btw codes</td><td class='num'></td></tr>
  			<tr><td><a href="#XperiodX">period</a></td><td>Periodes</td><td class='num'></td></tr>
  			<tr><td><a href="#XopeningBalanceX">openingBalance</a></td><td>Totalen van de openingsbalans</td><td></td></tr>
  			<tr><td><a href="#XobLineX">obLine</a></td><td>Mutatieregels openingsbalans</td><td class='num'></td></tr>
  			<tr><td><a href="#XcustomerSupplierX">customerSupplier</a></td><td>customerSupplier NAW gegevens</td><td class='num'></td></tr>
  			<tr><td><a href="#XjournalX">journal</a></td><td>Dagboeken</td><td class='num'></td></tr>
  			<tr><td><a href="#XtransactionsX">transactions</a></td><td>Totaaltelling van transacties</td><td></td></tr>
  			<tr><td><a href="#XtransactionX">transaction</a></td><td>Transacties (journaalposten/boekingen)</td><td class='num'></td></tr>
  			<tr><td><a href="#XtrLineX">trLine</a></td><td>Transactieregels (journaalpostregels/boekingsregels)</td><td class='num'></td></tr>
  		</tbody>
  	</table>


    <!-- Header -->
    <p></p><a id="XheaderX"></a>
    <table id="header">
      <caption>Header</caption>
      <tbody>
      <xsl:for-each select="xaf:auditfile/xaf:header">
      <tr> <th>fiscalYear</th>        <td><xsl:value-of select="xaf:fiscalYear"/>        </td> </tr>
      <tr> <th>startDate</th>         <td><xsl:value-of select="xaf:startDate"/>         </td> </tr>
      <tr> <th>endDate</th>           <td><xsl:value-of select="xaf:endDate"/>           </td> </tr>
      <tr> <th>curCode</th>           <td><xsl:value-of select="xaf:curCode"/>           </td> </tr>
      <tr> <th>dateCreated</th>       <td><xsl:value-of select="xaf:dateCreated"/>       </td> </tr>
      <tr> <th>softwareDesc</th>      <td><xsl:value-of select="xaf:softwareDesc"/>      </td> </tr>
      <tr> <th>softwareVersion</th>   <td><xsl:value-of select="xaf:softwareVersion"/>   </td> </tr>
      </xsl:for-each>
      </tbody>
    </table>


    <!-- Company -->
    <p></p><a id="XcompanyX"></a>
    <table id="company">
      <caption>Company</caption>
      <tbody>
      <xsl:for-each select="xaf:auditfile/xaf:company">
      <tr> <th>companyIdent</th>             <td><xsl:value-of select="xaf:companyIdent"/>           </td> </tr>
      <tr> <th>companyName</th>              <td><xsl:value-of select="xaf:companyName"/>            </td> </tr>
      <tr> <th>taxRegistrationCountry</th>   <td><xsl:value-of select="xaf:taxRegistrationCountry"/> </td> </tr>
      <tr> <th>taxRegIdent</th>              <td><xsl:value-of select="xaf:taxRegIdent"/>            </td> </tr>
      <tr> <th>strAddr_streetname</th>       <td><xsl:value-of select="xaf:streetAddress[1]/xaf:streetname"/> </td> </tr>
      <tr> <th>strAddr_number</th>           <td><xsl:value-of select="xaf:streetAddress[1]/xaf:number"/> </td> </tr>
      <tr> <th>strAddr_numberExtensiton</th> <td><xsl:value-of select="xaf:streetAddress[1]/xaf:numberExtension"/> </td> </tr>
      <tr> <th>strAddr_city</th>             <td><xsl:value-of select="xaf:streetAddress[1]/xaf:city"/> </td> </tr>
      <tr> <th>strAddr_postalCode</th>       <td><xsl:value-of select="xaf:streetAddress[1]/xaf:postalCode"/> </td> </tr>
      <tr> <th>strAddr_country</th>          <td><xsl:value-of select="xaf:streetAddress[1]/xaf:country"/> </td> </tr>
      </xsl:for-each>
      </tbody>
    </table>


    <!-- Rekeningschema -->
    <p></p><a id="XledgerAccountX"></a>
    <table class="sortable" id="ledgerAccount">
      <caption>Rekeningschema</caption>
      <thead>
      <tr>
        <th>accountID</th>
        <th>accountDesc</th>
        <th>accountType</th>
        <th>leadCode</th>
        <th>leadDescription</th>
        <th>leadReference</th>
        <th>leadCrossRef</th>
      </tr>
      </thead>
      <tbody>
      <xsl:for-each select="xaf:auditfile/xaf:company/xaf:generalLedger/xaf:ledgerAccount">
        <tr>
          <td><xsl:value-of select="xaf:accID"/></td>
          <td><xsl:value-of select="xaf:accDesc"/></td>
          <td><xsl:value-of select="xaf:accTp"/></td>
          <td><xsl:value-of select="xaf:leadCode"/></td>
          <td><xsl:value-of select="xaf:leadDescription"/></td>
          <td><xsl:value-of select="xaf:leadReference"/></td>
          <td><xsl:value-of select="xaf:leadCrossRef"/></td>
        </tr>
      </xsl:for-each>
      </tbody>
    </table>


    <!-- Taxonomie (RGS?) -->
    <p></p><a id="XtaxonomyX"></a>
    <table class="sortable" id="taxonomy">
      <caption>Taxonomie</caption>
      <thead><tr>
        <th>accountID</th>
        <th>accountDesc</th>
        <th>accountType</th>

        <th>taxoRef</th>
        <th>taxoEl_txCd</th>
        <th>taxoEl_txClsCd</th>
        <th>taxoEl_txClsCtxtID</th>
        <th>taxoEl_glAccID</th>
      </tr></thead>
      <tbody>
      <xsl:for-each select="xaf:auditfile/xaf:company/xaf:generalLedger/xaf:ledgerAccount/xaf:taxonomy">
        <tr>
          <td><xsl:value-of select="../xaf:accID"/></td>
          <td><xsl:value-of select="../xaf:accDesc"/></td>
          <td><xsl:value-of select="../xaf:accTp"/></td>

          <td><xsl:value-of select="xaf:taxoRef"/></td>
          <td><xsl:value-of select="xaf:taxoElement[1]/xaf:txCd"/></td>
          <td><xsl:value-of select="xaf:taxoElement[1]/xaf:txClsCd"/></td>
          <td><xsl:value-of select="xaf:taxoElement[1]/xaf:txClsCtxtID"/></td>
          <td><xsl:value-of select="xaf:taxoElement[1]/xaf:glAccID"/></td>
        </tr>
      </xsl:for-each>
      </tbody>
    </table>


    <!-- Basic -->
    <p></p><a id="XbasicX"></a>
    <table class="sortable" id='basic'>
      <caption>Basics</caption>
      <thead><tr>
        <th>basicType</th>
        <th>basicID</th>
        <th>basicDesc</th>
      </tr></thead>
      <tbody>
      <xsl:for-each select="xaf:auditfile/xaf:company/xaf:generalLedger/xaf:basics/xaf:basic">
        <tr>
          <td><xsl:value-of select="xaf:basicType"/></td>
          <td><xsl:value-of select="xaf:basicID"/></td>
          <td><xsl:value-of select="xaf:basicDesc"/></td>
        </tr>
      </xsl:for-each>
      </tbody>
    </table>


    <!-- VAT codes -->
    <p></p><a id="XvatCodeX"></a>
    <table class="sortable" id='vatCode'>
      <caption>VAT codes</caption>
      <thead><tr>
        <th>vatID</th>
        <th>vatDesc</th>
        <th>vatToPayAccountID</th>
        <th>vatToClaimAccountID</th>
      </tr></thead>
      <tbody>
      <xsl:for-each select="xaf:auditfile/xaf:company/xaf:vatCodes/xaf:vatCode">
        <tr>
          <td><xsl:value-of select="xaf:vatID"/></td>
          <td><xsl:value-of select="xaf:vatDesc"/></td>
          <td><xsl:value-of select="xaf:vatToPayAccID"/></td>
          <td><xsl:value-of select="xaf:vatToClaimAccID"/></td>
        </tr>
      </xsl:for-each>
      </tbody>
    </table>


    <!-- Periodes -->
    <p></p><a id="XperiodX"></a>
    <table class="sortable" id="period">
      <caption>Periodes</caption>
      <thead>
      <tr>
        <th>periodNumber</th>
        <th>periodDesc</th>
        <th>startDatePeriod</th>
        <th>startTimePeriod</th>
        <th>endDatePeriod</th>
        <th>endTimePeriod</th>
      </tr></thead>
      <tbody>
      <xsl:for-each select="xaf:auditfile/xaf:company/xaf:periods/xaf:period">
      <tr>
        <td><xsl:value-of select="xaf:periodNumber"/>    </td>
        <td><xsl:value-of select="xaf:periodDesc"/>      </td>
        <td><xsl:value-of select="xaf:startDatePeriod"/> </td>
        <td><xsl:value-of select="xaf:startTimePeriod"/> </td>
        <td><xsl:value-of select="xaf:endDatePeriod"/>   </td>
        <td><xsl:value-of select="xaf:endTimePeriod"/>   </td>
      </tr>
      </xsl:for-each>
      </tbody>
    </table>


    <!-- Openingsbalans -->
    <p></p><a id="XopeningBalanceX"></a>
    <table id="openingBalance">
      <caption>Openingsbalans</caption>
      <thead>
      <tr>
        <th>Balans Datum</th>
        <th>Omschrijving</th>
        <th>Aantal balansregels</th>
        <th>Telling Debet</th>
        <th>Telling Credit</th>
      </tr>
      </thead>
      <tbody>
      <xsl:for-each select="xaf:auditfile/xaf:company/xaf:openingBalance">
      <tr>
        <td><xsl:value-of select="xaf:opBalDate"/></td>
        <td><xsl:value-of select="xaf:opBalDesc"/></td>
        <td class='num'><xsl:value-of select="xaf:linesCount"/></td>
        <td class='num'><xsl:value-of select="xaf:totalDebit"/></td>
        <td class='num'><xsl:value-of select="xaf:totalCredit"/></td>
      </tr>
      </xsl:for-each>
      </tbody>
    </table>


    <!-- Openingsbalans regels -->
    <p></p><a id="XobLineX"></a>
    <table class="sortable" id="obLine">
      <caption>Openingsbalans regels</caption>
      <thead>
      <tr>
        <th>Volgnr</th>
        <th>Rekening</th>
        <th>Datum</th>
        <th>Omschrijving</th>
        <th>Bedrag</th>
        <th>D/C</th>
      </tr>
      </thead>
      <tbody>
      <xsl:for-each select="xaf:auditfile/xaf:company/xaf:openingBalance/xaf:obLine">
      <tr>
        <td><xsl:value-of select="xaf:nr"/></td>
        <td><xsl:value-of select="xaf:accID"/></td>
        <td><xsl:value-of select="../xaf:opBalDate"/></td>
        <td><xsl:value-of select="../xaf:opBalDesc"/></td>
        <td class='num'><xsl:value-of select="xaf:amnt"/></td>
        <td><xsl:value-of select="xaf:amntTp"/></td>
      </tr>
      </xsl:for-each>
      </tbody>
    </table>


    <!-- Debiteuren / Crediteuren -->
    <p></p><a id="XcustomerSupplierX"></a>
    <table class="sortable" id="customerSupplier">
      <caption>Debiteuren / Crediteuren</caption>
      <thead>
      <tr>
        <th>Id</th>
        <th>Naam</th>
        <th>Contact</th>
        <th>Telefoon</th>
        <th>Fax</th>
        <th>eMail</th>
        <th>Website</th>
        <th>KvK nr</th>
        <th>Land</th>
        <th>SofiNr</th>
        <th>Relatie</th>
        <th>Soort</th>
        <th>Groep</th>
        <th>Kredietlimiet</th>
        <th>Bestel limiet</th>
        <th>strAddr_streetname</th>
        <th>strAddr_number</th>
        <th>strAddr_numberExtensiton</th>
        <th>strAddr_city</th>
        <th>strAddr_postalCode</th>
        <th>strAddr_country</th>
        <th>bank_bankAccNr</th>
        <th>bank_bankIdCd</th>
      </tr>
      </thead>
      <tbody>
      <xsl:for-each select="xaf:auditfile/xaf:company/xaf:customersSuppliers/xaf:customerSupplier">
      <tr>
        <td><xsl:value-of select="xaf:custSupID"/></td>
        <td><xsl:value-of select="xaf:custSupName"/></td>
        <td><xsl:value-of select="xaf:contact"/></td>
        <td><xsl:value-of select="xaf:telephone"/></td>
        <td><xsl:value-of select="xaf:fax"/></td>
        <td><xsl:value-of select="xaf:eMail"/></td>
        <td><xsl:value-of select="xaf:website"/></td>
        <td><xsl:value-of select="xaf:commerceNr"/></td>
        <td><xsl:value-of select="xaf:taxRegistrationCountry"/></td>
        <td><xsl:value-of select="xaf:taxRegIdent"/></td>
        <td><xsl:value-of select="xaf:relationshipID"/></td>
        <td><xsl:value-of select="xaf:custSupTp"/></td>
        <td><xsl:value-of select="xaf:custSupGrpID"/></td>
        <td><xsl:value-of select="xaf:custCreditLimit"/></td>
        <td><xsl:value-of select="xaf:supplierLimit"/></td>
        <td><xsl:value-of select="xaf:streetAddress[1]/xaf:streetname"/> </td>
        <td><xsl:value-of select="xaf:streetAddress[1]/xaf:number"/> </td>
        <td><xsl:value-of select="xaf:streetAddress[1]/xaf:numberExtension"/> </td>
        <td><xsl:value-of select="xaf:streetAddress[1]/xaf:city"/> </td>
        <td><xsl:value-of select="xaf:streetAddress[1]/xaf:postalCode"/> </td>
        <td><xsl:value-of select="xaf:streetAddress[1]/xaf:country"/> </td>
        <td><xsl:value-of select="xaf:bankAccount[1]/xaf:bankAccNr"/> </td>
        <td><xsl:value-of select="xaf:bankAccount[1]/xaf:bankIdCd"/> </td>
      </tr>
      </xsl:for-each>
      </tbody>
    </table>


    <!-- Transactions -->
    <p></p><a id="XtransactionsX"></a>
    <table id="transactions">
      <caption>Transactions</caption>
      <thead>
      <tr>
        <th>Aantal mutatieregels</th>
        <th>Telling Debet</th>
        <th>Telling Credit</th>
      </tr>
      </thead>
      <tbody>
      <xsl:for-each select="xaf:auditfile/xaf:company/xaf:transactions">
      <tr>
        <td class='num'><xsl:value-of select="xaf:linesCount"/></td>
        <td class='num'><xsl:value-of select="xaf:totalDebit"/></td>
        <td class='num'><xsl:value-of select="xaf:totalCredit"/></td>
      </tr>
      </xsl:for-each>
      </tbody>
    </table>


    <!-- Dagboeken -->
    <p></p><a id="XjournalX"></a>
    <table class="sortable" id="journal">
      <caption>Dagboeken</caption>
      <thead>
      <tr>
        <th>Dagboek</th>
        <th>Dagboek Naam</th>
        <th>Soort</th>
        <th>Tegenrekening</th>
        <th>Bank</th>
      </tr>
      </thead>
      <tbody>
      <xsl:for-each select="xaf:auditfile/xaf:company/xaf:transactions/xaf:journal">
      <tr>
        <td><xsl:value-of select="xaf:jrnID"/></td>
        <td><xsl:value-of select="xaf:desc"/></td>
        <td><xsl:value-of select="xaf:jrnTp"/></td>
        <td><xsl:value-of select="xaf:offsetAccID"/></td>
        <td><xsl:value-of select="xaf:bankAccNr"/></td>
      </tr>
      </xsl:for-each>
      </tbody>
    </table>


    <!-- Boekingen (boekstukken) -->
    <p></p><a id="XtransactionX"></a>
    <table class="sortable" id="transaction">
      <caption>Boekingen (boekstukken)</caption>
      <thead>
      <tr>
        <th>Dagboek</th>
        <th>Dagboek Naam</th>

        <th>TransactionID</th>
        <th>Omschrijving</th>
        <th>Periode</th>
        <th>trDt</th>
        <th>Bedrag</th>
        <th>D/C</th>
        <th>Bron</th>
        <th>User</th>
      </tr>
      </thead>
      <tbody>
      <xsl:for-each select="xaf:auditfile/xaf:company/xaf:transactions/xaf:journal/xaf:transaction">
      <tr>
        <td><xsl:value-of select="../xaf:jrnID"/></td>
        <td><xsl:value-of select="../xaf:desc"/></td>

        <td><xsl:value-of select="xaf:nr"/></td>
        <td><xsl:value-of select="xaf:desc"/></td>
        <td><xsl:value-of select="xaf:periodNumber"/></td>
        <td><xsl:value-of select="xaf:trDt"/></td>
        <td class='num'><xsl:value-of select="xaf:amnt"/></td>
        <td><xsl:value-of select="xaf:amntTp"/></td>
        <td><xsl:value-of select="xaf:sourceID"/></td>
        <td><xsl:value-of select="xaf:userID"/></td>
      </tr>
      </xsl:for-each>
      </tbody>
    </table>


    <!-- Mutatieregels -->
    <p></p><a id="XtrLineX"></a>
    <table class="sortable" id="trLine">
      <caption>Mutatieregels</caption>
      <thead><tr>
      	<!-- journal -->
        <th>jrn_jrnID</th>
        <th>jrn_Desc</th>
				<!-- transaction -->
        <th>trn_nr</th>
        <th>trn_desc</th>
        <th>trn_periodNumber</th>
        <th>trn_trDt</th>
        <th>trn_sourceID</th>

				<!-- trLine -->
        <th>Volgnr</th>
        <th>Rekening</th>
        <th>docRef</th>
        <th>effDate</th>
        <th>desc</th>
        <th>Bedrag</th>
        <th>D/C</th>

        <th>recRef</th>
        <th>matchKeyID</th>
        <th>custSupID</th>
        <th>invRef</th>
        <th>orderRef</th>

        <th>costID</th>
        <th>prodID</th>
        <th>projID</th>
        <th>artGrpID</th>
        <th>qntityID</th>
        <th>qntity</th>

				<!-- vat -->
        <th>vatID</th>
        <th>vatPerc</th>
        <th>vatAmnt</th>
        <th>vatAmntTp</th>

				<!-- currency -->
        <th>curCode</th>
        <th>curAmnt</th>

      </tr></thead>
      <tbody>
      <xsl:for-each select="xaf:auditfile/xaf:company/xaf:transactions/xaf:journal/xaf:transaction/xaf:trLine">
      <tr>
      	<!-- journal -->
        <td><xsl:value-of select="../../xaf:jrnID"/></td>
        <td><xsl:value-of select="../../xaf:desc"/></td>

				<!-- transaction -->
        <td><xsl:value-of select="../xaf:nr"/></td>
        <td><xsl:value-of select="../xaf:desc"/></td>
        <td><xsl:value-of select="../xaf:periodNumber"/></td>
        <td><xsl:value-of select="../xaf:trDt"/></td>
        <td><xsl:value-of select="../xaf:sourceID"/></td>

				<!-- trLine -->
        <td><xsl:value-of select="xaf:nr"/></td>
        <td><xsl:value-of select="xaf:accID"/></td>
        <td><xsl:value-of select="xaf:docRef"/></td>
        <td><xsl:value-of select="xaf:effDate"/></td>
        <td><xsl:value-of select="xaf:desc"/></td>
        <td class='num'><xsl:value-of select="xaf:amnt"/></td>
        <td><xsl:value-of select="xaf:amntTp"/></td>

        <td><xsl:value-of select="xaf:recRef"/></td>
        <td><xsl:value-of select="xaf:matchKeyID"/></td>
        <td><xsl:value-of select="xaf:custSupID"/></td>
        <td><xsl:value-of select="xaf:invRef"/></td>
        <td><xsl:value-of select="xaf:orderRef"/></td>

        <td><xsl:value-of select="xaf:costID"/></td>
        <td><xsl:value-of select="xaf:prodID"/></td>
        <td><xsl:value-of select="xaf:projID"/></td>
        <td><xsl:value-of select="xaf:artGrpID"/></td>
        <td><xsl:value-of select="xaf:qntityID"/></td>
        <td><xsl:value-of select="xaf:qntity"/></td>

				<!-- vat -->
        <td><xsl:value-of select="xaf:vat[1]/xaf:vatID"/></td>
        <td><xsl:value-of select="xaf:vat[1]/xaf:vatPerc"/></td>
        <td class='num'><xsl:value-of select="xaf:vat[1]/xaf:vatAmnt"/></td>
        <td><xsl:value-of select="xaf:vat[1]/xaf:vatAmntTp"/></td>

				<!-- currency -->
        <td><xsl:value-of select="xaf:currency[1]/xaf:curCode"/></td>
        <td class='num'><xsl:value-of select="xaf:currency[1]/xaf:curAmnt"/></td>

      </tr>
      </xsl:for-each>
      </tbody>
    </table>

  </body>
  </html>
</xsl:template>
</xsl:stylesheet>