const	logs	= console.log;

const	phorum	= "https://gamedev.ru/flame/forum/?id=240242";
const	hosting	= "";
const	port	= process.env.PORT || 5000;

var		log;

logs(`Start at "http://${hosting}:${port}/" for parse "${phorum}"`);

//const	sys		= require('sys');
const	http	= require("http");
const	util	= require("util");

const	htmlparser = require(log = "htmlparser");
logs(`require("${log}") is ` + (htmlparser ? "loaded..." : "fails."));
if(!htmlparser)
	return 1;

const	jsdom = require(log = "jsdom");
logs(`require("${log}") is ` + (jsdom ? "loaded..." : "fails."));
if(!jsdom)
	return 2;

const	XMLhttprequest = require(log = "xmlhttprequest");
logs(`require("${log}") is ` + (XMLhttprequest ? "loaded..." : "fails."));
if(!XMLhttprequest)
	return 3;

const	{createCanvas, loadImage} = require(log = 'canvas');
logs(`require("${log}") is ` + (createCanvas ? "loaded..." : "fails."));
if(!createCanvas)
	return 4;

const	hGIF = require(log = 'gifencoder');
logs(`require("${log}") is ` + (hGIF ? "loaded..." : "fails."));
if(!hGIF)
	return 5;

const	XMLHttpRequest = XMLhttprequest.XMLHttpRequest;
const	hXML	= new XMLHttpRequest();
const	{JSDOM}	= jsdom;

logs(`Define the HTML-Parser...`);
var		handler = new htmlparser.DefaultHandler(function (error, dom) {
    if(error) {
        console.log("Parse error...");
		console.log(error);
    } else {
        console.log("Parsed - " + dom.length);
	}
});

logs(`Binding the HTML-Parser...`);
const	parser = new htmlparser.Parser(handler);

var		info;

logs(`Create Canvas...`);
const	hCanvas = createCanvas(640, 640);
logs(`Get 2D-Context...`);
const	hCtx = hCanvas.getContext('2d');

var	Matrix	= [];

var	i, j;

for(i = 0; i < 100; ++ i) {
	Matrix[i] = [];
	for(j = 0; j < 100; ++ j)
		Matrix[i][j] = 10;
}

/*loadImage('examples/images/lime-cat.jpg').then((image) => {
	hCtx.drawImage(image, 50, 0, 70, 70)
	var img = hCanvas.toDataURL();*/

function GetUp(hSecret) {
	var	html;
	var	aMaps = {};
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
			/*for(var i in pics) {
				loadImage(pics[i].src).then((image) => {
					console.log(image);
				});
			}*/
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
									aMaps[nick] = [[]];
								aMaps[nick].push({
									place	:place,
									design	:design,
									images	:pics
								});
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
	return aMaps;
}

var	PosX = 0, PosY = 0;

function showMap(aMaps, nick, place, piece, hGif) {
	//var	nick = info[0];
	//var	place = info[1];
	console.log("Show:user=" + nick + ";map=" + place);
	//logs(util.inspect(aMaps, false, null, true /* enable colors */));
	console.log("Show:user=" + aMaps[nick]);
	console.log("Show:user=" + aMaps[nick][place]);
	console.log("Show:user=" + aMaps[nick][place].place);
	var	map = aMaps[nick][place];
	var	osx = +piece % 3;
	var	osy = (+piece - osx) / 3;
	var	y = 0;
	//
	hCtx.clearRect(0, 0, hCanvas.width, hCanvas.height);
	hCtx.fillText('Awesome!', 50, 100);
	//
	osx *= 213;
	osy *= 160;
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
				if(Matrix[y][x] < 10)
					c = Matrix[y][x];
				if(c < 8)
					hCtx.fillStyle = "rgb(" + [(c & 4 ? 255:0), (c & 2 ? 255:0), (c & 1 ? 255:0)].join() + ")";
				else
					hCtx.fillStyle = "rgb(" + (c & 1 ? [192,192,192]:[128,128,128]).join() + ")";
				hCtx.fillRect(x * 64 - osx, y * 64 - osy, 64, 64);
				try { hCtx.drawImage(map.images[0], 24 * +c, 0, 24, 24, x * 8 - osx, y * 8 - osy, 24, 24); } catch(e) { /*console.log(e);*/ }
			} else {
			//if(d > 0 && map.images.length > d) {
				//hCtx.drawImage(map.images[d], x * 24, y * 24);
				hCtx.fillStyle = "red";
				if(Matrix[y][x] > 9)
					hCtx.fillText(plot.charAt(0), x * 64 - osx, y * 64+64 - osy);
			}
			plot = plot.substr(1);
			++ x;
		}
		++ y;
	});
	hGif.addFrame(hCtx);
	hCtx.fillStyle = "rgba(227,167,127,0.75)";
	hCtx.fillRect(PosX * 64, PosY * 64, 64, 64);
	hCtx.beginPath();
	hCtx.strokeStyle = "rgba(127,227,167,0.75)";
	hCtx.rect(PosX * 64 + 16, PosY * 64 + 16, 32, 32);
	hCtx.stroke();
	hGif.addFrame(hCtx);
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
var	pieced;
var	dom;

var	theChat	= [
		{
			nick	:"Нуль-Пост",
			text	:"Добро Пожаловать!",
			time	:"2018/12/09"
		}
	];

const server = http.createServer((req, res) => {
	var	aMaps = {};
	var	picture = unescape(req.url).match(/nick="(.*?)"&post=(\d)(?:&piece=(\d))/);
	var	click	= unescape(req.url).match(/\/(\d)(\d)/);
	var	choice	= unescape(req.url).match(/\/(\d)/);
	var	chat	= unescape(req.url).match(/chat(?:=(.*))?/);
	console.log(req.url);
	if(picture) {
		console.log("hXML.open::get?nick::" + picture[1] + "//" + picture[2] + " // " + picture[3]);
		hXML.open("GET", phorum, false);
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
			pieced = picture[3];
			pictun = picture[2];
			nickun = picture[1];
			dom = new JSDOM(hXML.responseText);
			var	hSecret = dom.window.document;
				console.log(`OnLoad:user=${nickun};map=${pictun};secret=${dom}:${hSecret}`);
				var tmp = GetUp(hSecret);
				aMaps = tmp;
				try {
					var	hGif = new hGIF(640, 640);
					hGif.createReadStream().pipe(res);
					hGif.start();
					hGif.setRepeat(0);
					hGif.setDelay(500);
					hGif.setQuality(10);
					showMap(aMaps, nickun, pictun, pieced=0, hGif);
					res.statusCode = 200;
					res.setHeader('Content-Type', 'image/gif');
					hGif.finish();
				} catch(e) {
					res.statusCode = 404;
					res.end(e);
				};
			res.statusCode = 200;
			//res.setHeader('Content-Type', 'image/png');
			//hCanvas.pngStream().pipe(res);
		}
	} else
	if(click) {
		res.statusCode = 302;
		res.setHeader("Location", "https://gamedev.ru/pages/nullpost/play");
		if(PosX != click[2] || PosY != click[1])
			PosX = click[2], PosY = click[1];
		else
			Matrix[PosY][PosX] = (Matrix[PosY][PosX] + 1) % 11;
		res.end();
	} else
	if(choice) {
		res.statusCode = 302;
		res.setHeader("Location", "https://gamedev.ru/pages/nullpost/play");
		Matrix[PosY][PosX] = +choice[1];
		res.end();
	} else
	if(chat) {
		if(chat[1]) {
			theChat.push({
				nick	:"guest",
				text	:chat[1],
				time	:(new Date()).toUTCString()
			});
			if(theChat.length > 10)
				theChat.splice(1, 1);
			res.statusCode = 302;
			res.setHeader("Location", "https://gamedev.ru/pages/nullpost/play");
			res.end();
		} else {
			var	tmp = [];
			theChat.forEach(function(msg) {
				tmp.push("" + msg.time + "|«" + msg.nick + "»:" + msg.text);
			});
			res.statusCode = 200;
			res.setHeader("Content-Type", "text/plain; charset=utf-8");
			res.end(tmp.join("\r\n"));
		}
	} else {
		res.statusCode = 404;
		res.setHeader('Content-Type', 'image/png');
		res.end();
	}
});
server.listen(port, hosting, () => {
  console.log(`Server running at http://${hosting}:${port}/`);
});
