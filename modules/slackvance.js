"use strict";

let auth = require("./slack-salesforce-auth"),
    force = require("./force"),
    CONTACT_TOKEN = process.env.SLACK_CONTACT_TOKEN;

exports.handle = (req, res) => {

    // if (req.body.token != CONTACT_TOKEN) {
    //     res.send("Invalid token");
    //     return;
    // }

    // let slackUserId = req.body.user_id,
    //     oauthObj = auth.getOAuthObject(slackUserId);
	// let options = {
	// 		method: 'POST',
	// 		model : "{\"approvalId\":\"a061h000002pIlTAAU\"}",
	// 		saver : "SBAA.ApprovalRestApiProvider.Approve"
	// 	};
	console.log(req.body);
	console.log('Got approved');
	res.send(req.body);
	// force.apexrest(oauthObj, '/sbaa/ServiceRouter', options).then(data => {
	// 	res.send(data);
	// }).catch(error => {
	// 	if (error.code == 401) {
	// 		res.send(`Visit this URL to login to Salesforce: https://${req.hostname}/login/` + slackUserId);
	// 	} else {
	// 		res.send(data);
	// 	}
	// });
};
