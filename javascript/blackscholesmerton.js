﻿//VALIDATE INITIAL PARAMETERS
  validateInitialParams = function() {

    var initialInputs = {

          feesField:             "fees-field",
          timeToExpiryCheckbox:  "time-to-expiry-checkbox",
          dividendYieldCheckbox: "dividend-yield-checkbox",
          riskFreeRateCheckbox:  "risk-free-rate-checkbox",
          numLegsRadio1:         "num-legs-radio-1",
          numLegsRadio2:         "num-legs-radio-2",
          numLegsRadio3:         "num-legs-radio-3",
          numLegsRadio4:         "num-legs-radio-4",
          continueButton1:       "continue-button-1",
        },

        initialConditions = {

          feesField:         (__select(initialInputs.feesField).value != "" && __select(initialInputs.feesField).value >= 0),
        };


    if(initialConditions.feesField) {

      //CAPTURE INITIAL USER-DEFINED PARAMETERS
        globalParams.contractFees = Math.round(__select("fees-field").value*100)/100;
        globalParams.tradeLegs    = Math.round(__select("input[name=num-legs-radio]:checked").value*1)/1;

      //DISABLE INITIAL INPUT ELEMENTS ON 'CONTINUE' CLICK
        elementAvail(initialInputs, false);

      //DYNAMICALLY CREATE ELEMENTS NEEDED TO SPECIFY ADDITIONAL PARAMETERS
        validateFinalParams();

    } else {

      //SOME INPUT ERROR MESSAGE HANDLING
        if(!initialConditions.feesField) {

          __select(initialInputs.feesField).style.borderColor = '#ff0000';
            alert("Please enter a valid number string greater than or equal to 0 for the total commissions and fees per contract.");
          __select(initialInputs.feesField).style.borderColor = '#f5f5f5';

          return;
        };
    };
  };


//VALIDATE FINAL PARAMETERS
  validateFinalParams = function() {

    //CREATE A CONTAINER FOR THE TRADE LEGS
      __element({tag: "div", attributes: {id: "more-params-container"}}, "user-params-container");


      //CREATE USER-SPECIFIED NUMBER OF TRADE LEG CONTAINERS, ADD CHILD ELEMENTS
        for(var i=0; i<globalParams.tradeLegs; i++) {

          __element({tag: "div", attributes: {id: "leg-"+(i+1), class: "trade-leg"}}, "more-params-container");

          
          //BUY/SELL RADIO
            __element({tag: "form", attributes: {id: "buy-sell-form-"+(i+1)}}, "leg-"+(i+1));

              __element({tag: "input", attributes: {type: "radio", id: "buy-radio-"+(i+1), name: "buy-sell-radio-"+(i+1), value: "1"}}, "buy-sell-form-"+(i+1));
              __element({tag: "label", content: "Buy", attributes: {"for": "buy-radio-"+(i+1), class: "buy-sell-radio"}}, "buy-sell-form-"+(i+1));

              __element({tag: "input", attributes: {type: "radio", id: "sell-radio-"+(i+1), name: "buy-sell-radio-"+(i+1), value: "-1"}}, "buy-sell-form-"+(i+1));
              __element({tag: "label", content: "Sell", attributes: {"for": "sell-radio-"+(i+1), class: "buy-sell-radio"}}, "buy-sell-form-"+(i+1));

          
            //ALTERNATE BUY/SELL DEFAULT SELECTION TO SAVE TIME SETTING UP CERTAIN TRADES - VERTICALS, BUTTERFLIES, ETC.
              if(i % 2 == 0) { __select("buy-radio-"+(i+1)).setAttribute("checked", "") } else { __select("sell-radio-"+(i+1)).setAttribute("checked", "") };
        };


    //SPECIFY THE CURRENT PRICE OF THE UNDERLYING ASSET
      __element({tag: "form", attributes: {id: "current-price-form"}}, "user-params-container");

        __element({tag: "div", content: "Current price of the underlying asset :", attributes: {class: "align-helper"}}, "current-price-form");

        __element({tag: "input", attributes: {type: "number", id: "current-price-field", min: ".01", step: ".01", placeholder: "Ex:  5432.10", onblur: "this.placeholder='Ex:  5432.10'", onfocus: "this.placeholder=''"}}, "current-price-form");


    //EASE-IN ANIMATION FOR THE NEW ELEMENTS
      elementAnim.ease("in", "more-params-container", 10, 0.5, 16);


    //debug
      console.log(globalParams);
  };


/*TO BE PLACED IN THE FUNCTION THAT EXECUTES WHEN 'CALCULATE' BUTTON IS CLICKED

    var finalInputs = {

          currentPriceField: "current-price-field",
        },

        finalConditions = {

          currentPriceField: (__select(finalInputs.currentPriceField).value != "" && __select(finalInputs.currentPriceField).value > 0),
        };


    if(finalConditions.currentPriceField) {

      //CAPTURE FINAL USER-DEFINED PARAMETERS
        for(var i=0; i<globalParams.tradeLegs; i++) {
    
          globalParams.signs[(i+1)] = __select("input[name=buy-sell-radio-"+(i+1)+"]:checked").value;
        };

        globalParams.currentPrice = Math.round(__select("current-price-field").value*100)/100;


      //DISABLE FINAL INPUT ELEMENTS ON 'CALCULATE' CLICK
        elementAvail(finalInputs, false);

    } else {

      if(!finalConditions.currentPriceField) {

        __select(finalInputs.currentPriceField).style.borderColor = '#ff0000';
          alert("Please enter a valid number string greater than 0 for the current price of the underlying asset.");
        __select(finalInputs.currentPriceField).style.borderColor = '#f5f5f5';

        return;
      };
    };
    
END*/