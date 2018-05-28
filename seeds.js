var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [{
        name: "Cloud's Rest",
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Bacon ipsum dolor amet doner andouille buffalo, meatloaf leberkas tenderloin venison chuck fatback pastrami brisket. Buffalo fatback strip steak, sausage rump chuck drumstick pork chop boudin filet mignon pig sirloin kielbasa meatloaf. Short loin pork sirloin spare ribs, shankle tail ham burgdoggen meatball porchetta ground round hamburger bacon. T-bone ribeye porchetta flank pig chuck hamburger leberkas burgdoggen sausage."
    },
    {
        name: "Desert Mesa",
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Ball tip strip steak porchetta, meatball leberkas hamburger biltong pastrami. Biltong fatback porchetta, shoulder meatloaf strip steak cupim jerky jowl ham drumstick boudin corned beef buffalo. Flank beef strip steak fatback leberkas beef ribs ribeye pork chop hamburger short ribs pork loin pork belly drumstick. Pig tenderloin burgdoggen hamburger swine bresaola shankle bacon tongue pancetta turkey strip steak."
    },
    {
        name: "Canyon Floor",
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Chicken t-bone doner pig prosciutto ball tip turducken ham cupim leberkas venison kielbasa brisket meatball shank. Sausage kielbasa prosciutto strip steak flank pork, filet mignon t-bone. Frankfurter turducken kielbasa short ribs venison pancetta salami strip steak brisket pork meatball shoulder fatback pork belly spare ribs. Strip steak short ribs short loin, pork belly pork tenderloin boudin swine tail chuck tri-tip picanha sirloin. Burgdoggen biltong shoulder meatloaf jerky shank rump pig tri-tip."
    }
]

function seedDB() {
    //Remove all campgrounds
    Campground.remove({}, function() {
        if (err) {
            console.log(err);
        }
        console.log("removed campgrounds!");
        Comment.remove({}, function (err) {
            if (err) {
                console.log(err);
            }
            console.log("removed comments!");
            //add a few campgrounds
            data.forEach(function (seed) {
                Campground.create(seed, function (err, campground) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("added a campground");
                        //create a comment
                        Comment.create({
                            text: "This place is great, but I wish there was internet",
                            author: "Homer"
                        }, function (err, comment) {
                            if (err) {
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created new comment");
                            }
                        });
                    }
                });
            });
        });
    });
}

module.exports = seedDB;
