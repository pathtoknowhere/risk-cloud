﻿// INITIAL PARAMETERS ===============================================================================================================================

initialParams = function(properties) {

    var self = function() { return };

    for(prop in properties) { self[prop] = properties[prop] }

    return self;
}({

    validate: function() {

        //string objects containing element id's
        var numLegsRadio    = idStrings(["num-legs-radio"]),
            continueButton1 = "continue-button-1";

        //capture initial user-defined parameters
        g.TRADE_LEGS = +elem.select("input[name=num-legs-radio]:checked").value;

        //transitions
        finalParams.create(function() {

            elem.ease("out", "initial-params-container", 0.5, 30);
            elem.fade("out", "initial-params-container", 0.03);
            elem.fade("in", "final-params-container", 0.01);
        });
    }
})

// END INITIAL PARAMETERS ===========================================================================================================================


// FINAL PARAMETERS =================================================================================================================================

finalParams = function(properties) {

    var self = function() { return };

    for(prop in properties) { self[prop] = properties[prop] }

    return self;
}({

    create: function(callback) {

        for(i=1; i<g.TRADE_LEGS+1; i++) {

            //trade legs
            elem.create({tag: "div", attributes: {id: "leg-"+i, class: "general-group trade-leg"}}, "trade-legs-params-container");

            //sub-containers and logic
            for(j=1; j<8; j++) {

                elem.create({tag: "div", attributes: {id: "leg-sub-container-"+j+"-"+i, class: "general-group leg-sub-container"}}, "leg-"+i);

                //add some space between certain sub-containers
                if(j==1 || j==4) { elem.select("leg-sub-container-"+j+"-"+i).style.marginBottom = 1.75 + "vw" }

                //hide sub-containers 2 through 4 when the number of trade legs is greater than 1
                if(j>4 && j<8) {
                        
                    switch(i>1) {

                        case true:
                            elem.select("leg-sub-container-"+j+"-"+i).style.height = 0;
                            break;

                        case false:
                            if(g.TRADE_LEGS>1) {
                                elem.select("leg-sub-container-"+j+"-1").setAttribute("data-clicked", "false");
                                elem.select("leg-sub-container-"+j+"-1").style.backgroundColor = '#cbdafb';
                            }
                            break;
                    }
                }
            }

            //make the first sub-container of each trade leg larger and darker
            elem.select("leg-sub-container-1-"+i).style.height = 6.25 + "vw";
            elem.select("leg-sub-container-1-"+i).style.backgroundColor = '#777777';

            //sub-container forms
            (function(n) {

                //buy-sell & call-put radios
                [ [["buy","1"],["sell","-1"]], [["call","1"],["put","-1"]] ].forEach(function(arr) { twoButtons.create(arr, n) });

                //text fields
                ["num-contracts", "strike-price", "option-price", "expiry", "div-yield", "risk-free-rate"].forEach(function(ele) { numberFields.create(ele, n) });
            })(i);
        }

        //adaptive sizing, bordering
        (function() {

            var bdr = '1px solid #fafafa';

            switch(g.TRADE_LEGS) {

                case 1:
                    elem.select("trade-legs-params-container").style.width = 45 + 'vw';
                    elem.select("leg-1").style.borderLeft  = bdr;
                    elem.select("leg-1").style.borderRight = bdr;
                    break;
                case 2:
                    elem.select("trade-legs-params-container").style.width = 45 + 'vw';
                    elem.select("leg-1").style.borderRight = bdr;
                    break;

                case 3:
                    elem.select("trade-legs-params-container").style.width = 68 + 'vw';
                    for(n=1; n<g.TRADE_LEGS; n++) { elem.select("leg-"+n).style.borderRight = bdr }
                    break;

                case 4:
                    elem.select("trade-legs-params-container").style.width = 90 + 'vw';
                    for(n=1; n<g.TRADE_LEGS; n++) { elem.select("leg-"+n).style.borderRight = bdr }
                    break;
            }
        })();

        //some more logic needed to apply certain trade parameters to all legs on multi-leg trades
        if(g.TRADE_LEGS>1) {

            //on click, toggle visibility of some sub-containers
            elem.select("leg-sub-container-5-1").addEventListener("click", expVis = function() {numberFields.visible("leg-sub-container-5", 2.725, 'expiry')});
            elem.select("leg-sub-container-6-1").addEventListener("click", divVis = function() {numberFields.visible("leg-sub-container-6", 2.725, 'div-yield')});
            elem.select("leg-sub-container-7-1").addEventListener("click", rfrVis = function() {numberFields.visible("leg-sub-container-7", 2.725, 'risk-free-rate')});

            //prevent a field element click from triggering a sub-container event
            ["expiry-field-1", "div-yield-field-1", "risk-free-rate-field-1"].forEach(function(ele) {

                elem.select(ele).addEventListener("click", function(e) { e.stopPropagation() });
            });
        }

        //transition animation callback
        if(typeof callback === 'function') { callback() }
    },

    destroy: function() {

        //clear global params
        obj.reset(g);

        //transitions
        elem.fade("out", "final-params-container", 0.03, function() {

            //destroy trade info
            elem.destroyChildren('trade-legs-params-container');

            //reset stock price field value
            elem.select("current-price-field").value = 100.25;
        });

        elem.ease("in", "initial-params-container", 0.5, 30);
        elem.fade("in", "initial-params-container", 0.01);
    },

    validate: function() {

        //id strings
        var buySellRadios      = idStrings(["buy-radio", "sell-radio"]),
            callPutRadios      = idStrings(["call-radio", "put-radio"]),
            numContractsFields = idStrings(["num-contracts-field"]),
            strikePriceFields  = idStrings(["strike-price-field"]),
            optionPriceFields  = idStrings(["option-price-field"]),
            expiryFields       = idStrings(["expiry-field"]),
            divYieldFields     = idStrings(["div-yield-field"]),
            riskFreeFields     = idStrings(["risk-free-rate-field"]),
            returnButton1      = "return-button-1",
            stockPriceField    = "current-price-field",
            calculateButton1   = "calculate-button-1",

            //evaluate text form input conditions
            numContractsCond = inputCheck("num-contracts-field"),
            strikePriceCond  = inputCheck("strike-price-field"),
            optionPriceCond  = inputCheck("option-price-field"),
            expiryCond       = inputCheck("expiry-field"),
            divYieldCond     = inputCheck("div-yield-field"),
            riskFreeCond     = inputCheck("risk-free-rate-field"),
            stockPriceCond   = (elem.select(stockPriceField).value != "" && elem.select(stockPriceField).value > 0);

        //input validation, error message handling
        switch(false) {

            case numContractsCond[obj.size(numContractsCond)]:
                errorMsg("num-contracts-field-"+obj.size(numContractsCond), "Please enter a whole number greater than or equal to 1 for the number of contracts in this trade leg.");
                break;

            case strikePriceCond[obj.size(strikePriceCond)]:
                errorMsg("strike-price-field-"+obj.size(strikePriceCond), "Please enter a number greater than or equal to 0.25 for the strike price in this trade leg.");
                break;

            case optionPriceCond[obj.size(optionPriceCond)]:
                errorMsg("option-price-field-"+obj.size(optionPriceCond), "Please enter a number greater than 0 for the option price in this trade leg.");
                break;

            case expiryCond[obj.size(expiryCond)]:
                errorMsg("expiry-field-"+obj.size(expiryCond), "Please enter a whole number greater than or equal to 1, and less than or equal to 183, for the number of calendar days to expiry in this trade leg.");
                break;

            case divYieldCond[obj.size(divYieldCond)]:
                errorMsg("div-yield-field-"+obj.size(divYieldCond), "Please enter a number greater than or equal to 0, and less than or equal to 100, for the dividend yield percentage in this trade leg.");
                break;

            case riskFreeCond[obj.size(riskFreeCond)]:
                errorMsg("risk-free-rate-field-"+obj.size(riskFreeCond), "Please enter a number greater than or equal to 0, and less than or equal to 25, for the risk-free rate percentage in this trade leg.");
                break;

            case stockPriceCond:
                errorMsg(stockPriceField, "Please enter a number greater than 0 for the current price of the underlying stock.");
                break;

            //user-defined parameter capture, write some info to elements of the trade summary table, calculate and launch visuals
            default:
                g.STOCK_PRICE = +elem.select("current-price-field").value;

                for(i=1; i<g.TRADE_LEGS+1; i++) {

                    g.LONG_SHORT[i]    = +elem.select("input[name=buy-sell-radio-"+i+"]:checked").value;
                    g.CONTRACT_TYPE[i] = +elem.select("input[name=call-put-radio-"+i+"]:checked").value;
                    g.NUM_CONTRACTS[i] = +elem.select("num-contracts-field-"+i).value;
                    g.STRIKE_PRICE[i]  = +elem.select("strike-price-field-"+i).value;
                    g.OPTION_PRICE[i]  = +elem.select("option-price-field-"+i).value;

                    //on multi-leg trades, take the value of certain parameters in the first trade leg unless the user specifies otherwise
                    if(elem.select('leg-sub-container-5-1').getAttribute("data-clicked") == "false") {

                        g.EXPIRY[i] = (i==1) ? +elem.select("expiry-field-"+i).value : g.EXPIRY[1];
                    } else {
                        g.EXPIRY[i] = +elem.select("expiry-field-"+i).value;
                    }


                    if(elem.select('leg-sub-container-6-1').getAttribute("data-clicked") == "false") {

                        g.DIV_YIELD[i] = (i==1) ? elem.select("div-yield-field-"+i).value/100 : g.DIV_YIELD[1];
                    } else {
                        g.DIV_YIELD[i] = elem.select("div-yield-field-"+i).value/100;
                    }


                    if(elem.select('leg-sub-container-7-1').getAttribute("data-clicked") == "false") {

                        g.RISK_FREE[i] = (i==1) ? elem.select("risk-free-rate-field-"+i).value/100 : g.RISK_FREE[1];
                    } else {
                        g.RISK_FREE[i] = elem.select("risk-free-rate-field-"+i).value/100;
                    }


                    //write trade summary and option price info to elements of the trade summary table
                    (function(n) {

                        //local vars
                        var ele      = "leg-"+n+"-",
                            buy_sell = g.LONG_SHORT[n]    == 1 ? "BUY &nbsp"    : "SELL &nbsp",
                            color    = g.LONG_SHORT[n]    == 1 ? "rgb(0,175,0)" : "rgb(200,0,0)",
                            call_put = g.CONTRACT_TYPE[n] == 1 ? " CALL "       : " PUT ",
                            expiry   = " &nbsp" + g.EXPIRY[n] + " DTE";

                        //trade summary
                        elem.select(ele+"summary").innerHTML   = buy_sell + g.NUM_CONTRACTS[n] + "&nbsp x &nbsp" + g.STRIKE_PRICE[n] + call_put + expiry;
                        elem.select(ele+"summary").style.color = color;
                        elem.select(ele+"summary").style.borderRightColor = "rgb(0,0,0)";

                        //option price
                        elem.select(ele+"price").innerHTML   = "$" + g.OPTION_PRICE[n].toFixed(2);
                        elem.select(ele+"price").style.color = color;
                    })(i);
                }


                //write option price total to its trade summary table element
                (function() {

                    var price = 0;

                    for(i=1; i<g.TRADE_LEGS+1; i++) { price += g.LONG_SHORT[i]*g.NUM_CONTRACTS[i]*g.OPTION_PRICE[i].toFixed(2) }

                    elem.select("price-total").innerHTML   = "$" + Math.abs(price).toFixed(2);
                    elem.select("price-total").style.color = Math.sign(price) == 1 ? "rgb(0,150,0)" : "rgb(175,0,0)";
                })();


                //add nearest expiry value to the 'output-time-field' and set this value as the field's maximum
                elem.select("output-time-field").value = obj.min(g.EXPIRY);
                elem.select("output-time-field").setAttribute("max", obj.min(g.EXPIRY));


                //transitions, calculate and display output
                elem.ease("out", "final-params-container", 0.65, 39);
                elem.fade("out", "final-params-container", 0.03);

                elem.fade("in", "output-container", 0.01, function() {

                    //status message
                    console.log('now calculating...');

                    //add 'calculating' text
                    elem.create({tag: "div", content: 'Calculating...', attributes: {id: "BSM-calc-text", class: "loading-text"}}, "output-view-container");

                    setTimeout(function() { BSM.data(visuals.init) }, 100);
                });
                break;
        }
    }
})

// END FINAL PARAMETERS =============================================================================================================================
