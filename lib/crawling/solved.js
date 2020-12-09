const axios = require("axios");
module.exports = {
	async getProfile(id) {
		return (await axios.get(`https://api.solved.ac/v2/users/show.json?id=${id}`)).data;
	}
};
