const	logs	= console.log;

const	sprites	= "./collection.png";
const	phorum	= "https://gamedev.ru/pages/nullpost/forum/?id=240744#m1";
const	hosting	= "";
const	port	= process.env.PORT || 5000;

var		log;

Object.defineProperty(
	String.prototype, "shifted", {
		//	"3(_14159)".shifted == "3₁₄₁₅₉"
		//	"23(^59)30".shifted == "23⁵⁹30"
		//	"31(|12)18".shifted == "31Ⅻ18"
		get: function () {
			return this
				.replace(
					/\((_|\^|\|)(\d+)\)/gm
					,function(match, prefix, numbers) {
						var	pattern = {
								"_"	:"₀₁₂₃₄₅₆₇₈₉",
								"^"	:"⁰¹²³⁴⁵⁶⁷⁸⁹",
								"|"	:"ØⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩⅪⅫ"
							}[prefix].split("");
						return	numbers
							.replace(
								"|" == prefix
									? (/10|11|12|\d/g)
									: (/\d/g)
								,function(n) {
									return	pattern[n];
								}
							)
						;
					}
				)
			;
		}
	}
);

logs(`Start at "http://${hosting}:${port}/" for parse "${phorum}"`);

//const	sys		= require('sys');
const	http	= require("http");
const	util	= require("util");
const	iconv	= require("iconv-lite");

Object.defineProperty(
	String.prototype, "win1251", {
		get: function () {
			return	iconv.decode(Buffer.from(this, "binary"), "utf8").toString();
		}
	}
);

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

const	dateFmt = require(log = 'dateformat');
logs(`require("${log}") is ` + (dateFmt ? "loaded..." : "fails."));
if(!dateFmt)
	return 6;

const	XMLHttpRequest = XMLhttprequest.XMLHttpRequest;
const	hXML	= new XMLHttpRequest();
const	{JSDOM}	= jsdom;

logs(`Define the HTML-Parser...`);
var	handler = new htmlparser.DefaultHandler(function(error, dom) {
	if(error) {
		console.log("Parse error...");
		console.log(error);
	} else {
		console.log("Parsed - " + dom.length);
	}
});

logs(`Binding the HTML-Parser...`);
const	parser = new htmlparser.Parser(handler);

var	info;

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

var	hImage	= null;
var	hSprites= null;

loadImage(sprites).then((image) => {
	hSprites = image;
	logs(`// Sprites loaded...`);
});

loadImage("NullWall.png").then((image) => {
	hImage = image;
	logs(`// Image loaded...`);
});

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
			//console.log(pics);
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
								//console.log("::PARSE::");
								//console.log(".design="+design);
								//console.log(".images="+pics);
								//console.log("--PARSE--");
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

function showWorld(aMaps, nick, place, piece, hGif) {
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
	hCtx.save();
	hCtx.clearRect(0, 0, hCanvas.width, hCanvas.height);
	hCtx.fillText("Error!", 50, 100);
	//
	osx *= 256;
	osy *= 256;
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
				//hCtx.fillRect(x * 64 - osx, y * 64 - osy, 64, 64);
				try {
					hCtx.drawImage
						(hSprites
						,256 * Math.floor(Math.random() * 4)
						,256 * +c, 256, 256
						,160 + x * 128 - y * 128 - osx
						,160 + y * 128 + x * 128 - osy, 256, 256
						);
				} catch(e) { console.log(e); }
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
	hCtx.restore();
//	hGif.addFrame(hCtx);
	//Dropbox.save("/", "nullpost.jpeg", "");
}

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
	hCtx.save();
	hCtx.clearRect(0, 0, hCanvas.width, hCanvas.height);
	hCtx.fillText("Error!", 50, 100);
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
				//hCtx.fillRect(x * 64 - osx, y * 64 - osy, 64, 64);
				try { hCtx.drawImage(hImage, 128 * +c, 0, 128, 128, x * 64 - osx - 64, y * 64 - osy - 64, 128, 128); } catch(e) { console.log(e); }
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
	hCtx.restore();
	hGif.addFrame(hCtx);
	//Dropbox.save("/", "nullpost.jpeg", "");
}

function ParsePhorum() {
	if(!dom)
		console.log(`// First time for Phorum parse`);
	else
		console.log(`// Reload the Phorum`);
	hXML.open("GET", phorum, false);
	hXML.send();
	if(200 != hXML.status) {
		console.log(hXML.status + ": " + hXML.statusText);
		res.statusCode = 200;
		res.setHeader("Content-Type", "text/plan");
		res.end(hXML.status + ": " + hXML.statusText);
		return false;
	} else {
		console.log(`// Parse the Phorum page...`);
		parser.parseComplete(hXML.responseText);
		console.log(`// Calling JSDOM...`);
				//var		document = parser.Parse(hXML.responseText);
				//sys.puts(sys.inspect(handler.dom, false, null));
		dom = new JSDOM(hXML.responseText);
		hSecret = dom.window.document;
		console.log(`// Parse the Phorum`);
		aMaps = GetUp(hSecret);
		return true;
	}
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
var	hSecret;
var	aMaps = {};
var	nUsers = 0;
var	theChat	= [
		{
			nick	:"Нуль-Пост",
			text	:"Добро Пожаловать!",
			time	:dateFmt(new Date(), "(_dd)(|m)yyyy/HH(^MM)(_ss)").shifted
		}
	];
var	theUsers = {};

const server = http.createServer((req, res) => {
	var	requrl	= unescape(req.url).replace(/\+/g, " ");
	//
	var	picture = requrl.match(/nick="(.*?)"&post=(\d)(?:&piece=(\d))/);
	var	ortho	= requrl.match(/ortho/);
	var	click	= requrl.match(/\/(\d)(\d)/);
	var	choice	= requrl.match(/\/(\d)/);
	var	chat	= requrl.match(/chat(?:=(.*))?/);
	//
	var	ipAddr	= req.headers["x-forwarded-for"];
	if(ipAddr) 
		ipAddr	= ipAddr.split(",").pop();
	else
		ipAddr	= req.connection.remoteAddress;
	var	theIP	= ipAddr.split(/:+/).pop().split(".").join("");
	var	nick;
	var	time	= dateFmt(new Date(), "(_dd)(|m)/HH(^MM)").shifted;
	//
	if(theIP in theUsers)
		nick = theUsers[theIP].nick;
	else {
		theUsers[theIP] = {
			nick	:(nick = "guest_" + dateFmt(new Date(), "HHMMss")),
			map	:null
		};
		console.log(`// New user #${++ nUsers} is connected: ${nick}`);
	}
	console.log(req.url);
	if(picture) {
		console.log("hXML.open::get?nick::" + picture[1] + "//" + picture[2] + " // " + picture[3]);
		if(!dom)
			if(!ParsePhorum())
				return 10;
		hCtx.fillStyle = 'red';
		hCtx.fillRect(0, 0, hCanvas.width, hCanvas.height);
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
			pieced = picture[3];
			pictun = picture[2];
			nickun = picture[1];
			if(ortho)
				showWorld(aMaps, nickun, pictun, pieced, hGif);
			else
				showMap(aMaps, nickun, pictun, pieced, hGif);
			res.statusCode = 200;
			res.setHeader("Content-Type", "image/gif");
			hGif.finish();
		} catch(e) {
			res.statusCode = 404;
			res.setHeader("Content-Type", "text/plain");
				//hCanvas.pngStream().pipe(res);
			res.end(e);
		};
		res.statusCode = 200;
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
			if(chat[1] == "!remap")
				ParsePhorum();
			if(chat[1].substr(-1) == ":") {
				var	cells = chat[1].match(/(\d{3})+/g);
				if(cells) {
					cells.forEach
					(function(cell) {
						var	xyz = cell.split("");
						Matrix[+xyz[1]][+xyz[0]] = +xyz[2];
					});
					logs(`// Painting by ${nick}`);
				} else {
					console.log(`// User ${nick} is now ${chat[1]}`);
					var	tmp = nick;
					nick = chat[1].split(/[^-A-Z_a-z0-9.]/)[0];
					theChat.push({
						nick	:tmp,
						text	:nick + ":",
						time	:time
					});
					theUsers[theIP].nick = nick;
				}
			} else
				theChat.push({
					nick	:nick,
					text	:chat[1].win1251,
					time	:time
				});
			if(theChat.length > 10)
				theChat.splice(1, 1);
			res.statusCode = 307;
			res.setHeader("Location", "https://gamedev.ru/pages/nullpost/play");
			res.end();
		} else {
			var	tmp = [];
			theChat.forEach(function(msg) {
				tmp.push("" + msg.time + "|«" + msg.nick + "»:" + msg.text.shifted);
			});
			tmp.push(`Your Nick is ${nick}`);
			tmp.push(`Total users is ${nUsers}`);
			tmp.push(`Your IP is ${req.connection.remoteAddress}$`);
			res.statusCode = 200;
			res.setHeader("Content-Type", "text/html; charset=utf-8");
			res.write("<html><meta http-equiv='refresh' content='900'><body><pre>");
			res.write(tmp.join("\r\n").replace(/&/g, "№").replace(/</g, "«").replace(/>/g, "»").replace(/\.+/g, "…"));
			res.end("</pre></body>");
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
