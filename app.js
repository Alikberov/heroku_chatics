const	log	= console.log;

const	Owner	= "Alikberov";
const	images	= "http://www.dropbox.com/s/0di1pktgtrl3xex/NullWall.png?raw=1";
const	sprites	= "./collection.png";
const	config	= "https://gamedev.ru/pages/nullpost/forum/?id=240744";
const	phorum	= "https://gamedev.ru/pages/nullpost/forum/?id=240744#m1";
const	hosting	= "";
const	port	= process.env.PORT || 5000;

log(`Start at "http://${hosting}:${port}/" for parse "${phorum}"`);

var	eTimes	= 0;	// Error Times
var	eBits	= 0;	// Error Flags
var	ePos	= 1;	// Error Position

//	Extension of "require"
function requiry(name) {
	try {
		var	imports	= require(name);
		log(`module "${name}" is loaded...`);
		ePos	<<= 1;
		return	imports;
	} catch(e) {
		var	error	= `module "${name}" not found!!!`;
		log(error);
		eBits	|= ePos;
		ePos	<<= 1;
		eTimes	++;
		return	false;
	}
}

const	{iconv, String}			= requiry("./stringex");
const	datefmt				= requiry("dateformat");
const	xmlhttprequest			= requiry("xmlhttprequest");
const	htmlparser			= requiry("htmlparser");
const	{jsdom, JSDOM}			= requiry("jsdom");
const	{createCanvas, loadImage}	= requiry("canvas");
const	gifencoder			= requiry("gifencoder");
const	firebase			= requiry("firebase");
//const	sys		= require('sys');
const	https				= requiry("https");
const	http				= requiry("http");
const	util				= requiry("util");
//const	iconv				= requiry("iconv-lite");

Object.defineProperty(
	String.prototype, "win1251", {
		get: function () {
			return	iconv.decode(Buffer.from(this, "binary"), "utf8").toString();
		}
	}
);

var	logs;

const	Canvas = require(logs = 'canvas');
log(`require("${logs}") is ` + (Canvas ? "loaded..." : "fails."));
if(!Canvas)
	return 7;

const	XMLHttpRequest = xmlhttprequest.XMLHttpRequest;
const	hXML	= new XMLHttpRequest();
//const	{JSDOM}	= jsdom;

log(`Define the HTML-Parser...`);
var	handler = new htmlparser.DefaultHandler(function(error, dom) {
	if(error) {
		log("Parse error...");
		log(error);
	} else {
		log("Parsed - " + dom.length);
		log(`${dom}`);
		//console.log(util.inspect(dom, false, null, true /* enable colors */));
	}
});

log(`Binding the HTML-Parser...`);
const	parser = new htmlparser.Parser(handler);

var	info;

log(`Create Canvas...`);
const	hCanvas = createCanvas(640, 640);
log(`Get 2D-Context...`);
const	hCtx = hCanvas.getContext('2d');

var	Config	= {};
var	Matrix	= [];

var	i, j;

for(i = 0; i < 100; ++ i) {
	Matrix[i] = [];
	for(j = 0; j < 100; ++ j)
		Matrix[i][j] = 10;
}

var	app = firebase.initializeApp(
	{
		apiKey: "AIzaSyDj--njV63QvHG_R7Ov0pP3VXijKJoUx44",
		authDomain: "null-post.firebaseapp.com",
		databaseURL: "https://null-post.firebaseio.com",
		projectId: "null-post",
		storageBucket: "null-post.appspot.com",
		messagingSenderId: "149431388574"
	}
);
var	database = firebase.app().database();
var	hAdvision = database.ref("advision");
var	szAdvision = "";

hAdvision.on("value",
	function(snap) {
		szAdvision = snap.val();
		log(`Advision changed…`);
	}
);
var	hWin1251 = database.ref("win1251");
var	_Win1251 = new Function("text", "iconv", "return text.win1251");

var	theLogins = [];

hWin1251.on("value",
	function(snap) {
		try {
			var	tmp = new Function("text", "iconv", snap.val());
			_Win1251 = tmp;
			log(`Russian changed…`);
		} catch(e) {
			log(`Win1251:${e}`);
		}
	}
);

var	LoadUser = null;

function ReadUser() {
	while(theLogins.length > 0) {
		LoadUser = database.ref("users/" + theUsers[theLogins[0]].nick);
		theUsers[theLogins[0]].ref = LoadUser;
		LoadedUser = function(snap) {
			var	v = snap.val();
			if(null == v) {
				theUsers[this.theIP].reach = {
					visits	:0,
					scores	:Math.floor(Math.random() * 100)
				};
				log(`// User «${theUsers[this.theIP].nick}» created...`);
				this.ref.set(theUsers[this.theIP].reach);
			} else {
				theUsers[this.theIP].reach = v;
				log(`// User «${theUsers[this.theIP].nick}» loaded...`);
			}
		}
		LoadedUser.theIP = theLogins[0];
		LoadedUser.ref = LoadUser;
		LoadUser.on("value", LoadedUser.bind(LoadedUser));
		theLogins.shift();
	}
}

var	hImage	= null;
var	hSprites= null;

loadImage(sprites).then((image) => {
	hSprites = image;
	log(`// Sprites loaded...`);
});

function loadImages(image, err) {
	if(image != null) {
		hImage = image;
		log(`// Image ${image} ${image.width}x${image.height} loaded from DropBox...`);
	} else
		log(err);
};
/*function find_link(link, callback) {
  var root ='';
	var	dlink;
  var f = function(link) {
	  dlink = link;
	var h = link.charAt(4) == 's' ? https : http;
	  logs(`FindLink "${link}"`);
    h.get(link, function(res) {
      if(res.statusCode == 301) {
        f(res.headers.location);
      } else {
        callback(link.substr(0,4) == 'http' ? link : dlink);
      }
    });
 }
  f(link, callback);
}
*/loadImage("./NullWall_1.png").then(loadImages);

function downloadImage(url, cb) {
	find_link(url, function(link) {
		log(`The_Link "${link}"`);
		var h = link.charAt(4) == 's' ? https : http;
    h.get(link)
    .on('response', function(res) {

      // http://stackoverflow.com/a/14269536/478603
      var chunks = [];
      res.on('data', function(data) {
        chunks.push(data);
      });
      res.on('end', function() {
        var img = new Canvas.Image();
        img.src = Buffer.concat(chunks);
        cb(img);
      });

    })
    .on('error', function(err) {
      cb(null, err);
    });
	});
}

//downloadImage(images, loadImages);

function LoginUser(hSecret, PassWord) {
	var	html;
	var	aMaps = {};
	var	res	= [];
	var	Section	= "";
	var	theUser	= null;
	hSecret
	.querySelector("#main_body")
	.querySelectorAll(".mes")
	.forEach
	(function(hDiv) {
		if("DIV" == hDiv.tagName) {
			hCaption = hDiv.querySelector("table").rows[0].cells;
			hUser = hCaption[0].querySelector("a");
			nick = hUser.textContent;
			log(`// Login mode: User "${nick}"`);
			var	posts = hDiv.querySelectorAll("div.block");
			for(var i = 0; i < posts.length; ++ i) {
				if(posts[i].textContent.indexOf(PassWord) >= 0) {
					theUser = nick;
					log(`// Login for "${nick}"`);
					return;
				}
			}
		}
	});
	return theUser;
}

function LoadConfig(hSecret) {
	var	html;
	var	aMaps = {};
	var	res	= [];
	var	Section	= "";
	hSecret
	.querySelector("#main_body")
	.querySelectorAll(".mes")
	.forEach
	(function(hDiv) {
		if("DIV" == hDiv.tagName) {
			hCaption = hDiv.querySelector("table").rows[0].cells;
			hUser = hCaption[0].querySelector("a");
			nick = hUser.textContent;
			if(nick != Owner)
				return;
			hDiv
			.querySelectorAll("pre")
			.forEach
			(function(hPre) {
				pr = hPre.textContent;
				if(pr) {
					log(pr);
					pr = pr.match(/(\[config]([^\0]+?)\[\/config])+/gm);
					if(pr)
						pr.forEach
						(function(map) {
							log(map);
							mp = map.match(/(\[config]([^\0]+)\[\/config])+/m);
							log(mp);
							if(mp) {
								mp[2].split(/\r?\n/)
								.forEach(function(s) {
									log(`// "${s}"`);
									info = s.split(/\t+/);
									if("" != info[0]) {
										Section = info[0];
										if(!(Section in Config))
											Config[Section] = [];
										if(info[1])
											log(`// ${info[1]}`);
									} else
									if(info[1] && Section != "" && Section in Config) {
										Config[Section].push(info[1]);
									}
								});
							}
						});
				} else
					;//console.log(pr);
			});
		}
	});
}

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
								design = mp[3].split(/\r?\n/).slice(1).join("\r\n");
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

var	Locations =
	{
		common:
		{
			cell_x	:5,
			cell_y	:5,
			colour	:9
		}
	};

function showWorld(aMaps, nick, place, piece, hGif) {
	//var	nick = info[0];
	//var	place = info[1];
	hCtx.save();
	hCtx.clearRect(0, 0, hCanvas.width, hCanvas.height);
	hCtx.fillText("Error!", 50, 100);
	try {
	console.log("Show:user=" + nick + ";map=" + place);
	//log(util.inspect(aMaps, false, null, true /* enable colors */));
	console.log("Show:user=" + aMaps[nick]);
	console.log("Show:user=" + aMaps[nick][place]);
	console.log("Show:user=" + aMaps[nick][place].place);
	} catch(e) {
		hGif.addFrame(hCtx);
		hCtx.fillText("Error!", 50, 100);
		hCtx.fillText(e, 50, 200);
		hGif.addFrame(hCtx);
		hCtx.restore();
		return;
	}
	var	map = aMaps[nick][place];
	var	osx = +piece % 3;
	var	osy = (+piece - osx) / 3;
	var	y;
	//
	//
	osx *= 128;
	osy *= 64;
	//
	var	flash = false;
	do {
		hCtx.clearRect(0, 0, hCanvas.width, hCanvas.height);
		y = 0;
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
					if(!(flash && y == Locations.common.cell_y && x == Locations.common.cell_x))
						try {
							hCtx.drawImage
								(hSprites
								,256 * Math.floor(Math.random() * 4)
								,256 * +c, 256, 256
								,160 + x * 64 - y * 64 - osx
								,160 + y * 32 + x * 64 - osy, 256, 256
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
	} while(flash = !flash);
/*	hGif.addFrame(hCtx);
	hCtx.fillStyle = "rgba(227,167,127,0.75)";
	hCtx.fillRect(PosX * 64, PosY * 64, 64, 64);
	hCtx.beginPath();
	hCtx.strokeStyle = "rgba(127,227,167,0.75)";
	hCtx.rect(PosX * 64 + 16, PosY * 64 + 16, 32, 32);
	hCtx.stroke();*/
	hCtx.restore();
//	hGif.addFrame(hCtx);
	//Dropbox.save("/", "nullpost.jpeg", "");
}
function bashMap(cells) {
	var	res	= "";
	var	str;
	var	i, c;
	var	y = 0;
	cells.slice(0, 10).forEach
	(function(row) {
		str = "";
		for(i = 0; i < row.length; ++ i) {
			switch(row[i]) {
			case 0:	str += `\x1b[30;40m`; break;
			case 1: str += `\x1b[31;40m`; break;
			case 2: str += `\x1b[31;43m`; break;
			case 3: str += `\x1b[33;40m`; break;
			case 4: str += `\x1b[32;40m`; break;
			case 5: str += `\x1b[36;40m`; break;
			case 6: str += `\x1b[34;40m`; break;
			case 7: str += `\x1b[35;40m`; break;
			case 8: str += `\x1b[37;47m`; break;
			case 9: str += `\x1b[37;40m`; break;
			}
			str += `${Locations.common.cell_x == i && Locations.common.cell_y == y ? "\u2592\u2592\u2592" : "\u2593\u2593\u2593"}`;
		}
		res += `\r\n` + str + `\x1B[39;49m`;
		res += `\r\n` + str + `\x1B[39;49m`;
		res += `\r\n` + str + `\x1B[39;49m`;
		++ y;
	});
	log(`${res}`)
}
var	ansi;
function showMap(aMaps, nick, place, piece, hGif) {
	//var	nick = info[0];
	//var	place = info[1];
	hCtx.save();
	hCtx.clearRect(0, 0, hCanvas.width, hCanvas.height);
	try {
	console.log("Show:user=" + nick + ";map=" + place);
	//log(util.inspect(aMaps, false, null, true /* enable colors */));
	console.log("Show:user=" + aMaps[nick]);
	console.log("Show:user=" + aMaps[nick][place]);
	console.log("Show:user=" + aMaps[nick][place].place);
	} catch(e) {
		hGif.addFrame(hCtx);
		hCtx.fillText("Error!", 50, 100);
		hCtx.fillText(e, 50, 200);
		hGif.addFrame(hCtx);
		hCtx.restore();
		return;
	}
	var	map = aMaps[nick][place];
	var	osx = +piece % 3;
	var	osy = (+piece - osx) / 3;
	var	y;
	//
	//
	osx *= 213;
	osy *= 320;
	//
	var	flash	= false;
	ansi	= [];
	do {
		hCtx.clearRect(0, 0, hCanvas.width, hCanvas.height);
		y = 0;
		map
		.design.split(/\r?\n/)
		.forEach
		(function(plot) {
			var	x = 0;
			ansi.push([]);
			while(plot.length) {
				var	c = plot.charAt(0);
				var	d = plot.charCodeAt(0) - 64;
				if(isFinite(c)) {
					if(Matrix[y][x] < 10)
						c = Matrix[y][x];
					ansi[y][x] = +c;
					if(c < 8)
						hCtx.fillStyle = "rgb(" + [(c & 4 ? 255:0), (c & 2 ? 255:0), (c & 1 ? 255:0)].join() + ")";
					else
						hCtx.fillStyle = "rgb(" + (c & 1 ? [192,192,192]:[128,128,128]).join() + ")";
					//hCtx.fillRect(x * 64 - osx, y * 64 - osy, 64, 64);
					//if(!(flash && y == Locations.common.cell_y && x == Locations.common.cell_x))
					if((flash && y == Locations.common.cell_y && x == Locations.common.cell_x)) {
						if(c != Locations.common.colour)
							c = Locations.common.colour;
						else
							c = 0;
					}
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
	} while(flash = !flash);
/*	hCtx.fillStyle = "rgba(227,167,127,0.75)";
	hCtx.fillRect(Locations.common.cell_x * 64, Locations.common.cell_y * 64, 64, 64);
	hCtx.beginPath();
	hCtx.strokeStyle = "rgba(127,227,167,0.75)";
	hCtx.rect(Locations.common.cell_x * 64 + 16, Locations.common.cell_y * 64 + 16, 32, 32);
	hCtx.stroke();
	hGif.addFrame(hCtx);*/
	hCtx.restore();
	//Dropbox.save("/", "nullpost.jpeg", "");
}

function ParseLogin(PassWord) {
	console.log(`// Find user in phorum...`);
	hXML.open("GET", Config.ChatLogin, false);
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
		var	dom = new JSDOM(hXML.responseText);
		console.log(`// Search for user`);
		return LoginUser(dom.window.document, PassWord);
	}
}

function ParseConfig() {
	console.log(`// Reload the Config from Phorum...`);
	hXML.open("GET", config, false);
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
		var	dom = new JSDOM(hXML.responseText);
		console.log(`// Parse the Phorum`);
		LoadConfig(dom.window.document);
		return true;
	}
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
hCtx.font = '16px "Impact"';
hCtx.rotate(0.1*0);
 
// Draw line under text
var text = hCtx.measureText('Awesome!')
hCtx.strokeStyle = 'rgba(0,0,0,0.5)'
hCtx.beginPath()
hCtx.lineTo(50, 102)
hCtx.lineTo(50 + text.width, 102)
hCtx.stroke()

var	szChatLast	= `This is last line from NullPost-chat…`;

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
			time	:datefmt(new Date(), "(.dd)(|m)/HH(~(^MM))(.ss)").shifted
		}
	];
var	theUsers = {};

ParseConfig();
//log(util.inspect(Config, false, null, true));

var	theValues = {
		"Nick"		:`nick`,
		"IP"		:`req.connection.remoteAddress`,
		"Guests"	:`nUsers`,
		"Scores"	:`theUsers[theIP].reach ? theUsers[theIP].reach.scores : "---"`,
		"Visits"	:`theUsers[theIP].reach ? theUsers[theIP].reach.visits : "---"`,
		"ChatLast"	:`szChatLast`
	};
var	theValuex = [];

for(var id in theValues)
	theValuex.push(id);
theValuex = new RegExp("\\(\\\\(" + theValuex.join("|") + ")\\)", "gm");

const server = http.createServer((req, res) => {
	var	requrl	= unescape(req.url).replace(/\+/g, " ");
	//
	var	login	= requrl.match(/login/);
	var	advision= requrl.match(/advision/);
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
	var	fail	= false;
	var	time	= datefmt(new Date(),
			("ChatTimeStamp" in Config
			 	? Config.ChatTimeStamp
			 	: "(_dd)(|m)/HH(^MM)"
			 )).shifted;
	//
	if(theIP in theUsers)
		nick = theUsers[theIP].nick;
	else {
		theUsers[theIP] = {
			nick	:(nick = "guest_" + datefmt(new Date(), "HHMMss")),
			map	:null,
			login	:Math.floor(Math.random() * 87655 + 12345),
			reach	:null
		};
		log(`// New user #${++ nUsers} is connected: ${nick}`);
	}
	if(theUsers[theIP].login > 0 && ("ChatLogin" in Config)) {
		tmp = ParseLogin("" + theUsers[theIP].login);
		if(tmp && tmp.length > 2) {
			log(`// User "${theUsers[theIP].nick}" is founded as "${tmp}"`);
			nUsers = 1;
			for(var id in theUsers) {
				if(theUsers[id].nick == nick && id != theIP)
					delete theUsers[id];
				else
					++ nUsers;
			}
			theUsers[theIP].nick = tmp;
			theUsers[theIP].login = -theUsers[theIP].login;
			theUsers[theIP].reach = null;
			theLogins.push(theIP);
			ReadUser();
			nick = tmp;
		}
	}
	log(req.url);
	if(login) {
		res.statusCode = 200;
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		log(`Login:#${theUsers[theIP].login} for «${nick}»`);
		if(theUsers[theIP].login > 0)
			theUsers[theIP].login = Math.floor(Math.random() * 87655 + 12345);
		res.end(theUsers[theIP].login > 0 ? theUsers[theIP].login.toString() : `Не требуется: Вы - «${nick}»!`);
	} else
	if(advision) {
		res.statusCode = 200;
		res.setHeader("Content-Type", "text/html; charset=utf-8");
		str = szAdvision;
		str = str.replace(theValuex, function(s, t) {
			try {
				return eval(theValues[t]);
			} catch(e) {
				return "---";
			}
		});
		res.end(str);
	} else
	if(picture) {
		log("hXML.open::get?nick::" + picture[1] + "//" + picture[2] + " // " + picture[3]);
		if(!dom)
			if(!ParsePhorum())
				return 10;
		hCtx.fillStyle = 'red';
		hCtx.fillRect(0, 0, hCanvas.width, hCanvas.height);
			console.log(`OnLoad:user=${nickun};map=${pictun};secret=${dom}:${hSecret}`);
		var tmp = GetUp(hSecret);
		aMaps = tmp;
		try {
			var	hGif = new gifencoder(640, 640);
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
			fail = e;
		}
		try {
			if(fail) {
				res.statusCode = 404;
				res.setHeader("Content-Type", "text/plain");
				//hCanvas.pngStream().pipe(res);
				res.end(fail);
			} else
				res.statusCode = 200;
		} catch(e) {
			log(`${e}`);
		}
	} else
	if(click) {
		Locations.common.cell_y = +click[1];
		Locations.common.cell_x = +click[2];
		Matrix
			[Locations.common.cell_y]
			[Locations.common.cell_x]
			= Locations.common.colour;
		res.statusCode = 302;
		res.setHeader("Location", "https://gamedev.ru/pages/nullpost/play");
		res.end();
	} else
	if(choice) {
		Locations.common.colour = +choice[1];
		res.statusCode = 302;
		res.setHeader("Location", "https://gamedev.ru/pages/nullpost/play");
		res.end();
	} else
	if(chat) {
		if(chat[1]) {
			if(chat[1] == "!image") {
				//loadImage(images).then(loadImages);
				downloadImage(images, loadImages);
			}
			if(chat[1] == "!remap") {
				ParsePhorum();
				theChat.push({
					nick	:"Server",
					text	:"!remap",
					time	:time
				});
			}
			if(chat[1] == "!config") {
				ParseConfig();
				theChat.push({
					nick	:"Server",
					text	:"!config",
					time	:time
				});
			}
			if(chat[1] == "!login" && theUsers[theIP].login == 0) {
				if(("ChatLogin" in Config) && Config.ChatLogin) {
					theUsers[theIP].login = Math.floor(Math.random() * 87655 + 12345);
					res.statusCode = 307;
					res.setHeader("Location", Config.ChatLogin + "&YourPassWord=" + theUsers[theIP].login);
					res.end();
					return;
				} else
					theChat.push({
						nick	:"Error",
						text	:"Not supported",
						time	:time
					});
			}
			if(chat[1].substr(-1) == ":") {
				var	cells = chat[1].match(/(\d{3})+/g);
				if(cells) {
					cells.forEach
					(function(cell) {
						var	xyz = cell.split("");
						Matrix[+xyz[1]][+xyz[0]] = +xyz[2];
					});
					log(`// Painting by ${nick}`);
				} else {
					log(`// User ${nick} is now ${chat[1]}`);
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
				try {
					theChat.push({
						nick	:nick,
						text	:_Win1251(chat[1], iconv),
						time	:time
					});
				} catch(e) {
					log(`// Chat crash on "${chat[1]}"`);
					log(e);
				}
			if(theChat.length > 10)
				theChat.splice(1, 1);
			res.statusCode = 307;
			res.setHeader("Location", "https://gamedev.ru/pages/nullpost/play");
			res.end();
		} else {
			var	tmp = [];
			theChat.forEach(function(msg) {
				tmp.push(szChatLast = "" + msg.time + "|«" + msg.nick + "»:" + msg.text);
			});
			if(("ChatPrompt" in Config) && Config.ChatPrompt.length)
				Config
				.ChatPrompt
				.forEach(
				function(str) {
					/*str = str.replace(/\(\\Nick\)/g, nick);
					str = str.replace(/\(\\Guests\)/g, nUsers);
					str = str.replace(/\(\\IP\)/g, req.connection.remoteAddress);*/
					str = str.replace(theValuex, function(s, t) {
						try {
							return eval(theValues[t]);
						} catch(e) {
							return "---";
						}
					});
					/*if(theUsers[theIP].reach) {
						str = str.replace(/\(\\Scores\)/g, theUsers[theIP].reach.scores);
						str = str.replace(/\(\\Visits\)/g, theUsers[theIP].reach.visits);
					} else {
						str = str.replace(/\(\\(Scores|Visits)\)/g, "---");
					}*/
					tmp.push(str.shifted);
				});
			//tmp.push(`Your Nick is ${nick}`);
			//tmp.push(`Total users is ${nUsers}`);
			//tmp.push(`Your IP is ${req.connection.remoteAddress}`);
			if(theUsers[theIP].login >= 0 && ("ChatLogin" in Config) && Config.ChatLogin) {
				theUsers[theIP].login = Math.floor(Math.random() * 87655 + 12345);
				tmp.push(`Логин-код для форума:${theUsers[theIP].login}`);
			}
			res.statusCode = 200;
			res.setHeader("Content-Type", "text/html; charset=utf-8");
			res.write(`<html><head>\r\n`);
			res.write(`<meta http-equiv='refresh' content='900'>\r\n`);
			res.write(`<style>blink { position:absolute; } </style></head>\r\n`);
			res.write(`<body><pre>`);
			res.write(tmp.join("\r\n")
				  //.replace(/&/g, "№")
				  //.replace(/</g, "«")
				  //.replace(/>/g, "»")
				  //.replace(/\.+/g, "…")
				  //.replace(/\*/g, "×")
				  //.replace(/\|/g, "±")
				  //.replace(/\\/g, "÷")
				 );
			res.write("</pre>");
			if(theUsers[theIP].login >= 0 && ("ChatLogin" in Config) && Config.ChatLogin) {
				res.write(`<a target='_blank' href='${Config.ChatLogin + '?' + theUsers[theIP].login}'>Залогиниться</a>`);
			}
			try { bashMap(ansi); } catch(e) { console.log(e); }
			res.end("</body>");
		}
	} else {
		res.statusCode = 404;
		res.setHeader('Content-Type', 'image/png');
		res.end();
	}
});
server.listen(port, hosting, () => {
	log(`Server running at http://${hosting}:${port}/`);
});
