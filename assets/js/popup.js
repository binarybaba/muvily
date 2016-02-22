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


var title;
chrome.storage.local.get(null,function(movie){
    
    /*populating the popup the lazy way yay*/
    for(var key in movie){
        if(document.getElementById(key)){
            if(movie[key]!==" "){
                document.getElementById(key).innerHTML=movie[key];
            }
        }
    }
    
    $(document).ready(function(){
        
        /*There are no directors for series. Replacing it with creators.*/
        if(movie["Type"]==="series"){
            $("#Writer").closest('li').html("Creator: "+movie["Writer"]);
            $("#Director").closest('li').remove();
            
        }
        
        if($('#imdbRating').text()==="has no rating yet"){
            $('#imdbRating').text("0.0");
        }
        
        $('.about').hide();
        $('.rotten-tomatoes').hide();
        
        $('#tomato-btn').on('click', function(){
            $('#tomato-btn').addClass('selected');
            $('#imdb-btn').removeClass('selected');
            $('div.imdb').fadeOut(20,function(){
                $('div.imdb').removeClass('active');
                $('div.rotten-tomatoes').addClass('active');
                $('div.rotten-tomatoes').fadeIn(200);
                
            });
        });
        $('#imdb-btn').on('click',function(){
            $('#imdb-btn').addClass('selected');
            $('#tomato-btn').removeClass('selected');
            $('div.rotten-tomatoes').fadeOut(20,function(){
                $('div.rotten-tomatoes').removeClass('active');
                $('div.imdb').addClass('active');
                $('div.imdb').fadeIn(200);
            });
        });
        $('#about-btn').on('click', function(){
            $('#about-btn').toggleClass('selected');
            $('#about-btn').hasClass('selected') ? $('.movie-wrapper').fadeOut(200, function(){
                $('.about').fadeIn(200);
            })
            :
            $('.about').fadeOut(200, function(){
                $('.movie-wrapper').fadeIn(200);
            });
            
        });
        
    });
    
    
});



//Switch to persist data
/*chrome.storage.local.clear();*/