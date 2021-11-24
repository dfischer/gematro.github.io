// ============================== Init ==============================

var cipherList = [] // list of all available ciphers
var cipherListSaved = [] // copy of all initially available ciphers
var defaultCipherArray = [] // default ciphers
var defaultCipherArraySaved = [] // copy of default ciphers
var cCat = []; // list of all available cipher categories

// Layout
var cipherMenuColumns = 4 // number of columns for all available ciphers table
var enabledCiphColumns = 4 // number of columns for enabled ciphers table (for phrase)

var colorControlsMenuOpened = false // color controls menu state
var editCiphersMenuOpened = false // edit ciphers menu state
var dateCalcMenuOpened = false // date calculator menu state

var enabledCiphCount = 0 // number of enabled ciphers
var optEnableExtraCiphers = false // enable extra ciphers

// Cipher colors
var origColors = [] // preserve original cipher colors
var chkboxColors = [] // individual cipher color modifiers
var globColors = [] // global color modifiers

var sHistory = [] // user search history (history table)
var optPhraseLimit = 5 // word limit to enter input as separate phrases, "End" key

var optTinyHistoryTable = false // tiny mode - hide cipher names, no break each 25 phrases
var optCompactHistoryTable = false // compact mode - vertical cipher names
var optLoadUserHistCiphers = true // load ciphers when CSV file is imported

var optShowOnlyMatching = false // set opacity of nonmatching values to zero

var optNumCalcMethod = "Full" // "Reduced", "Full", "Off" or anything - default option to calculate 19 as 1+9
var optLetterWordCount = true // show word/letter count
var optSimpleResult = true // Simple Result - phrase = 67 (English Ordinal)
var optWordBreakdown = true // word breakdown
var optShowCipherChart = true // cipher breakdown chart

var optFiltSameCipherMatch = false // filter shows only phrases that match in the same cipher
var optFiltCrossCipherMatch = true // filter shows only ciphers that have matching values
var alphaHlt = 0.15 // opacity for values that do not match - change value here and in conf_SOM()

var optAllowPhraseComments = true // allow phrase comments, text inside [...] is not evaluated
var liveDatabaseMode = true // live database mode

var optGradientCharts = true // gradient fill for breakdown/cipher charts
var optGradientChartsDefault = optGradientCharts

var interfaceHue = 222 // calculator interface color
var interfaceHueDefault = 222 // value for reset, updated on first run of updateInterfaceHue()
var interfaceSat = 1.0 // interface saturation multiplier
var interfaceSatDefault = 1.0
var interfaceLit = 1.0  // interface lightness multiplier
var interfaceLitDefault = 1.0

var fontHue = 0 // font and outline hue
var fontHueDefault = 0 // value for reset, updated on first run of updateFontHue()
var fontSat = 0 // font saturation
var fontSatDefault = 0
var fontLit = 1.0  // font lightness multiplier
var fontLitDefault = 1.0

function initCalc() { // run after page has finished loading
	saveInitialCiphers()
	initCiphers() // update default ciphers
	createCiphersMenu()
	createOptionsMenu()
	createFeaturesMenu()
	createExportMenu()
	createAboutMenu()
	enableDefaultCiphers()
}

function closeAllOpenedMenus() {
	if (colorControlsMenuOpened) toggleColorControlsMenu() // Colors Menu
	if (dateCalcMenuOpened) toggleDateCalcMenu() // Date Calculator
	if (editCiphersMenuOpened) toggleEditCiphersMenu() // Edit Ciphers
}

// ========================= Ciphers Menu ===========================

function createCiphersMenu() { // create menu with all cipher catergories
	var o = document.getElementById("calcOptionsPanel").innerHTML

	o += '<div class="dropdown">'
	o += '<button class="dropbtn">Ciphers</button>'
	o += '<div class="dropdown-content" style="width: 380px;">'

	o += '<div><center>'
	o += '<input class="intBtn3" type="button" value="Empty" onclick="disableAllCiphers()">'
	o += '<input class="intBtn3" type="button" value="Default" onclick="enableDefaultCiphers()">'
	o += '<input class="intBtn3" type="button" value="All (EN)" onclick="enableAllEnglishCiphers()">'
	o += '<input class="intBtn3" type="button" value="All" onclick="enableAllCiphers()">'
	o += '</center></div>'

	o += '<hr style="background-color: var(--separator-accent2); height: 1px; border: none; margin: 0.4em;">'

	o += '<div style="width: 30%; float: left;">'
	for (i = 0; i < cCat.length; i++) {
		o += '<input class="intBtn2 ciphCatButton" type="button" value="'+cCat[i]+'">'
	}

	o += '</div>'

	o += '<div style="width: 70%; float: left;">'
	o += '<div id="menuCiphCatDetailsArea" style="margin: 0em 0.25em 0em 1.25em;">'
	o += '</div></div>'

	o += '</div></div>'

	document.getElementById("calcOptionsPanel").innerHTML = o
	displayCipherCatDetailed(cCat[0]) // open first available category
}

$(document).ready(function(){
	$("body").on("mouseover", ".ciphCatButton", function () { // mouse over cipher category button
		displayCipherCatDetailed( $(this).val() );
	});

	$("body").on("click", ".ciphCatButton", function (e) {
		if (navigator.maxTouchPoints < 1) { // Left Click (desktop)
			toggleCipherCategory( $(this).val() ) // toggle category
		}
	});
});

function displayCipherCatDetailed(curCat) {
	var chk = ""; var o = ""
	if (navigator.maxTouchPoints > 1) {
		o += '<input class="intBtn3" type="button" value="Toggle Category" style="width: 100%; margin-top: 0.1em" onclick="toggleCipherCategory(&quot;'+curCat+'&quot;)">'
		o += '<div style="padding: 0.25em;"></div>'
	}
	o += '<table class="cipherCatDetails"><tbody>'
	for (i = 0; i < cipherList.length; i++) {
		if (cipherList[i].cipherCategory == curCat) {
			if (cipherList[i].enabled) {chk = " checked";} else {chk = ""} // checkbox state
			o += '<tr><td><input type="checkbox" id="cipher_chkbox'+i+'" class="ciphCheckbox" value="" onclick="toggleCipher('+i+')"'+chk+'></td>'
			o += '<td><span class="ciphCheckboxLabel2">'+cipherList[i].cipherName+'</span></td></tr>'
		}
	}
	o += '</tbody></table>'
	document.getElementById("menuCiphCatDetailsArea").innerHTML = o
}

// =========================== About Menu ===========================

function createAboutMenu() { // create menu with all cipher catergories
	var o = document.getElementById("calcOptionsPanel").innerHTML

	o += '<div class="dropdown">'
	o += '<button class="dropbtn">About</button>'
	o += '<div class="dropdown-content">'

	o += '<center>'
	o += '<div style="display: flex; justify-content: center; padding-bottom: 0.4em;"><img src="res/logo.svg" style="height: 10px"></div>'
	o += '</center>'
	o += '<div style="margin: 0.5em;"></div>'
	o += '<input class="intBtn" type="button" value="GitHub Repository" onclick="gotoGitHubRepo()">'
	o += '<div style="margin: 0.5em;"></div>'
	o += '<input class="intBtn" type="button" value="Quickstart Guide" onclick="displayQuickstartGuide()">'
	o += '<div style="margin: 0.5em;"></div>'
	o += '<input class="intBtn" type="button" value="Contacts" onclick="displayContactInfo()">'

	o += '</div></div>'

	document.getElementById("calcOptionsPanel").innerHTML = o
}

function gotoGitHubRepo() {
	window.open("https://github.com/gematro/gematro.github.io", "_blank")
}

// ========================= Options Menu ===========================

function createOptionsMenu() {

	var o = document.getElementById("calcOptionsPanel").innerHTML

	o += '<div class="dropdown">'
	o += '<button class="dropbtn">Options</button>'
	o += '<div class="dropdown-content-opt">'

	o += create_NumCalc() // Number Calculation

	// get checkbox states
	var CCMstate, SCMstate, SOMstate, CHstate, THstate, EECstate, APCstate, LDMstate, LWCstate, SRstate, WBstate, CCstate, GCstate, SWCstate, MCRstate = ""

	if (optFiltCrossCipherMatch) CCMstate = "checked" // Cross Cipher Match
	if (optFiltSameCipherMatch) SCMstate = "checked" // Same Cipher Match
	if (optShowOnlyMatching) SOMstate = "checked" // Show Only Matching

	if (optCompactHistoryTable) CHstate = "checked" // Compact History
	if (optTinyHistoryTable) THstate = "checked" // Tiny History

	if (optEnableExtraCiphers) EECstate = "checked" // Enable Extra Ciphers
	if (optAllowPhraseComments) APCstate = "checked" // Allow Phrase Comments
	if (liveDatabaseMode) LDMstate = "checked" // Live Database Mode

	if (optLetterWordCount) LWCstate = "checked" // Letter/Word Count
	if (optSimpleResult) SRstate = "checked" // Simple Result
	if (optWordBreakdown) WBstate = "checked" // Word Breakdown
	if (optShowCipherChart) CCstate = "checked" // Cipher Chart

	if (optGradientCharts) GCstate = "checked" // Gradient Charts

	if (optLoadUserHistCiphers) SWCstate = "checked" // Switch Ciphers (CSV)
	if (!optMatrixCodeRain) MCRstate = "checked" // Matrix Code Rain

	o += '<div class="optionElement"><input type="checkbox" id="chkbox_CCM" value="" onclick="conf_CCM()" '+CCMstate+'><span class="optionElementLabel">Cross Cipher Match</span></div>'
	o += '<div class="optionElement"><input type="checkbox" id="chkbox_SCM" value="" onclick="conf_SCM()" '+SCMstate+'><span class="optionElementLabel">Same Cipher Match</span></div>'
	o += '<div class="optionElement"><input type="checkbox" id="chkbox_SOM" value="" onclick="conf_SOM()" '+SOMstate+'><span class="optionElementLabel">Show Only Matching</span></div>'
	o += '<div style="margin: 1em"></div>'
	o += '<div class="optionElement"><input type="checkbox" id="chkbox_CH" value="" onclick="conf_CH()" '+CHstate+'><span class="optionElementLabel">Compact History</span></div>'
	o += '<div class="optionElement"><input type="checkbox" id="chkbox_TH" value="" onclick="conf_TH()" '+THstate+'><span class="optionElementLabel">Tiny History</span></div>'
	o += '<div style="margin: 1em"></div>'
	o += '<div class="optionElement" id="enableExtraCiphOption"><input type="checkbox" id="chkbox_EEC" value="" onclick="conf_EEC()" '+EECstate+'><span class="optionElementLabel">Enable Extra Ciphers</span></div>'
	o += '<div class="optionElement"><input type="checkbox" id="chkbox_APC" value="" onclick="conf_APC()" '+APCstate+'><span class="optionElementLabel">Ignore Comments [...]</span></div>'
	o += '<div id="liveDBOption" class="optionElement"><input type="checkbox" id="chkbox_LDM" value="" onclick="conf_LDM()" '+LDMstate+'><span class="optionElementLabel">Live Database Mode</span></div>'
	o += '<div style="margin: 1em"></div>'
	o += '<div class="optionElement"><input type="checkbox" id="chkbox_LWC" value="" onclick="conf_LWC()" '+LWCstate+'><span class="optionElementLabel">Letter/Word Count</span></div>'
	o += '<div class="optionElement"><input type="checkbox" id="chkbox_SR" value="" onclick="conf_SR()" '+SRstate+'><span class="optionElementLabel">Simple Result</span></div>'
	o += '<div class="optionElement"><input type="checkbox" id="chkbox_WB" value="" onclick="conf_WB()" '+WBstate+'><span class="optionElementLabel">Word Breakdown</span></div>'
	o += '<div class="optionElement"><input type="checkbox" id="chkbox_CC" value="" onclick="conf_CC()" '+CCstate+'><span class="optionElementLabel">Cipher Chart</span></div>'
	o += '<div style="margin: 1em"></div>'
	o += '<div class="optionElement"><input type="checkbox" id="chkbox_GC" value="" onclick="conf_GC()" '+GCstate+'><span class="optionElementLabel">Gradient Charts</span></div>'
	o += '<div style="margin: 1em"></div>'
	o += '<div class="optionElement"><input type="checkbox" id="chkbox_SWC" value="" onclick="conf_SWC()" '+SWCstate+'><span class="optionElementLabel">Switch Ciphers (CSV)</span></div>'
	o += '<div class="optionElement"><input type="checkbox" id="chkbox_MCR" value="" onclick="conf_MCR()" '+MCRstate+'><span class="optionElementLabel">Matrix Code Rain</span></div>'
	o += '<div style="margin: 1em"></div>'

	o += '</div></div>'

	document.getElementById("calcOptionsPanel").innerHTML = o
}

function conf_EEC() { // Enable Extra Ciphers
	var i, n
	var cipherExists = false
	optEnableExtraCiphers = !optEnableExtraCiphers
	resetColorControls() // reset color changes (otherwise they become permanent)
	if (optEnableExtraCiphers) { // load extra ciphers
		for (i = 0; i < cipherListExtra.length; i++) {
			for (n = 0; n < cipherList.length; n++) { // check if cipher exists
				if (cipherListExtra[i].cipherName == cipherList[n].cipherName) {cipherExists = true; return;}
			}
			if (!cipherExists) cipherList.push( Object.assign(new cipher(), cipherListExtra[i]) )// copy of a cipher object
		}
	} else { // unload extra ciphers
		for (i = 0; i < cipherListExtra.length; i++) {
			for (n = 0; n < cipherList.length; n++) {
				if (cipherListExtra[i].cipherName == cipherList[n].cipherName) cipherList.splice(n,1) // remove cipher
			}
		}
	}
	initCalcCustCiph(false) // don't update values inside cipher editor
}

function conf_CCM() { // Cross Cipher Match
	optFiltCrossCipherMatch = !optFiltCrossCipherMatch
	if (optFiltCrossCipherMatch) {
		optFiltSameCipherMatch = false
		chkSCM = document.getElementById("chkbox_SCM")
		if (chkSCM !== null) chkSCM.checked = false
	} else if (!optFiltCrossCipherMatch && !optFiltSameCipherMatch) {
		optFiltCrossCipherMatch = true // can't disable both, revert to cross match as default
		chkCCM = document.getElementById("chkbox_CCM")
		if (chkCCM !== null) chkCCM.checked = true
	}
}

function conf_SCM() { // Same Cipher Match
	optFiltSameCipherMatch = !optFiltSameCipherMatch
	if (optFiltSameCipherMatch) {
		optFiltCrossCipherMatch = false
		chkCCM = document.getElementById("chkbox_CCM")
		if (chkCCM !== null) chkCCM.checked = false
	} else if (!optFiltCrossCipherMatch && !optFiltSameCipherMatch) {
		optFiltCrossCipherMatch = true // can't disable both, revert to cross match as default
		chkCCM = document.getElementById("chkbox_CCM")
		if (chkCCM !== null) chkCCM.checked = true
	}
}

function conf_SOM() { // Show Only Matching
	optShowOnlyMatching = !optShowOnlyMatching
	if (optShowOnlyMatching) { alphaHlt = 0; } else { alphaHlt = 0.15; } 
	if (optFiltCrossCipherMatch) {
		updateTables()
	} else if (optFiltSameCipherMatch) {
		updateHistoryTableSameCiphMatch()
	}
}

function conf_CH() { // Compact History
	optCompactHistoryTable = !optCompactHistoryTable
	if (optTinyHistoryTable) { // only one option is allowed
		optTinyHistoryTable = false
		if (chkbox_TH !== null) chkbox_TH.checked = false
	}
	updateTables()
}

function conf_TH() { // Tiny History
	optTinyHistoryTable = !optTinyHistoryTable
	if (optCompactHistoryTable) { // only one option is allowed
		optCompactHistoryTable = false
		if (chkbox_CH !== null) chkbox_CH.checked = false
	}
	updateTables()
}

function conf_APC() { // Allow Phrase Comments
	optAllowPhraseComments = !optAllowPhraseComments
	updateTables()
}

function conf_LWC() { // Letter/Word Count
	optLetterWordCount = !optLetterWordCount
	updateWordBreakdown()
}

function conf_SR() { // Simple Result
	optSimpleResult = !optSimpleResult
	updateWordBreakdown()
	element = document.getElementById("SimpleBreak")
	if (element !== null && optSimpleResult) element.classList.remove("hideValue")
	if (element !== null && !optSimpleResult) element.classList.add("hideValue")
}

function conf_WB() { // Word Breakdown
	optWordBreakdown = !optWordBreakdown
	updateWordBreakdown()
}

function conf_CC() { // Cipher Chart
	optShowCipherChart = !optShowCipherChart
	updateWordBreakdown()
	element = document.getElementById("ChartSpot")
	element.classList.toggle("hideValue")
}

function conf_GC() { // Gradient Charts
	optGradientCharts = !optGradientCharts
	updateWordBreakdown()
}

function conf_SWC() { // Switch Ciphers (CSV)
	optLoadUserHistCiphers = !optLoadUserHistCiphers
}

function conf_LDM() { // Live Database Mode
	liveDatabaseMode = !liveDatabaseMode
}

function conf_MCR() { // Matrix Code Rain
	toggleCodeRain()
}

function create_NumCalc() { // Number Calculation
	var o = ""
	var fullNumCalcState, redNumCalcState, offNumCalcState
	if (optNumCalcMethod == "Full") { fullNumCalcState = 'checked' }
	else if (optNumCalcMethod == "Reduced") { redNumCalcState = 'checked' }
	else if (optNumCalcMethod == "Off") { offNumCalcState = 'checked' }
	o += '<table class="optionElementTable"><tbody>'
	o += '<tr><td colspan=3><span>Number Calculation</span></td></tr>'
	o += '<tr><td><input type="checkbox" id="chkbox_fullNumCalc" onclick="conf_NumCalc(&quot;Full&quot;)" '+fullNumCalcState+'><span class="optionTableLabel">Full</span></td>'
	o += '<td><input type="checkbox" id="chkbox_redNumCalc" onclick="conf_NumCalc(&quot;Reduced&quot;)" '+redNumCalcState+'><span class="optionTableLabel">Reduced</span></td>'
	o += '<td><input type="checkbox" id="chkbox_offNumCalc" onclick="conf_NumCalc(&quot;Off&quot;)" '+offNumCalcState+'><span class="optionTableLabel">Off</span></td></tr>'
	o += '</tbody></table>'
	return o
}
function conf_NumCalc(mode) { // Number Calculation
	optNumCalcMethod = mode
	if (mode == "Full") {
		document.getElementById("chkbox_fullNumCalc").checked = true
		document.getElementById("chkbox_redNumCalc").checked = false
		document.getElementById("chkbox_offNumCalc").checked = false
	} else if (mode == "Reduced") {
		document.getElementById("chkbox_redNumCalc").checked = true
		document.getElementById("chkbox_fullNumCalc").checked = false
		document.getElementById("chkbox_offNumCalc").checked = false
	} else if (mode == "Off") {
		document.getElementById("chkbox_offNumCalc").checked = true
		document.getElementById("chkbox_fullNumCalc").checked = false
		document.getElementById("chkbox_redNumCalc").checked = false
	}
	updateWordBreakdown()
	updateTables()
}

// ========================= Color Functions ========================

function createFeaturesMenu() {
	var o = document.getElementById("calcOptionsPanel").innerHTML

	o += '<div class="dropdown">'
	o += '<button class="dropbtn">Features</button>'
	o += '<div class="dropdown-content">'

	o += '<input class="intBtn" type="button" value="Date Calculator" onclick="toggleDateCalcMenu()">'
	o += '<div style="margin: 0.5em;"></div>'
	o += '<input class="intBtn" type="button" value="Color Controls" onclick="toggleColorControlsMenu()">'
	o += '<div style="margin: 0.5em;"></div>'
	o += '<input id="edCiphBtn" class="intBtn" type="button" value="Edit Ciphers" onclick="toggleEditCiphersMenu()">'

	o += '<hr style="background-color: var(--separator-accent2); height: 1px; border: none; margin: 0.75em;">'

	o += '<input class="intBtn" type="button" value="Find Matches" onclick="updateHistoryTableAutoHlt()">'
	o += '<div style="margin: 0.5em;"></div>'
	o += '<input class="intBtn" type="button" value="Enter As Words" onclick="phraseBoxKeypress(35)">' // "End" keystroke
	o += create_PL() // Phrase Limit (End)
	o += '<div style="margin: 0.5em;"></div>'
	o += '<input class="intBtn" type="button" value="Clear History" onclick="phraseBoxKeypress(36)">' // "Home" keystroke
	o += '<input id="clearDBqueryBtn" style="margin-top: 0.5em;" class="intBtn hideValue" type="button" value="Clear DB Query" onclick="clearDatabaseQueryTable()">' // clear database query
	o += '<input id="unloadDBBtn" style="margin-top: 0.5em;" class="intBtn hideValue" type="button" value="Unload Database" onclick="unloadDatabase()">' // unload database

	o += '</div></div>'
	document.getElementById("calcOptionsPanel").innerHTML = o
}
function create_PL() { // Phrase Limit (End)
	var o = ""
	o += '<div class="enterAsWordsLimit">'
	o += '<span class="optionTableLabel">Word limit:</span><input id="phrLimitBox" onchange="conf_PL()" type="text" value="'+optPhraseLimit+'">'
	o += '</div>'
	return o
}
function conf_PL() {
	var pLimit = document.getElementById("phrLimitBox")
	optPhraseLimit = pLimit.value
}

function toggleColorControlsMenu(redraw = false) { // display control menu to adjust each cipher
	if (!colorControlsMenuOpened || redraw) {

		if (!redraw) {
			closeAllOpenedMenus()
		} else {
			document.getElementById("colorControlsMenuArea").innerHTML = "" // clear previous layout
		}

		colorControlsMenuOpened = true
		
		var cur_ciph_index = 0 // index of current of enabled cipher that will be added to the table (total # of ciphers added so far + 1)
		var new_row_opened = false // condition to open new row inside table
		var ciph_in_row = 0 // count ciphers in current row

		var o = '<div class="colorControlsBG">'
		o += '<table class="ciphToggleContainer"><tbody>'
		
		for (i = 0; i < cipherList.length; i++) {
			cur_ciph_index++
			if (!new_row_opened) { // check if new row has to be opened
				o += '<tr>'
				new_row_opened = true
			}
			var chk = ""
			if (ciph_in_row < cipherMenuColumns) { // until number of ciphers in row equals number of columns
				if (cipherList[i].enabled) {
					o += '<td><span class="ciphCheckboxLabel">'+cipherList[i].cipherName+'</span></td>'
					o += '<td><input type="number" step="2" min="-360" max="360" value="'+chkboxColors[i].H+'" class="colSlider" id="sliderHue'+i+'" oninput="changeCipherColors(&quot;sliderHue'+i+'&quot;, &quot;Hue&quot;, '+i+')"></td>'
					o += '<td><input type="number" step="1" min="-100" max="100" value="'+chkboxColors[i].S+'" class="colSlider" id="sliderSaturation'+i+'" oninput="changeCipherColors(&quot;sliderSaturation'+i+'&quot;, &quot;Saturation&quot;, '+i+')"></td>'
					o += '<td><input type="number" step="1" min="-100" max="100" value="'+chkboxColors[i].L+'" class="colSlider" id="sliderLightness'+i+'" oninput="changeCipherColors(&quot;sliderLightness'+i+'&quot;, &quot;Lightness&quot;, '+i+')"></td>'
					o += '<td><input type="text" value="" class="cipherColValueBox" id="cipherHSL'+i+'"></td>'
					o += '<td style="min-width: 16px;"></td>'
					ciph_in_row++
				}
			}
			if (ciph_in_row == cipherMenuColumns) { // check if row needs to be closed
				o += '</tr>'
				ciph_in_row = 0 // reset cipher count
				new_row_opened = false
			}
		}
		o += '</tbody></table>'

		// global color controls
		o += '<center>'
		o += '<table class="globColCtrlTable">'
		o += '<tr><td class="colLabel">All Ciphers Color: </td>'
		o += '<td class="colLabelSmall">Hue</td>'
		o += '<td><input type="number" step="2" min="-360" max="360" value="'+globColors.H+'" class="colSlider2" id="globalSliderHue" oninput="changeCipherColors(&quot;globalSliderHue&quot;, &quot;Hue&quot;)"></td>'
		o += '<td class="colLabelSmall">Saturation</td>'
		o += '<td><input type="number" step="1" min="-100" max="100" value="'+globColors.S+'" class="colSlider2" id="globalSliderSaturation" oninput="changeCipherColors(&quot;globalSliderSaturation&quot;, &quot;Saturation&quot;)"></td>'
		o += '<td class="colLabelSmall">Lightness</td>'
		o += '<td><input type="number" step="1" min="-100" max="100" value="'+globColors.L+'" class="colSlider2" id="globalSliderLightness" oninput="changeCipherColors(&quot;globalSliderLightness&quot;, &quot;Lightness&quot;)"></td>'
		o += '<td rowspan=3></td>'
		o += '<td rowspan=3><input id="resetColorsButton" class="intBtn" type="button" value="Reset Colors" style="margin: 0em 0.5em;" onclick="resetColorControls()"></td>'
		o += '</tr>'

		// interface color controls
		o += '<tr><td class="colLabel" style="padding-right: 0.4em;">Interface Color:</td>'
		o += '<td class="colLabelSmall">Hue</td>'
		o += '<td><input type="number" step="1" min="0" max="359" value="'+interfaceHue+'" class="colSlider2" id="interfaceHueSlider" oninput="updateInterfaceHue()"></td>'
		o += '<td class="colLabelSmall">Saturation</td>'
		o += '<td><input type="number" step="0.1" min="0" max="10.0" value="'+interfaceSat+'" class="colSlider2" id="interfaceSatSlider" oninput="updateInterfaceSat()"></td>'
		o += '<td class="colLabelSmall">Lightness</td>'
		o += '<td><input type="number" step="0.01" min="0" max="10.0" value="'+interfaceLit+'" class="colSlider2" id="interfaceLitSlider" oninput="updateInterfaceLit()"></td>'
		o += '</tr>'
		// font and outline color controls
		o += '<tr><td class="colLabel" style="padding-right: 0.4em;">Font & Outline Color:</td>'
		o += '<td class="colLabelSmall">Hue</td>'
		o += '<td><input type="number" step="1" min="0" max="359" value="'+fontHue+'" class="colSlider2" id="fontHueSlider" oninput="updateFontHue()"></td>'
		o += '<td class="colLabelSmall">Saturation</td>'
		o += '<td><input type="number" step="0.01" min="0" max="1.0" value="'+fontSat+'" class="colSlider2" id="fontSatSlider" oninput="updateFontSat()"></td>'
		o += '<td class="colLabelSmall">Lightness</td>'
		o += '<td><input type="number" step="0.01" min="0" max="10.0" value="'+fontLit+'" class="colSlider2" id="fontLitSlider" oninput="updateFontLit()"></td>'
		o += '</tr>'
		// column controls
		o += '<tr><td class="colLabel" style="padding-right: 0.4em;">Cipher Columns:</td>'
		o += '<td class="colLabelSmall">Control</td>'
		o += '<td><input type="number" step="1" min="1" max="10" value="'+cipherMenuColumns+'" class="colSlider2" id="avail_ciphers_columns" oninput="updColorMenuLayout()"></td>'
		o += '<td class="colLabelSmall">Enabled</td>'
		o += '<td><input type="number" step="1" min="1" max="10" value="'+enabledCiphColumns+'" class="colSlider2" id="enabled_ciphers_columns" oninput="updateTables(false)"></td>'
		o += '</tr>'
		o += '</table>'
		o += '</center>'

		o += '</div>' // colorControlsBG
		
		document.getElementById("colorControlsMenuArea").innerHTML += o
		populateColorValues() // update values for controls
	} else {
		document.getElementById("colorControlsMenuArea").innerHTML = "" // clear
		colorControlsMenuOpened = false
	}
}

function updateInterfaceColor(firstrun = false) { // change interface color
	updateInterfaceHue(firstrun)
	updateInterfaceSat(firstrun)
	updateInterfaceLit(firstrun)
	updateFontHue(firstrun)
	updateFontSat(firstrun)
	updateFontLit(firstrun)
}

function updateInterfaceHue(firstrun = false) { // change interface hue
	// update hue from slider if element exists
	if (document.getElementById("interfaceHueSlider") !== null) interfaceHue = document.getElementById("interfaceHueSlider").value
	var root = document.documentElement
	root.style.setProperty("--global-hue", interfaceHue.toString()) // update :root CSS variable
	if (firstrun) interfaceHueDefault = interfaceHue // set default color for reset
}
function updateInterfaceSat(firstrun = false) { // change interface saturation
	// update saturation from slider if element exists
	if (document.getElementById("interfaceSatSlider") !== null) interfaceSat = document.getElementById("interfaceSatSlider").value
	var root = document.documentElement
	root.style.setProperty("--global-sat", interfaceSat.toString()) // update :root CSS variable
	if (firstrun) interfaceSatDefault = interfaceSat // set default color for reset
}
function updateInterfaceLit(firstrun = false) { // change interface lightness
	// update lightness from slider if element exists
	if (document.getElementById("interfaceLitSlider") !== null) interfaceLit = document.getElementById("interfaceLitSlider").value
	var root = document.documentElement
	root.style.setProperty("--global-lit", interfaceLit.toString()) // update :root CSS variable
	if (firstrun) interfaceLitDefault = interfaceLit // set default color for reset
}

function updateFontHue(firstrun = false) { // change font and outline hue
	// update hue from slider if element exists
	if (document.getElementById("fontHueSlider") !== null) fontHue = document.getElementById("fontHueSlider").value
	var root = document.documentElement
	root.style.setProperty("--font-hue", fontHue.toString()) // update :root CSS variable
	if (firstrun) fontHueDefault = fontHue // set default color for reset
}
function updateFontSat(firstrun = false) { // change font and outline saturation
	// update saturation from slider if element exists
	if (document.getElementById("fontSatSlider") !== null) fontSat = document.getElementById("fontSatSlider").value
	var root = document.documentElement
	root.style.setProperty("--font-sat", fontSat.toString()) // update :root CSS variable
	if (firstrun) fontSatDefault = fontSat // set default color for reset
}
function updateFontLit(firstrun = false) { // change font and outline lightness
	// update lightness from slider if element exists
	if (document.getElementById("fontLitSlider") !== null) fontLit = document.getElementById("fontLitSlider").value
	var root = document.documentElement
	root.style.setProperty("--font-lit", fontLit.toString()) // update :root CSS variable
	if (firstrun) fontLitDefault = fontLit // set default color for reset
}

function updColorMenuLayout() {
	cipherMenuColumns = document.getElementById("avail_ciphers_columns").value
	toggleColorControlsMenu(true) // flag to update layout
}

function initColorArrays() { // store original cipher colors and current modifier values
	origColors = []
	chkboxColors = []
	globColors = []
	var tmp = {}
	for (i = 0; i < cipherList.length; i++) {
		tmp = {H:cipherList[i].H, S:cipherList[i].S, L:cipherList[i].L}
		origColors.push(tmp)
		tmp = {H:0, S:0, L:0}
		chkboxColors.push(tmp) // individual controls
	}
	globColors = {H:0, S:0, L:0}
}

function resetColorControls() { // set all color controls to zero
	if (document.getElementById("globalSliderHue") !== null) document.getElementById("globalSliderHue").value = 0
	if (document.getElementById("globalSliderSaturation") !== null) document.getElementById("globalSliderSaturation").value = 0
	if (document.getElementById("globalSliderLightness") !== null) document.getElementById("globalSliderLightness").value = 0
	globColors = {H:0, S:0, L:0} // reset global color modifier

	// reset values for individual colors
	chkboxColors = []
	var tmp_H, tmp_S, tmp_L
	for (i = 0; i < cipherList.length; i++) {
		chkboxColors.push({H:0, S:0, L:0}) // create new object for each cipher
		tmp_H = document.getElementById("sliderHue"+i)
		tmp_S = document.getElementById("sliderSaturation"+i)
		tmp_L = document.getElementById("sliderLightness"+i)
		if (tmp_H !== null && tmp_S !== null && tmp_L !== null) { // if individual sliders are visible
			tmp_H.value = 0
			tmp_S.value = 0
			tmp_L.value = 0
		}
	}

	// update colors
	changeCipherColors(0, "Hue")
	changeCipherColors(0, "Saturation")
	changeCipherColors(0, "Lightness")

	interfaceHue = interfaceHueDefault // reset interface color
	interfaceSat = interfaceSatDefault
	interfaceLit = interfaceLitDefault
	if (document.getElementById("interfaceHueSlider") !== null) document.getElementById("interfaceHueSlider").value = interfaceHue
	if (document.getElementById("interfaceSatSlider") !== null) document.getElementById("interfaceSatSlider").value = interfaceSat
	if (document.getElementById("interfaceLitSlider") !== null) document.getElementById("interfaceLitSlider").value = interfaceLit

	fontHue = fontHueDefault // reset font and outline color
	fontSat = fontSatDefault
	fontLit = fontLitDefault
	if (document.getElementById("fontHueSlider") !== null) document.getElementById("fontHueSlider").value = fontHue
	if (document.getElementById("fontSatSlider") !== null) document.getElementById("fontSatSlider").value = fontSat
	if (document.getElementById("fontLitSlider") !== null) document.getElementById("fontLitSlider").value = fontLit
	updateInterfaceColor()

	updateTables() // update
}

function changeCipherColors(elem_id, col_mode, cipher_index) {
	var ciph_len, st_pos, cur_ciphColBox

	var curVal
	if (typeof elem_id == "number") {
		curVal = elem_id // if a number was passed instead of element id
	} else {
		curVal = Number(document.getElementById(elem_id).value) // current slider value
	}

	if (cipher_index == undefined) { // no cipher_index, change all colors
		ciph_len = cipherList.length
		st_pos = 0
	} else { // else change individual color
		ciph_len = cipher_index+1
		st_pos = cipher_index
	}
	for (i = st_pos; i < ciph_len; i++) {
		if (col_mode == "Hue") {
			if (cipher_index == undefined) { globColors.H = curVal } // update global value modified
			else { chkboxColors[i].H = curVal } // update individual cipher value
			cipherList[i].H = colFmt(origColors[i].H + chkboxColors[i].H + globColors.H,"H")
		} else if (col_mode == "Saturation") {
			if (cipher_index == undefined) { globColors.S = curVal }
			else { chkboxColors[i].S = curVal }
			cipherList[i].S = colFmt(origColors[i].S + chkboxColors[i].S + globColors.S,"S")
		} else if (col_mode == "Lightness") {
			if (cipher_index == undefined) { globColors.L = curVal }
			else { chkboxColors[i].L = curVal }
			cipherList[i].L = colFmt(origColors[i].L + chkboxColors[i].L + globColors.L,"L")
		}
		cur_ciphColBox = document.getElementById("cipherHSL"+i) // textbox with HSLA values for current color
		if (cur_ciphColBox !== null) cur_ciphColBox.value = colPad(cipherList[i].H)+colPad(cipherList[i].S)+colPad(cipherList[i].L,true)
	}
	updateTables(false) // update without redrawing color controls
	updateWordBreakdown() // update word/cipher breakdown table
}

function colFmt(val, mode) { // normalize HSLA color values
	if (mode == "H") {
		if (val < 0) { val = val % 360 + 360 } // fix 0-360 range
		else { val = val % 360 }
	} else if (mode == "S") {
		val = clampNum(val, 0, 100)
	} else if (mode == "L") {
		val = clampNum(val, 0, 100)
	}
	return val
}

function clampNum(number, min, max) { // clamp number within specified range
	return Math.max(min, Math.min(number, max))
}

function colPad(val, last = false) { // padding for color values (monospace)
	val = String(val+"    ").substring(0,4)
	if (last) val = val.substring(0,val.length-1) // last value has no extra space
	return val
}

function populateColorValues() { // update color controls for each individual cipher
	var tmp_H, tmp_S, tmp_L, tmp_HSL
	for (i = 0; i < cipherList.length; i++) {
		tmp_H = document.getElementById("sliderHue"+i)
		tmp_S = document.getElementById("sliderSaturation"+i)
		tmp_L = document.getElementById("sliderLightness"+i)
		tmp_HSL = document.getElementById("cipherHSL"+i)
		if (tmp_H !== null) tmp_H.value = chkboxColors[i].H
		if (tmp_S !== null) tmp_S.value = chkboxColors[i].S
		if (tmp_L !== null) tmp_L.value = chkboxColors[i].L
		if (tmp_HSL !== null) tmp_HSL.value = colPad(cipherList[i].H)+colPad(cipherList[i].S)+colPad(cipherList[i].L,true)
	}
}

// ====================== Enabled Cipher Table ======================

function saveInitialCiphers() {
	if (cipherListSaved.length == 0) cipherListSaved = [...cipherList] // make a copy of initial ciphers to revert changes
}

function initCiphers(updDefCiph = true) { // list categories, define default (base) ciphers
	var c = ""
	cCat = [] // clear categories
	for (i = 0; i < cipherList.length; i++) {
		c = cipherList[i].cipherCategory
		if (cCat.indexOf(c) == -1) cCat.push(c) // list categories
		if (cipherList[i].enabled && updDefCiph) defaultCipherArray.push(cipherList[i].cipherName) // update default ciphers
	}
	if (defaultCipherArraySaved.length == 0) defaultCipherArraySaved = [...defaultCipherArray] // copy of initial default ciphers
	initColorArrays()
}

function enableDefaultCiphers() {
	disableAllCiphers()
	var ciphArr = defaultCipherArray
	for (n = 0; n < cipherList.length; n++) {
		if (ciphArr.indexOf(cipherList[n].cipherName) > -1) {
			cipherList[n].enabled = true // enable cipher
			cur_chkbox = document.getElementById("cipher_chkbox"+n)
			if (cur_chkbox !== null) cur_chkbox.checked = true // update checkbox if present
		}
	}
	updateTables() // update
}

function enableAllCiphers() {
	prevCiphIndex = -1 // reset cipher selection
	var cur_chkbox
	for (i = 0; i < cipherList.length; i++) {
		cur_chkbox = document.getElementById("cipher_chkbox"+i)
		cipherList[i].enabled = true
		if (cur_chkbox !== null) cur_chkbox.checked = true
	}
	updateTables() // update
}

function enableAllEnglishCiphers() {
	prevCiphIndex = -1 // reset cipher selection
	var cur_chkbox
	for (i = 0; i < cipherList.length; i++) {
		if (cipherList[i].cArr.indexOf(97) > -1) { // lowercase "a"
			cur_chkbox = document.getElementById("cipher_chkbox"+i)
			cipherList[i].enabled = true
			if (cur_chkbox !== null) cur_chkbox.checked = true
		}
	}
	updateTables() // update
}

function disableAllCiphers() {
	prevCiphIndex = -1 // reset cipher selection
	var cur_chkbox
	for (i = 0; i < cipherList.length; i++) {
		cur_chkbox = document.getElementById("cipher_chkbox"+i)
		cipherList[i].enabled = false // if checkbox exists toggle state (next line)
		if (cur_chkbox !== null) cur_chkbox.checked = false
	}
	updateTables() // update
}

function toggleCipherCategory(ciph_cat) {
	prevCiphIndex = -1 // reset cipher selection
	var on_first = false
	for (i = 0; i < cipherList.length; i++) {
		if (cipherList[i].cipherCategory == ciph_cat && !cipherList[i].enabled) on_first = true // if one cipher is disabled
	}
	var cur_chkbox
	for (i = 0; i < cipherList.length; i++) {
		//console.log(cipherList[i].cipherCategory)
		if (cipherList[i].cipherCategory == ciph_cat) {
			cur_chkbox = document.getElementById("cipher_chkbox"+i)
			if (on_first) { // if one cipher is disabled, first enable all
				cipherList[i].enabled = true
				if (cur_chkbox !== null) cur_chkbox.checked = true
			} else { // if all ciphers are enabled, disable all
				cipherList[i].enabled = false
				if (cur_chkbox !== null) cur_chkbox.checked = false
			}
		}
	}
	updateTables() // update
}

function toggleCipher(c_id, chk = false) {
	prevCiphIndex = -1 // reset cipher selection
	cipherList[c_id].enabled = !cipherList[c_id].enabled // toggle true/false
	if (chk) { // toggle checkbox state
		cur_chkbox = document.getElementById("cipher_chkbox"+c_id);
		if (cur_chkbox !== null) cur_chkbox.checked = !cur_chkbox.checked; // update checkbox if visible
	}
	updateTables() // update
}

function updateTables(updColorLayout = true) {
	prevCiphIndex = -1 // reset cipher selection
	for (i = 0; i < cipherList.length; i++) {
		// if previous breakdown cipher is not enabled or if cipher no longer exists
		if ( cipherList[i].cipherName == breakCipher && !cipherList[i].enabled || typeof cipherList.find(o => o.cipherName == breakCipher) == 'undefined' ) {
			for (n = 0; n < cipherList.length; n++) {
				if (cipherList[n].enabled) {
					breakCipher = cipherList[n].cipherName // load first enabled cipher instead
					break
				}
			}
		}
	}
	if (colorControlsMenuOpened && updColorLayout) updColorMenuLayout() // update color controls if menu is opened
	updateEnabledCipherTable() // update enabled cipher table
	updateHistoryTable() // update history table
	updateWordBreakdown(breakCipher, true) // update word breakdown and choose first enabled cipher
}

function updateEnabledCipherCount() {
	enabledCiphCount = 0 // number of enabled ciphers
	for (i = 0; i < cipherList.length; i++) { // count all enabled ciphers
		if (cipherList[i].enabled) enabledCiphCount++
	}
}

function sVal() {
	return document.getElementById("phraseBox").value.trim() // get value, remove spaces from both sides
}

function sValNoComments() {
	// get value, remove text inside [...], remove [ and ] (unfinished input), remove spaces from both sides
	return document.getElementById("phraseBox").value.replace(/\[.+\]/g, '').replace(/\[/g, '').replace(/\]/g, '').trim()
}

function calcCipherNameWidthPx(str) { // calculate column width inside table based on cipher name length
	chWidthArr = [["a",8.13],["b",9.28],["c",7.66],["d",9.28],["e",8.32],["f",4.8],["g",9.38],["h",9.26],["i",3.79],["j",3.86],["k",8.38],["l",3.79],["m",14.38],["n",9.26],["o",8.64],["p",9.28],["q",9.28],["r",5.48],["s",6.81],["t",5.46],["u",9.21],["v",7.49],["w",12.12],["x",7.51],["y",7.49],["z",7.09],["A",10.13],["B",10.3],["C",9.63],["D",11.23],["E",9.11],["F",8.64],["G",10.5],["H",11.04],["I",4.22],["J",6.98],["K",9.78],["L",8.08],["M",12.99],["N",11.04],["O",11.42],["P",9.68],["Q",11.42],["R",9.89],["S",8.45],["T",8.12],["U",10.76],["V",9.68],["W",15.31],["X",8.9],["Y",8.76],["Z",8.94],["1",5.03],["2",7.81],["3",7.71],["4",9.1],["5",7.74],["6",8.39],["7",8.13],["8",8.76],["9",8.39],["0",9.07],["-",5.25],["(",4.58],[")",4.6],[" ",3.66]]
	var i, n, m
	var tmp = 0; var curChar = ''; var lenArr = [];
	var arr = str.split(' ') // split string by words
	for (i = 0; i < arr.length; i++) { // for each word
		tmp = 0 // reset word width
		for (n = 0; n < arr[i].length; n++) { // for each character in that word
			curChar = arr[i].substring(n,n+1) // current character
			for (m = 0; m < chWidthArr.length; m++) { // for each element in array with widths
				if (chWidthArr[m][0] == curChar) tmp += chWidthArr[m][1] // add width for correspondent character
			}
		}
		lenArr.push(tmp) // save width for current word
	}
	tmp = 0
	for (i = 0; i < lenArr.length; i++) {
		if (lenArr[i] > tmp) tmp = lenArr[i] // find max value
	}
	if (tmp+6 >= 80) return Math.ceil(tmp+6) // 6px padding
	return 80
}

function calcCipherNameHeightPx(str) { // calculate row height inside compact table based on cipher name length
	chWidthArr = [["a",8.13],["b",9.28],["c",7.66],["d",9.28],["e",8.32],["f",4.8],["g",9.38],["h",9.26],["i",3.79],["j",3.86],["k",8.38],["l",3.79],["m",14.38],["n",9.26],["o",8.64],["p",9.28],["q",9.28],["r",5.48],["s",6.81],["t",5.46],["u",9.21],["v",7.49],["w",12.12],["x",7.51],["y",7.49],["z",7.09],["A",10.13],["B",10.3],["C",9.63],["D",11.23],["E",9.11],["F",8.64],["G",10.5],["H",11.04],["I",4.22],["J",6.98],["K",9.78],["L",8.08],["M",12.99],["N",11.04],["O",11.42],["P",9.68],["Q",11.42],["R",9.89],["S",8.45],["T",8.12],["U",10.76],["V",9.68],["W",15.31],["X",8.9],["Y",8.76],["Z",8.94],["1",5.03],["2",7.81],["3",7.71],["4",9.1],["5",7.74],["6",8.39],["7",8.13],["8",8.76],["9",8.39],["0",9.07],["-",5.25],["(",4.58],[")",4.6],[" ",3.66]]
	var i, n
	var tmp = 0; var curChar = '';
	for (i = 0; i < str.length; i++) { // for each character in string
		curChar = str.substring(i,i+1) // current character
		for (n = 0; n < chWidthArr.length; n++) { // for each element in array with widths
			if (chWidthArr[n][0] == curChar) tmp += chWidthArr[n][1] // add width for correspondent character
		}
	}
	return Math.ceil(tmp+20) // 20px padding
}

function updateEnabledCipherTable() { // draws a table with phrase gematria for enabled ciphers (odd/even)
	document.getElementById("enabledCiphTable").innerHTML = "" // clear previous table
	
	prevCiphIndex = -1 // reset cipher selection
	updateEnabledCipherCount() // get number of enabled ciphers
	
	phr = sVal() // grab current phrase
	// if (enabledCiphCount == 0 || phr == "") return // no enabled ciphers, empty phraseBox
	
	if (document.getElementById("enabled_ciphers_columns") !== null ) enabledCiphColumns = document.getElementById("enabled_ciphers_columns").value // number of columns in cipher table, update value
	var result_columns = enabledCiphColumns
	if (enabledCiphCount <= enabledCiphColumns) { result_columns = enabledCiphCount }
	// else if (enabledCiphCount > 6 && enabledCiphCount <= 20) { result_columns = 2 }
	// else { result_columns = 4 }

	var cur_ciph_index = 0 // index of current of enabled cipher that will be added to the table (total # of ciphers added so far + 1)
	var new_row_opened = false // condition to open new row inside table
	var odd_col = true // odd = "cipher name - value", even = "value - cipher name", used in each row
	//var n_of_rows = 0 // number of rows inside cipher table
	var last_row_elements = 0 // number of ciphers in the last row
	var ciph_in_row = 0 // count active ciphers in row
	var cur_col = "" // current cipher color
	
	var o = '<table class="phraseGemContainer"><tbody>'
	
	//n_of_rows = Math.ceil(cipherList.length / result_columns) // 6.0 => 6 rows, 6.25 => 7 rows
	last_row_elements = enabledCiphCount % result_columns
	
	for (i = 0; i < cipherList.length; i++) { // <= to include last row
		if (cipherList[i].enabled) { // for active ciphers
			cur_ciph_index++
			if (!new_row_opened) { // check if new row has to be opened
				o += '<tr>'
				odd_col = true // reset on each new row
				new_row_opened = true
			}
			if (ciph_in_row < result_columns) { // until number of ciphers in row equals number of colums
				cur_col = 'color: hsl('+cipherList[i].H+' '+cipherList[i].S+'% '+cipherList[i].L+'% / 1);'
				if (odd_col) { // odd column, "cipher name - value"
					o += '<td class="phraseGemCiphName" style="'+cur_col+'">'+cipherList[i].cipherName+'</td>'
					// o += '<td class="phraseGemValueOdd" style="'+cur_col+'">'+cipherList[i].calcGematria(phr)+'</td>'
					o += '<td class="phraseGemValueOdd" style="'+cur_col+'"><span class="numProp">'+cipherList[i].calcGematria(phr)+'<span></td>'
					ciph_in_row++
					odd_col = false
					//console.log(cipherList[i].cipherName+": odd")
				} else if (!odd_col) { // even column, "value - cipher name"
					// o += '<td class="phraseGemValueEven" style="'+cur_col+'">'+cipherList[i].calcGematria(phr)+'</td>'
					o += '<td class="phraseGemValueEven" style="'+cur_col+'"><span class="numProp">'+cipherList[i].calcGematria(phr)+'<span></td>'
					o += '<td class="phraseGemCiphName" style="'+cur_col+'">'+cipherList[i].cipherName+'</td>'
					ciph_in_row++
					odd_col = true
					//console.log(cipherList[i].cipherName+": even")
				}
				if (cur_ciph_index == enabledCiphCount && last_row_elements !== 0) { // last enabled cipher is added and last row is not fully populated
					for (n = 0; n < result_columns - last_row_elements; n++) { // for remaining empty cells in last row
						if (odd_col) {
							o += '<td class="phraseGemCiphNameBlank"></td>'
							o += '<td class="phraseGemValueOdd"></td>'
							odd_col = false
						} else if (!odd_col) {
							o += '<td class="phraseGemValueEven"></td>'
							o += '<td class="phraseGemCiphNameBlank"></td>'
							odd_col = true
						}
					}
				}
				if (ciph_in_row == result_columns) { // check if row needs to be closed
					o += '</tr>'
					ciph_in_row = 0 // reset cipher count
					new_row_opened = false
				}
			}
		}
	}
	o += '</tbody></table>'
	
	document.getElementById("enabledCiphTable").innerHTML += o
}

// =================== Phrase Box - History Table ===================

function phraseBoxKeypress(e) { // run on each keystroke inside text box - onkeydown="navHistory(event.keyCode) - from index.html
	var phrPos, pBox
	phr = sVal() // get phrase from SearchField
	pBox = document.getElementById("phraseBox")

	phrPos = sHistory.indexOf(phr) // position of phrase in History array
	switch (e) { // keypress event
		case 13: // Enter
			addPhraseToHistory(phr, true) // enter as single phrase
			pBox.value = "" // clear textbox on Enter
			break
		case 38: // Up Arrow
			if (phrPos > 0) {
				phr = sHistory[phrPos - 1]
			}
			if (phr !== "") {pBox.value = phr; updateWordBreakdown(); updateTables()}
			break
		case 40: // Down Arrow
			if (phrPos > -1) {
				if (sHistory.length > (phrPos + 1)) {phr = sHistory[phrPos + 1]}
			} else {
				if (sHistory.length > 0) {phr = sHistory[0]}
			}
			if (phr !== "") {pBox.value = phr; updateWordBreakdown(); updateTables()}
			break
		case 46: // Delete - remove entries from history
			if (sHistory.length == 1 && phrPos > -1) { // if one entry and matches box contents
				sHistory = [] // reinit
				tArea = document.getElementById("HistoryTableArea")
				tArea.innerHTML = "" // clear table
			}
			if (phrPos > -1) {
				sHistory.splice(phrPos, 1) // if a match is found, delete entry
			}
			pBox.value = "" // empty text box, so the old value is not added again
			updateWordBreakdown() // update breakdown
			updateTables() // update enabled cipher and history table
			break
		case 36: // Home - clear all history
			sHistory = [] // reinitialize
			document.getElementById("HistoryTableArea").innerHTML = "" // clear history table
			break
		case 35: // End - parse sentence as separate words and phrases
			phr = phr.replace(/\t/g, " ") // replace tab with spaces
			phr = phr.replace(/ +/g, " ") // remove double spaces
			// phr = phr.replace(/(\.|,|:|;|\\|)/g, "") // remove special characters, last one is "|"

			wordArr = phr.split(" ") // split string to array, space delimiter
			phrLimit = optPhraseLimit // max phrase length
			var phrase = ""; var k = 1;
			// for (i = 0; i < wordArr.length; i++) { // phrases in normal order
				// k = 1 // init variable
				// phrase = wordArr[i]
				// addPhraseToHistory(phrase, false)
				// while (k < phrLimit && i+k < wordArr.length) { // add words to a phrase, check it is within array size
					// phrase += " "+wordArr[i+k]
					// addPhraseToHistory(phrase, false)
					// k++
				// }
			// }
			for (i = wordArr.length-1; i > -1; i--) { // add phrases in reverse order, so you don't have to read backwards
				k = 1 // word count
				phrase = wordArr[i]
				addPhraseToHistory(phrase, false) // don't recalculate table yet
				while (k < phrLimit && i-k > -1) { // add words to a phrase, check it is within wordArr size
					phrase = wordArr[i-k]+" "+phrase
					addPhraseToHistory(phrase, false)
					k++
				}
			}
			updateHistoryTable() // update table only once after all phrases are added
			break
	}
}

function addPhraseToHistory(phr, upd) { // add new phrase to search history
	var phrPos
	if (phr !== "") { // if input is not empty
		if (Number(phr) > 0) { // if a number is entered, do not add it to history
		} else {
			phrPos = sHistory.indexOf(phr);
			if (phrPos > -1) { // if phrase is in history
				sHistory.splice(phrPos, 1) // first remove it from array
			}
			sHistory.unshift(phr) // insert it in the beginning
		}
	}
	if (upd) updateHistoryTable() // table update condition
}

function updateHistoryTable(hltBoolArr) {
	var ms, i, x, y, z, curCiph, gemVal
	var ciphCount = 0 // count enabled ciphers (for hltBoolArr)
	histTable = document.getElementById("HistoryTableArea")
	
	if (sHistory.length == 0) {return}

	prevPhrID = -1 // reset phrase selection
	ms = '<table class="HistoryTable"><tbody>'

	highlt = document.getElementById("highlightBox").value.replace(/ +/g," ") // get value of Highlight textbox, remove double spaces
	
	var hltMode = false // highlighting mode
	if (highlt !== "") {
		highlt_num = highlt.split(" "); // create array, space delimited numbers
		highlt_num = highlt_num.map(function (e) { return parseInt(e, 10); }) // parse string array as integer array to exclude quotes
		highlt_num = removeZeroHlt(highlt_num)
		hltMode = true
	}

	var dispPhrase = "" // phrase to display inside history table
	var tmpComment = ""; var commentMatch;
	for (x = 0; x < sHistory.length; x++) {

		if (x % 25 == 0 && !optTinyHistoryTable) {
			ms += '<tr class="cH"><td class="mP"></td>'
			for (z = 0; z < cipherList.length; z++) {
				if (cipherList[z].enabled) {
					if (optCompactHistoryTable) {
						ms += '<td class="hCV" style="height: '+calcCipherNameHeightPx(cipherList[z].cipherName)+'px;"><span class="hCV2" style="color: hsl('+cipherList[z].H+' '+cipherList[z].S+'% '+cipherList[z].L+'% / 1);">'+cipherList[z].cipherName+'</span></td>' // color of cipher displayed in the table
					} else {
						ms += '<td class="hC" style="color: hsl('+cipherList[z].H+' '+cipherList[z].S+'% '+cipherList[z].L+'% / 1); max-width: '+calcCipherNameWidthPx(cipherList[z].cipherName)+'px; min-width: '+calcCipherNameWidthPx(cipherList[z].cipherName)+'px;">'+cipherList[z].cipherName+'</td>' // color of cipher displayed in the table
					}
				}
			}
			ms += "</tr>"
		}

		ciphCount = 0 // reset enabled cipher count (for hltBoolArr)

		if (optAllowPhraseComments) {
			tmpComment = "" // reset
			commentMatch = sHistory[x].match(/\[.+\]/g) // find comment
			if (commentMatch !== null) {
				tmpComment = commentMatch[0]
			}
			// comment first, phrase without comment and leading/trailing spaces
			dispPhrase = '<span class="pCHT">'+tmpComment+'</span>' + sHistory[x].replace(/\[.+\]/g, '').trim()
		} else {
			dispPhrase = sHistory[x]
		}
		ms += '<tr><td class="hP" data-ind="'+x+'">' + dispPhrase + '</td>' // hP - history phrase, add data index
		var col = "" // value color

		for (y = 0; y < cipherList.length; y++) {
			if (cipherList[y].enabled) {
				curCiph = cipherList[y]
				gemVal = curCiph.calcGematria(sHistory[x]) // value only
				
				//phrase x, cipher y
				col = 'hsl('+curCiph.H+' '+curCiph.S+'% '+curCiph.L+'% / 1)' // default value color

				// if highlight mode is on
				if (hltMode) {
					// if cross cipher match and highlight box doesn't include number
					if ( optFiltCrossCipherMatch && !highlt_num.includes(gemVal) ) {
						col = 'hsl('+curCiph.H+' '+curCiph.S+'% '+curCiph.L+'% / '+alphaHlt+')'
					// hltBoolArr was passed and value inside hltBoolArr is not active (optFiltSameCipherMatch)
					} else if ( typeof hltBoolArr !== 'undefined' && hltBoolArr[x][ciphCount] == false ) {
						col = 'hsl('+curCiph.H+' '+curCiph.S+'% '+curCiph.L+'% / '+alphaHlt+')'
					}
				}
				ciphCount++ // next position in hltBoolArr
				ms += '<td class="tC"><span style="color: '+col+'" class="gV"> '+gemVal+' </span></td>'
			}
		}
		ms += '</tr>'
	}

	ms += '</tbody></table>'
	histTable.innerHTML = ms
}