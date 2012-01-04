// A minified version of this file is available at http://api.opencorporates.com/tools/widget.js
// To use this widget in any HTML file simply add these lines:
//   <script src="http://api.opencorporates.com/tools/widget.js" type="text/javascript"></script>
//   <div class="ocwidget-container"></div>
// The widget will be added to your page wherever you put the <div>


(function() {
//Dynmaically include jQuery -- with thanks to http://alexmarandon.com/articles/web_widget_jquery/
// Localize jQuery variable
var jQuery;

/******** Load jQuery if not present *********/
if (window.jQuery === undefined || window.jQuery.fn.jquery !== '1.5') {
    var script_tag = document.createElement('script');
    script_tag.setAttribute("type","text/javascript");
    script_tag.setAttribute("src",
        "http://ajax.googleapis.com/ajax/libs/jquery/1.5/jquery.min.js");
    if (script_tag.readyState) {
      script_tag.onreadystatechange = function () { // For old versions of IE
          if (this.readyState == 'complete' || this.readyState == 'loaded') {
              scriptLoadHandler();
          }
      };
    } else { // Other browsers
      script_tag.onload = scriptLoadHandler;
    }
    // Try to find the head, otherwise default to the documentElement
    (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
} else {
    // The jQuery version on the window is the one we want to use
    jQuery = window.jQuery;
    main();
}

/******** Called once jQuery has loaded ******/
function scriptLoadHandler() {
    // Restore $ and window.jQuery to their previous values and store the
    // new jQuery in our local jQuery variable
    jQuery = window.jQuery.noConflict(true);
    // Call our main function
    main(); 
}

/******** Our main function ********/
function main() { 
    jQuery(document).ready(function($) { 
      setupDocument();
    });
}

function setupDocument () {
	var form_stuff = '<style lang="text/css">div.ocwidget-container {margin:3px; width:100%; border: 1px solid #b18e72; max-width: 20em; font-family:Helvetica,sans-serif;}\n .ocwidget-header {padding: 1px 4px;}\n .ocwidget-header h3 { color: #8f735c; border-bottom: 1px solid #efe7e0; margin:0;}\n .ocwidget-footer { padding: 1px 3px; background-color: #efe7e0; border-top: 1px solid #676767; margin: 1em 0 0 0; font-size: 80%;}\n .ocwidget-container a {text-decoration: none; font-style: normal; color: #8f735c;}\n .ocwidget-container ul {padding: 0;}\n .ocwidget-container ul li {margin:0.25em 0.25em 0.25em 1.25em; font-style: italic;}\n .ocwidget-container .inactive, .ocwidget-container .inactive a {color: #999;}\n .ocwidget-container .company {font-weight: bold;}\n.ocwidget-container .summary {font-weight: bold; font-style:italic}\n#openc_api_search_q {font-size: 105%;margin-left:4px}\n.ocwidget-container #ocwidget-result {margin: 1px 4px; font-size: 90%;}\n.ocwidget-header .scope {font-size: 80%;}</style>';
  form_stuff += '<div class="ocwidget-header"><h3><a href="http://opencorporates.com">OpenCorporates company search</a></h3><div class="scope">30 million companies, 35 jurisdictions</div></div>\n<form accept-charset="UTF-8" action="http://opencorporates.com/companies" class="search" id="ocwidget-search" method="get"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="✓"></div>\n<input id="openc_api_search_q" name="q" type="text">\n<input class="button" name="commit" type="submit" value="Search">\n</form><div class="loading" style="display:none;">Searching...</div><div id="ocwidget-result" style="display:none;"></div><div class="ocwidget-footer">Powered by <a href="http://opencorporates.com">OpenCorporates :: The Open Database Of The Corporate World</a></div>';
  jQuery('.ocwidget-container').html(form_stuff)
  jQuery("#ocwidget-search").submit(function(event) {
    event.preventDefault();
    if (jQuery("#ocwidget-result").is(":visible")) {jQuery("#ocwidget-result").slideUp("slow");}
    jQuery(".loading").show();
    var $form = jQuery( this ),
            term = $form.find( 'input[name="q"]' ).val(),
            url = $form.attr( 'action' ).replace('http://','http://api.') + '/search?callback=?';
    jQuery.getJSON( url, { q: term },
          function( data ) { insertCompanyData(data, term); }
        );
      });
  
  
    }

function insertCompanyData (data, term) {
  var companies = data.companies;
  content = "<div class='summary'>Found <a href='http://opencorporates.com/companies?q=" + term + "'>" + data.total_count + " results</a></div>"
  content += listAll(companies)
  jQuery(".ocwidget-container .loading").hide();
  jQuery( "#ocwidget-result" ).html(content).slideDown("slow");
}

function listItemFor(company) {
  var jurisdiction = company.jurisdiction_code.replace(/_(\w+)/," ($1)").toUpperCase();
  var li = "<li class='" + (company.inactive ? 'inactive' : '') + "'>";
  li += " <a class='company' href='" + company.opencorporates_url + "'>" + company.name + "</a>, " + jurisdiction;
  li += company.incorporation_date ? ', ' + company.incorporation_date : "";
  li += company.current_status ? ', ' + company.current_status : "";
  li += "</li>";
  return li;
}

function listAll(coll) { 
  if(coll.length && coll.length > 0){
    var listResult = "<ul>";
    for (var i = 0; i < coll.length && i < 8; i++) {
      var li = coll[i].company;
      listResult += listItemFor(li);
    }
    listResult += "</ul>";
    return listResult;
  }
  else { return '';}
}

})(); // We call our anonymous function immediately
