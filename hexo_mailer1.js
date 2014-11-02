/*var fs = require('fs');
 
var csvFile = fs.readFileSync("friends_list.csv","utf8");
console.log(csvFile);

var csvParse = function(csvFile) {
	var first_name = [];
	var last_name = [];
	var month_since_contact = [];
	var email_addresses = [];
	var array = [];
	array = csvFile.split(',').forEach(
			first_name.push(array[0])
			last_name.push(array[1])
			month_since_contact.push(array[2])
			email_addresses.push(array[3])
	)
	return
	
	for (var i = 0; i < csvFile.length; i++) {
		array = csvFile[i].split(',')
			first_name.push(array[0])
			last_name.push(array[1])
			month_since_contact.push(array[2])
}
			email_addresses.push(array[3])
	};
	console.log(csvParse(csvFile));


var csv_data = csvParse(csvFile)
console.log(csv_data);

var csvParse = function(csvFile) {
	
	var person_info = [];
	var temperory = [];
	for(var i=1;i<csvFile.length;i++){
		temperory = csvFile.split(',');
		person_info.push({firstName:temperory[0], lastName:temperory[1], monthsSinceContact:temperory[2], emailAddress:temperory[3]});
	}
	return person_info;
	
}


console.log(csvParse(csvFile));

var csv_data = csvParse(csvFile)*/

var fs = require('fs');
var ejs = require('ejs');
var FeedSub = require('feedsub');
 
var csvFile = fs.readFileSync("friends_list.csv","utf8");
var emailTemplate = fs.readFileSync('email_template.ejs', 'utf8');

var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('DQzaysUgBH3blXQ4kcZGzA');
 
function csvParse(csvFile){
    var personContact = [];
    var arr = csvFile.split("\n");
    var newObj;
 
    keys = arr.shift().split(",");
 
    arr.forEach(function(contact){
        contact = contact.split(",");
        newObj = {};
 
        for(var i =0; i < contact.length; i++){
            newObj[keys[i]] = contact[i];
        }
 
personContact.push(newObj);
 
    })
 
    return personContact;
}
 
friendList = csvParse(csvFile);
 
friendList.forEach(function(row){
 
    firstName = row["first_name"];
    numMonthsSinceContact = row["months_since_contact"];
    emailAddress = row["email_address"];
     
    // we make a copy of the emailTemplate variable to a new variable to ensure
    // we don't edit the original template text since we'll need to us it for 
    // multiple emails
 
    templateCopy = emailTemplate;
 
    // use .replace to replace FIRST_NAME and NUM_MONTHS_SINCE_CONTACT with firstName and  monthsSinceLastContact  
    templateCopy = templateCopy.replace(/FIRST_NAME/gi,
    firstName).replace(/NUM_MONTHS_SINCE_CONTACT/gi,numMonthsSinceContact);
 
    console.log(templateCopy); 
})


var customizedTemplate = ejs.render(emailTemplate, 
                { firstName: firstName,  
                  monthsSinceContact: monthsSinceContact,
                  emailAddress: emailAddress,
                  latestPosts: latestPosts
                });


 
 
var blogContent = new FeedSub('http://faisalnwz01.github.io/atom.xml', {
        emitOnStart: true
}); 
blogContent.read(function(err,blogPosts){
    console.log(blogPosts);
})






function sendEmail(to_name, to_email, from_name, from_email, subject, message_html){
  var message = {
      "html": message_html,
      "subject": subject,
      "from_email": from_email,
      "from_name": from_name,
      "to": [{
              "email": to_email,
              "name": to_name
          }],
      "important": false,
      "track_opens": true,    
      "auto_html": false,
      "preserve_recipients": true,
      "merge": false,
      "tags": [
          "Fullstack_Hexomailer_Workshop"
      ]    
  };
  var async = false;
  var ip_pool = "Main Pool";
  mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result) {
      //console.log(message);
       console.log(result);   
  }, function(e) {
      // Mandrill returns the error as an object with name and message keys
      console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
      // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
  });
  }

var latestPosts = [];

blogContent.read(function(err,blogPosts){
    
    blogPosts.forEach(function(post){
    	var currentDate = new Date();
    	var sevenDays = 604800000;

    	for (key in post) {
    		if(key=== "published") {
    			var postDate = new Date(post[key]);
    			if(currentDate.getTime() - sevenDays < postDate.getTime()) {
    				post["link"] = post["link"]["href"];
    				latestPosts.push(post);
    			}
    		}
    	}
    })

sendEmail(firstName, emailAddress, "Faisal", "faisalnwz01@gmail.com", "New Email", customizedTemplate);
    })
 
 
});










