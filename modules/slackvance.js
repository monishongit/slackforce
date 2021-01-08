"use strict";

let auth = require("./slack-salesforce-auth"),
    force = require("./force"),
    CONTACT_TOKEN = process.env.SLACK_CONTACT_TOKEN;

exports.execute = (req, res) => {

    if (req.body.token != CONTACT_TOKEN) {
        res.send("Invalid token");
        return;
    }

    let slackUserId = req.body.user_id,
        oauthObj = auth.getOAuthObject(slackUserId),
        options = {
			method: 'POST',
			model : "{\"approvalId\":\"a061h000002pIlTAAU\"}",
			saver : "SBAA.ApprovalRestApiProvider.Approve"
		};
	console.log(req.body);
	force.apexrest(oauthObj, '/sbaa/ServiceRouter', options).then(data => {
            // let contacts = JSON.parse(data);
			//     res.json({text: "Contacts matching '" + req.body.text + "':", attachments: attachments});
			console.log(data);
			res.send("done");
        })
        .catch(error => {
            if (error.code == 401) {
                res.send(`Visit this URL to login to Salesforce: https://${req.hostname}/login/` + slackUserId);
            } else {
				console.log(data);
                res.send("An error as occurred");
            }
        });
};