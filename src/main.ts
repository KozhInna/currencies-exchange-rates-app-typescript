interface Data {
  conversion_rates: Record<string, number>;
}

class FetchWrapper {
  baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  get(endpoint: string): Promise<Data> {
    return fetch(this.baseURL + endpoint).then((response) => response.json());
  }

  put(endpoint: string, body: any): Promise<any> {
    return this._send("put", endpoint, body);
  }

  post(endpoint: string, body: any): Promise<any> {
    return this._send("post", endpoint, body);
  }

  delete(endpoint: string, body: any): Promise<any> {
    return this._send("delete", endpoint, body);
  }

  _send(method: string, endpoint: string, body: any): Promise<any> {
    return fetch(this.baseURL + endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((response) => response.json());
  }
}

//TODO
/* The goal of this project is to show the user the conversion rate between 2 currency pairs.
  The currency chosen on the left is the base currency and the currency chosen on the right is the target currency.
  The app starts at 1 USD = 1 USD.
  
  The API you need to use in this challenge is exchangerate-api.com.
  You can create a free account and browse the documentation.
  
  The free plan on this API allows you to perform 1,500 requests per month.
  Remember that every time you type in the editor, the browser preview will refresh,
  causing a new API request. In order not to exceed your limit, we recommend commenting out the
  fetch/FetchWrapper related code after you get it to work the first time. */

//Notes:
// Sign up for a free account on exchange <a href="https://www.exchangerate-api.com/">https://www.exchangerate-api.com/</a>
// Copy the example request
// Please check the documentation link, read Standard Requests documentation
// Sending a GET request to <a href="https://v6.exchangerate-api.com/v6/YOUR_API_KEY/latest/USD">https://v6.exchangerate-api.com/v6/YOUR_API_KEY/latest/USD</a>
// Above will give you exchange rate comapred to USD

// TODO: WRITE YOUR TYPESCRIPT CODE HERE

// A global variable that references the HTML select element with the id base-currency
const baseCurrency = document.getElementById(
  "base-currency"
) as HTMLSelectElement;
// A global variable that references the HTML select element with the id target-currency
const targetCurrency = document.getElementById(
  "target-currency"
) as HTMLSelectElement;
// A global variable that references the HTML paragraph element with the id conversion-result
const conversionResult = document.getElementById(
  "conversion-result"
) as HTMLParagraphElement;
// A global variable that stores the conversion rates for each currency pair as an array of arrays
let conversionRates: [string, number][] = [];

// An instance of the FetchWrapper class with the base URL of the API
// A constant that stores the API key for authentication
const apiKey = (import.meta as any).env.VITE_API_KEY;
const baseURL = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/`;
const api = new FetchWrapper(baseURL);

// A call to the get method of the API instance with the endpoint that requests the latest conversion rates for the USD currency
// Assign the conversion_rates property of the response data to the rates variable
api.get("USD").then((res) => {
  const data = res.conversion_rates;
  for (const item in data) {
    const itemOfArr: [string, number] = [item, data[item]];
    conversionRates.push(itemOfArr);
  }
  console.log(conversionRates);
});

// Add an event listener to the base element that invokes the getConversionRates function when the user selects a new value
const getConversionRates = async () => {
  const base = baseCurrency.value;
  const target = targetCurrency.value;

  conversionRates = [];

  // Push data to conversionsArr in the requested format (array of arrays)
  const res = await api.get(base);
  const data = res.conversion_rates;
  for (const item in data) {
    conversionRates.push([item, data[item]]);
  }

  // Find conversion rate
  currencyConversionRes(conversionRates, target);
};

baseCurrency.addEventListener("change", getConversionRates);
// Add an event listener to the target element that invokes the getConversionRates function when the user selects a new value
targetCurrency.addEventListener("change", getConversionRates);

// A function that performs the currency conversion and updates the UI

// Iterate over the rates array and find the rate that matches the target currency value
// If the currency name matches the target currency value
// Assign the conversion rate to the textContent property of the result element, which displays it on the web page
const currencyConversionRes = (
  currencyOfArr: [string, number][],
  target: string
) => {
  const conversionRate = currencyOfArr.find((item) => item[0] === target)?.[1];

  conversionResult.textContent = conversionRate
    ? conversionRate.toString()
    : "error";
};
