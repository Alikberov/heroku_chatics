Object.defineProperty(
	String.prototype, "win1251", {
		get: function () {
			return	iconv.decode(Buffer.from(this, "ascii"), "win1251").toString();
		}
	}
);

Object.defineProperty(
	String.prototype, "shifted", {
		//	"3(.14159)".shifted == "3₁₄₁₅₉"
		//	"23(^59)30".shifted == "23⁵⁹30"
		//	"31(|12)18".shifted == "31Ⅻ18"
		//	"2(@10)127".shifted == "2⑩127"
		//	"**words**".shifted == "<b>words</b>"
		//	"//words//".shifted == "<i>words</i>"
		//	"--words--".shifted == "<s>words</s>"
		//	"__words__".shifted == "<u>words</u>"
		//	"~~words~~".shifted == "<blink>words</blink>"
		get: function () {
			return	this
				.replace(
					/\(([|.^@])(\d+)\)/gm
					,function(match, prefix, numbers) {
						var	pattern = {
								"."	:"₀₁₂₃₄₅₆₇₈₉",
								"^"	:"⁰¹²³⁴⁵⁶⁷⁸⁹",
								"|"	:"ØⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩⅪⅫ",
								"@"	:"Ⓞ①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳"
							}[prefix].split("");
						console.log(`${match} -- ${prefix} -- ${numbers}`);
						return	numbers
							.replace(
								"|" == prefix
									? (/10|11|12|\d/g)
									:
								"@" == prefix
									? (/1\d|20|\d/g)
									: (/\d/g)
								,function(n) {
									return	pattern[n];
								}
							)
						;
					}
				)
				.replace(
					/(\+-|\([crs]\)|\.{2,}|[&<>*\\]|,(?:\s*))/gm
					,function(match, symbol) {
						return {
								"+-"	:"±",
								"(c)"	:"©",
								"(r)"	:"®",
								"(s)"	:"§",
								"&"	:"№",
								"<"	:"«",
								">"	:"»",
								"*"	:"×",
								"\\"	:"÷",
								","	:", ",
								".."	:"…"
							}[symbol.replace(/\.{2,}/, "..")];
					}
				)
				.replace(
					/([-×_/~])\1([^\1]+)\1\1/gm
					,function(match, prefix, text) {
						var	tag = {
								"×"	:"b",
								"/"	:"i",
								"-"	:"s",
								"_"	:"u",
								"~"	:"blink"
							}[prefix];
						return	`<${tag}>${text}</${tag}>`;
					}
				)
				.replace(
					/(http:\/\/[-a-z.A-Z_0-9%/]+)/g, "<a href='$1'>$1</a>"
				)
			;
		}
	}
);

module.exports = {
	String	:String
};
