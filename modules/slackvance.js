"use strict";

let auth = require("./slack-salesforce-auth"),
    force = require("./force"),
    CONTACT_TOKEN = process.env.SLACK_CONTACT_TOKEN;

exports.handle = (req, res) => {

    if (req.body.token != CONTACT_TOKEN) {
        res.send("Invalid token");
        return;
    }

    let slackUserId = req.body.user_id,
        oauthObj = auth.getOAuthObject(slackUserId);
		// let optionstmp = {
		// 		method: 'POST',
		// 		model : "{\"approvalId\":\"a061h000002pIlTAAU\"}",
		// 		saver : "SBAA.ApprovalRestApiProvider.Approve"
		// 	};
		console.log('slackvance broker got request');
		console.log(req.body);
		// let modelValue = req.body.actions[0].value;
		// console.log(modelValue);
		// let saverValue = '';
		// if (req.body.actions[0].text.text == 'Approve') {
		// 	saverValue = 'SBAA.ApprovalRestApiProvider.Approve'
		// } else {
		// 	saverValue = 'SBAA.ApprovalRestApiProvider.Reject'
		// }
		// let options = {
		// 	model : modelValue,
		// 	saver : saverValue
		}
	console.log(req.body);
	console.log('Got approved');
	
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
