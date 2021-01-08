"use strict";

let auth = require("./slack-salesforce-auth"),
    force = require("./force"),
    CONTACT_TOKEN = process.env.SLACK_CONTACT_TOKEN;

exports.handle = (req, res) => {
	try {
		let payload = JSON.parse(req.body.payload);
	
	console.log("token...:", payload.token);
	console.log("CONTACT_TOKEN...:", CONTACT_TOKEN);

	if (payload.token != CONTACT_TOKEN) {
		console.log("invalid token..")
        res.send("Invalid token");
        return;
    }

     let slackUserId = payload.user.id,
         oauthObj = auth.getOAuthObject(slackUserId);
		// let optionstmp = {
		// 		method: 'POST',
		// 		model : "{\"approvalId\":\"a061h000002pIlTAAU\"}",
		// 		saver : "SBAA.ApprovalRestApiProvider.Approve"
		// 	};
		console.log('slackvance broker got request');
		// console.log(req.body);
		let modelValue = payload.actions[0].value;
		console.log(modelValue);
		let saverValue = '';
		if (payload.actions[0].text.text == 'Approve') {
			saverValue = 'SBAA.ApprovalRestApiProvider.Approve'
		} else {
			saverValue = 'SBAA.ApprovalRestApiProvider.Reject'
		}
		let options = {
			model : modelValue,
			saver : saverValue
		}
	// console.log(req.body);
	// console.log('Got approved');
	res.send("end");
	// force.apexrest(oauthObj, '/sbaa/ServiceRouter', options).then(data => {
	// 	res.send(data);
	// }).catch(error => {
	// 	if (error.code == 401) {
	// 		res.send(`Visit this URL to login to Salesforce: https://${req.hostname}/login/` + slackUserId);
	// 	} else {
	// 		res.send(data);
	// 	}
	// });
} catch {
	console.log("end error");
	res.send("end error");
}
};
