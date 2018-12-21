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

//const	sys		= require('sys');
const	https				= requiry("https");
const	http				= requiry("http");
const	util				= requiry("util");

async function my_server(req, res) {
	{
		res.statusCode = 501;
		res.setHeader('Content-Type', 'text/html');
		res.end(`<h1>New version of script is crashed!</h1><h2>Thanks for Alikberov!</h2>`);
	}
};

const server = http.createServer(my_server);

server.listen(port, hosting, () => {
	log(`Stub server running at http://${hosting}:${port}/`);
});
