/**
 * Created by rishabhshukla on 09/03/17.
 */
var firebase = require('firebase');
const r = require('convert-radix64');
const hasha = require("hasha");
const hashMap = {};

var config = {
    apiKey: "AIzaSyBd_OvqkNSQzhvmizK9aQYW0Nk00QROlAI",
    authDomain: "url-shortner-102e0.firebaseio.com",
    databaseURL: "https://url-shortner-102e0.firebaseio.com",
    storageBucket: "url-shortner-102e0.appspot.com",
};
firebase.initializeApp(config);

module.exports = {
    shorten: (url) => {
        hash =  hasha(url, {encoding:"base64", algorithm:"md5"});
        hash = hash.slice(0,4);

        hash = hash.replace('/','-');
        hash = hash.replace('+','_');
        //let hashInt = parseInt(hash,16)
        //conv = atob(hashInt);
        hashMap[hash] = url;
        writeUserData(url,r.from64(hash),hash);

        return hash;

    },
    expand: (shortcode) => {

        return new Promise(function(resolve, reject){

            if(shortcode === undefined){
                reject(null);
            }
            var ref = firebase.database().ref('/'+r.from64(shortcode));

                ref.once('value').then(function(snapshot) {
                val = snapshot.val();
                if(val){       
                    let url = val.url;
                    resolve(url);
                }else{
                    resolve(hashMap[shortcode]);
                }
            });
                
        });
    }
};

writeUserData = (url,shortcode,code) => {
    firebase.database().ref('/'+shortcode).set({
        code:code,
        url:url
    });
}
