var fs = require('fs');
var ejs = require('ejs');
var FeedSub = require('feedsub');
 
var csvFile = fs.readFileSync("friends_list.csv","utf8");
var emailTemplate = fs.readFileSync('email_template.ejs', 'utf8');

var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('DQzaysUgBH3blXQ4kcZGzA');
 
var blogContent = new FeedSub('http://faisalnwz01.github.io/atom.xml', {
  emitOnStart: true
}); 


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
   var timePublished = new Date();
    	var sevenDaysMins = 10080; //number of minutes in 7 days

    	for (key in post) {
    		if(key === "published") {
    			var postDate = new Date(post[key]);
    			if(timePublished.getMinutes() - sevenDaysMins < postDate.getMinutes()) {
    				post = post["link"]["href"];
    				latestPosts.push(post);
    			}
    		}
    	}
    })



  var customizedTemplate = ejs.render(templateCopy, 
    { firstName: firstName,  
      numMonthsSinceContact: numMonthsSinceContact,
      emailAddress: emailAddress,
      latestPosts: latestPosts
    });

  sendEmail(firstName, emailAddress, "Faisal", "faisalnwz01@gmail.com", "New Email", customizedTemplate);
})


