const express = require("express");
const path = require("path");
const https = require("https");
const fs = require("fs");
const app = express();

const solved = require("./lib/crawling/solved");
const boj = require("./lib/crawling/boj");
const mt_rand = require("./lib/mt_rand");

const wait = (time) => new Promise(r => setTimeout(() => r(), time));

let USER_DATA = [];

const crawl = async () => {
	let members = await boj.getMembers();
	let solved_info = [];
	for (let mem of members) {
		solved_info.push(await solved.getProfile(mem));
		//await wait(500);
	}
	solved_info = solved_info.filter(mem => mem.success).sort((a, b) => {
		return a.result.user[0].rank > b.result.user[0].rank ? 1 : -1;
	});
	USER_DATA = [];
	for (let mem of solved_info) {
		let member = mem.result.user[0];
		USER_DATA.push({
			name: member.user_id,
			rank: member.rank,
			exp: member.exp,
			solved: member.solved,
			level: member.level,
			class: `${member.class}${(new Array(member.class_decoration)).fill('+', 0, member.class_decoration).join("")}`
		});
	}
	console.log(USER_DATA, 'refreshed!', Date.now(), (new Date()).toLocaleString());
	let nxt;
	setTimeout(() => crawl(), nxt = 1000 * mt_rand(60 * 30, 60 * 60));
	console.log('next', nxt, Date.now() + nxt, (new Date(Date.now() + nxt)).toLocaleString());
};

crawl();

app.get("/api/members", (req, res) => {
	res.header('Content-Type', 'application/json; charset=utf8');
	res.status(200).end(JSON.stringify(USER_DATA));
});

app.use(express.static(path.join(__dirname, "public/dist")));

app.use((req, res) => {
	res.end(fs.readFileSync(path.join(__dirname, "public/dist/index.html")));
})

https.createServer({
	key: fs.readFileSync("./ssl/privkey.pem", "utf8"),
	cert: fs.readFileSync("./ssl/cert.pem", "utf8"),
	ca: fs.readFileSync("./ssl/fullchain.pem", "utf8"),
}, app).listen(443, () => {
	console.log('server running on 443!');
});
