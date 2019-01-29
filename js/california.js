---
---

window.JSMaps.maps.activeTab = "stats";
window.JSMaps.maps.activeQuoteIndex = 0;

window.JSMaps.maps.onStateClick = function(data) {
	if (!data.enable) {
		return;
	}
	var countyName = data.name;
	var countyData = window.JSMaps.maps.countyData[data.name];
	var hasGetCalFreshData = countyData.hasOwnProperty("number-apps");
	var hasQuotes = countyData['quotes'].length > 0;

	// Setup the tab and content containers with the details tab that will
	// always be present.
	$('div.map-info').html(
		"<h3>" + countyName + "</h3>" +
		"<div class='county-details-note'>Data from 2017</div>" +
		"<div class='county-details'>" +
		"<div class='county-details-tabs'>" +
		"<div class='county-details-tab' id='stats-tab'>" +
		"County Statistics" +
		"</div>" +
		"</div>" +
		"<div class='county-details-content'>" +
		"</div>" +
		"</div>"
	);

	// Insert tab for quotes if there is at least one to display
	if (hasQuotes) {
		$('div.county-details-tabs').append(
			"<div class='county-details-tab' id='stories-tab'>Stories of CalFresh</div>"
		);
	}

	// Build the stats content and add it if that tab is active or the only tab
	if(!hasQuotes || window.JSMaps.maps.activeTab == 'stats') {
		$('#stats-tab').addClass('selected');

		// Every county always has these basic stats
		$('div.county-details-content').html(
			"<div class='county-details-stats'>" +
			"<div class='county-details-stat'>" +
			"<div class='county-details-stat-name'>Population</div>" +
			"<div class='county-details-stat-number'>" + countyData["population"] + "</div>" +
			"</div>" +
			"<div class='county-details-stat'>" +
			"<div class='county-details-stat-name'>Poverty rate</div>" +
			"<div class='county-details-stat-number'>" + countyData["poverty-rate"] + "</div>" +
			"</div>" +
			"<div class='county-details-stat'>" +
			"<div class='county-details-stat-name'>Median income<div class='county-details-stat-desc'>cost of living adjusted</div></div>" +
			"<div class='county-details-stat-number'>" + countyData["median-income"].toLocaleString("en", {style: "currency", currency: "USD", maximumFractionDigits: 0, minimumFractionDigits: 0}) + "</div>" +
			"</div>" +
			"<div class='county-details-stat'>" +
			"<div class='county-details-stat-name'>Min cost of living<div class='county-details-stat-desc'>2 working adults, 2 children</div></div>" +
			"<div class='county-details-stat-number'>" + countyData["minimum-cost-living-family"].toLocaleString("en", {style: "currency", currency: "USD", maximumFractionDigits: 0, minimumFractionDigits: 0}) + "</div>" +
			"</div>" +
			"<div style='clear:both'></div>" +
			"</div>"
		);

		// GetCalFresh counties also have these additional stats
		if (hasGetCalFreshData) {
			$('div.county-details-content').append(
				"<div class='county-details-gcf-stats-heading'>GetCalFresh Data</div>" +
				"<div class='county-details-gcf-stats'>" +
				"<div class='county-details-gcf-stat'>" +
				"<div class='county-details-gcf-stat-number'>"+ countyData["number-apps"].toLocaleString("en", {style: "decimal"}) + "</div>" +
				"<div class='county-details-gcf-stat-name'>GetCalFresh applicants</div>" +
				"</div>" +
				"<div class='county-details-gcf-stat'>" +
				"<div class='county-details-gcf-stat-number'>"+ countyData["percent-earned-income"].toLocaleString("en", {style: "percent"}) + "</div>" +
				"<div class='county-details-gcf-stat-name'>Have jobs</div>" +
				"</div>" +
				"<div class='county-details-gcf-stat'>" +
				"<div class='county-details-gcf-stat-number'>"+ countyData["percent-student"].toLocaleString("en", {style: "percent"}) + "</div>" +
				"<div class='county-details-gcf-stat-name'>Students</div>" +
				"</div>" +
				"<div class='county-details-gcf-stat'>" +
				"<div class='county-details-gcf-stat-number'>"+ countyData["percent-unstable-housing"].toLocaleString("en", {style: "percent"}) + "</div>" +
				"<div class='county-details-gcf-stat-name'>Lack stable housing</div>" +
				"</div>" +
				"<div class='county-details-gcf-stat'>" +
				"<div class='county-details-gcf-stat-number'>"+ countyData["percent-with-children"].toLocaleString("en", {style: "percent"}) + "</div>" +
				"<div class='county-details-gcf-stat-name'>Families with children</div>" +
				"</div>" +
				"<div class='county-details-gcf-stat'>" +
				"<div class='county-details-gcf-stat-number'>"+ countyData["percent-with-seniors"].toLocaleString("en", {style: "percent"}) + "</div>" +
				"<div class='county-details-gcf-stat-name'>Seniors</div>" +
				"</div>" +
				"</div>"
			);
		}
	} else {
		// Build the quotes content and add it if that tab is active
		$('#stories-tab').addClass('selected');
		window.JSMaps.maps.activeQuoteIndex = 0;

		// Append the wrapper and first quote
		var quote = countyData['quotes'][0];
		$('div.county-details-content').html(
			"<div class='county-details-stories'>" +
			"<div class='map-quote'>" +
			"<div class='map-quote-image'></div>" +
			"<p class='map-quote-text'>" + quote + "</p>" +
			"</div>" +
			"<div class='map-quote-selector'>" +
			"<div class='map-quote-selector-arrow left'></div>" +
			"<div class='map-quote-selector-dots'></div>" +
			"<div class='map-quote-selector-arrow right'></div>" +
			"</div>" +
			"</div>"
		);

		// Append quote selector
		for (i = 0; i < countyData['quotes'].length; i++) {
			var quote = countyData['quotes'][i];
			var quoteDotHtml = "<div id='map-dot-" + i + "' class='map-quote-selector-dot'></div>";
			if (i == 0) {
				quoteDotHtml = "<div id='map-dot-" + i + "' class='map-quote-selector-dot selected'></div>"
			}
			$('div.map-quote-selector-dots').append(quoteDotHtml);
		}
	}

		$('div.map-quote-selector-dot').click(function() {
			var dotIndex = this.id.split('-')[2];
			window.JSMaps.maps.activeQuoteIndex = dotIndex;

			$('p.map-quote-text').html(countyData['quotes'][dotIndex]);

			$('div.map-quote-selector-dot').removeClass('selected');
			$('#'+this.id).addClass('selected');
		});

	$('div.map-quote-selector-arrow.left').click(function() {
		if(window.JSMaps.maps.activeQuoteIndex == 0) {
			window.JSMaps.maps.activeQuoteIndex = countyData['quotes'].length - 1;
		} else {
			window.JSMaps.maps.activeQuoteIndex -= 1;
		}
		$('p.map-quote-text').html(countyData['quotes'][window.JSMaps.maps.activeQuoteIndex]);

		$('div.map-quote-selector-dot').removeClass('selected');
		$('div#map-dot-' + window.JSMaps.maps.activeQuoteIndex).addClass('selected');
	});

	$('div.map-quote-selector-arrow.right').click(function() {
		if(window.JSMaps.maps.activeQuoteIndex == countyData['quotes'].length - 1) {
			window.JSMaps.maps.activeQuoteIndex = 0;
		} else {
			window.JSMaps.maps.activeQuoteIndex += 1;
		}
		$('p.map-quote-text').html(countyData['quotes'][window.JSMaps.maps.activeQuoteIndex]);

		$('div.map-quote-selector-dot').removeClass('selected');
		$('div#map-dot-' + window.JSMaps.maps.activeQuoteIndex).addClass('selected');
	});

	$('#stats-tab').click(function() {
		window.JSMaps.maps.activeTab = "stats";
		window.JSMaps.maps.onStateClick(data);
	});
	$('#stories-tab').click(function() {
		window.JSMaps.maps.activeTab = "stories";
		window.JSMaps.maps.onStateClick(data);
	});
};

window.JSMaps.maps.countyData = {{site.data.map | jsonify}};

window.JSMaps.maps.california = {
	"config": {
		"mapWidth": 512,
		"mapHeight": 1024,
		"enablePanZoom": true,
		"initialZoom": 4,
		"initialMapX": 0,
		"initialMapY": 0,
		"displayAbbreviations": false,
		"offColor": "#EBEBEB",
		"offStrokeColor": "#ABABAB",
		"stateClickAction": null,
		"strokeWidth": 0.5,
		"strokeColor": "#000000",
		"textAreaWidth": 0,
		"textAreaHeight": 0,
		"onStateClick": window.JSMaps.maps.onStateClick,
		"onReady": function() {
				$('#california-map').trigger('stateClick', 'San Francisco');
		},
	},
	"paths": [
		{% for county in site.data.map %}
			{% assign countyName = county[0] %}
			{% assign countyData = county[1] %}
		{
			"enable": {%if countyData['number-apps'] %}true{% else %}false{%endif%},
			"name": "{{countyName}}",
			"abbreviation": "",
			"textX": 0,
			"textY": 0,
			"color": "#FFFFFF",
			"hoverColor": "#F5D0A5",
			"selectedColor": "#EFA44C",
			"text": "",
			"path": "{{countyData.path}}"
		},
		{% endfor %}
	],
}
