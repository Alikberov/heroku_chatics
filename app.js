const	szPage	= "https://gamedev.ru/flame/forum/?id=240242";
const	hostname = "";
const	hostport = process.env.PORT || 5000;

console.log("http://" + hostname + ":" + hostport + "/ --- " + szPage);

const	http = require("http");
const	htmlparser = require("htmlparser");
const	jsdom	= require("jsdom");
const	XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const	hXML = new XMLHttpRequest();

const	{ JSDOM } = jsdom;


var		handler = new htmlparser.DefaultHandler(function (error, dom) {
    if(error) {
        console.log("Parse error...");
		console.log(error);
    } else {
        console.log("Parsed - " + dom.length);
	}
});

var		hSecret;
var		aMaps	= {};
var		info;

const	parser = new htmlparser.Parser(handler);

const	{ createCanvas, loadImage } = require('canvas');
//const	sys = require('sys');

const	hCanvas = createCanvas(640, 480);
const	hCtx = hCanvas.getContext('2d');

//
/*loadImage('examples/images/lime-cat.jpg').then((image) => {
	hCtx.drawImage(image, 50, 0, 70, 70)
	var img = hCanvas.toDataURL();*/

function GetUp() {
	var	html;
	var	res	= [];
	hSecret
	.querySelector("#main_body")
	.querySelectorAll(".mes")
	.forEach
	(function(hDiv) {
		if("DIV" == hDiv.tagName) {
			hCaption = hDiv.querySelector("table").rows[0].cells;
			hUser = hCaption[0].querySelector("a");
			nick = hUser.textContent;
			pics = hDiv.querySelectorAll("img");
			for(var i in pics) {
				loadImage(pics[i].src).then((image) => {
					console.log(image);
				});
			}
			console.log(pics);
			hDiv
			.querySelectorAll("pre")
			.forEach
			(function(hPre) {
				pr = hPre.innerHTML;
				if(pr) {
//					console.log(pr);
					pr = pr.match(/(\[map:"(.+)"]([^\0]+?)\[\/map])+/gm);
					if(pr)
						pr.forEach
						(function(map) {
//							console.log(map);
							mp = map.match(/(\[map:"(.+)"]([^\0]+)\[\/map])+/m);
//							console.log(mp);
							if(mp) {
								place = mp[2];
								design = mp[3];
								if(!(nick in aMaps))
									aMaps[nick] = [];
								aMaps[nick][place] = {
									design	:design,
									images	:pics
								};
//								hSelect.add(new Option(nick + ":" + place, place), null);
								info = [nick, place];
								res.push("«" + nick + "»:" + place + "\r\n" + design);
								console.log("::PARSE::");
								console.log(".design="+design);
								console.log(".images="+pics);
								console.log("--PARSE--");
							}
						});
				} else
					;//console.log(pr);
			});
		}
	});
}
function showMap(nick, place) {
	//var	nick = info[0];
	//var	place = info[1];
	console.log("Show:user=" + nick + ";map=" + place);
	console.log("Show:user=" + aMaps[nick]);
	console.log("Show:user=" + aMaps[nick][place]);
	var	map = aMaps[nick][place];
	var	y = 0;
	//
	hCtx.clearRect(0, 0, hCanvas.width, hCanvas.height);
	hCtx.fillText('Awesome!', 50, 100);
	//
	map
	.design.split(/\r?\n/)
	.forEach
	(function(plot) {
		var	x = 0;
		while(plot.length) {
			var	c = plot.charAt(0);
			var	d = plot.charCodeAt(0) - 64;
			if(isFinite(c)) {
				hCtx.fillStyle = "rgb(" + [28 * c, 28 * c, 28 * c].join() + ")";
				hCtx.fillRect(x * 24, y * 24, 24, 24);
				try { hCtx.drawImage(map.images[0], 24 * +c, 0, 24, 24, x * 8, y * 8, 24, 24); } catch(e) { /*console.log(e);*/ }
			} else {
			//if(d > 0 && map.images.length > d) {
				//hCtx.drawImage(map.images[d], x * 24, y * 24);
				hCtx.fillStyle = "red";
				hCtx.fillText(plot.charAt(0), x * 24, y * 24+24);
			}
			plot = plot.substr(1);
			++ x;
		}
		++ y;
	});
	//Dropbox.save("/", "nullpost.jpeg", "");
}

//
// Write "Awesome!"
hCtx.font = '30px "Impact"';
hCtx.rotate(0.1*0);
 
// Draw line under text
var text = hCtx.measureText('Awesome!')
hCtx.strokeStyle = 'rgba(0,0,0,0.5)'
hCtx.beginPath()
hCtx.lineTo(50, 102)
hCtx.lineTo(50 + text.width, 102)
hCtx.stroke()

var	nickun;
var	pictun;
var	dom;

const server = http.createServer((req, res) => {
	var	picture = unescape(req.url).match(/nick="(.*?)"&post=(\d)/);
	console.log(req.url);
	if(picture) {
		console.log("hXML.open::get?nick::" + picture[1] + "//" + picture[2]);
		hXML.open("GET", szPage, false);
		hXML.send();
		if(200 != hXML.status) {
			console.log(hXML.status + ": " + hXML.statusText);
		} else {
			hCtx.fillStyle = 'red';
			hCtx.fillRect(0, 0, hCanvas.width, hCanvas.height);
			parser.parseComplete(hXML.responseText);
			console.log("hXML.responseText");
			//var		document = parser.Parse(hXML.responseText);
			//sys.puts(sys.inspect(handler.dom, false, null));
			console.log("GetUp(); showMap("  + picture[1] + ")"); // Ждём загрузки всех изображений
			pictun = picture[2];
			nickun = picture[1];
			dom = new JSDOM(hXML.responseText);
			hSecret = dom.window.document;
			//setTimeout(() => {
				console.log("Timer:user=" + nickun + ";map=" + pictun + ";secret=" + dom + ":" + hSecret);
				GetUp();
				showMap(nickun, pictun);
			//}, 1000); // Ждём загрузки всех изображений
			res.statusCode = 200;
			res.setHeader('Content-Type', 'image/png');
			hCanvas.pngStream().pipe(res);
		}
	}
});
server.listen(hostport, hostname, () => {
  console.log(`Server running at http://${hostname}:${hostport}/`);
});
