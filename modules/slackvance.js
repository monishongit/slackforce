"use strict";

let auth = require("./slack-salesforce-auth"),
	force = require("./force"),
	request = require('request'),
    CONTACT_TOKEN = process.env.SLACK_CONTACT_TOKEN;

exports.handle = (req, res) => {
	try {
		let payload = JSON.parse(req.body.payload);
	
		if (payload.token != CONTACT_TOKEN) {
			res.send(400);
			let resBody = {
				replace_original: false,
				text: "Invalid token, contact administrator."
			}
			console.log('uri', payload.response_url);
			console.log('body', resBody);
			request.post({
				uri: payload.response_url,
				body: resBody,
				json: true
			}, function (err, res, body) {
				//handle callback  
				if (err) {
					console.error(err)
					return
				  }
				  console.log(`statusCode: ${res.statusCode}`)
				  console.log(body)          
			});
			return;
		}

    	let slackUserId = payload.user.id,
        	oauthObj = auth.getOAuthObject(slackUserId);
		// Sample AA message format:
		// let optionsTmp = {
		// 		method: 'POST',
		// 		model : "{\"approvalId\":\"a061h000002pIlTAAU\"}",
		// 		saver : "SBAA.ApprovalRestApiProvider.Approve"
		// 	};
		let status = '';
		let modelValue = {approvalId: payload.actions[0].value};
		let saverValue = '';
		if (payload.actions[0].text.text == 'Approve') {
			saverValue = 'SBAA.ApprovalRestApiProvider.Approve'
			status = 'approved'
		} else {
			saverValue = 'SBAA.ApprovalRestApiProvider.Reject'
			status = 'rejected'
		}
		let options = {
			"method" : "POST",
			"data": {
				"model" : modelValue,
				"saver" : saverValue
			}
		}
		console.log('options: ', options);
		force.apexrest(oauthObj, '/sbaa/ServiceRouter', options).then(data => {
			console.log('apexrest result: ', data);
			res.send(data);
			let result = '';
			let replace = true;
			if (JSON.stringify(data).includes('errorCode')) {
				result = JSON.stringify(data)
				replace = false
			} else {
				result = "Quote <Q-00000> is " + status;
			}
			let resBody = {
				replace_original: replace,
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
				res.send(error.code)
				let errorMsg = `Visit this URL to login to Salesforce: https://${req.hostname}/login/` + slackUserId;
				let resBody = {
					replace_original: false,
					text: errorMsg
				}
				request.post({
					uri: payload.response_url,
					body: resBody,
					json: true
				}, function (err, res, body) {
					//handle callback  
					if (err) {
						console.error(err)
						return
					  }
					  console.log(`statusCode: ${res.statusCode}`)
					  console.log(body)          
				});
			} else {
				res.send(data);
			}
		});
	} catch {
		console.log("end error");
		res.send("end error");
	}
};
