let panelModel = require('../models/panelModel.js');
let adminSessionIDs = require("../adminLoginIDs.js");
let nodemailer = require("../config/emailer.js");
let fs = require("fs");
let safeEval = require('safe-eval');
let crypto = require("crypto");

var exps = {
	email_codes : {},
	adminpanel: function(req, res){
		if(adminSessionIDs[req.sessionID] === true)
			res.sendFile("adminpanel.html", {root: "./"});
		else
			res.redirect("/adminlogin");
	},

	adminlogin: function(req, res){
		if(adminSessionIDs[req.sessionID] === true)
			res.redirect("adminpanel");
		else
			res.sendFile("adminlogin.html", {root: "client/static/html"});
		
		console.log(req.sessionID);
	},
	adminloginPost: function(req, res){
		//admin login
		//username: admin, password: fmf4__dev
		panelModel.validateLogin(req, res);
	},

	signUp: function(req, res){
	var email_crypto = crypto.randomBytes(48).toString("hex");
	exps.email_codes[req.body.email] = email_crypto;
	req.body.email_code = "?email=" +  req.body.email + "&code=" +email_crypto;
	var content = safeEval("`" + fs.readFileSync(__dirname + "/email_content.html", "utf8") + "`", req.body);
	console.log(content);
	var mailOptions = {
	    from: '"FMFA Class Registration" <noreply.fmfa@gmail.com>', // sender address
	    to: req.body.email, // list of receivers
	    subject: "FMFA Class Registration", // Subject line
	    text: '', // plaintext body
	    html: content// html body
	};
	nodemailer.sendMail(mailOptions, function(error, info){
	    if(error){
	        return console.log(error);
	    }
	    console.log('Message sent: ' + info.response);
	});
		res.json({});
	},
	confirmSeating: function(req, res){
		console.log(req.query, "@@@");
		if (req.query.code == exps.email_codes[req.query.email]){
			panelModel.confirmed_code(req, res);
			console.log("success");
		}
		res.redirect("/calendar");
	},

	getCalendarData: function(req, res){
		panelModel.getCalendarData(req, res);
	},

	getStudentsForClass: function(req, res){
		if(adminSessionIDs[req.sessionID] === true)
			panelModel.getStudentsForClass(req, res);
		else
			res.status(401).send("plz login");
	},

	getClassStudentCount: function(req, res, waitlisted){
		panelModel.getClassStudentCount(req, res, waitlisted);
	},

	addCategory: function(req, res){
		panelModel.addCategory(req, res);
	},
	deleteClassDescription: function(req, res){
		panelModel.deleteClassDescription(req, res);
	},
	remove_student : function(req, res){
		panelModel.removeStudent(req, res);
	},
	deleteStudent: function(req, res){
		panelModel.deleteStudent(req, res);
	},

	delete_scheduled_class: function(req, res){
		panelModel.deleteScheduledClass(req,res);
	},
	deleteCategory: function(req, res){
		panelModel.deleteCategory(req, res);
	},
	deleteLocation: function(req, res){
		panelModel.deleteLocation(req, res);
	},

	updateCategory: function(req, res){
		panelModel.updateCategory(req, res);
	},

	updateScheduledClass: function(req, res){
		console.log("edit scheulded class BE controller")
		panelModel.updateScheduledClass(req, res);
	},
	updateLocation: function(req, res){
		panelModel.updateLocation(req, res);
	},
	updateClassDescription: function(req, res){
		panelModel.updateClassDescription(req, res);
	},
	getCategories: function(req, res){
		panelModel.getCategories(req, res);
	},
	updateStudent: function(req, res){
		panelModel.updateStudent(req, res);
	},
	getOneStudent: function(req, res){
		console.log(req, "from BE controllers" );
		panelModel.getOneStudent(req, res);
	},
	getClassInstances: function(req, res){
		panelModel.getClassInstances(req, res);
	},
	getLocations: function(req, res){
		panelModel.getLocations(req, res);
	},
	addLocation: function(req, res){
		panelModel.addLocation(req, res);
	},

	addDescriptions: function(req, res){
		panelModel.addDescriptions(req, res);
	},

	getClassDescriptions: function(req, res){
		panelModel.getClassDescriptions(req, res);
	},
	scheduleClass: function(req, res){
		panelModel.scheduleClass(req, res);
	}
}

module.exports = exps;
