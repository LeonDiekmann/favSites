chayns.ready.then(function () {
    tappProject.init();

    //inside this block you can use any chayns function
    });

(function (tappProject, chayns, window, undefined) {
 
    'use strict';


    var fetchLink;
    var resultNr = 5;
    var timer;
    var jsonData = [];
    var fetchString = "Tobit";


    var $listContainer = null;
    var $accSearch = null;
    var $resultExpand = null;

    var $formName = null;
    var $formAddress = null;
    var $formMail = null;
    var $formComment = null;
    var $btnAdd = null;



    tappProject.init = function init() {

        // start
        $btnAdd.disabled = true;

        fetchLink = 'https://chayns1.tobit.com/TappApi/Site/SlitteApp?SearchString=' + fetchString + '&Skip=0&Take=' + resultNr;
        jsonRead().then(function(result){
            jsonData = result.Data; 
            $listContainer.innerHTML = "";
            console.log("data", result);
            for (let index = 0; index < result.Data.length; index++) {
                const element = result.Data[index];
                createElement(element);
                console.log("data", element.siteId);
            }

        }).catch(function(){
            console.log("failed");
        });
    };
    //content
    $listContainer = document.querySelector("#listContainer");
    $accSearch = document.querySelector("#accSearch");
    $resultExpand = document.querySelector("#resultExpand");

    $formName = document.querySelector("#formName");
    $formAddress = document.querySelector("#formAddress");
    $formMail = document.querySelector("#formMail");
    $formComment = document.querySelector("#inputComment");
    $btnAdd = document.querySelector("#btnAdd");



    $formName.addEventListener("input", function() {
        formTextChange();
    });

    $formAddress.addEventListener("input", function(){
        formTextChange();
    })

    $formMail.addEventListener("input", function() {
        formTextChange();
    });

    function formTextChange() {
        if ($formName.value !== "" && $formAddress.value !== "" && $formMail.value !== "" && $formMail.value.includes("@")) {
            $btnAdd.classList.remove("button--disabled");
            $btnAdd.disabled = false;
        }
        else
        {
            $btnAdd.className = "button  button--disabled";
            $btnAdd.disabled = true;
        }
    }

    $btnAdd.addEventListener("click", function() {
        chayns.intercom.sendMessageToPage({ 
            text: "Name: " + $formName.value + "\nAdresse: " + $formAddress.value + 
            "\nE-Mail: " + $formMail.value + "\nKommentar: " + $formComment.value
        }).then(function(data){
            $formName.value = "";
            $formAddress.value = "";
            $formMail.value = "";
            $formComment.value = "";
            $btnAdd.disabled = true;
            if(data.status == 200)
               chayns.dialog.alert('','Vielen Dank, ihre Site wurde hinzugefügt.');
        });
    })


    $resultExpand.addEventListener("click", function() {
        
        
        fetchString = $accSearch.value;
        resultNr = jsonData.length + 5;
        fetchLink = 'https://chayns1.tobit.com/TappApi/Site/SlitteApp?SearchString=' + fetchString + '&Skip=0&Take=' + resultNr;
        if ($accSearch.value !== "") {  
            chayns.showWaitCursor()
            jsonRead().then(function(result){
                chayns.hideWaitCursor()
                $listContainer.innerHTML = "";
                jsonData = result.Data; 
                console.log("data", result);
                for (let index = 0; index < result.Data.length; index++) {
                    const element = result.Data[index];

                    createElement(element);
                    console.log("data", element.siteId);
                }
        
            }).catch(function(){
                console.log("failed");
            });
        }

    });

    $accSearch.addEventListener("input",function () {
        
        
        fetchString = $accSearch.value;
        resultNr = 5;
        fetchLink = 'https://chayns1.tobit.com/TappApi/Site/SlitteApp?SearchString=' + fetchString + '&Skip=0&Take=' + resultNr;              
        if ($accSearch.value !== ""){    
            clearTimeout(timer);
            timer = setTimeout(function() {
                chayns.showWaitCursor()
                jsonRead().then(function(result){
                    chayns.hideWaitCursor()
                    jsonData = result.Data; 
                    $listContainer.innerHTML = "";
                    console.log("data", result);
                    for (let index = 0; index < result.Data.length; index++) {
                        const element = result.Data[index];
                        createElement(element);
                        console.log("data", element.siteId);
                    }

                }).catch(function(){
                    console.log("failed");
                });
            }, 500);
        }
    });


    function jsonRead() {
        return new Promise(function(resolve,reject){
            try
            {
                fetch(fetchLink)
            .then(function(response) {
                return response.json()
            }).then(function(json) {
                resolve(json);
                console.log('parsed json', json)
            }).catch(function(ex) {
                console.log('parsing failed', ex)
                reject(ex);
            })
            }
            catch (ex)
            {
                reject(ex);
            }
        });
    }

    function createElement(element) {
        var listLink = document.createElement("a");
        var list = document.createElement("div");
        var listHead = document.createElement("div");
        var listDivImg = document.createElement("div");
        var listImg = document.createElement("img");
        var listTitle = document.createElement("div");
        var listTitleHead = document.createElement("p");
        var listTitleDesc = document.createElement("p");


        list.className = "ListItem ListItem--clickable";
        listHead.className = "ListItem__head";
        listDivImg.className = "ListItem__Image";
        listTitle.className = "ListItem__Title";
        listTitleHead.className = "ListItem__Title--headline";
        listTitleDesc.className = "ListItem__Title--description";

        listLink.appendChild(list);
        list.appendChild(listHead);
        listHead.appendChild(listDivImg);
        listDivImg.appendChild(listImg);
        listHead.appendChild(listTitle);
        listTitle.appendChild(listTitleHead);
        listTitle.appendChild(listTitleDesc);
        $listContainer.appendChild(listLink);


        listImg.style.backgroundSize = "40px, 40px";
        listImg.style.backgroundImage = "URL('https://chayns.tobit.com/storage/" + element.siteId + "/Images/icon-57.png')";
        // listImg.src = "https://chayns.tobit.com/storage/" + id + "/Images/icon-57.png";
        listTitleHead.innerText = element.appstoreName;
        listTitleDesc = "Test";
        listLink.href = "https://chayns.net/" + element.siteId;
        listLink.target = "_blank";
    }

})((window.tappProject = {}), chayns, window);
