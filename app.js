var	Config	= {
	advision	:"",
	chat		:{
				body	:[
						`<html><head>`,
						`<meta http-equiv='refresh' content='900'>`,
						`<style>em { position:absolute; } </style></head>`,
						`<body><pre>(\\ChatLogs)</pre>`,
						`(\\ChatNotice)</body>`
					].join("\r\n"),
				prompt	:[
						`Your Nick is (\\Nick)`,
						`Now is (\\Guests) users in chat`
					].join("\r\n"),
			},
	ChatLogin	:"https://gamedev.ru/pages/nullpost/forum/?id=240914",
	images		:{
				blank	:undefined,
				boxes	:undefined,
				orthos	:undefined,
				screen	:undefined
			},
	login		:"<a href='https://gamedev.ru/pages/nullpost/forum/?id=240914'>Залогиниться</a>",
	logoff		:"Используйте код (\\PassWord) для идентификации",
	logon		:[
				`<head\t\t\t\t\t\t\t\t\t\t\t  >`,
				`<meta content='text/html; charset=UTF-16'\t\thttp-equiv='Content-Type'\t />`,
				`</head\t\t\t\t\t\t\t\t\t\t\t  >`,
				`<body>`,
				`Вы идентифицированы как «(\\Nick)» ((\\Name))`,
				`</body>`
			].join("\r\n"),
	timefmt		:`(.dd)(|m)/HH(!(^MM))(.ss)`
};

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
const	Canvas				= requiry("canvas");
const	gifencoder			= requiry("gifencoder");
const	firebase			= requiry("firebase");
//const	sys		= require('sys');
const	https				= requiry("https");
const	http				= requiry("http");
const	util				= requiry("util");
//const	iconv				= requiry("iconv-lite");
const	bl				= requiry("bl");

Object.defineProperty(
	String.prototype, "win1251", {
		get: function () {
			return	iconv.decode(Buffer.from(this, "binary"), "utf8").toString();
		}
	}
);

var	logs;

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
log(`//Get 2D-Context...`);
const	hCtx = hCanvas.getContext('2d');
log(`////Canvas.imageSmoothingEnabled = ${hCtx.imageSmoothingEnabled}`);
	hCtx.imageSmoothingEnabled = false;
log(`////Canvas.filter = ${hCtx.filter}`);
	hCtx.filter = "none";

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

var	journal	= {
		chatLog	:database.ref("journal/chat/log"),
		pointXY	:database.ref("journal/map/xy"),
		colour	:database.ref("journal/map/colour"),
		user	:database.ref("journal/user"),
		users	:database.ref("journal/users")
};
//////////////////////////////////////////////////////////////////////////////////////////
function HotConfig_Image(image, err) {
	var	info	= `DataBase::«${this.path}${this.branch}» is `;
	if(image != null) {
		info += `Image(${image.width}x${image.height}) - `;
		try {
			hCtx.drawImage(image, 0, 0, 99, 99, 0, 0, 99, 99);
			this.config[this.branch] = image;
			info += `ready`
		} catch(e) {
			info += `${e}`;
		}
	} else
		info += `${err}`;
	log(`${info}…`);
}

function HotConfig_Set(snap) {
	const	max = 24;
	var	s = snap.val();
	var	old = this.config[this.branch];
	var	info	= `DataBase::«${this.path}${this.branch}» is `;
	info += `changed from `;
	if("image" == typeof old)
		info += `changed from Image(${old.width}x${old.height})`
	else
	if("string" == typeof old)
		info += `changed from "${old.substr(0,max)}${old.length > max ? "…" : ""}"`;
	else
	if("number" == typeof old)
		info += `changed from (${old})`;
	else
	if(null == old && s == null)
		info += `steel «${old}»`;
	else
		info += `«${old}»`;
	if("string" == typeof s) {
		if(!s.indexOf("data:image/")) {
			info += ` to Image`;
			loadImage(s).then(
				HotConfig_Image
				.bind(
					{
						config	:this.config,
						branch	:this.branch,
						path	:this.path
					}
				)
			);
		} else {
			info += ` to "${s.substr(0,max)}${old.length > max ? "…" : ""}"`;
			this.config[this.branch] = s;
		}
	} else
	if("number" == typeof s) {
		info += ` to (${s})`;
		this.config[this.branch] = s;
	} else
	if(null != old)
		info += ` to lost - ${s}`;
	log(`${info}…`);
}
function HotConfig_Init(map, callback, ref, path) {
	for(var id in map) {
		if("object" != typeof map[id]) {
			log(`${path}${id} binding…`);
			ref.child(id)
			.on("value",
				callback
				.bind(
					{
						config	:map,
						branch	:id,
						path	:path
					}
				)
			);
		} else {
			HotConfig_Init(map[id], callback, ref.child(id), path + id + "/");
		}
	}
}
HotConfig_Init(Config, HotConfig_Set, database.ref("/"), "/");
//////////////////////////////////////////////////////////////////////////////////////////
var	Matrix	= [];

var	i, j;

for(i = 0; i < 100; ++ i) {
	Matrix[i] = [];
	for(j = 0; j < 100; ++ j)
		Matrix[i][j] = 10;
}

var	dbRefs = {
	win1251		:database.ref("win1251"),
	advision	:database.ref("advision"),
	timefmt		:database.ref("timefmt"),
	chatbody	:database.ref("chatbody"),
	logoff		:database.ref("logoff"),
	logon		:database.ref("logon"),
	images_blank	:database.ref("images/blank"),
	images_boxes	:database.ref("images/boxes"),
	images_orthos	:database.ref("images/orthos"),
	images_screen	:database.ref("images/screen")
};
var	hImages = {
	blank	:null,
	boxes	:null,
	orthos	:null,
	screen	:null
};

var	szAdvision = "";
var	szTimeFormat = "(.dd)(|m)/HH(~(^MM))(.ss)";
var	szChatBody = [
		`<html><head>`,
		`<meta http-equiv='refresh' content='900'>`,
		`<style>em { position:absolute; } </style></head>`,
		`<body><pre>(\\ChatLogs)</pre>`,
		`(\\ChatNotice)</body>`
	].join("\r\n");

var	szLogOff = "Используйте код (\\PassWord) для идентификации";
var	szLogOn = [
		`<head\t\t\t\t\t\t\t\t\t\t\t  >`,
		`<meta content='text/html; charset=UTF-16'\t\thttp-equiv='Content-Type'\t />`,
		`</head\t\t\t\t\t\t\t\t\t\t\t  >`,
		`<body>`,
		`Вы идентифицированы как «(\\Nick)» ((\\Name))`,
		`</body>`
	].join("\r\n");

dbRefs.advision.on("value",
	function(snap) {
		var	s = snap.val();
		if(s) {
			szAdvision = s;
			log(`Advision changed…`);
		}
	}
);
dbRefs.timefmt.on("value",
	function(snap) {
		var	s = snap.val();
		if(s) {
			szTimeFormat = s;
			log(`Time-Format changed…`);
		}
	}
);
dbRefs.chatbody.on("value",
	function(snap) {
		var	s = snap.val();
		if(s) {
			szChatBody = s;
			log(`Chat-Body changed…`);
		}
	}
);
dbRefs.logoff.on("value",
	function(snap) {
		var	s = snap.val();
		if(s) {
			szLogOff = s;
			log(`LogOff-message changed…`);
		}
	}
);

dbRefs.logon.on("value",
	function(snap) {
		var	s = snap.val();
		if(s) {
			szLogOn = s;
			log(`LogOn-message changed…`);
		}
	}
);

dbRefs.images_boxes.on("value",
	function(snap) {
		var	s = snap.val();
		log(`images/boxes ${s ? "loaded" : "fault"}...` );
		loadImage(s).then(
			function(image, err) {
				if(image != null) {
					log(`// Image/Boxes ${image} ${image.width}x${image.height} loaded from DataBase...`);
					try {
						hCtx.drawImage(image, 0, 0, 99, 99, 0, 0, 99, 99);
						hImages.boxes = image;
					} catch(e) {
						log(`//Image boxes ${e}`);
					}
				} else
					log(err);
			}
		);
	}
);

dbRefs.images_orthos.on("value",
	function(snap) {
		var	s = snap.val();
		log(`images/orthos ${s ? "loaded" : "fault"}...` );
		loadImage(s).then(
			function(image, err) {
				if(image != null) {
					log(`// Image/orthos ${image} ${image.width}x${image.height} loaded from DataBase...`);
					try {
						hCtx.drawImage(image, 0, 0, 99, 99, 0, 0, 99, 99);
						hImages.orthos = image;
					} catch(e) {
						log(`//Image orthos ${e}`);
					}
				} else
					log(err);
			}
		);
	}
);

dbRefs.images_blank.on("value",
	function(snap) {
		var	s = snap.val();
		log(`images/blank ${s ? "loaded" : "fault"}...` );
		loadImage(s).then(
			function(image, err) {
				if(image != null) {
					log(`// Image/blank ${image} ${image.width}x${image.height} loaded from DataBase...`);
					try {
						hCtx.drawImage(image, 0, 0, 99, 99, 0, 0, 99, 99);
						hImages.blank = image;
					} catch(e) {
						log(`//Image blank ${e}`);
					}
				} else
					log(err);
			}
		);
	}
);

dbRefs.images_screen.on("value",
	function(snap) {
		var	s = snap.val();
		log(`images/screen ${s ? "loaded" : "fault"}...` );
		loadImage(s).then(
			function(image, err) {
				if(image != null) {
					log(`// Image/screen ${image} ${image.width}x${image.height} loaded from DataBase...`);
					try {
						hCtx.drawImage(image, 0, 0, 99, 99, 0, 0, 99, 99);
						hImages.screen = image;
					} catch(e) {
						log(`//Image screen ${e}`);
					}
				} else
					log(err);
			}
		);
	}
);

var	_Win1251 = new Function("text", "iconv", "return text.win1251");

var	theLogins = [];

dbRefs.win1251.on("value",
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

function Owner_Cmd(cmd) {
	switch(cmd) {
	case	"!image":
		//loadImage(images).then(loadImages);
		downloadImage(images, loadImages);
		return true;
	case	"!remap":
		ParsePhorum();
		return true;
	case	"!config":
		ParseConfig();
		return true;
	case	"!clear":
		theChat =
			[
				{
					nick	:"Нуль-Пост",
					text	:"Добро Пожаловать!",
					time	:datefmt(new Date(), szTimeFormat).shifted
				}
			];
		return true;
	}
	return false;
}

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

loadImage(sprites).then((image) => {
	if(null != image) {
		hImages.orthos = image;
		log(`// Image orthos ${image} ${image.width}x${image.height} loaded from folder ${sprites}...`);
	} else {
	}
});

function loadImages(image, err) {
	if(image != null) {
		hImages.boxes = image;
		log(`// Image boxes ${image} ${image.width}x${image.height} loaded from floder...`);
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
	var	userName= null;
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
					userName = _Win1251(hUser.title, iconv);
					log(`// Login for "${nick}"`);
					return;
				}
			}
		}
	});
	return {nick:theUser, name:userName};
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
										try {
											Config[Section].push(info[1]);
										} catch(e) {log(`Config/${info[1]}: ${e}`); }
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
		if(Config.images.blank)
			try { hCtx.drawImage(Config.images.blank, 0, 0, Config.images.blank.width, Config.images.blank.height, 0, 0, hCanvas.width, hCanvas.height); } catch(e) {}
		else
		if(hImages.blank)
			try { hCtx.drawImage(hImages.blank, 0, 0, hImages.blank.width, hImages.blank.height, 0, 0, hCanvas.width, hCanvas.height); } catch(e) {}
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
								//(hImages.orthos
								(Config.images.orthos
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
		if(Config.images.screen)
			try { hCtx.drawImage(Config.images.screen, 0, 0, Config.images.screen.width, Config.images.screen.height, 0, 0, hCanvas.width, hCanvas.height); } catch(e) {}
		else
		if(hImages.screen)
			try { hCtx.drawImage(hImages.screen, 0, 0, hImages.screen.width, hImages.screen.height, 0, 0, hCanvas.width, hCanvas.height); } catch(e) {}
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
		if(Config.images.blank)
			try { hCtx.drawImage(Config.images.blank, 0, 0, Config.images.blank.width, Config.images.blank.height, 0, 0, hCanvas.width, hCanvas.height); } catch(e) {}
		else
		if(hImages.blank)
			try { hCtx.drawImage(hImages.blank, 0, 0, hImages.blank.width, hImages.blank.height, 0, 0, hCanvas.width, hCanvas.height); } catch(e) {}
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
					if(Config.images.boxes)
						try { hCtx.drawImage(Config.images.boxes, 128 * +c, 0, 128, 128, x * 64 - osx - 64, y * 64 - osy - 64, 128, 128); } catch(e) { console.log(e); }
					else
						try { hCtx.drawImage(hImages.boxes, 128 * +c, 0, 128, 128, x * 64 - osx - 64, y * 64 - osy - 64, 128, 128); } catch(e) { console.log(e); }
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
		if(Config.images.screen)
			try { hCtx.drawImage(Config.images.screen, 0, 0, Config.images.screen.width, Config.images.screen.height, 0, 0, hCanvas.width, hCanvas.height); } catch(e) {}
		else
		if(hImages.screen)
			try { hCtx.drawImage(hImages.screen, 0, 0, hImages.screen.width, hImages.screen.height, 0, 0, hCanvas.width, hCanvas.height); } catch(e) {}
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

function ParseLogin_new(PassWord) {
	console.log(`// Find user in phorum...`);
	https.get(Config.ChatLogin, function(res) {
		var data = []; // List of Buffer objects
		res.on("data", function(chunk) {
			data.push(chunk); // Append Buffer object
		});
		res.on("end", function() {
			data = Buffer.concat(data); // Make one large Buffer of it
			var txt = new Buffer(data, 'binary');
			    txt=iconv.decode(txt, 'win1251').toString();
			//var myMessage = MyMessage.decode(data);
		console.log(`// Parse the Phorum page...`);
		parser.parseComplete(txt);
		console.log(`// Calling JSDOM...`);
				//var		document = parser.Parse(hXML.responseText);
				//sys.puts(sys.inspect(handler.dom, false, null));
		var	dom = new JSDOM(txt);
		console.log(`// Search for user`);
		return LoginUser(dom.window.document, PassWord);
		});
	});
}
async function ParseLogin_async(PassWord) {
	log(`ParseLogin_async(PassWord)`);
	return new Promise((resolve, reject) => {
		log(`ParseLogin_async(PassWord)::Promise`);
		try {
			log(`${Config.ChatLogin}`);
			https.get(Config.ChatLogin, response => {
				log(`ParseLogin_async(PassWord)::get.response=${response} setEncoding=${response.setEncoding}`);
				response.setEncoding('binary');
				log(`ParseLogin_async(PassWord)::get.response=${response} bl=${bl}`);
				response.pipe(bl((err, data) => {
				    log(`ParseLogin_async(PassWord)::bl`);
				if (err) {
				    reject(err);
				}
				//	data = Buffer.concat(data); // Make one large Buffer of it
					var txt = new Buffer(data, 'binary');
					log(`Buffer ----------------------------- ${txt}`);
					    txt=iconv.decode(txt, 'win1251').toString();
					log(`decode ------------------------------ ${txt}`);
					//var myMessage = MyMessage.decode(data);
				console.log(`// Parse the Phorum page...`);
				parser.parseComplete(txt);
				console.log(`// Calling JSDOM...`);
						//var		document = parser.Parse(hXML.responseText);
						//sys.puts(sys.inspect(handler.dom, false, null));
				var	dom = new JSDOM(txt);
				console.log(`// Search for user`);
				//return LoginUser(dom.window.document, PassWord);
				resolve(LoginUser(dom.window.document, PassWord));
				}));
			});
		} catch(e) {
			log(e);
		}
	});
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
var	nGuests = 0;
var	theChat	= [];
var	theUsers = {};
var	aChatBlank = [];

Owner_Cmd("!clear");
ParseConfig();
//log(util.inspect(Config, false, null, true));

var	theValues = {
		"Nick"		:`nick`,
		"Name"		:`name`,
		"IP"		:`req.connection.remoteAddress`,
		"Guests"	:`nGuests`,
		"Users"		:`nUsers`,
		"Scores"	:`theUsers[theIP].reach ? theUsers[theIP].reach.scores : "---"`,
		"Visits"	:`theUsers[theIP].reach ? theUsers[theIP].reach.visits : "---"`,
		"ChatLast"	:`szChatLast`
	};
var	theValuex = [];

for(var id in theValues)
	theValuex.push(id);
theValuex = new RegExp("\\(\\\\(" + theValuex.join("|") + ")\\)", "gm");

async function my_server(req, res) {
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
	var	chatNotes=[];
	var	ipAddr	= req.headers["x-forwarded-for"];
	if(ipAddr) 
		ipAddr	= ipAddr.split(",").pop();
	else
		ipAddr	= req.connection.remoteAddress;
	var	theIP	= ipAddr.split(/:+/).pop().split(".").join("");
	var	nick, name;
	var	fail	= false;
	var	time	= datefmt(new Date(), Config.timefmt).shifted;
	//
	if(theIP in theUsers)
		nick = theUsers[theIP].nick,
		name = theUsers[theIP].name;
	else {
		theUsers[theIP] = {
			nick	:(nick = "guest_" + datefmt(new Date(), "HHMMss")),
			name	:"anonymous",
			map	:null,
			login	:0,
			reach	:null
		};
		log(`// New user #${++ nGuests} is connected: ${nick}`);
	}
	if(theUsers[theIP].login > 0 && ("logoff" in Config)) {
		log(`await ParseLogin`);
		tmp = await ParseLogin_async("" + theUsers[theIP].login);
		log(`await ParseLogin == ${tmp}`);
		name = tmp.name;
		tmp = tmp.nick;
		if(tmp && tmp.length > 2) {
			log(`// User "${theUsers[theIP].nick}" is founded as "${tmp}"`);
			nUsers = 0;
			nGuests = 0;
			for(var id in theUsers) {
				if(theUsers[id].nick == nick && id != theIP)
					delete theUsers[id];
			}
			theUsers[theIP].nick = tmp;
			theUsers[theIP].name = name;
			theUsers[theIP].login = -theUsers[theIP].login;
			theUsers[theIP].reach = null;
			for(var id in theUsers) {
				if(theUsers[id].login < 0)
					++ nUsers;
				else
					++ nGuests;
			}
			theLogins.push(theIP);
			ReadUser();
			nick = tmp;
		}
	}
	log(req.url);
	tmp = [];
	for(var id in theUsers)
		tmp.push(theUsers[id].nick);
	try { journal.user.set(nick); journal.users.set(tmp.join("\r\n")); } catch(e) { log(e); }
	if(login) {
		res.statusCode = 200;
		res.setHeader("Content-Type", "text/html; charset=utf-8");
		log(`Login:#${theUsers[theIP].login} for «${nick}»`);
		if(theUsers[theIP].login >= 0)
			theUsers[theIP].login = Math.floor(Math.random() * 87655 + 12345);
		var	tmp = theUsers[theIP].login < 0 ? Config.logon : Config.logoff;
		tmp = tmp
			.replace(/\(\\PassWord\)/g, "" + theUsers[theIP].login)
			.replace(theValuex, function(s, t) {
				try {
					return eval(theValues[t]);
				} catch(e) {
					return "---";
				}
			});
		res.end(tmp);
	} else
	if([advision][(theUsers[theIP].login = theUsers[theIP].login < 0 ? theUsers[theIP].login : 0) * 0]) {
		res.statusCode = 200;
		res.setHeader("Content-Type", "text/html; charset=utf-8");
		str = Config.advision;
		str = str.replace(theValuex, function(s, t) {
			try {
				return eval(theValues[t]);
			} catch(e) {
				return "---";
			}
		});
		res.end(str.shiftedHTML);
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
		var	hGif = new gifencoder(640, 640);
		hGif.createReadStream().pipe(res);
		hGif.start();
		hGif.setRepeat(0);
		hGif.setDelay(500);
		hGif.setQuality(10);
		try {
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
			hGif.addFrame(hCtx);
			hCtx.fillText("Error!", 50, 100);
			hCtx.fillText(e, 50, 200);
			hGif.addFrame(hCtx);
			res.statusCode = 200;
			res.setHeader("Content-Type", "image/gif");
			hGif.finish();
			return;
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
		try { journal.pointXY.set(`${click[2]},${click[1]}`); } catch(e) { log(e); }
	} else
	if(choice) {
		Locations.common.colour = +choice[1];
		res.statusCode = 302;
		res.setHeader("Location", "https://gamedev.ru/pages/nullpost/play");
		res.end();
		try { journal.colour.set(`${choice[1]}`); } catch(e) { log(e); }
	} else
	if(chat) {
		if(chat[1]) {
			if((nick == Owner) && Owner_Cmd(chat[1])) {
				res.statusCode = 307;
				res.setHeader("Location", "https://gamedev.ru/pages/nullpost/play");
				res.end();
				return;
			}
			if(chat[1] == "!login" && theUsers[theIP].login == 0) {
				if(("logoff" in Config) && Config.logoff) {
					theUsers[theIP].login = Math.floor(Math.random() * 87655 + 12345);
					res.statusCode = 307;
					res.setHeader("Location", Config.logoff);
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
			aChatBlank = [];
			theChat.forEach(function(msg) {
				szChatLast = "" + msg.time + "|«" + msg.nick + "»:" + msg.text;
				aChatBlank.push(szChatLast);
			});
			try { journal.chatLog.set(aChatBlank.join("\r\n")); } catch(e) { log(e); }
			res.statusCode = 307;
			res.setHeader("Location", "https://gamedev.ru/pages/nullpost/play");
			res.end();
		} else {
			var	tmp = [];
			if(theUsers[theIP].login >= 0 && ("login" in Config) && Config.login)
				chatNotes.push(Config.login);
			Config
			.chat.prompt
			.split(/\r?\n/)
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
			res.statusCode = 200;
			res.setHeader("Content-Type", "text/html; charset=utf-8");
			res.end(Config.chat.body
				  .replace(/\(\\ChatNotice\)/gm, chatNotes.join("\r\n"))
				  .replace(/\(\\ChatLogs\)/gm, aChatBlank.concat(tmp).join("\r\n"))
			);
			try { bashMap(ansi); } catch(e) { console.log(e); }
		}
	} else {
		res.statusCode = 404;
		res.setHeader('Content-Type', 'image/png');
		res.end();
	}
};

const server = http.createServer(my_server);

server.listen(port, hosting, () => {
	log(`Server running at http://${hosting}:${port}/`);
});
