import axios, { AxiosBasicCredentials } from 'axios';
const fxmlUrl = 'https://flightxml.flightaware.com/json/FlightXML3/';

interface APIConfig {
  username: string;
  apiKey: string;
}

interface AircraftTypeParams {
  /**
   * Aircraft type ID
   */
  type: string;
}

interface AircraftTypeStruct {
  description: string;
  engine_count?: number;
  engine_type?: string;
  manufacturer: string;
  type: string;
}

interface AirlineFlightSchedulesParams {
  /**
   * Timestamp of earliest flight departure to return, specified in integer seconds since 1970 (UNIX epoch time).
   * Use UTC/GMT to convert the local time at the departure airport to this timestamp.
   */
  start_date: number;
  /**
   * Timestamp of latest flight departure to return, specified in integer seconds since 1970 (UNIX epoch time).
   * Use UTC/GMT to convert the local time at the departure airport to this timestamp.
   */
  end_date: number;
  /**
   * Optional airport code of origin. If blank or unspecified, then flights with any origin will be returned.
   */
  origin?: string;
  /**
   * Optional airport code of destination. If blank or unspecified, then flights with any destination will be returned.
   */
  destination?: string;
  /**
   * Optional airline code of the carrier. If blank or unspecified, then flights on any airline will be returned.
   */
  airline?: string;
  /**
   * Optional flight number. If blank or unspecified, then any flight number will be returned.
   */
  flightno?: string;
  /**
   * Optional flag to include codeshare flights. Defaults to false.
   */
  exclude_codeshare?: boolean;
  /**
   * Optional maximum number of past records to obtain. Must be a positive integer value. Defaults to 15.
   */
  howMany?: number;
  /**
   * Optional. Must be an integer value of the offset row count you want the search to start at. Most requests should be 0 (most recent report).
   */
  offset?: number;
}

interface AirlineFlightScheduleStruct {
  /**
   * if ident is a codeshare flight, actual_ident is the primary identifier used by the operator
   */
  actual_ident: string;
  /**
   * aircraft type ID
   */
  aircrafttype: string;
  /**
   * scheduled time of arrival (seconds since 1970)
   */
  arrivaltime: number;
  /**
   * scheduled time of departure (seconds since 1970)
   */
  departuretime: number;
  /**
   * the destination ICAO airport ID
   */
  destination: string;
  /**
   * FlightAware flight ident if available
   */
  fa_ident?: string;
  /**
   * flight ident
   */
  ident: string;
  /**
   * Meal service offered on the flight if available
   */
  meal_service?: string;
  /**
   * the origin ICAO airport ID
   */
  origin: string;
  /**
   * Number of seats in the business class cabin
   */
  seats_cabin_business?: number;
  /**
   * Number of seats in the coach class cabin
   */
  seats_cabin_coach?: number;
  /**
   * Number of seats in the first class cabin
   */
  seats_cabin_first?: number;
}

interface ArrayOfAirlineFlightScheduleStruct {
  flights: AirlineFlightScheduleStruct[];
  next_offset: number;
}

interface AirlineInfoParams {
  /**
   * the ICAO airline ID (e.g., COA, ASA, UAL, etc.)
   */
  airline_code: string;
}

interface AirlineInfoStruct {
  airbourne?: number;
  callsign: string;
  country: string;
  flights_last_24_hours?: number;
  location: string;
  name: string;
  phone: string;
  shortname: string;
  url: string;
  wiki_url?: string;
}

interface AirportBoardsParams {
  /**
   * airport code
   */
  airport_code: string;
  /**
   * Optional. Set to true or 1 to receive extended flight information. Defaults to false.
   */
  include_ex_data?: boolean;
  /**
   * Optional. Specify "ga" to show only general aviation traffic, "airline" to only show airline traffic.
   * If null/void then all types are returned. You can also limit results to a particular airline by specifying
   * "airline:airlineCode" where the airlineCode is the ICAO identifier for that airline.
   */
  filter?: string;
  /**
   * Select "all" or any space separated combination of "arrivals", "departures", "enroute", and "scheduled". Defaults to all
   */
  type?: string;
  /**
   * Optional. Number of flights to fetch, per type. Defaults to 15.
   */
  howMany?: number;
  /**
   * Optional. Offset for query. Defaults to 0.
   */
  offset?: number;
}

interface AirportBoardsStruct {
  airport: string;
  airport_info?: AirportStruct;
  arrivals?: TrackAirportStruct;
  departures?: TrackAirportStruct;
  enroute?: TrackAirportStruct;
  scheduled?: TrackAirportStruct;
}

interface AirportDelaysParams {
  /**
   * Optional airport to retrieve delays for. if blank then delays for all airports will be returned
   */
  airport_code?: string;
  /**
   * Optional. Maximum number of aggregated rows to return. Must be a positive integer. Defaults to 15.
   */
  howMany?: number;
  /**
   * Optional. Must be an integer value of the offset row count you want the search to start at. Most requests should be 0.
   */
  offset?: number;
}

interface AirportDelaysStruct {
  delays: AirportDelayEntry[];
  next_offset: number;
}

interface AirportDelayEntry {
  /**
   * icao/iata code of airport
   */
  airport: string;
  /**
   * category of largest delay
   */
  category: string;
  /**
   * color of largest delay
   */
  color: string;
  /**
   * duration of largest delay
   */
  delay_secs: number;
  /**
   * Array of reasons for the delay
   */
  reasons_all: AirportDelayReason[];
}

interface AirportDelayReason {
  /**
   * Category for the delay (ie weather, runway)
   */
  category: string;
  /**
   * Color indicating severity of largest delay
   */
  color: string;
  /**
   * Duration in seconds of the largest delay
   */
  delay_secs: number;
  /**
   * Textual description of the cause of the delay
   */
  reason: string;
}

interface AirportInfoParams {
  /**
   * the ICAO airport ID (e.g., KLAX, KSFO, KIAH, KHOU, KJFK, KEWR, KORD, KATL, etc.)
   */
  airport_code: string;
}

interface AirportStruct {
  airport_code: string;
  alternate_ident?: string;
  city: string;
  country_code?: string;
  direction?: string;
  distance?: number;
  elevation?: number;
  heading?: number;
  latitude?: number;
  longitude?: number;
  name: string;
  state?: string;
  timezone: string;
  wiki_url?: string;
}

interface BlockIdentCheckParams {
  /**
   * requested tail number
   */
  ident: string;
}

interface CountAirportOperationsParams {
  /**
   * the ICAO airport ID (e.g., KLAX, KSFO, KIAH, KHOU, KJFK, KEWR, KORD, KATL, etc.)
   */
  airport_code: string;
}

interface CountAirportOperationsStruct {
  departed: number;
  enroute: number;
  scheduled_arrivals: number;
  scheduled_departures: number;
}

interface ArrayOfCountAirlineOperationsStruct {
  data: CountAirlineOperationsStruct[];
}

interface CountAirlineOperationsStruct {
  /**
   * Number of flights currently enroute
   */
  enroute: number;
  /**
   * ICAO identifier for the airline
   */
  icao: string;
  /**
   * Full name of the airline
   */
  name: string;
}

interface DecodeFlightRouteParams {
  /**
   * unique identifier assigned by FlightAware for the desired flight (or use "ident@departureTime")
   */
  faFlightId: string;
}

interface ArrayOfFlightRouteStruct {
  data: FlightRouteStruct[];
  route_distance: string;
}

interface FlightRouteStruct {
  /**
   * Distance from origin airport
   */
  distance_from_origin?: number;
  /**
   * Distance from the last point on Route
   */
  distance_this_leg?: number;
  /**
   * Distance to destination airport
   */
  distance_to_destination?: number;
  /**
   * Latitude of the fix
   */
  latitude?: number;
  /**
   * Longitude of the fix
   */
  longitude?: number;
  /**
   * Name of the route fix
   */
  name?: string;
  /**
   * Course from the current point to the next
   */
  outbound_course?: number;
  /**
   * Type of the fix (ie Waypoint / Reporting Point)
   */
  type?: string;
}

interface DecodeRouteParams {
  /**
   * Origin airport code
   */
  origin: string;
  /**
   * Space separated list of intersections and/or VORs along the route (e.g. WYLSN MONNT KLJOY MAJKK REDDN4)
   */
  route: string;
  /**
   * Origin airport code
   */
  destination: string;
}

interface FindFlightParams {
  /**
   * Airport of origin
   */
  origin: string;
  /**
   * Airport of destination
   */
  destination: string;
  /**
   * Optional. Set to true or 1 to receive extended flight information. Defaults to false.
   */
  include_ex_data?: boolean;
  /**
   * Optional type of search (auto, nonstop, onestop). Default is auto.
   */
  type?: string;
  /**
   * Optional filter restrictions (all, ga, airline). Default is all.
   */
  filter?: string;
  /**
   * Optional maximum number of results to return. Must be a positive integer. Default is 15.
   */
  howMany?: number;
  /**
   * must be an integer value of the offset row count you want the search to start at. Most requests should be 0.
   */
  offset?: number;
}

interface FindFlightStruct {
  flights: FindFlightMatch[];
  next_offset: number;
  num_flights: number;
}

interface FindFlightMatch {
  num_segments: number;
  segments: FlightInfoStatusStruct[];
}

interface FlightInfoStatusStruct {
  /**
   * Runway actual arrival time
   */
  actual_arrival_time?: Timestamp;
  /**
   * Actual gate arrival time
   */
  actual_blockin_time?: Timestamp;
  /**
   * Actual gate departure time
   */
  actual_blockout_time?: Timestamp;
  /**
   * Runway actual departure time
   */
  actual_departure_time?: Timestamp;
  /**
   * Indicates if the flight is adhoc (no flight plan information available)
   */
  adhoc: boolean;
  /**
   * Aircraft type, ie. B727, C172
   */
  aircrafttype?: string;
  /**
   * Airline code (ICAO) extracted from the ident
   */
  airline?: string;
  /**
   * Airline code (IATA) extracted from the ident
   */
  airline_iata?: string;
  /**
   * Arrival delay (in seconds) based on either actual or estimated gate arrival time. If gate time is unavailable then based on runway arrival time. A negative value indicates the flight is early.
   */
  arrival_delay?: number;
  /**
   * alternate ident assigned by ATC, if available
   */
  atc_ident?: string;
  /**
   * Baggage claim location at the destinationi airport, if known
   */
  bag_claim?: string;
  /**
   * Indicates if the flight is blocked from public viewing
   */
  blocked: boolean;
  /**
   * Indicates if the flight was cancelled
   */
  cancelled: boolean;
  /**
   * Comma separated list of any codeshares operating on this flight.
   */
  codeshares?: string;
  datalink?: boolean;
  /**
   * Departure delay (in seconds) based on either actual or estimated gate departure time. If gate time is unavailable then based on runway departure time. A negative value indiates the flight is early.
   */
  departure_delay?: number;
  /**
   * Destination airport code, Lat/Lon location, final Navaid, or blank
   */
  destination?: AirportDisplayStruct;
  /**
   * Friendly string representation of the aircraft type
   */
  display_aircrafttype?: string;
  /**
   * Display friendly string for the filed altitude
   */
  display_filed_altitude?: string;
  /**
   * Distance based on the filed route. May vary from the actual distance flown
   */
  distance_filed?: number;
  /**
   * Indicates if the flight diverted
   */
  diverted: boolean;
  /**
   * Runway estimated arrival time
   */
  estimated_arrival_time?: Timestamp;
  /**
   * Estimated gate arrival time
   */
  estimated_blockin_time?: Timestamp;
  /**
   * Estimated gate departure time
   */
  estimated_blockout_time?: Timestamp;
  /**
   * Runway estimated departure time
   */
  estimated_departure_time?: Timestamp;
  /**
   * Unique identifier assigned by FlightAware for this specific flight
   */
  faFlightID: string;
  /**
   * Filed IFR airspeed in knots
   */
  filed_airspeed_kts?: number;
  /**
   * Filed IFR airspeed in mach number
   */
  filed_airspeed_mach?: number;
  /**
   * Filed IFR altitude
   */
  filed_altitude?: number;
  /**
   * Runway filed arrival time
   */
  filed_arrival_time?: Timestamp;
  /**
   * Scheduled gate arrival time
   */
  filed_blockin_time?: Timestamp;
  /**
   * Scheduled gate departure time
   */
  filed_blockout_time?: Timestamp;
  /**
   * Runway filed departure time
   */
  filed_departure_time?: Timestamp;
  /**
   * Runway-to-runway filed duration (seconds)
   */
  filed_ete?: number;
  /**
   * Flight number extracted from the ident
   */
  flightnumber?: string;
  /**
   * Full aircraft type including any suffic and prefix
   */
  full_aircrafttype?: string;
  /**
   * Gate at the destination airport, if known
   */
  gate_dest?: string;
  /**
   * Gate at the origin airport, if known
   */
  gate_orig?: string;
  /**
   * Identifier of the flight
   */
  ident: string;
  /**
   * Unique identifier assigned by FlightAware of the previous flight of the aircraft serving this flight, if known
   */
  inbound_faFlightID?: string;
  /**
   * Origin airport code, Lat/Lon location, initial Navaid, or otherwise
   */
  origin?: AirportDisplayStruct;
  /**
   * Progress bar indicator (0-100), or -1 if not yet departed or unknown
   */
  progress_percent?: number;
  /**
   * Filed IFR route for the flight
   */
  route?: string;
  /**
   * Number of seats in the business class cabin
   */
  seats_cabin_business?: number;
  /**
   * Number of seats in the coach class cabin
   */
  seats_cabin_coach?: number;
  /**
   * Number of seats in the first class cabin
   */
  seats_cabin_first?: number;
  /**
   * Human readable summary of flight status
   */
  status?: string;
  /**
   * Tail number for the aircraft
   */
  tailnumber?: string;
  /**
   * Terminal at the destination airport, if known
   */
  terminal_dest?: string;
  /**
   * Terminal at the origin airport, if known
   */
  terminal_orig?: string;
  /**
   * General_Aviation or Form_Airline
   */
  type: string;
}

interface AirportDisplayStruct {
  /**
   * Display friendly name for the airport
   */
  airport_name: string;
  /**
   * Any alternate identifiers for the airport. The IATA code, when available
   */
  alternate_ident: string;
  /**
   * Airport location city
   */
  city: string;
  /**
   * ICAO identifier for the airport
   */
  code: string;
}

interface FleetBoardsParams {
  /**
   * ICAO airline code
   */
  fleet_code: string;
  /**
   * Optional. Set to true or 1 to receive extended flight information. Defaults to false.
   */
  include_ex_data?: boolean;
  /**
   * Select one of "arrivals", "departures", "enroute", "scheduled", or "all". Defaults to all
   */
  type?: string;
  /**
   * Optional. Number of flights to fetch, per type. Defaults to 15.
   */
  howMany?: number;
  /**
   * Optional. Offset for query. Defaults to 0.
   */
  offset?: number;
}

interface FleetBoardsStruct {
  arrivals?: TrackFleetStruct;
  departures?: TrackFleetStruct;
  enroute?: TrackFleetStruct;
  fleet: string;
  scheduled?: TrackFleetStruct;
}

interface FlightCancellationStatisticsParams {
  /**
   * specifies which day to analyze. (must be 'yesterday', 'today', 'tomorrow', 'plus2days', 'twoDaysAgo', 'minus2plus12hrs', 'next36hrs', 'week')
   */
  time_period: string;
  /**
   * 	the aggregation criteria. (must be 'airline', 'origin', or 'destination')
   */
  type_matching: string;
  /**
   * This argument can be blank/unspecified to request that all results are returned.
   * Otherwise, when type_matching is 'airline', this argument can be the specific
   * airline you are interested in. When type_matching is 'origin' or 'destination',
   * this argument can be the specific airport you are interested in.
   */
  ident_filter?: string;
  /**
   * Optional. Maximum number of aggregated rows to return, ordered by highest to lowest. Must be a positive integer. Defaults to 15.
   */
  howMany?: number;
  /**
   * 	Optional. Must be an integer value of the offset row count you want the search to start at. Most requests should be 0.
   */
  offset?: number;
}

interface CancellationSummaryStruct {
  matching: CancellationRowStruct[];
  next_offset: number;
  total_cancellations_national: number;
  total_cancellations_worldwide: number;
  total_delays_worldwide: number;
  type_matching: string;
}

interface CancellationRowStruct {
  /**
   * the number of cancelled flights belonging to this airline/airport
   */
  cancellations: number;
  /**
   * the number of delayed flights belonging to this airline/airport
   */
  delays: number;
  /**
   * human displayable string. for airlines, the name of the airline. for origin/destination, the name of the airport.
   */
  description: string;
  /**
   * 	for airlines, the icao/iata airline code. for origin/destination, the icao/iata airport code.
   */
  ident: string;
  /**
   * the total number of originally scheduled flights belonging to this airline/airport
   */
  total: number;
}

interface FlightInfoStatusParams {
  /**
   * requested tail number, ident, atc_ident, or faFlightID
   */
  ident: string;
  /**
   * Optional. Set to true or 1 to receive extended flight information. Defaults to false.
   */
  include_ex_data?: boolean;
  /**
   * Optional results filter. This filter will be available in the future and will utilize ODate logical operators to filter results.
   */
  filter?: string;
  /**
   * Optional maximum number of past flights to obtain. Must be a positive integer value. Defaults to 15.
   */
  howMany?: number;
  /**
   * Optional. Must be an integer value of the offset row count you want the search to start at. Most requests should be 0.
   */
  offset?: number;
}

interface ArrayOfFlightInfoStatusStruct {
  flights: FlightInfoStatusStruct[];
  next_offset: number;
}

interface GetFlightTrackParams {
  /**
   * requested flight id (either a FlightAware flight id (e.g. SWA35-1491974780-airline-0046) or an ident with departure time (e.g. SWA35@1492200000))
   */
  ident: string;
  /**
   * Optional - false by default. Set to true to return estimated positions in the track.
   */
  include_position_estimates?: boolean;
}

interface ArrayOfTrackStruct {
  tracks: TrackStruct[];
}

interface TrackStruct {
  /**
   * The aircraft altitude at time of position update
   */
  altitude: number;
  /**
   * Indicates if the aircraft is climbing (C) or descending (D)
   */
  altitude_change: string;
  /**
   * The aircraft altitude in feet at time of position update
   */
  altitude_feet?: number;
  /**
   * C indicates the aircraft is 200 feet off its ATC assigned altitude
   */
  altitude_status: string;
  /**
   * The aircraft groundspeed at time of position update
   */
  groundspeed: number;
  /**
   * The aircraft heading at time of position update
   */
  heading?: number;
  /**
   * The latitude for the position update
   */
  latitude: number;
  /**
   * The longitude for the position update
   */
  longitude: number;
  /**
   * The timestamp for the position update
   */
  timestamp: number;
  /**
   * TP=projected, TO=oceanic, TZ=radar, TA=broadcast, TM=multilateration, TD=datalink, TX=surface, TS=space-based
   */
  update_type: string;
}

interface LatLongsToDistanceParams {
  /**
   * Latitude of point 1
   */
  lat1: number;
  /**
   * Longitude of point 1
   */
  lon1: number;
  /**
   * Latitude of point 2
   */
  lat2: number;
  /**
   * Longitude of point 2
   */
  lon2: number;
}

interface LatLongsToHeadingParams {
  /**
   * Latitude of point 1
   */
  lat1: number;
  /**
   * Longitude of point 1
   */
  lon1: number;
  /**
   * Latitude of point 2
   */
  lat2: number;
  /**
   * Longitude of point 2
   */
  lon2: number;
}

interface NearbyAirportsParams {
  /**
   * The latitude of the point to search near.
   */
  latitude?: number;
  /**
   * The longitude of the point to search near.
   */
  longitude?: number;
  /**
   * The airport code to search near
   */
  airport_code?: string;
  /**
   * The search radius to use for finding nearby airports in statute miles.
   */
  radius: number;
  /**
   * Optional. Return only airports with Instrument Approaches (also limits results to North America)
   */
  only_iap?: boolean;
  /**
   * Optional. Maximum number of aggregated rows to return. Must be a positive integer. Defaults to 15.
   */
  howMany?: number;
  /**
   * Optional. Must be an integer value of the offset row count you want the search to start at. Most requests should be 0 (closest airports).
   */
  offset?: number;
}

interface NearbyAirportsStruct {
  airports: AirportStruct[];
  next_offset: number;
}

interface RoutesBetweenAirportsParams {
  /**
   * the ICAO airport ID (e.g., KLAX, KSFO, KIAH, KHOU, KJFK, KEWR, KORD, KATL, etc.)
   */
  origin: string;
  /**
   * the ICAO airport ID (e.g., KLAX, KSFO, KIAH, KHOU, KJFK, KEWR, KORD, KATL, etc.)
   */
  destination: string;
  /**
   * maximum filed plan age of flights to consider. Can be a value less than or equal
   * to 14 days (2 weeks) OR 1 month OR 1 year (for example: "6 days" or "1 month" or "1 year").
   * This should generally be longer than maxDepartureAge.
   */
  max_file_age: string;
  /**
   * Optional. Sort column for results. Valid options are "count" (default) or
   * "last_departuretime". The "count" option will sort results by the route filing
   * count in descening order. The "last_departuretime" option will sort results by
   * the latest filed departuretime for that route in descending order (newest first).
   * Any invalid value will result in sorting by count descending.
   */
  sort_by: string;
  /**
   * Optional. Maximum number of past flights to obtain. Must be a positive integer value less. Defaults to 15.
   */
  howMany?: number;
  /**
   * 	Optional. Must be an integer value of the offset row count you want the search to start at. Most requests should be 0.
   */
  offset?: number;
}

interface ArrayOfRoutesBetweenAirportsStruct {
  data: RoutesBetweenAirportsStruct[];
  next_offset: number;
}

interface RoutesBetweenAirportsStruct {
  /**
   * List of aircraft types that have filed this route
   */
  aircrafttypes: string;
  /**
   * The number of flights with this filed route
   */
  count: number;
  /**
   * The highest altitude filed for the route
   */
  filed_altitude_max: number;
  /**
   * The lowest altitude filed for the route
   */
  filed_altitude_min: number;
  /**
   * The latest departuretime for a flight operating on this route
   */
  last_departuretime: number;
  /**
   * The IFR route assigned
   */
  route: string;
  /**
   * The distance as filed for the route. May vary from the actual distance flown
   */
  route_distance?: string;
}

interface TailOwnerParams {
  /**
   * requested tail number
   */
  ident: string;
}

interface TailOwnerStruct {
  location: string;
  location2: string;
  owner: string;
  website: string;
}

interface WeatherConditionsParams {
  /**
   * the ICAO airport ID (e.g., KLAX, KSFO, KIAH, KHOU, KJFK, KEWR, KORD, KATL, etc.)
   */
  airport_code: string;
  /**
   * Optional. The active time for the METAR reports (in seconds since 1970). If howMany is greater than 1 then this will specify the first result while subsequent results will be retrieved in reverse chronological order. If specified as zero, then the most recent report available is assumed.
   */
  weather_date?: number;
  /**
   * Optional. The units for temperature fields. May be C, F, Celsius or Fahrenheit. Defaults to Celsius.
   */
  temperature_units?: string;
  /**
   * Optional. Defaults to false. If true then if the requested airport does not have a weather conditions report then the weather for the closest airport will be returned (if there is one within 30 miles)
   */
  return_nearby_weather?: boolean;
  /**
   * Optional. The maximum number of past records to obtain. Must be a positive integer value. Defaults to 15
   */
  howMany?: number;
  /**
   * Optional. This must be an integer value of the offset row count you want the search to start at. Most requests should be 0 (most recent report). Defaults to 0
   */
  offset?: number;
}

interface WeatherConditionsArrayStruct {
  conditions: WeatherConditionsStruct[];
  next_offset: number;
}

interface WeatherConditionsStruct {
  /**
   * the ICAO airport code of the report
   */
  airport_code: string;
  /**
   * human-friendly summary of clouds (e.g. Overcast skies, Clear skies, Raining, Snowing, etc.)
   */
  cloud_friendly: string;
  /**
   * Array of cloud data
   */
  clouds?: WeatherConditionsCloudStruct[];
  /**
   * notable weather (e.g. BR, FG, RA)
   */
  conditions: string;
  /**
   * air pressure
   */
  pressure: number;
  /**
   * units for air pressure
   */
  pressure_units: string;
  /**
   * raw METAR report string
   */
  raw_data: string;
  /**
   * air temperature (Celsius)
   */
  temp_air: number;
  /**
   * dewpoint temperature (Celsius)
   */
  temp_dewpoint: number;
  /**
   * perceived temperature (e.g. wind chill)
   */
  temp_perceived: string;
  /**
   * relative humidity (percent)
   */
  temp_relhum: number;
  /**
   * timestamp of report (in seconds since 1970)
   */
  time: number;
  /**
   * visibility
   */
  visibility: number;
  /**
   * units for visibility
   */
  visibility_units: string;
  /**
   * heading direction of wind (degrees)
   */
  wind_direction: number;
  /**
   * human-friendly summary of winds (e.g. Very windy, Calm, etc.)
   */
  wind_friendly: string;
  /**
   * wind speed
   */
  wind_speed: number;
  /**
   * wind gust speed
   */
  wind_speed_gust: number;
  /**
   * units for the wind speed and wind gusts
   */
  wind_units: string;
}

interface WeatherConditionsCloudStruct {
  /**
   * Height in feet of cloud base
   */
  altitude?: number;
  /**
   * Raw cloud symbol from the METAR report
   */
  symbol: string;
  /**
   * Type of cloud. May be CLR, FEW, SCT, BKN, OVC, VV
   */
  type: string;
}

interface WeatherForecastParams {
  /**
   * the ICAO airport ID (e.g., KLAX, KSFO, KIAH, KHOU, KJFK, KEWR, KORD, KATL, etc.)
   */
  airport_code: string;
  /**
   * Optional. The active time for the METAR reports (in seconds since 1970). If howMany is greater than 1 then this will specify the first result while subsequent results will be retrieved in reverse chronological order. If specified as zero, then the most recent report available is assumed.
   */
  weather_date?: number;
  /**
   * Optional. Defaults to false. If true then if the requested airport does not have a weather conditions report then the weather for the closest airport will be returned (if there is one within 30 miles)
   */
  return_nearby_weather?: boolean;
}

interface WeatherForecastStruct {
  airport_code: string;
  decoded_forecast?: DecodedForecastStruct;
  raw_forecast: string[];
  timestring: string;
}

interface DecodedForecastStruct {
  /**
   * End of the effective period for this forecast
   */
  forecast_end: number;
  /**
   * Array of decoded forecast periods
   */
  forecast_lines: ForecastLineStruct[];
  /**
   * Start of the effective period for this forecast
   */
  forecast_start: number;
}

interface ForecastLineStruct {
  /**
   * Optional. Forecast pressure
   */
  barometric?: string;
  /**
   * Optional. Sky condition forecasts
   */
  clounds?: ForecastCloudsStruct[];
  /**
   * End of the effective period for this forecast line
   */
  forecast_line_end: number;
  /**
   * Start of the effective period for this forecast line
   */
  forecast_line_start: number;
  /**
   * The type of forecast line (forecast, from, temporary, becoming
   */
  forecast_line_type: string;
  /**
   * Optional. Icing forecast
   */
  icing_layers?: string;
  /**
   * Optional. Significant Weather forecast
   */
  significant_weather?: string;
  /**
   * Optional. Turbulence forecast
   */
  turbulence_layers?: string;
  /**
   * Optional. Visibility forecast
   */
  visibility?: ForecastVisibilityStruct;
  /**
   * Optional. Wind forecast
   */
  winds?: ForecastWindStruct;
  /**
   * Optional. Windshear forecast
   */
  windshear?: ForecastWindshear;
}

interface ForecastCloudsStruct {
  /**
   * Height (AGL) of cloud layer base
   */
  altitude?: string;
  /**
   * Area of sky covered by the cloud layer (FEW 0-2 octas, SCT 3-4 octas, BKN 5-7 octas, OVC 8 octas
   */
  coverage?: string;
  /**
   * Any special modifiers such as CB (cumulonimbus) or TCU (towering cumulonimbus
   */
  special?: string;
  /**
   * Raw TAF cloud symbol
   */
  symbol: string;
}

interface ForecastVisibilityStruct {
  /**
   * Raw TAF visibility symbo
   */
  symbol: string;
  /**
   * Visibility units
   */
  units?: string;
  /**
   * Numeric visibility
   */
  visibility: string;
}

interface ForecastWindStruct {
  /**
   * Wind direction
   */
  direction: string;
  /**
   * Optional. Peak gusts for forecast.
   */
  peak_gusts?: number;
  /**
   * Wind speed
   */
  speed: number;
  /**
   * Raw TAF wind symbol
   */
  symbol: string;
  /**
   * Optional. Wind units.
   */
  units?: string;
}

interface ForecastWindshear {
  /**
   * Wind direction of windshear
   */
  direction: string;
  /**
   * Altitude of low level wind shear occurance
   */
  height: string;
  /**
   * Wind speed of windshear
   */
  speed?: string;
  /**
   * Raw TAF windshear symbol
   */
  symbol: string;
  /**
   * Wind units of windshear
   */
  units?: string;
}

interface ZipcodeInfoParams {
  /**
   * a five-digit U.S. Postal Service zipcode.
   */
  zipcode: string;
}

interface ZipcodeInfoStruct {
  city: string;
  county: string;
  latitude: number;
  longitude: number;
  state: string;
}

interface TrackFleetStruct {
  /**
   * Array of flight information
   */
  flights: FlightInfoStatusStruct[];
  /**
   * Offset parameter to pass into request to get the next page
   */
  next_offset: number;
  /**
   * Number of flights on this page of the response
   */
  num_flights: number;
}

interface Timestamp {
  /**
   * localized string for the date
   */
  date?: string;
  /**
   * localized name for the day of week
   */
  dow?: string;
  /**
   * UNIX epoch seconds since January 1, 1970 UTC
   */
  epoch: number;
  /**
   * seconds since January 1, 1970 in local timezone
   */
  localtime?: number;
  /**
   * localized string for the time of day
   */
  time?: string;
  /**
   * IANA tzdata style timezone name
   */
  tz?: string;
}

interface TrackAirportStruct {
  /**
   * Array of flight information
   */
  flights: FlightInfoStatusStruct[];
  /**
   * Offset parameter to pass into request to get the next page
   */
  next_offset: number;
  /**
   * Number of flights on this page of the response
   */
  num_flights: number;
}

/**
 * The wrapper class for the FlightAware API.
 */
class API {
  auth: AxiosBasicCredentials;
  constructor(config: APIConfig) {
    this.auth = {
      username: config.username,
      password: config.apiKey,
    };
  }

  /**
   * Given an aircraft type string such as GALX, returns information about that type,
   * comprising the manufacturer (for instance, "IAI"), type (for instance, "Gulfstream G200"), and description (like "twin-jet").
   *
   * @param params Query parameters
   */
  async aircraftType(params: AircraftTypeParams): Promise<AircraftTypeStruct> {
    return axios.get(fxmlUrl + 'AircraftType', {
      params,
      auth: this.auth,
    }).then(({data}) => data.AircraftTypeResult);
  }

  /**
   * Returns flight schedules that have been published by airlines.
   * These schedules are available for the recent past as well as up to one year into the future.
   * Flights performed by airline codeshares are also returned by default in these results but can be excluded.
   * If available the FlightAware flight id will be returned.
   *
   * @param params Query parameters
   */
  async airlineFlightSchedules(
    params: AirlineFlightSchedulesParams
  ): Promise<ArrayOfAirlineFlightScheduleStruct> {
    return axios.get(fxmlUrl + 'AirlineFlightSchedules', {
      params,
      auth: this.auth,
    }).then(({data}) => data.AirlineFlightSchedulesResult);
  }

  /**
   * Returns information about a commercial airline/carrier given an ICAO airline code.
   *
   * @param params Query parameters
   */
  async airlineInfo(params: AirlineInfoParams): Promise<AirlineInfoStruct> {
    return axios.get(fxmlUrl + 'AirlineInfo', {
      params,
      auth: this.auth,
    }).then(({data}) => data.AirlineInfoResult);
  }

  /**
   * Returns the flights scheduled, departing, enroute, and arriving at a specified airport.
   *
   * @param params Query parameters
   */
  async airportBoards(
    params: AirportBoardsParams
  ): Promise<AirportBoardsStruct> {
    return axios.get(fxmlUrl + 'AirportBoards', {
      params,
      auth: this.auth,
    }).then(({data}) => data.AirportBoardsResult);
  }

  /**
   * Retrieves a list of airport-wide delays at a specific airport or at all airports. There may be multiple reasons returned if there are multiple types of delays reported at an airport. Note that individual flights can be delayed without there being an airport-wide delay that this function reports.
   *
   * The "delay_secs" member should not be displayed to the user anywhere. It is intended only for sorting/ordering purposes.
   *
   * The "category" member will be one of the following codes: weather, traffic, volume, runway, equipment, accident, security, general, unknown, other.
   *
   * @param params Query parameters
   */
  async airportDelays(
    params: AirportDelaysParams
  ): Promise<AirportDelaysStruct> {
    return axios.get(fxmlUrl + 'AirportDelays', {
      params,
      auth: this.auth,
    }).then(({data}) => data.AirportDelaysResult);
  }

  /**
   * Returns information about an airport given an airport code such as KLAX, KSFO, KORD, KIAH, O07, etc.
   * Data returned includes name (Houston Intercontinental Airport), location (typically city, state and country code),
   * latitude and longitude, alternate_ident (IATA, when available), timezone (:America/Chicago), elevation.
   *
   * The returned timezone is specified in a format that is compatible with the official IANA zoneinfo database and
   * can be used to convert the timestamps returned by all other functions into localtimes.
   * Support for timestamp conversion using zoneinfo identifiers is available natively or through third-party
   * libraries for most programming languages. In some cases, the leading colon (":") character may need to be
   * removed from the timezone identifier in order for it to be recognized by some timezone libraries.
   *
   * @param params Query parameters
   */
  async airportInfo(params: AirportInfoParams): Promise<AirportStruct> {
    return axios.get(fxmlUrl + 'AirportInfo', {
      params,
      auth: this.auth,
    }).then(({data}) => data.AirportInfoResult);
  }

  /**
   * Given an aircraft identification, returns 1 if the aircraft is blocked from public tracking, 0 if it is not.
   *
   * @param params Query parameters
   */
  async blockIdentCheck(params: BlockIdentCheckParams): Promise<number> {
    return axios.get(fxmlUrl + 'BlockIdentCheck', {
      params,
      auth: this.auth,
    }).then(({data}) => data.BlockIdentCheckResult);
  }

  /**
   * Given an airport, CountAirportOperations returns the number of aircraft scheduled, en route or departing the airport.
   * Scheduled arrivals are non-airborne flights that are scheduled to fly to the airport in question.
   *
   * @param params Query parameters
   */
  async countAirportOperations(
    params: CountAirportOperationsParams
  ): Promise<CountAirportOperationsStruct> {
    return axios.get(fxmlUrl + 'CountAirportOperations', {
      params,
      auth: this.auth,
    }).then(({data}) => data.CountAirportOperationsResult);
  }

  /**
   * Returns an array of airlines and how many flights each currently has enroute.
   */
  async countAllEnrouteAirlineOperations(): Promise<
    ArrayOfCountAirlineOperationsStruct
  > {
    return axios.get(fxmlUrl + 'CountAllEnrouteAirlineOperations', {
      auth: this.auth,
    }).then(({data}) => data.CountAllEnrouteAirlineOperationsResult);
  }

  /**
   * Given a flight identifier (faFlightID) of a past, current, or future flight, returns a "cracked" list of
   * noteworthy navigation points along the planned flight route. The list represents the originally planned route of travel,
   * which may differ slightly from the actual flight path flown. The returned list will include the name,
   * type, latitude, longitude, distance from origin, distance from destination, distance this leg and outbound course
   * of each point if available. Additional reporting points along the route may be automatically included in the returned list.
   * Not all flight routes can be successfully decoded by this function, particularly if the flight is not entirely within
   * the continental U.S. airspace, since this function only has access to navaids within that area.
   * If data on a waypoint is missing then the type will be listed as "UNKNOWN". To obtain the faFlightID, you can use
   * a function such as GetFlightID, FlightInfoEx, or InFlightInfo.
   *
   * For an alternate version of this function that lets you specify the route, see DecodeRoute.
   *
   * @param params Query parameters
   */
  async decodeFlightRoute(
    params: DecodeFlightRouteParams
  ): Promise<ArrayOfFlightRouteStruct> {
    return axios.get(fxmlUrl + 'DecodeFlightRoute', {
      params,
      auth: this.auth,
    }).then(({data}) => data.DecodeFlightResult);
  }

  /**
   * Given an origin airport, destination airport, and a route between them, returns a "cracked" list of noteworthy
   * navigation points along the planned flight route. The list represents the originally planned route of travel,
   * which may differ slightly from the actual flight path flown. The returned list will include the name, type,
   * latitude, longitude, distance from origin, distance from destination, distance this leg and outbound course of
   * each point if available. Additional reporting points along the route may be automatically included in the returned list.
   * Not all flight routes can be successfully decoded by this function, particularly if the flight is not entirely
   * within the continental U.S. airspace, since this function only has access to navaids within that area.
   * If data on a waypoint is missing then the type will be listed as "UNKNOWN".
   *
   * For an alternate version of this function that lets you specify an existing flight identifier, see DecodeFlightRoute.
   *
   * @param params Query parameters
   */
  async decodeRoute(
    params: DecodeRouteParams
  ): Promise<ArrayOfFlightRouteStruct> {
    return axios.get(fxmlUrl + 'DecodeRoute', {
      params,
      auth: this.auth,
    }).then(({data}) => data.DecodeRouteResult);
  }

  /**
   * Returns matching flights based on an origin/destination pair.
   * The returned results may include non-stop or one-stop flights.
   *
   * @param params Query parameters
   */
  async findFlight(params: FindFlightParams): Promise<FindFlightStruct> {
    return axios.get(fxmlUrl + 'FindFlight', {
      params,
      auth: this.auth,
    }).then(({data}) => data.FindFlightResult);
  }

  /**
   * Returns the flights scheduled, departing, enroute, for a specified airline.
   *
   * @param params Query parameters
   */
  async fleetBoards(params: FleetBoardsParams): Promise<FleetBoardsStruct> {
    return axios.get(fxmlUrl + 'FleetBoards', {
      params,
      auth: this.auth,
    }).then(({data}) => data.FleetBoardsResult);
  }

  /**
   * Fetches statistics about how many flights have been cancelled on the specified day,
   * and aggregated by the specified breakdown criteria. Currently supported criteria
   * include the operating airline, the origin airport, or the destination airport.
   *
   * @param params Query parameters
   */
  async flightCancellationStatistics(
    params: FlightCancellationStatisticsParams
  ): Promise<CancellationSummaryStruct> {
    return axios.get(fxmlUrl + 'FlightCancellationStatistics', {
      params,
      auth: this.auth,
    }).then(({data}) => data.FlightCancellationStatisticsResult);
  }

  /**
   * Returns information about flights for a specific tail number (e.g., N12345), or an ident
   * (typically an ICAO airline with flight number, e.g., SWA2558), or a FlightAware-assigned unique
   * flight identifier (e.g. faFlightID returned by another FlightXML function).
   * When a tail number or ident is specified and multiple flights are available, the results
   * will be returned from newest to oldest. The oldest flights searched by this function are
   * about 2 weeks in the past. Codeshares and alternate idents are automatically searched.
   * When a FlightAware-assigned unique flight identifier is supplied, at most a single result will be returned.
   *
   * Times are provided in a nested data structure that contains the representation in
   * several different formats, including UTC integer seconds since 1970 (UNIX epoch time),
   * and integer seconds since 1970 relative to the local (airport) timezone.
   * The estimated time enroute (filed_ete) is given in seconds.
   *
   * The inbound_faFlightID field will only be included for queries that use a howMany of 15 or less.
   *
   * @param params Query parameters
   */
  async flightInfoStatus(
    params: FlightInfoStatusParams
  ): Promise<ArrayOfFlightInfoStatusStruct> {
    return axios.get(fxmlUrl + 'FlightInfoStatus', {
      params,
      auth: this.auth,
    }).then(({data}) => data.FlightInfoStatusResult);
  }

  /**
   * Looks up a flight's track log by its unique FlightAware identifier (e.g. SKW5252-1491801993-airline-0107)
   * or flight ident and departure time (e.g. SKW5252@1492037400). To obtain the faFlightID,
   * you can use a function such as FlightInfoStatus. It returns the track log for that flight if
   * it has departed. It returns an array of positions, with each including the timestamp, longitude,
   * latitude, groundspeed, altitude, altitudestatus, updatetype, and altitudechange.
   * Altitude is in hundreds of feet or Flight Level where appropriate, see our FAQ about flight levels.
   *
   * Altitude status is 'C' when the flight is more than 200 feet away from its ATC-assigned altitude.
   * (For example, the aircraft is transitioning to its assigned altitude.) Altitude change is 'C' if
   * the aircraft is climbing (compared to the previous position reported), 'D' for descending,
   * and empty if it is level. This happens for VFR flights with flight following, among other things.
   * Timestamp is integer seconds since 1970 (UNIX epoch time).
   *
   * Codeshares and alternate idents are automatically searched.
   *
   * @param params Query parameters
   */
  async getFlightTrack(
    params: GetFlightTrackParams
  ): Promise<ArrayOfTrackStruct> {
    return axios.get(fxmlUrl + 'GetFlightTrack', {
      params,
      auth: this.auth,
    }).then(({data}) => data.GetFlightTrackResult);
  }

  /**
   * Given two latitudes and longitudes, lat1 lon1 lat2 and lon2, respectively,
   * determine the great circle distance between those positions in miles.
   * The returned distance is rounded to the nearest whole mile.
   *
   * @param params Query parameters
   */
  async latLongsToDistance(params: LatLongsToDistanceParams): Promise<number> {
    return axios.get(fxmlUrl + 'LatLongsToDistance', {
      params,
      auth: this.auth,
    }).then(({data}) => data.LatLongsToDistanceResult);
  }

  /**
   * Given two latitudes and longitudes, lat1 lon1 lat2 and lon2, respectively,
   * calculate and return the initial compass heading (where 360 is North)
   * from position one to position two. Quite accurate for relatively short
   * distances but since it assumes the earth is a sphere rather than on irregular
   *  oblate sphereoid may be inaccurate for flights around a good chunk of the world, etc.
   *
   * @param params Query parameters
   */
  async latLongsToHeading(params: LatLongsToHeadingParams): Promise<number> {
    return axios.get(fxmlUrl + 'LatLongsToHeading', {
      params,
      auth: this.auth,
    }).then(({data}) => data.LatLongsToHeadingResult);
  }

  /**
   * Returns a list of airports near the latitude / longitude or airport
   * code specified within the given radius.
   * You must specify either a latitude/longitude OR an airport code.
   *
   * @param params Query parameters
   */
  async nearbyAirports(
    params: NearbyAirportsParams
  ): Promise<NearbyAirportsStruct> {
    return axios.get(fxmlUrl + 'NearbyAirports', {
      params,
      auth: this.auth,
    }).then(({data}) => data.NearbyAirportsResult);
  }

  /**
   * Returns information about assigned IFR routings between two airports.
   * For each known routing, the route, number of times that route has been assigned,
   * the filed altitude (lowest and highest among found plans, measured in 100 ft
   * intervals), and the most recent filed departure date/time are returned.
   * The max_file_age will only accept certain values so ensure that you conform to those requirements.
   *
   * @param params Query parameters
   */
  async routesBetweenAirports(
    params: RoutesBetweenAirportsParams
  ): Promise<ArrayOfRoutesBetweenAirportsStruct> {
    return axios.get(fxmlUrl + 'RoutesBetweenAirports', {
      params,
      auth: this.auth,
    }).then(({data}) => data.RoutesBetweenAirportsResult);
  }

  /**
   * Returns information about the owner of an aircraft, given a flight number or N-number.
   * Data returned includes owner's name, location (typically city and state),
   * and website, if any. Codeshares and alternate idents are automatically searched.
   *
   * @param params Query parameters
   */
  async tailOwner(params: TailOwnerParams): Promise<TailOwnerStruct> {
    return axios.get(fxmlUrl + 'TailOwner', {
      params,
      auth: this.auth,
    }).then(({data}) => data.TailOwnerResult);
  }

  /**
   * Given an airport, return the Weather Conditions (METAR) as parsed, human-readable, and raw formats.
   * To return weather for a nearby airport if the requested one is not available,
   * then set the return_nearby_weather argument to true. If a value greater than 1
   * is specified for howMany then multiple past reports will be returned, in order of increasing age.
   *
   * @param params Query parameters
   */
  async weatherConditions(
    params: WeatherConditionsParams
  ): Promise<WeatherConditionsArrayStruct> {
    return axios.get(fxmlUrl + 'WeatherConditions', {
      params,
      auth: this.auth,
    }).then(({data}) => data.WeatherConditionsResult);
  }

  /**
   * Given an airport, return the Weather Conditions (METAR) as parsed, human-readable, and raw formats.
   * To return weather for a nearby airport if the requested one is not available,
   * then set the return_nearby_weather argument to true. If a value greater than 1
   * is specified for howMany then multiple past reports will be returned, in order of increasing age.
   *
   * @param params Query parameters
   */
  async weatherForecast(
    params: WeatherForecastParams
  ): Promise<WeatherForecastStruct> {
    return axios.get(fxmlUrl + 'WeatherForecast', {
      params,
      auth: this.auth,
    }).then(({data}) => data.WeatherForecastResult)
  }

  /**
   * Returns information about a five-digit zipcode. Of particular importance is latitude and longitude.
   *
   * @param params Query parameters
   */
  async zipcodeInfo(params: ZipcodeInfoParams): Promise<ZipcodeInfoStruct> {
    return axios.get(fxmlUrl + 'ZipcodeInfo', {
      params,
      auth: this.auth,
    }).then(({data}) => data.ZipcodeInfoResult)
  }
}

/**
 * Creates a new API instance with the given configuration.
 *
 * @param config The API configuration
 */
export function createApi(config: APIConfig): API {
  return new API(config);
}
