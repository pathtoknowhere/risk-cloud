//the Black-Scholes-Merton model for valuing multi-leg European-style options which pay a continuous dividend yield
BSM = function(properties) {

    var self = function() { return };

    for(prop in properties) { self[prop] = properties[prop] }

    return self;
}({

    //objects to store theoretical option prices and the 'greeks'
    price: {},

    delta: {},

    gamma: {},

    theta: {},

    vega:  {},

    rho:   {},

    //extract implied volatility from an option price using one of two methods
    impVol: function(leg, S, mtd) {

        //local variables
        var type = g.CONTRACT_TYPE[leg],
            n    = g.NUM_CONTRACTS[leg],
            K    = g.STRIKE_PRICE[leg],
            optP = g.OPTION_PRICE[leg],
            T    = g.EXPIRY[leg]/365,
            D    = g.DIV_YIELD[leg],
            r    = g.RISK_FREE[leg],
            bsmP = 0;

        switch(mtd) {

            //Newton-Raphson
            case 'Newton-Raphson':

                //case-specific local vars
                var est = 0.2,
                    itr = 15;

                for(j=0; j<itr; j++) {

                    //local loop variables
                    var d1  = (Math.log(S/K)+((r-D+(Math.pow(est,2)/2))*T))/(est*Math.sqrt(T)),
                        d2  = d1-(est*Math.sqrt(T)),
                        vga = S*Math.pow(Math.E,-D*T)*math.NORM(d1)*Math.sqrt(T);

                    //option price based on current estimate for implied volatility
                    bsmP = type*((S*math.LOGISTIC(type*d1)*Math.pow(Math.E,-D*T))-(K*math.LOGISTIC(type*d2)*Math.pow(Math.E,-r*T)));

                    //return a value if threshold condition is met
                    if(Math.abs(optP-bsmP) <= Math.pow(10,-2)) { return est }

                    //next estimate for implied volatility
                    est += (optP-bsmP)/vga;
                }

                if(j==itr) { return false }


            //bisection
            case 'Bisection':

                //console message
                console.log('The Newton-Raphson method did not converge for leg '+leg+'. Now implementing the Bisection method...');

                //case-specific local vars
                var low = 0.01,
                    hgh = 2,
                    itr = 50;

                for(j=0; j<itr; j++) {

                    //local loop variables
                    var est = (low+hgh)/2,
                        d1  = (Math.log(S/K)+((r-D+(Math.pow(est,2)/2))*T))/(est*Math.sqrt(T)),
                        d2  = d1-(est*Math.sqrt(T));

                    //option price based on current estimate for implied volatility
                    bsmP = type*((S*math.LOGISTIC(type*d1)*Math.pow(Math.E,-D*T))-(K*math.LOGISTIC(type*d2)*Math.pow(Math.E,-r*T)));

                    //next estimate for implied volatility
                    switch(Math.sign(optP-bsmP)) {

                        case 1:
                            low = est;
                            break;

                        case -1:
                            hgh = est;
                            break;
                    }

                    //return a value if threshold condition is met
                    if(Math.abs(low-hgh) <= Math.pow(10,-10)) { return est }
                }
        }
    },


    //option price and greeks for the overall trade relative to a given time and stock price
    calc: function(t, S) {

        for(i=1; i<g.TRADE_LEGS+1; i++) {

            //local variables
            var sgnN = g.LONG_SHORT[i]*g.NUM_CONTRACTS[i],
                type = g.CONTRACT_TYPE[i],
                K    = g.STRIKE_PRICE[i],
                tau  = (g.EXPIRY[i]-t)/365,
                D    = g.DIV_YIELD[i],
                r    = g.RISK_FREE[i],
                vol  = g.IMPLIED_VOL[i],
                d1   = tau == 0 && S == K ? Infinity : (Math.log(S/K)+((r-D+(Math.pow(vol,2)/2))*tau))/(vol*Math.sqrt(tau)),
                d2   = d1-(vol*Math.sqrt(tau));

            //price
            this.price[i] = +(sgnN*type*((S*math.LOGISTIC(type*d1)*Math.pow(Math.E,-D*tau))-(K*math.LOGISTIC(type*d2)*Math.pow(Math.E,-r*tau)))*100).toFixed(2);

            //greeks
            this.delta[i] = +(sgnN*type*Math.pow(Math.E,-D*tau)*math.LOGISTIC(type*d1)*100).toFixed(2);

            this.gamma[i] = tau !== 0 ? +(sgnN*(Math.pow(Math.E,-D*tau)*math.NORM(d1))/(S*vol*Math.sqrt(tau))*100).toFixed(2) : 0;

            this.theta[i] = tau !== 0 ? +(sgnN*((S*Math.pow(Math.E,-D*tau)*(D*type*math.LOGISTIC(type*d1)))-(K*Math.pow(Math.E,-r*tau)*((r*type*math.LOGISTIC(type*d2))+((vol*math.NORM(d2))/(2*Math.sqrt(tau))))))/3.65).toFixed(2) : 0;

            this.vega[i]  = +(sgnN*S*Math.pow(Math.E,-D*tau)*math.NORM(d1)*Math.sqrt(tau)).toFixed(2);

            this.rho[i]   = +(sgnN*type*K*tau*Math.pow(Math.E,-r*tau)*math.LOGISTIC(type*d2)).toFixed(2);
        }
    },


    //compute and store profit/loss and greeks data across a range of stock prices and time 
    data: function(callback) {

        //local variables
        var sPrices = [],
            tCost,
            arr     = ['delta','gamma','theta','vega','rho'];

        // HELPERS ==================================================================================================================================

        //calculate the implied volatility for each trade leg and store it to the global object
        getImpliedVols = function() {

            for(i=1; i<g.TRADE_LEGS+1; i++) {

                g.IMPLIED_VOL[i] = BSM.impVol(i, g.STOCK_PRICE, 'Newton-Raphson') || BSM.impVol(i, g.STOCK_PRICE, 'Bisection');
            }
        }

        //create the stock price space
        getStockSpace = function() {

            //local vars
            var kDists = {},
                vols   = {},
                n      = 500,
                v;

            //determine a standard deviation for use in generating the range of stock prices in the space
                //keys of nearest expirys
                var eKeys = obj.filterKeys(g.EXPIRY, function(time) { return time == obj.min(g.EXPIRY) });

                //distances from filtered strikes to the stock price
                for(i=0; i<eKeys.length; i++) { kDists[eKeys[i]] = Math.abs(g.STRIKE_PRICE[eKeys[i]]-g.STOCK_PRICE) }

                //keys of filtered strikes 'nearest-to-the-money'
                var kDistsKeys = obj.filterKeys(kDists, function(dist) { return dist == obj.min(kDists) });

                //IV's of the options at the filtered strikes
                for(j=0; j<kDistsKeys.length; j++) { vols[kDistsKeys[j]] = g.IMPLIED_VOL[kDistsKeys[j]] }

                //stock price space IV (average of the IV's adjusted for the nearest trade horizon)
                v = obj.avg(vols)*Math.sqrt(obj.min(g.EXPIRY)/365);


            //create the array of stock prices using a range of -3 to +3 v's
            for(i=0; i<n+1; i++) { sPrices.push(+(g.STOCK_PRICE*(1-(3*v)*(1-(2*i/n)))).toFixed(2)) }

            //delete any duplicate prices in the stock price array
            sPrices = array.unique(sPrices);

            //store the new array's length to the global object
            g.STOCKRANGE_LENGTH = sPrices.length;
        }

        getStockSpaceData = function(t) {

            for(s=0; s<g.STOCKRANGE_LENGTH; s++) {

                //clear old values
                obj.reset(BSM);

                //calculate new values
                BSM.calc(t, sPrices[s]);

                //store values across time and stock price
                g.PROFITLOSS_DATA[t][sPrices[s].toFixed(2)] = +(obj.sum(BSM.price)-tCost).toFixed(2);

                arr.forEach(function(greek) { g[greek.toUpperCase()+'_DATA'][t][sPrices[s].toFixed(2)] = +(obj.sum(BSM[greek])).toFixed(2) });

                //store current 'greek' values to the global object for use in the trade summary table
                if(t == 0 && s == (g.STOCKRANGE_LENGTH-1)/2) {

                    arr.forEach(function(greek) { for(n in BSM[greek]) { g[greek.toUpperCase()][n] = BSM[greek][n] } });
                }
            }
        }

        getTimeSpaceData = function(start, end) {

            for(t=start; t<=end; t++) {

                //declare objects for profit/loss and greeks data storage, get data for current day
                g.PROFITLOSS_DATA[t] = {};

                arr.forEach(function(greek) { g[greek.toUpperCase()+'_DATA'][t] = {} });

                getStockSpaceData(t);
            }
        }

        // END HELPERS ==============================================================================================================================


        // MAIN =====================================================================================================================================

        allData = function(callback) {

            getImpliedVols();
            getStockSpace();

            //calculate current trade values
            BSM.calc(0, g.STOCK_PRICE);

            //store the current price of the trade
            tCost = obj.sum(BSM.price);

            getTimeSpaceData(0, obj.min(g.EXPIRY)-1);
            getTimeSpaceData(obj.min(g.EXPIRY)-0.5, obj.min(g.EXPIRY)-0.5);
            getTimeSpaceData(obj.min(g.EXPIRY), obj.min(g.EXPIRY));

            //clear values after last calculation
            obj.reset(BSM);

            callback = function() {

                //remove 'calculating' text
                elem.destroyChildren("output-view-container", ["BSM-calc-text"]);

                //status message
                console.log('finished calculations.');

                //add 'pushing data' text
                elem.create({tag: "div", content: 'Pushing data to three.js...', attributes: {id: "BSM-push-text", class: "loading-text"}}, "output-view-container");

                //status message
                console.log('pushing vertices to point cloud geometries...');
            }();
        }();

        //data visualization callback
        if(typeof callback === 'function') { callback() }

        // END MAIN =================================================================================================================================
    }
})
