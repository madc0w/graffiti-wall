module.exports = {
	servers : {
		one : {
			host : "104.248.87.137",
			username : "root",
			pem : "~/.ssh/id_rsa",
		//		 password: ""
		// or neither for authenticate from ssh-agent
		}
	},

	app : {
		name : "wallator",
		path : "../",

		servers : {
			one : {},
		},

		buildOptions : {
			serverOnly : true,
		},

		env : {
			// If you are using ssl, it needs to start with https://
			ROOT_URL : "http://104.248.87.137",
			MONGO_URL : "mongodb://wallator:blimey@mongodb-1650-0.cloudclusters.net:10005/wallator?authSource=admin",
		//			MONGO_OPLOG_URL : "mongodb://oplog_wallator:blimey@mongodb-1650-0.cloudclusters.net:10005/wallator?authSource=admin",
		},

		docker : {
			// change to "abernix/meteord:base" if your app is using Meteor 1.4 - 1.5
			image : "abernix/meteord:node-8.4.0-base",
		},

		// Show progress bar while uploading bundle to server
		// You might need to disable it on CI servers
		enableUploadProgressBar : true
	},

//	mongo : {
//		version : "3.4.1",
//		servers : {
//			one : {}
//		}
//	},

	// (Optional)
	// Use the proxy to setup ssl or to route requests to the correct
	// app when there are several apps

	// proxy: {
	//   domains: "mywebsite.com,www.mywebsite.com",

//   ssl: {
//     // Enable Let's Encrypt
//     letsEncryptEmail: "email@domain.com"
//   }
// }
};
