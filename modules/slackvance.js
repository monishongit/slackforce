"use strict";

let auth = require("./slack-salesforce-auth"),
	force = require("./force"),
	request = require('request'),
    CONTACT_TOKEN = process.env.SLACK_CONTACT_TOKEN;

exports.handle = (req, res) => {
	try {
		let payload = JSON.parse(req.body.payload);
	
		if (payload.token != CONTACT_TOKEN) {
			console.log("invalid token..");//response_url
			res.send(400);
			request.post(
				payload.response_url,
				{
				  text: "Invalid token"
				},
				(error, res, body) => {
				  if (error) {
					console.error(error)
					return
				  }
				  console.log(`statusCode: ${res.statusCode}`)
				  console.log(body)
				}
			)
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
			let result = JSON.stringify(data);
			let resBody = {
				replace_original: false,
				text: result
			}
			console.log('uri', payload.response_url);
			console.log('body', resBody);
			request.post({
				uri: payload.response_url,
				body: resBody,
				json:true
			}, function (err, res, body) {
				//handle callback  
				if (err) {
					console.error(err)
					return
				  }
				  console.log(`statusCode: ${res.statusCode}`)
				  console.log(body)          
			});
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
