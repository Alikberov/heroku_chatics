const	log	= console.log;

const	hosting	= "";
const	port	= process.env.PORT || 5000;

log(`Stub started at "http://${hosting}:${port}/"`);

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

var	Preventive	= "";
var	Script		= "";

const	https				= requiry("https");
const	http				= requiry("http");
const	util				= requiry("util");
const	firebase			= requiry("firebase");

async function my_server(req, res) {
	{
		if("" != Script)
			try {
				eval(Script);
			} catch(e) {
				log(e);
			}
		;
		res.statusCode = 501;
		res.setHeader('Content-Type', 'text/html');
		if("" == Preventive)
			res.end(`<h1>New version of script is crashed!</h1><h2>Thanks for Alikberov!</h2>`);
		else
			res.end(Preventive);
	}
};

const server = http.createServer(my_server);

server.listen(port, hosting, () => {
	log(`Stub server running at http://${hosting}:${port}/`);
});

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

firebase
.app()
.database()
.ref("Preventive")
.on("value",
	function(snap) {
		var	s = snap.val();
		if("..." == s) {
			server.close(
				function() {
					console.log("Stub server closed…");
					process.exit(0);
				}
			);
		} else
		if("<" == s.charAt(0))
			Preventive == s;
		else
			Script = s;
	}
);
