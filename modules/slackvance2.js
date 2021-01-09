"use strict";

let jsforce = require('jsforce'),
	request = require('request')

exports.handle = (req, res) => {

		let payload = JSON.parse(req.body.payload);
		
		let status = '';
		let modelValue = "{\"approvalId\": \"" + payload.actions[0].value + "\"}";
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
			"body" : {
				"model" : modelValue,
				"saver" : saverValue
			}
		}
		console.log('options: ', options);
		let conn = new jsforce.Connection({
			loginUrl: 'https://test.salesforce.com'
		});
		conn.login('test-kdqmffi3ivs8@example.com', 'test1234q36ZhdYW2YpT9puMOKdDNwpnQ', function(err, res) {
		if (err) { return console.error(err); }
			// body payload structure is depending to the Apex REST method interface.
			conn.apex.post("/sbaa/ServiceRouter", options.body, function(err, res) {
			if (err) { return console.error(err); }
			else {
				res.send(200);
				request.post({
					uri: payload.response_url,
					body: {
						replace_original: false,
						text: "Quote is " + status + "!"
					},
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
			}
				console.log("response: ", res);
				// the response object structure depends on the definition of apex class
			});
		});
};
