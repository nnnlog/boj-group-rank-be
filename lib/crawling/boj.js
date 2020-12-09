const axios = require("axios");
const cheerio = require("cheerio");
module.exports = {
	async getMembers() {
		let html = (await axios.get(`https://www.acmicpc.net/group/member/9190`)).data;
		let $ = cheerio.load(html, {
			decodeEntities: false
		});
		let a = $("a[href]");
		let ret = {};
		for (let i = 0; i < a.length; i++) {
			let link = $(a[i]).attr('href');
			if (typeof link === "string" && link.startsWith("/user/") && link.length > '/user/'.length) {
				ret[link.replace("/user/", "")] = 1;
			}
		}
		return Object.keys(ret);
	}
};
