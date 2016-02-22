/*
 
 - This file is a part of Muvily Extension for Google Chrome (http://allrightamin.xyz/muvily)
 - 
 - Muvily is free software: you can redistribute it and/or modify it under the terms of 
 - the MIT License as published by the Free Software Foundation.
 - 
 - The MIT License (MIT)
 - 
 - Copyright (c) 2016 Amin Mohamed Ajani
 - 
 - Permission is hereby granted, free of charge, to any person obtaining a copy
 - of this software and associated documentation files (the "Software"), to deal
 - in the Software without restriction, including without limitation the rights
 - to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 - copies of the Software, and to permit persons to whom the Software is
 - furnished to do so, subject to the following conditions:
 - 
 - The above copyright notice and this permission notice shall be included in all
 - copies or substantial portions of the Software.
 - 
 - THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 - IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 - FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 - AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 - LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 - OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
*/



var options={};
var movie;
function showNotification(rawMovie,query,e){
    
    /*Removing the N/As with user friendly 'Nothing' (if it exists ofcourse) which will be stored in tomato keys too. Will implement tomato keys as soon as Google fixes their bug in list notifictaions. Till now, get stuck with the basic notifs.*/
    
    if(rawMovie){
    movie = JSON.parse(rawMovie.replace(/N\/A/g," "));
    }
    /*Check whether there is no net or a bad request and then trigger appropriate notification*/
    if(e === 1){
        options = {
            type:"basic",
            title:"Look ma! Bad Internet!",
            message:"Either there's no net on your computer or there's no net in my computer.",
            contextMessage : "*belly dances*",
            iconUrl:"/assets/img/nonet.png"
        };
    }
    else if(movie["Response"]==="False"){
        
        options= {
            type:"basic",
            title:"Bippity Boppity Boo, I gotta message for you",
            message:'"'+query+'"'+" doesn't exist in the database. Try reselecting the name.",
            contextMessage : "feedbacks @aminspeaks",
            iconUrl:"/assets/img/badrequest.png"
        };
    }
    else{
        /*User-friendlying messages for Imdb only. Tomato keys in the future will will have 'nothing yet'*/
        if(movie["imdbRating"]===" "){
                 movie["imdbRating"]= "has no rating yet";
                }
        if(movie["Awards"]===" "){
            movie["Awards"]="No awards yet";
        }
        if(movie["Plot"]===" "){
            movie["Plot"]="I don't have the plot details for this one yet. I also don't have a life. Look at me - I'm a stupid piece of code. They should make a movie on me.";
        }
        if(movie["BoxOffice"]===" "){
            movie["BoxOffice"]="No Box Office details yet";
        }
        
        
        options={
            type : "basic",
            title : "IMDb "+movie["imdbRating"],
            message : movie["Title"]+": "+movie["Plot"] ,
            iconUrl : "/assets/img/icon128.png",
            contextMessage: movie["Awards"],
            priority:1
        };
        
        }
    
    
    chrome.notifications.create("moovio",options, function(id){
        console.log(chrome.runtime.lastError);
        //Storing the details of the movie in the extension storage for more details in the popup.
        chrome.storage.local.set(movie, function(){
            console.log("Title: "+movie["Title"]+" is set");
        });
        
        
        
        //If the system/user closed the notification (which hides it actually), clear it. Performance, bitch.
        chrome.notifications.onClosed.addListener(function(){
            chrome.notifications.clear("moovio", function(){
            console.log(chrome.runtime.lastError);
        });
        });
    });
        
    }

function doIt(info){
    
    
    
    /*Sending the request*/
    
    var url="http://www.omdbapi.com/?t="+info.selectionText+"&tomatoes=true&r=json";
    
    /*Asynch http request as per MDN and chrome guidelines. Fuck synchronous stuff bhenchod*/
    
    var xhr = new XMLHttpRequest();
    xhr.open("GET",url,true);
    xhr.onload = function(event){
        if(xhr.readyState === 4){
            if(xhr.status === 200){
                showNotification(xhr.responseText,info.selectionText,0);
            }
            else{
                 showNotification(null,null,1);
            }
        }
    };
    xhr.onerror = function (event){
        /*Pass a flag 1 to show theres an error. For some reason unknown, showNotification expects the movie to be in json. 
        It fires some unexpected syntax error. Maybe I dont know much shit. Anyway, good old error flag.*/
        showNotification(null,null,1);
    };
    xhr.send(null);

    
}

chrome.contextMenus.create({
    title:"Get Movie Details",
    contexts:["selection"],
    onclick: doIt
});
