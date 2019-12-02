# FlightAware API Bindings

This repository provides TypeScript bindings to the [FlightAware API v3.0][fa-api]. Usage requires an [API key][fa-api-key].

## Usage
```js
import { createApi } from 'flightaware-ts'

const FA_USERNAME = "USERNAME_GOES_HERE";
const FA_API_KEY = "API_KEY_GOES_HERE";
const FA_CONFIG = {
    username: FA_USERNAME,
    apiKey: FA_API_KEY
}
const api = createApi(FA_CONFIG);

api.findFlight({
    origin: 'KIAH',
    destination: 'KJFK',
    type: 'nonstop'
}).then(x => console.log(x.flights[0]))
/* Prints:
{"num_segments":1,"segments":[{"ident":"DAL214","faFlightID":"DAL214-1575092751-airline-0510","airline":"DAL","airline_iata":"DL","flightnumber":"214","tailnumber":"N109DU","type":"Form_Airline","blocked":false,"diverted":false,"cancelled":false,"origin":{"code":"KIAH","city":"Houston, TX","alternate_ident":"","airport_name":"Houston Bush Int'ctl"},"destination":{"code":"KJFK","city":"New York, NY","alternate_ident":"","airport_name":"John F Kennedy Intl"},"filed_ete":11700,"route":"MMUGS4 GUSTI Q22 CATLN J37 AJFEB GRD Q64 TYI J209 SAWED J121 SIE CAMRN4","filed_altitude":370,"display_filed_altitude":"37,000 feet","filed_airspeed_kts":379,"distance_filed":1417,"filed_departure_time":{"epoch":1575332400,"tz":"CST","dow":"Monday","time":"06:20PM","date":"12/02/2019","localtime":1575310800},"estimated_departure_time":{"epoch":1575332400,"tz":"CST","dow":"Monday","time":"06:20PM","date":"12/02/2019","localtime":1575310800},"actual_departure_time":{"epoch":0},"departure_delay":0,"filed_arrival_time":{"epoch":1575344100,"tz":"EST","dow":"Monday","time":"10:35PM","date":"12/02/2019","localtime":1575326100},"estimated_arrival_time":{"epoch":1575344100,"tz":"EST","dow":"Monday","time":"10:35PM","date":"12/02/2019","localtime":1575326100},"actual_arrival_time":{"epoch":0},"arrival_delay":0,"status":"Scheduled","progress_percent":-1,"aircrafttype":"BCS1","full_aircrafttype":"BCS1","adhoc":false}]}
 */
```

See the [API reference][fa-api-ref] for full endpoint documentation.

[fa-api]: https://flightaware.com/commercial/flightxml/v3/content.rvt
[fa-api-key]: https://flightaware.com/commercial/flightxml/v3/pricing.rvt
[fa-api-ref]: https://flightaware.com/commercial/flightxml/v3/apiref.rvt
