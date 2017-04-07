<a href="">Risk Cloud</a>
===

&nbsp; An open-source desktop web application that's fully client-side, with a single dependency on <a href="https://github.com/mrdoob/three.js/">Three.js</a>. The current build allows users to visualize <a href="https://en.wikipedia.org/wiki/Option_(finance)">options</a> structures with a maximum of four legs and sixth months remaining to expiration using the <a href="https://en.wikipedia.org/wiki/Black%E2%80%93Scholes_model">Black-Scholes-Merton model</a>.

&nbsp; Click the corresponding link in the 'MODEL' sub-menu to begin. Select the number of legs in the trade and press the 'Continue' button.

<br>
<img width="" alt="home page" src="https://drive.google.com/uc?export=download&id=0B3rehuqgDPeVM2JoaWkwQ1Zqcms">
<br>
<img width="" alt="BSM page 1" src="https://drive.google.com/uc?export=download&id=0B3rehuqgDPeVaXJ0eDh6WEZtNWM">
<br>

&nbsp; Enter the details of the trade and click 'Calculate' to start loading the structure, or click 'Return' to redefine the number of legs. Time spreads, etc. may be specified via the blue tabs in the first column, which open those parameters for editing in the other columns.

&nbsp; <i>The parameters for the trade below reflect data from April 3rd, 2017 for the monthly SPX options expiring June 16th, 2017. They are provided for demonstration purposes only and do not constitute a recommendation.</i>

<br>
<img width="" alt="BSM page 2" src="https://drive.google.com/uc?export=download&id=0B3rehuqgDPeVZU9DMHR6ZkUtQXc">
<br>

&nbsp; Visual presentation was inspired by the <a href="https://www.thinkorswim.com/t/trading.html">ThinkorSwim desktop</a> platform. Users familiar with that software will recognize similarities in the graph as well as the mouse tracker and its output. One key difference is the addition of a 'T-0.5' line, shown in purple. This curve gauges trade behavior a half-day before expiration, which can be useful in determining holding periods as some structures can retain significant profit potential until very close to expiry.

&nbsp; The yellow vertical dotted lines mark the discrete range from -3 standard deviations to +3, with the <a href="https://en.wikipedia.org/wiki/Moneyness">at-the-money</a> center line being 0. A guess for future realized volatility, derived from the <a href="https://en.wikipedia.org/wiki/Implied_volatility">implied volatilities</a> in the trade, is used as a proxy for <a href="https://en.wikipedia.org/wiki/Standard_deviation">standard deviation</a>.

&nbsp; The table under the graph details option price, implied volatility and five of the most widely-used <a href="https://en.wikipedia.org/wiki/Greeks_(finance)">greeks</a> for each leg. Totals are provided, though not for implied volatility, since those quantities are not additive. It's important to also mention that the IV and greeks data, along with any other application output, assumes the trade parameters are accurate as of 16:00 EDT on the current day.

<br>
<img width="" alt="BSM page 3 profit" src="https://drive.google.com/uc?export=download&id=0B3rehuqgDPeVcTFObFluQVFLbzQ">
<br>

&nbsp; Two of the eight greeks supported by the app, <a href="https://en.wikipedia.org/wiki/Greeks_(finance)#Delta">Delta</a> and <a href="https://en.wikipedia.org/wiki/Greeks_(finance)#Vomma">Vomma</a>, are shown below. In the Vomma graph, the blue 't+0' line reflects the approximate state of the trade 36 days from expiry. This value, which has a minimum of 1, can be adjusted using the widget in the lower-right portion of the output container.

&nbsp; Press 'Return' at any time to adjust the trade parameters.

<br>
<img width="" alt="BSM page 3 delta" src="https://drive.google.com/uc?export=download&id=0B3rehuqgDPeVLUFHOEU2bjVfb1E">
<br>
<img width="" alt="BSM page 3 vomma" src="https://drive.google.com/uc?export=download&id=0B3rehuqgDPeVUXNMSDk2SUtpN2c">
<br>

&nbsp; <i>Note that in the images above, the site is being accessed locally. In addition to a live version, users can opt to <a href="https://github.com/Ice101781/risk_cloud/archive/master.zip">download</a> the app for use offline.</i>
