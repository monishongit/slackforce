"use strict";

let auth = require("./slack-salesforce-auth"),
    force = require("./force"),
    CONTACT_TOKEN = process.env.SLACK_CONTACT_TOKEN;

exports.handle = (req, res) => {
	try {
		let payload = JSON.parse(req.body.payload);
	
		if (payload.token != CONTACT_TOKEN) {
			console.log("invalid token..")
			res.send("Invalid token");
			return;
		}

    	let slackUserId = payload.user.id,
        	oauthObj = auth.getOAuthObject(slackUserId);
		// let optionsTmp = {
		// 		method: 'POST',
		// 		model : "{\"approvalId\":\"a061h000002pIlTAAU\"}",
		// 		saver : "SBAA.ApprovalRestApiProvider.Approve"
		// 	};
		let modelValue = payload.actions[0].value;
		let saverValue = '';
		if (payload.actions[0].text.text == 'Approve') {
			saverValue = 'SBAA.ApprovalRestApiProvider.Approve'
		} else {
			saverValue = 'SBAA.ApprovalRestApiProvider.Reject'
		}
		let options = {
			"model" : "{\\\"approvalId\\\":\\\"a061h000002pIlTAAU\\\"}",
			"saver" : saverValue
		}
		console.log('options: ', options);
		force.apexrest(oauthObj, '/sbaa/ServiceRouter', options).then(data => {
			console.log('apexrest result: ', data);
			res.send(data);
		}).catch(error => {
			console.log('apexrest error: ', error);
			if (error.code == 401) {
				res.send(`Visit this URL to login to Salesforce: https://${req.hostname}/login/` + slackUserId);
			} else {
				res.send(data);
			}
		});
	} catch {
		console.log("end error");
		res.send("end error");
	}
};
