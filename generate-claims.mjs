// generate-claims.mjs — Shielded SEO programmatic page generator
// Run: node generate-claims.mjs
// Generates: claims/ directory with state, city, incident, and hub pages

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = join(__dirname, 'claims');

// ─── STATES ──────────────────────────────────────────────────────
const STATES = [
  { name:'Alabama',abbr:'AL',slug:'alabama',sol:6,statute:'Ala. Code §27-12-24',badFaith:'Common law bad faith recognized',commissioner:'Alabama Dept. of Insurance',commUrl:'https://www.aldoi.gov',note:'Alabama allows bad faith claims when an insurer denies without a reasonably legitimate basis.' },
  { name:'Alaska',abbr:'AK',slug:'alaska',sol:6,statute:'AS 21.36.125',badFaith:'Unfair claims practices statute',commissioner:'Alaska Div. of Insurance',commUrl:'https://www.commerce.alaska.gov/web/ins',note:'Alaska requires insurers to acknowledge and act on claims within 10 working days.' },
  { name:'Arizona',abbr:'AZ',slug:'arizona',sol:2,statute:'A.R.S. §20-461',badFaith:'First-party bad faith recognized; 2-yr SOL',commissioner:'Arizona Dept. of Insurance',commUrl:'https://insurance.az.gov',note:'Arizona courts award punitive damages for egregious bad faith conduct.' },
  { name:'Arkansas',abbr:'AR',slug:'arkansas',sol:5,statute:'Ark. Code §23-66-206',badFaith:'Statutory bad faith penalties',commissioner:'Arkansas Insurance Dept.',commUrl:'https://insurance.arkansas.gov',note:'Arkansas imposes 12% penalty plus attorney fees for wrongful claim denials.' },
  { name:'California',abbr:'CA',slug:'california',sol:4,statute:'Cal. Ins. Code §790.03',badFaith:'Strong statutory + common law bad faith',commissioner:'California Dept. of Insurance',commUrl:'https://www.insurance.ca.gov',note:'California has the nation\'s strongest policyholder protections including the Unfair Insurance Practices Act.' },
  { name:'Colorado',abbr:'CO',slug:'colorado',sol:2,statute:'C.R.S. §10-3-1115',badFaith:'2x damages for unreasonable delay or denial',commissioner:'Colorado Div. of Insurance',commUrl:'https://doi.colorado.gov',note:'Colorado uniquely allows double damages for unreasonable delay — even without a full denial.' },
  { name:'Connecticut',abbr:'CT',slug:'connecticut',sol:6,statute:'Conn. Gen. Stat. §38a-815',badFaith:'CUIPA bad faith claims recognized',commissioner:'Connecticut Insurance Dept.',commUrl:'https://portal.ct.gov/CID',note:'Connecticut requires insurers to affirm or deny coverage within a reasonable time after proof of loss.' },
  { name:'Delaware',abbr:'DE',slug:'delaware',sol:3,statute:'18 Del. C. §2304',badFaith:'Common law bad faith recognized',commissioner:'Delaware Insurance Dept.',commUrl:'https://insurance.delaware.gov',note:'Delaware follows the fairly debatable standard for bad faith analysis.' },
  { name:'Florida',abbr:'FL',slug:'florida',sol:5,statute:'Fla. Stat. §624.155',badFaith:'Civil Remedy Notice required before suit',commissioner:'Florida Dept. of Financial Services',commUrl:'https://www.myfloridacfo.com/division/consumers',note:'Florida requires a Civil Remedy Notice giving insurers 60 days to cure bad faith before you can sue.' },
  { name:'Georgia',abbr:'GA',slug:'georgia',sol:6,statute:'O.C.G.A. §33-4-6',badFaith:'25% penalty + attorney fees for bad faith',commissioner:'Georgia Insurance Commissioner',commUrl:'https://www.oci.ga.gov',note:'Georgia imposes a 25% penalty on the loss amount plus attorney fees for bad faith refusal to pay.' },
  { name:'Hawaii',abbr:'HI',slug:'hawaii',sol:6,statute:'HRS §431:13-103',badFaith:'Unfair claims practices recognized',commissioner:'Hawaii Insurance Div.',commUrl:'https://cca.hawaii.gov/ins',note:'Hawaii requires insurers to respond to claims within 15 days and resolve within 45 days.' },
  { name:'Idaho',abbr:'ID',slug:'idaho',sol:5,statute:'Idaho Code §41-1329',badFaith:'Unfair claims settlement practices',commissioner:'Idaho Dept. of Insurance',commUrl:'https://doi.idaho.gov',note:'Idaho mandates prompt investigation and good-faith settlement when liability is clear.' },
  { name:'Illinois',abbr:'IL',slug:'illinois',sol:2,statute:'215 ILCS 5/155',badFaith:'Statutory bad faith; 2-yr SOL; extra damages',commissioner:'Illinois Dept. of Insurance',commUrl:'https://insurance.illinois.gov',note:'Illinois §155 allows extra damages and attorney fees when an insurer\'s delay or denial is vexatious.' },
  { name:'Indiana',abbr:'IN',slug:'indiana',sol:10,statute:'Ind. Code §27-4-1-4.5',badFaith:'Common law bad faith recognized',commissioner:'Indiana Dept. of Insurance',commUrl:'https://www.in.gov/idoi',note:'Indiana has one of the longest contract SOLs at 10 years for written insurance contracts.' },
  { name:'Iowa',abbr:'IA',slug:'iowa',sol:10,statute:'Iowa Code §507B.4',badFaith:'IUIPA bad faith recognized',commissioner:'Iowa Insurance Div.',commUrl:'https://iid.iowa.gov',note:'Iowa allows 10 years to file suit on a written insurance contract.' },
  { name:'Kansas',abbr:'KS',slug:'kansas',sol:5,statute:'K.S.A. §40-2404',badFaith:'Common law bad faith recognized',commissioner:'Kansas Insurance Dept.',commUrl:'https://www.ksinsurance.org',note:'Kansas courts recognize bad faith and can award punitive damages for egregious conduct.' },
  { name:'Kentucky',abbr:'KY',slug:'kentucky',sol:15,statute:'KRS §304.12-230',badFaith:'Common law; longest SOL in the nation',commissioner:'Kentucky Insurance Dept.',commUrl:'https://insurance.ky.gov',note:'Kentucky has a 15-year statute of limitations on insurance contracts — the longest in the US.' },
  { name:'Louisiana',abbr:'LA',slug:'louisiana',sol:1,statute:'La. R.S. 22:1892',badFaith:'50% penalty for arbitrary refusal',commissioner:'Louisiana Dept. of Insurance',commUrl:'https://www.ldi.la.gov',note:'Louisiana imposes a 50% penalty on claim amounts for arbitrary or capricious refusal to pay — but has only a 1-year SOL.' },
  { name:'Maine',abbr:'ME',slug:'maine',sol:6,statute:'24-A M.R.S.A. §2164-B',badFaith:'Unfair claims practices',commissioner:'Maine Bureau of Insurance',commUrl:'https://www.maine.gov/pfr/insurance',note:'Maine requires insurers to complete investigation within 30 days of proof of loss.' },
  { name:'Maryland',abbr:'MD',slug:'maryland',sol:3,statute:'Md. Ins. Code §27-301',badFaith:'Common law bad faith; 3-yr SOL',commissioner:'Maryland Insurance Administration',commUrl:'https://insurance.maryland.gov',note:'Maryland\'s shorter 3-year SOL means business owners must act quickly after a disputed claim.' },
  { name:'Massachusetts',abbr:'MA',slug:'massachusetts',sol:6,statute:'M.G.L. c. 176D §3',badFaith:'Chapter 93A bad faith claims available',commissioner:'Massachusetts Div. of Insurance',commUrl:'https://www.mass.gov/orgs/division-of-insurance',note:'Massachusetts Chapter 93A allows double or triple damages for unfair insurance settlement practices.' },
  { name:'Michigan',abbr:'MI',slug:'michigan',sol:6,statute:'MCL §500.2026',badFaith:'Common law bad faith recognized',commissioner:'Michigan Dept. of Insurance',commUrl:'https://www.michigan.gov/difs',note:'Michigan requires insurers to pay undisputed amounts promptly while investigating disputed portions.' },
  { name:'Minnesota',abbr:'MN',slug:'minnesota',sol:6,statute:'Minn. Stat. §72A.201',badFaith:'Bad faith statute with extra damages',commissioner:'Minnesota Dept. of Commerce',commUrl:'https://mn.gov/commerce/insurance',note:'Minnesota allows attorney fees and damages for frivolous claim denials under its bad faith statute.' },
  { name:'Mississippi',abbr:'MS',slug:'mississippi',sol:3,statute:'Miss. Code §83-5-33',badFaith:'Common law bad faith recognized',commissioner:'Mississippi Insurance Dept.',commUrl:'https://www.mid.ms.gov',note:'Mississippi courts award punitive damages for insurers who deny claims in conscious disregard of policyholder rights.' },
  { name:'Missouri',abbr:'MO',slug:'missouri',sol:10,statute:'§375.420 RSMo',badFaith:'Vexatious refusal statute',commissioner:'Missouri Dept. of Commerce & Insurance',commUrl:'https://insurance.mo.gov',note:'Missouri\'s vexatious refusal statute adds 20% of first $1,500 plus 10% thereafter plus attorney fees.' },
  { name:'Montana',abbr:'MT',slug:'montana',sol:5,statute:'Mont. Code §33-18-201',badFaith:'Unfair trade practices act',commissioner:'Montana Commissioner of Securities & Insurance',commUrl:'https://csimt.gov',note:'Montana requires insurers to investigate claims within 30 days and respond to communications within 10 days.' },
  { name:'Nebraska',abbr:'NE',slug:'nebraska',sol:5,statute:'Neb. Rev. Stat. §44-1539',badFaith:'Common law bad faith recognized',commissioner:'Nebraska Dept. of Insurance',commUrl:'https://doi.nebraska.gov',note:'Nebraska courts recognize both first-party and third-party bad faith insurance claims.' },
  { name:'Nevada',abbr:'NV',slug:'nevada',sol:6,statute:'NRS §686A.310',badFaith:'Statutory bad faith; punitive damages available',commissioner:'Nevada Division of Insurance',commUrl:'https://doi.nv.gov',note:'Nevada statute expressly prohibits misrepresenting policy provisions and allows punitive damages for bad faith.' },
  { name:'New Hampshire',abbr:'NH',slug:'new-hampshire',sol:3,statute:'N.H. Rev. Stat. §417:4',badFaith:'Common law bad faith recognized',commissioner:'NH Insurance Dept.',commUrl:'https://www.nh.gov/insurance',note:'New Hampshire requires insurers to respond to claims within 10 days and complete investigation within 45 days.' },
  { name:'New Jersey',abbr:'NJ',slug:'new-jersey',sol:6,statute:'N.J.S.A. §17:29B-4',badFaith:'Common law + statutory bad faith',commissioner:'NJ Dept. of Banking & Insurance',commUrl:'https://www.state.nj.us/dobi',note:'New Jersey courts recognize punitive damages for egregious bad faith insurance conduct.' },
  { name:'New Mexico',abbr:'NM',slug:'new-mexico',sol:6,statute:'NMSA §59A-16-20',badFaith:'Unfair practices act; bad faith recognized',commissioner:'New Mexico OSI',commUrl:'https://www.osi.state.nm.us',note:'New Mexico requires insurers to acknowledge, investigate, and resolve claims within specific timeframes.' },
  { name:'New York',abbr:'NY',slug:'new-york',sol:6,statute:'N.Y. Ins. Law §2601',badFaith:'Common law bad faith recognized',commissioner:'NY Dept. of Financial Services',commUrl:'https://www.dfs.ny.gov',note:'New York prohibits unfair claim settlement practices and allows regulatory action against offending insurers.' },
  { name:'North Carolina',abbr:'NC',slug:'north-carolina',sol:3,statute:'N.C.G.S. §58-63-15',badFaith:'Unfair trade practices; UTPA claims',commissioner:'NC Dept. of Insurance',commUrl:'https://www.ncdoi.gov',note:'North Carolina\'s 3-year SOL runs from the date of loss — act quickly to preserve your rights.' },
  { name:'North Dakota',abbr:'ND',slug:'north-dakota',sol:6,statute:'N.D.C.C. §26.1-04-03',badFaith:'Common law bad faith recognized',commissioner:'ND Insurance Dept.',commUrl:'https://www.nd.gov/ndins',note:'North Dakota requires insurers to complete claim investigation within 30 days of notice.' },
  { name:'Ohio',abbr:'OH',slug:'ohio',sol:15,statute:'R.C. §3901.21',badFaith:'Common law bad faith; 15-yr contract SOL',commissioner:'Ohio Dept. of Insurance',commUrl:'https://insurance.ohio.gov',note:'Ohio has a 15-year SOL for written insurance contracts and recognizes common law bad faith claims.' },
  { name:'Oklahoma',abbr:'OK',slug:'oklahoma',sol:5,statute:'36 O.S. §1250.5',badFaith:'Common law bad faith recognized',commissioner:'Oklahoma Insurance Dept.',commUrl:'https://www.oid.ok.gov',note:'Oklahoma courts award punitive damages for bad faith when an insurer\'s conduct is reckless or intentional.' },
  { name:'Oregon',abbr:'OR',slug:'oregon',sol:6,statute:'ORS §746.230',badFaith:'Unfair claims practices; bad faith recognized',commissioner:'Oregon Insurance Div.',commUrl:'https://dfr.oregon.gov/insure',note:'Oregon requires insurers to accept or deny claims within a reasonable time with written explanation.' },
  { name:'Pennsylvania',abbr:'PA',slug:'pennsylvania',sol:4,statute:'42 Pa. C.S. §8371',badFaith:'Statutory; punitive damages available',commissioner:'PA Insurance Dept.',commUrl:'https://www.insurance.pa.gov',note:'Pennsylvania\'s §8371 bad faith statute allows interest, attorney fees, court costs, and punitive damages.' },
  { name:'Rhode Island',abbr:'RI',slug:'rhode-island',sol:10,statute:'R.I. Gen. Laws §27-9.1-1',badFaith:'Unfair practices act recognized',commissioner:'RI Dept. of Business Regulation',commUrl:'https://dbr.ri.gov/insurance',note:'Rhode Island has a 10-year SOL for written contracts and requires good faith claims handling.' },
  { name:'South Carolina',abbr:'SC',slug:'south-carolina',sol:3,statute:'S.C. Code §38-59-20',badFaith:'Common law bad faith recognized',commissioner:'SC Dept. of Insurance',commUrl:'https://doi.sc.gov',note:'South Carolina allows bad faith claims and extra-contractual damages for unreasonable claim handling.' },
  { name:'South Dakota',abbr:'SD',slug:'south-dakota',sol:6,statute:'SDCL §58-33-67',badFaith:'Common law bad faith recognized',commissioner:'SD Division of Insurance',commUrl:'https://dlr.sd.gov/insurance',note:'South Dakota requires prompt acknowledgment and investigation of all claims under its unfair practices act.' },
  { name:'Tennessee',abbr:'TN',slug:'tennessee',sol:6,statute:'Tenn. Code §56-8-104',badFaith:'Common law bad faith; extra damages',commissioner:'TN Dept. of Commerce & Insurance',commUrl:'https://www.tn.gov/commerce/insurance',note:'Tennessee allows 25% penalty plus attorney fees for bad faith refusal to pay on a policy.' },
  { name:'Texas',abbr:'TX',slug:'texas',sol:2,statute:'Tex. Ins. Code §541',badFaith:'Prompt Payment Act; 18% interest on late pay',commissioner:'Texas Dept. of Insurance',commUrl:'https://www.tdi.texas.gov',note:'Texas Prompt Payment Act requires acknowledgment within 15 days and acceptance/denial within 15 business days of receiving all items.' },
  { name:'Utah',abbr:'UT',slug:'utah',sol:6,statute:'Utah Code §31A-21-312',badFaith:'Common law bad faith recognized',commissioner:'Utah Insurance Dept.',commUrl:'https://insurance.utah.gov',note:'Utah requires insurers to acknowledge a claim within 10 working days and accept or deny within 45 days.' },
  { name:'Vermont',abbr:'VT',slug:'vermont',sol:6,statute:'8 V.S.A. §4726',badFaith:'Unfair practices act recognized',commissioner:'Vermont Dept. of Financial Regulation',commUrl:'https://dfr.vermont.gov',note:'Vermont mandates complete claims investigation and response within 45 days of proof of loss.' },
  { name:'Virginia',abbr:'VA',slug:'virginia',sol:5,statute:'Va. Code §38.2-510',badFaith:'Common law bad faith; VPIA',commissioner:'Virginia Bureau of Insurance',commUrl:'https://www.scc.virginia.gov/pages/Bureau-of-Insurance',note:'Virginia Policyholder Information Act requires insurers to fully explain claim decisions in writing.' },
  { name:'Washington',abbr:'WA',slug:'washington',sol:3,statute:'WAC 284-30; RCW 48.30.015',badFaith:'Insurance Fair Conduct Act; triple damages',commissioner:'Washington OIC',commUrl:'https://www.insurance.wa.gov',note:'Washington\'s Insurance Fair Conduct Act allows triple damages and attorney fees for unreasonable claim denial.' },
  { name:'West Virginia',abbr:'WV',slug:'west-virginia',sol:2,statute:'W. Va. Code §33-11-4',badFaith:'Common law bad faith; WVCPA',commissioner:'WV Offices of the Insurance Commissioner',commUrl:'https://www.wvinsurance.gov',note:'West Virginia has a short 2-year SOL for bad faith claims — file quickly after a disputed denial.' },
  { name:'Wisconsin',abbr:'WI',slug:'wisconsin',sol:6,statute:'Wis. Stat. §628.46',badFaith:'Prompt pay statute; 12% interest penalty',commissioner:'Wisconsin OCI',commUrl:'https://oci.wi.gov',note:'Wisconsin requires insurers to pay undisputed claims within 30 days or pay 12% annual interest penalty.' },
  { name:'Wyoming',abbr:'WY',slug:'wyoming',sol:8,statute:'Wyo. Stat. §26-13-124',badFaith:'Common law bad faith recognized',commissioner:'Wyoming Insurance Dept.',commUrl:'https://doi.wyo.gov',note:'Wyoming has an 8-year SOL for written contracts and recognizes common law bad faith insurance claims.' },
  { name:'Washington DC',abbr:'DC',slug:'washington-dc',sol:3,statute:'D.C. Code §31-2231.17',badFaith:'Common law bad faith recognized',commissioner:'DC Dept. of Insurance, Securities and Banking',commUrl:'https://disb.dc.gov',note:'DC follows the fairly debatable standard and requires insurers to respond to claims promptly.' },
];

// ─── CITIES ──────────────────────────────────────────────────────
const CITIES = [
  // Tier 1 — 500k+ population
  {name:'New York',slug:'new-york',stateAbbr:'NY',tier:1,pop:'8.3M'},
  {name:'Los Angeles',slug:'los-angeles',stateAbbr:'CA',tier:1,pop:'3.9M'},
  {name:'Chicago',slug:'chicago',stateAbbr:'IL',tier:1,pop:'2.7M'},
  {name:'Houston',slug:'houston',stateAbbr:'TX',tier:1,pop:'2.3M'},
  {name:'Phoenix',slug:'phoenix',stateAbbr:'AZ',tier:1,pop:'1.6M'},
  {name:'Philadelphia',slug:'philadelphia',stateAbbr:'PA',tier:1,pop:'1.6M'},
  {name:'San Antonio',slug:'san-antonio',stateAbbr:'TX',tier:1,pop:'1.4M'},
  {name:'San Diego',slug:'san-diego',stateAbbr:'CA',tier:1,pop:'1.4M'},
  {name:'Dallas',slug:'dallas',stateAbbr:'TX',tier:1,pop:'1.3M'},
  {name:'San Jose',slug:'san-jose',stateAbbr:'CA',tier:1,pop:'1.0M'},
  {name:'Austin',slug:'austin',stateAbbr:'TX',tier:1,pop:'978k'},
  {name:'Jacksonville',slug:'jacksonville',stateAbbr:'FL',tier:1,pop:'949k'},
  {name:'Fort Worth',slug:'fort-worth',stateAbbr:'TX',tier:1,pop:'935k'},
  {name:'Columbus',slug:'columbus',stateAbbr:'OH',tier:1,pop:'905k'},
  {name:'Charlotte',slug:'charlotte',stateAbbr:'NC',tier:1,pop:'874k'},
  {name:'Indianapolis',slug:'indianapolis',stateAbbr:'IN',tier:1,pop:'867k'},
  {name:'San Francisco',slug:'san-francisco',stateAbbr:'CA',tier:1,pop:'864k'},
  {name:'Seattle',slug:'seattle',stateAbbr:'WA',tier:1,pop:'737k'},
  {name:'Denver',slug:'denver',stateAbbr:'CO',tier:1,pop:'715k'},
  {name:'Nashville',slug:'nashville',stateAbbr:'TN',tier:1,pop:'689k'},
  {name:'Oklahoma City',slug:'oklahoma-city',stateAbbr:'OK',tier:1,pop:'681k'},
  {name:'El Paso',slug:'el-paso',stateAbbr:'TX',tier:1,pop:'678k'},
  {name:'Washington',slug:'washington',stateAbbr:'DC',tier:1,pop:'671k'},
  {name:'Las Vegas',slug:'las-vegas',stateAbbr:'NV',tier:1,pop:'641k'},
  {name:'Louisville',slug:'louisville',stateAbbr:'KY',tier:1,pop:'633k'},
  {name:'Memphis',slug:'memphis',stateAbbr:'TN',tier:1,pop:'620k'},
  {name:'Portland',slug:'portland',stateAbbr:'OR',tier:1,pop:'641k'},
  {name:'Baltimore',slug:'baltimore',stateAbbr:'MD',tier:1,pop:'569k'},
  {name:'Milwaukee',slug:'milwaukee',stateAbbr:'WI',tier:1,pop:'563k'},
  {name:'Albuquerque',slug:'albuquerque',stateAbbr:'NM',tier:1,pop:'560k'},
  {name:'Tucson',slug:'tucson',stateAbbr:'AZ',tier:1,pop:'542k'},
  {name:'Fresno',slug:'fresno',stateAbbr:'CA',tier:1,pop:'542k'},
  {name:'Mesa',slug:'mesa',stateAbbr:'AZ',tier:1,pop:'504k'},
  {name:'Sacramento',slug:'sacramento',stateAbbr:'CA',tier:1,pop:'524k'},
  {name:'Atlanta',slug:'atlanta',stateAbbr:'GA',tier:1,pop:'498k'},
  {name:'Kansas City',slug:'kansas-city',stateAbbr:'MO',tier:1,pop:'508k'},
  {name:'Omaha',slug:'omaha',stateAbbr:'NE',tier:1,pop:'486k'},
  {name:'Colorado Springs',slug:'colorado-springs',stateAbbr:'CO',tier:1,pop:'478k'},
  {name:'Raleigh',slug:'raleigh',stateAbbr:'NC',tier:1,pop:'467k'},
  {name:'Long Beach',slug:'long-beach',stateAbbr:'CA',tier:1,pop:'466k'},
  {name:'Virginia Beach',slug:'virginia-beach',stateAbbr:'VA',tier:1,pop:'459k'},
  {name:'Minneapolis',slug:'minneapolis',stateAbbr:'MN',tier:1,pop:'429k'},
  {name:'Tampa',slug:'tampa',stateAbbr:'FL',tier:1,pop:'400k'},
  {name:'New Orleans',slug:'new-orleans',stateAbbr:'LA',tier:1,pop:'369k'},
  {name:'Arlington',slug:'arlington',stateAbbr:'TX',tier:1,pop:'394k'},
  {name:'Bakersfield',slug:'bakersfield',stateAbbr:'CA',tier:1,pop:'380k'},
  {name:'Honolulu',slug:'honolulu',stateAbbr:'HI',tier:1,pop:'350k'},
  {name:'Anaheim',slug:'anaheim',stateAbbr:'CA',tier:1,pop:'346k'},
  {name:'Aurora',slug:'aurora',stateAbbr:'CO',tier:1,pop:'366k'},
  {name:'Santa Ana',slug:'santa-ana',stateAbbr:'CA',tier:1,pop:'310k'},
  // Tier 2 — 100k–500k
  {name:'Corpus Christi',slug:'corpus-christi',stateAbbr:'TX',tier:2,pop:'317k'},
  {name:'Riverside',slug:'riverside',stateAbbr:'CA',tier:2,pop:'314k'},
  {name:'Lexington',slug:'lexington',stateAbbr:'KY',tier:2,pop:'310k'},
  {name:'Pittsburgh',slug:'pittsburgh',stateAbbr:'PA',tier:2,pop:'303k'},
  {name:'Anchorage',slug:'anchorage',stateAbbr:'AK',tier:2,pop:'291k'},
  {name:'Stockton',slug:'stockton',stateAbbr:'CA',tier:2,pop:'312k'},
  {name:'Cincinnati',slug:'cincinnati',stateAbbr:'OH',tier:2,pop:'309k'},
  {name:'St. Paul',slug:'st-paul',stateAbbr:'MN',tier:2,pop:'307k'},
  {name:'Toledo',slug:'toledo',stateAbbr:'OH',tier:2,pop:'270k'},
  {name:'Greensboro',slug:'greensboro',stateAbbr:'NC',tier:2,pop:'296k'},
  {name:'Newark',slug:'newark',stateAbbr:'NJ',tier:2,pop:'307k'},
  {name:'Plano',slug:'plano',stateAbbr:'TX',tier:2,pop:'285k'},
  {name:'Henderson',slug:'henderson',stateAbbr:'NV',tier:2,pop:'320k'},
  {name:'Lincoln',slug:'lincoln',stateAbbr:'NE',tier:2,pop:'289k'},
  {name:'Buffalo',slug:'buffalo',stateAbbr:'NY',tier:2,pop:'278k'},
  {name:'Fort Wayne',slug:'fort-wayne',stateAbbr:'IN',tier:2,pop:'263k'},
  {name:'Jersey City',slug:'jersey-city',stateAbbr:'NJ',tier:2,pop:'286k'},
  {name:'Chula Vista',slug:'chula-vista',stateAbbr:'CA',tier:2,pop:'274k'},
  {name:'Orlando',slug:'orlando',stateAbbr:'FL',tier:2,pop:'307k'},
  {name:'St. Petersburg',slug:'st-petersburg',stateAbbr:'FL',tier:2,pop:'258k'},
  {name:'Laredo',slug:'laredo',stateAbbr:'TX',tier:2,pop:'255k'},
  {name:'Madison',slug:'madison',stateAbbr:'WI',tier:2,pop:'269k'},
  {name:'Durham',slug:'durham',stateAbbr:'NC',tier:2,pop:'283k'},
  {name:'Lubbock',slug:'lubbock',stateAbbr:'TX',tier:2,pop:'258k'},
  {name:'Winston-Salem',slug:'winston-salem',stateAbbr:'NC',tier:2,pop:'249k'},
  {name:'Garland',slug:'garland',stateAbbr:'TX',tier:2,pop:'236k'},
  {name:'Glendale',slug:'glendale',stateAbbr:'AZ',tier:2,pop:'246k'},
  {name:'Hialeah',slug:'hialeah',stateAbbr:'FL',tier:2,pop:'224k'},
  {name:'Scottsdale',slug:'scottsdale',stateAbbr:'AZ',tier:2,pop:'241k'},
  {name:'Irving',slug:'irving',stateAbbr:'TX',tier:2,pop:'240k'},
  {name:'Baton Rouge',slug:'baton-rouge',stateAbbr:'LA',tier:2,pop:'222k'},
  {name:'Fremont',slug:'fremont',stateAbbr:'CA',tier:2,pop:'230k'},
  {name:'Richmond',slug:'richmond',stateAbbr:'VA',tier:2,pop:'226k'},
  {name:'Boise',slug:'boise',stateAbbr:'ID',tier:2,pop:'235k'},
  {name:'Birmingham',slug:'birmingham',stateAbbr:'AL',tier:2,pop:'212k'},
  {name:'Rochester',slug:'rochester',stateAbbr:'NY',tier:2,pop:'211k'},
  {name:'San Bernardino',slug:'san-bernardino',stateAbbr:'CA',tier:2,pop:'222k'},
  {name:'Spokane',slug:'spokane',stateAbbr:'WA',tier:2,pop:'222k'},
  {name:'Des Moines',slug:'des-moines',stateAbbr:'IA',tier:2,pop:'214k'},
  {name:'Montgomery',slug:'montgomery',stateAbbr:'AL',tier:2,pop:'200k'},
  {name:'Modesto',slug:'modesto',stateAbbr:'CA',tier:2,pop:'218k'},
  {name:'Fayetteville',slug:'fayetteville',stateAbbr:'NC',tier:2,pop:'208k'},
  {name:'Tacoma',slug:'tacoma',stateAbbr:'WA',tier:2,pop:'213k'},
  {name:'Shreveport',slug:'shreveport',stateAbbr:'LA',tier:2,pop:'187k'},
  {name:'Fontana',slug:'fontana',stateAbbr:'CA',tier:2,pop:'213k'},
  {name:'Akron',slug:'akron',stateAbbr:'OH',tier:2,pop:'190k'},
  {name:'Huntington Beach',slug:'huntington-beach',stateAbbr:'CA',tier:2,pop:'200k'},
  {name:'Little Rock',slug:'little-rock',stateAbbr:'AR',tier:2,pop:'202k'},
  {name:'Grand Rapids',slug:'grand-rapids',stateAbbr:'MI',tier:2,pop:'198k'},
  {name:'Amarillo',slug:'amarillo',stateAbbr:'TX',tier:2,pop:'200k'},
  {name:'Oxnard',slug:'oxnard',stateAbbr:'CA',tier:2,pop:'203k'},
  {name:'Knoxville',slug:'knoxville',stateAbbr:'TN',tier:2,pop:'190k'},
  {name:'Salt Lake City',slug:'salt-lake-city',stateAbbr:'UT',tier:2,pop:'200k'},
  {name:'Huntsville',slug:'huntsville',stateAbbr:'AL',tier:2,pop:'190k'},
  {name:'Worcester',slug:'worcester',stateAbbr:'MA',tier:2,pop:'185k'},
  {name:'Augusta',slug:'augusta',stateAbbr:'GA',tier:2,pop:'198k'},
  {name:'Tempe',slug:'tempe',stateAbbr:'AZ',tier:2,pop:'185k'},
  {name:'Tallahassee',slug:'tallahassee',stateAbbr:'FL',tier:2,pop:'196k'},
  {name:'Cape Coral',slug:'cape-coral',stateAbbr:'FL',tier:2,pop:'194k'},
  {name:'Yonkers',slug:'yonkers',stateAbbr:'NY',tier:2,pop:'211k'},
  {name:'Mobile',slug:'mobile',stateAbbr:'AL',tier:2,pop:'187k'},
  {name:'Reno',slug:'reno',stateAbbr:'NV',tier:2,pop:'264k'},
  {name:'Overland Park',slug:'overland-park',stateAbbr:'KS',tier:2,pop:'197k'},
  {name:'Brownsville',slug:'brownsville',stateAbbr:'TX',tier:2,pop:'183k'},
  {name:'McKinney',slug:'mckinney',stateAbbr:'TX',tier:2,pop:'195k'},
  {name:'Fort Lauderdale',slug:'fort-lauderdale',stateAbbr:'FL',tier:2,pop:'182k'},
  {name:'Ontario',slug:'ontario',stateAbbr:'CA',tier:2,pop:'175k'},
  {name:'Chattanooga',slug:'chattanooga',stateAbbr:'TN',tier:2,pop:'181k'},
  {name:'Providence',slug:'providence',stateAbbr:'RI',tier:2,pop:'180k'},
  {name:'Oceanside',slug:'oceanside',stateAbbr:'CA',tier:2,pop:'175k'},
  {name:'Rancho Cucamonga',slug:'rancho-cucamonga',stateAbbr:'CA',tier:2,pop:'177k'},
  {name:'Santa Clarita',slug:'santa-clarita',stateAbbr:'CA',tier:2,pop:'228k'},
  {name:'Lansing',slug:'lansing',stateAbbr:'MI',tier:2,pop:'112k'},
  {name:'Vancouver',slug:'vancouver',stateAbbr:'WA',tier:2,pop:'184k'},
  {name:'Springfield',slug:'springfield',stateAbbr:'MO',tier:2,pop:'169k'},
  {name:'Elk Grove',slug:'elk-grove',stateAbbr:'CA',tier:2,pop:'176k'},
  {name:'Salem',slug:'salem',stateAbbr:'OR',tier:2,pop:'173k'},
  {name:'Clarksville',slug:'clarksville',stateAbbr:'TN',tier:2,pop:'166k'},
  {name:'Naperville',slug:'naperville',stateAbbr:'IL',tier:2,pop:'148k'},
  {name:'Bellevue',slug:'bellevue',stateAbbr:'WA',tier:2,pop:'148k'},
  {name:'Hayward',slug:'hayward',stateAbbr:'CA',tier:2,pop:'162k'},
  {name:'Alexandria',slug:'alexandria',stateAbbr:'VA',tier:2,pop:'159k'},
  {name:'Macon',slug:'macon',stateAbbr:'GA',tier:2,pop:'157k'},
  {name:'Sunnyvale',slug:'sunnyvale',stateAbbr:'CA',tier:2,pop:'153k'},
  {name:'Savannah',slug:'savannah',stateAbbr:'GA',tier:2,pop:'147k'},
  {name:'Torrance',slug:'torrance',stateAbbr:'CA',tier:2,pop:'147k'},
  {name:'Escondido',slug:'escondido',stateAbbr:'CA',tier:2,pop:'149k'},
  {name:'Killeen',slug:'killeen',stateAbbr:'TX',tier:2,pop:'145k'},
  {name:'Surprise',slug:'surprise',stateAbbr:'AZ',tier:2,pop:'143k'},
  {name:'Fort Collins',slug:'fort-collins',stateAbbr:'CO',tier:2,pop:'164k'},
  {name:'Dayton',slug:'dayton',stateAbbr:'OH',tier:2,pop:'137k'},
  {name:'Syracuse',slug:'syracuse',stateAbbr:'NY',tier:2,pop:'148k'},
  {name:'Bridgeport',slug:'bridgeport',stateAbbr:'CT',tier:2,pop:'148k'},
  {name:'Springfield',slug:'springfield-ma',stateAbbr:'MA',tier:2,pop:'155k'},
  {name:'Salinas',slug:'salinas',stateAbbr:'CA',tier:2,pop:'163k'},
  {name:'Murfreesboro',slug:'murfreesboro',stateAbbr:'TN',tier:2,pop:'151k'},
  {name:'Rockford',slug:'rockford',stateAbbr:'IL',tier:2,pop:'148k'},
  {name:'Jackson',slug:'jackson',stateAbbr:'MS',tier:2,pop:'153k'},
  {name:'McAllen',slug:'mcallen',stateAbbr:'TX',tier:2,pop:'143k'},
  {name:'New Haven',slug:'new-haven',stateAbbr:'CT',tier:2,pop:'130k'},
  {name:'Stamford',slug:'stamford',stateAbbr:'CT',tier:2,pop:'135k'},
  {name:'Sioux Falls',slug:'sioux-falls',stateAbbr:'SD',tier:2,pop:'192k'},
  {name:'Gainesville',slug:'gainesville',stateAbbr:'FL',tier:2,pop:'133k'},
  {name:'Hampton',slug:'hampton',stateAbbr:'VA',tier:2,pop:'137k'},
  {name:'Cedar Rapids',slug:'cedar-rapids',stateAbbr:'IA',tier:2,pop:'137k'},
  {name:'Chandler',slug:'chandler',stateAbbr:'AZ',tier:2,pop:'261k'},
  {name:'Gilbert',slug:'gilbert',stateAbbr:'AZ',tier:2,pop:'254k'},
  {name:'Peoria',slug:'peoria',stateAbbr:'IL',tier:2,pop:'110k'},
  {name:'Eugene',slug:'eugene',stateAbbr:'OR',tier:2,pop:'172k'},
  {name:'Norfolk',slug:'norfolk',stateAbbr:'VA',tier:2,pop:'238k'},
  {name:'Newport News',slug:'newport-news',stateAbbr:'VA',tier:2,pop:'186k'},
  {name:'Chesapeake',slug:'chesapeake',stateAbbr:'VA',tier:2,pop:'249k'},
  {name:'Wichita',slug:'wichita',stateAbbr:'KS',tier:2,pop:'389k'},
  {name:'Olathe',slug:'olathe',stateAbbr:'KS',tier:2,pop:'141k'},
  {name:'Topeka',slug:'topeka',stateAbbr:'KS',tier:2,pop:'126k'},
  {name:'Frisco',slug:'frisco',stateAbbr:'TX',tier:2,pop:'200k'},
  // Tier 3 — 25k–100k (representative sample)
  {name:'Pasadena',slug:'pasadena',stateAbbr:'CA',tier:3,pop:'138k'},
  {name:'Miramar',slug:'miramar',stateAbbr:'FL',tier:3,pop:'134k'},
  {name:'Mesquite',slug:'mesquite',stateAbbr:'TX',tier:3,pop:'143k'},
  {name:'Palmdale',slug:'palmdale',stateAbbr:'CA',tier:3,pop:'153k'},
  {name:'Hollywood',slug:'hollywood',stateAbbr:'FL',tier:3,pop:'148k'},
  {name:'Lakewood',slug:'lakewood',stateAbbr:'CO',tier:3,pop:'155k'},
  {name:'Warren',slug:'warren',stateAbbr:'MI',tier:3,pop:'139k'},
  {name:'Roseville',slug:'roseville',stateAbbr:'CA',tier:3,pop:'141k'},
  {name:'Pomona',slug:'pomona',stateAbbr:'CA',tier:3,pop:'151k'},
  {name:'Lancaster',slug:'lancaster',stateAbbr:'CA',tier:3,pop:'157k'},
  {name:'Corona',slug:'corona',stateAbbr:'CA',tier:3,pop:'163k'},
  {name:'Paterson',slug:'paterson',stateAbbr:'NJ',tier:3,pop:'155k'},
  {name:'Harlingen',slug:'harlingen',stateAbbr:'TX',tier:3,pop:'65k'},
  {name:'North Las Vegas',slug:'north-las-vegas',stateAbbr:'NV',tier:3,pop:'252k'},
  {name:'Paradise',slug:'paradise',stateAbbr:'NV',tier:3,pop:'193k'},
  {name:'Pembroke Pines',slug:'pembroke-pines',stateAbbr:'FL',tier:3,pop:'162k'},
  {name:'Fayetteville',slug:'fayetteville-ar',stateAbbr:'AR',tier:3,pop:'93k'},
  {name:'Peoria',slug:'peoria-az',stateAbbr:'AZ',tier:3,pop:'175k'},
  {name:'Moreno Valley',slug:'moreno-valley',stateAbbr:'CA',tier:3,pop:'213k'},
  {name:'Glendale',slug:'glendale-ca',stateAbbr:'CA',tier:3,pop:'196k'},
  {name:'Columbus',slug:'columbus-ga',stateAbbr:'GA',tier:3,pop:'200k'},
  {name:'Columbus',slug:'columbus-in',stateAbbr:'IN',tier:3,pop:'44k'},
  {name:'Springfield',slug:'springfield-il',stateAbbr:'IL',tier:3,pop:'114k'},
  {name:'Pasadena',slug:'pasadena-tx',stateAbbr:'TX',tier:3,pop:'153k'},
  {name:'Joliet',slug:'joliet',stateAbbr:'IL',tier:3,pop:'150k'},
  {name:'Torrance',slug:'torrance-ca',stateAbbr:'CA',tier:3,pop:'147k'},
  {name:'Pomona',slug:'pomona-ca',stateAbbr:'CA',tier:3,pop:'151k'},
  {name:'Garden Grove',slug:'garden-grove',stateAbbr:'CA',tier:3,pop:'170k'},
  {name:'Peoria',slug:'peoria-il',stateAbbr:'IL',tier:3,pop:'110k'},
  {name:'Santa Rosa',slug:'santa-rosa',stateAbbr:'CA',tier:3,pop:'177k'},
  {name:'Chattanooga',slug:'chattanooga-tn',stateAbbr:'TN',tier:3,pop:'181k'},
  {name:'Knoxville',slug:'knoxville-tn',stateAbbr:'TN',tier:3,pop:'190k'},
  {name:'Oceanside',slug:'oceanside-ca',stateAbbr:'CA',tier:3,pop:'175k'},
  {name:'Elk Grove',slug:'elk-grove-ca',stateAbbr:'CA',tier:3,pop:'176k'},
  {name:'Shreveport',slug:'shreveport-la',stateAbbr:'LA',tier:3,pop:'187k'},
  {name:'Mobile',slug:'mobile-al',stateAbbr:'AL',tier:3,pop:'187k'},
  {name:'Fontana',slug:'fontana-ca',stateAbbr:'CA',tier:3,pop:'213k'},
  {name:'Augusta',slug:'augusta-ga',stateAbbr:'GA',tier:3,pop:'198k'},
  {name:'Yonkers',slug:'yonkers-ny',stateAbbr:'NY',tier:3,pop:'211k'},
  {name:'Montgomery',slug:'montgomery-al',stateAbbr:'AL',tier:3,pop:'200k'},
  {name:'Tacoma',slug:'tacoma-wa',stateAbbr:'WA',tier:3,pop:'213k'},
  {name:'Spokane',slug:'spokane-wa',stateAbbr:'WA',tier:3,pop:'222k'},
  {name:'Little Rock',slug:'little-rock-ar',stateAbbr:'AR',tier:3,pop:'202k'},
  {name:'Modesto',slug:'modesto-ca',stateAbbr:'CA',tier:3,pop:'218k'},
  {name:'Worcester',slug:'worcester-ma',stateAbbr:'MA',tier:3,pop:'185k'},
  {name:'Birmingham',slug:'birmingham-al',stateAbbr:'AL',tier:3,pop:'212k'},
];

// ─── INCIDENTS ────────────────────────────────────────────────────
const INCIDENTS = [
  {
    name:'Fire & Smoke Damage',slug:'fire-damage',icon:'🔥',
    desc:'Kitchen fires, electrical fires, structure fires, smoke and soot damage',
    primaryKw:['commercial fire damage insurance claim','business fire insurance claim','kitchen fire insurance claim','electrical fire insurance claim'],
    secondaryKw:['smoke damage insurance claim business','fire total loss business insurance','arson insurance claim business','grease fire restaurant insurance'],
    covered:['Building and structure repair or rebuild','Contents and business personal property','Smoke and soot cleanup and odor remediation','Business interruption income loss','Ordinance or law (code upgrade) costs','Debris removal'],
    denied:['Pre-existing damage not caused by fire','Intentional fire without arson investigation','Flood damage from firefighting water (needs separate coverage)','Gradual deterioration'],
    docTips:['Fire marshal investigation report','Photographs before any cleanup begins','Complete inventory list of damaged/destroyed items','Three independent contractor repair estimates','Receipts for emergency board-up and temporary repairs','Business income records (12 months prior)'],
    faq:[
      {q:'Does my commercial property insurance cover smoke damage without a fire?',a:'Yes. Most commercial property policies cover smoke damage as a direct physical loss even without open flame, including odor remediation and air quality testing costs.'},
      {q:'My insurer says the fire was due to "poor maintenance" — can they deny my claim?',a:'Only if they can prove the maintenance issue was the direct cause AND your policy specifically excludes it. Vague maintenance exclusions are frequently challenged successfully.'},
      {q:'How long do I have to file a fire damage claim?',a:'Most policies require notice "as soon as practicable" — typically within 30–60 days. Your state statute of limitations for breach of insurance contract is separate and much longer.'},
    ]
  },
  {
    name:'Water & Flood Damage',slug:'water-damage',icon:'💧',
    desc:'Burst pipes, roof leaks, sewer backup, sprinkler malfunction, flooding',
    primaryKw:['commercial water damage insurance claim','burst pipe business insurance','water damage commercial property claim','flood damage business insurance'],
    secondaryKw:['sewer backup insurance claim business','frozen pipe burst insurance claim','HVAC water damage insurance claim','sprinkler system water damage claim'],
    covered:['Sudden and accidental pipe bursts','Roof leak resulting from storm','Accidental sprinkler discharge','HVAC condensate overflow','Sewer backup (with endorsement)','Equipment damage from water'],
    denied:['Gradual leaks or seepage (not sudden)','Natural flood without NFIP policy','Neglected maintenance causing pipe failure','Mold from long-term moisture (needs mold endorsement)'],
    docTips:['Plumber or restoration company report confirming sudden cause','Photographs of source and all affected areas','Moisture meter readings','List of all damaged contents and equipment','Previous maintenance records showing upkeep'],
    faq:[
      {q:'My roof has been leaking slowly for months — is that covered?',a:'Gradual leaks are often excluded as a maintenance issue. However, if the leak was sudden or caused by a storm event, coverage typically applies. The timing and cause are critical.'},
      {q:'Does commercial property insurance cover sewer backup?',a:'Standard commercial policies typically exclude sewer backup. You need a specific sewer and drain backup endorsement. Check your policy\'s water damage exclusion language.'},
      {q:'A frozen pipe burst in winter and flooded my business — is that covered?',a:'Yes, frozen pipe bursts are generally covered as sudden accidental damage. The insurer may probe whether the building was adequately heated — document your heating maintenance.'},
    ]
  },
  {
    name:'Storm & Weather Damage',slug:'storm-damage',icon:'⛈️',
    desc:'Hail, wind, hurricane, tornado, lightning, ice storm, fallen tree',
    primaryKw:['storm damage commercial property claim','hail damage business insurance claim','hurricane business insurance claim','wind damage commercial building insurance'],
    secondaryKw:['tornado damage business insurance','lightning strike insurance claim business','ice storm commercial property damage','fallen tree business insurance claim'],
    covered:['Wind damage to roof, walls, windows','Hail damage to roof, HVAC, skylights','Hurricane and tropical storm damage','Tornado structural damage','Lightning strike and surge damage','Fallen tree impact damage','Snow and ice load collapse'],
    denied:['Flood from storm surge (needs separate flood policy)','Gradual weathering or wear','Pre-existing roof damage','Earthquake shaking (needs separate policy)'],
    docTips:['Weather service records confirming storm date and severity','Aerial/drone photos of roof damage','Adjuster report with Xactimate estimate','Photos of hail marks, wind damage, fallen debris','Neighbor statements confirming the storm event'],
    faq:[
      {q:'My insurer says my roof damage is from normal wear — how do I fight that?',a:'Order an independent inspection from a licensed roofing contractor and a public adjuster. Wear and tear exclusions require the insurer to prove the damage is pre-existing — they bear that burden.'},
      {q:'Hurricane destroyed my commercial building. What is covered?',a:'Wind damage is typically covered under commercial property. Storm surge flooding requires a separate NFIP or private flood policy. Business interruption covers lost income during the closure period.'},
    ]
  },
  {
    name:'Theft & Burglary',slug:'theft',icon:'🔓',
    desc:'Break-ins, robbery, employee theft, equipment theft, copper theft',
    primaryKw:['business break-in insurance claim','commercial theft insurance claim','equipment theft insurance claim','employee theft insurance claim'],
    secondaryKw:['burglary commercial property insurance','robbery business insurance claim','copper theft insurance claim business','cargo theft insurance claim'],
    covered:['Stolen business personal property and inventory','Building damage from forced entry','Cash and securities (up to sublimit)','Equipment and tools theft','Employee dishonesty/fidelity coverage','Copper and metal theft damage'],
    denied:['Mysterious disappearance without evidence of theft','Theft by owner or principal','Inventory shortage without proof of theft','Employee theft without fidelity coverage endorsement'],
    docTips:['Police report filed within 24 hours','Inventory list with purchase prices and serial numbers','Security camera footage preserved immediately','Photos of forced entry points','Prior inventory records for comparison'],
    faq:[
      {q:'My employee stole from the business — does commercial insurance cover that?',a:'Standard commercial policies exclude employee theft. You need a crime policy or employee dishonesty endorsement. Fidelity bonds also cover this risk.'},
      {q:'Someone broke into my store but nothing was taken — just damage to the door. Is that covered?',a:'Yes. Vandalism and malicious mischief coverage (included in most commercial policies) covers damage from forced entry even if no theft occurred.'},
    ]
  },
  {
    name:'Vandalism & Riot Damage',slug:'vandalism',icon:'🪟',
    desc:'Graffiti, window smashing, property destruction, riot and civil unrest damage',
    primaryKw:['vandalism insurance claim business','graffiti damage insurance claim','riot damage commercial property insurance','civil unrest business insurance claim'],
    secondaryKw:['storefront window broken vandalism insurance','protest damage business insurance','arson vandalism insurance claim','malicious damage commercial insurance'],
    covered:['Graffiti removal and surface restoration','Broken windows and glass','Structural damage from deliberate acts','Riot and civil commotion damage','Looting and vandalism losses','Arson (intentional fire by third party)'],
    denied:['Intentional damage by the insured','Gradual deterioration painted as vandalism','Damage during wartime or military action'],
    docTips:['Police report filed same day','Photos before any cleanup','Contractor estimates for all repairs','Documentation of business closure costs','Video footage from neighboring businesses or traffic cameras'],
    faq:[
      {q:'My business was damaged during a protest. Does insurance cover riot damage?',a:'Yes. Most commercial property policies explicitly cover "riot or civil commotion" as a named peril. This includes looting, structural damage, and vandalism during unrest.'},
    ]
  },
  {
    name:'Slip & Fall / Premises Liability',slug:'slip-fall',icon:'⚠️',
    desc:'Customer and employee injuries on business premises, parking lot accidents',
    primaryKw:['slip and fall business insurance claim','customer injury business liability claim','premises liability insurance claim','slip fall claim against my business'],
    secondaryKw:['wet floor slip fall business liability','parking lot fall business insurance','customer tripped uneven floor insurance','customer fell in my store insurance'],
    covered:['Customer medical expenses from on-premises injuries','Legal defense costs for liability claims','Settlement payments up to policy limits','Employee medical payments under separate workers comp','Parking lot and exterior premises injuries'],
    denied:['Claims beyond policy liability limits','Intentional harm by business owner','Workers comp injuries (separate policy)'],
    docTips:['Incident report filed immediately','Photographs of hazard before correction','Witness statements from employees and bystanders','Security camera footage preserved','Medical records if available','Maintenance and inspection logs showing upkeep'],
    faq:[
      {q:'A customer slipped on a wet floor in my store. How do I handle the claim?',a:'Report to your general liability insurer immediately. Preserve all evidence including photos and surveillance video. Do not admit fault. Your insurer\'s claims team will investigate and handle the claim.'},
      {q:'My employee was injured at work — is that covered under my commercial liability policy?',a:'No. Employee injuries are covered by workers compensation insurance, which is separate from general liability. You are required by law to carry workers comp in most states.'},
    ]
  },
  {
    name:'Equipment Breakdown',slug:'equipment-breakdown',icon:'⚙️',
    desc:'HVAC failure, refrigeration breakdown, boiler, electrical equipment, machinery',
    primaryKw:['equipment breakdown insurance claim','HVAC failure insurance claim','refrigeration breakdown business insurance','commercial equipment failure insurance claim'],
    secondaryKw:['walk-in cooler failure insurance claim','boiler breakdown insurance claim','power surge equipment damage insurance','food spoilage insurance claim power outage'],
    covered:['Sudden mechanical or electrical breakdown','HVAC and refrigeration system failure','Boiler and pressure vessel damage','Power surge and electrical failure','Food spoilage from refrigeration failure','Cost of temporary equipment rental'],
    denied:['Normal wear and tear','Lack of maintenance causing failure','Cosmetic damage without functional breakdown','Leakage not resulting in breakdown'],
    docTips:['Repair technician report documenting sudden failure','Photographs of failed equipment','Food spoilage inventory with purchase prices','Refrigerator temperature logs','Prior maintenance service records'],
    faq:[
      {q:'My walk-in cooler failed overnight and I lost $8,000 in food. Is that covered?',a:'Yes, if you have equipment breakdown coverage (also called boiler and machinery coverage). Food spoilage from mechanical refrigeration failure is a standard covered loss under this coverage.'},
      {q:'My HVAC system stopped working in summer — does commercial insurance cover the replacement?',a:'Equipment breakdown coverage pays for sudden mechanical failure. Standard property insurance typically excludes mechanical breakdown. Check whether your policy includes an equipment breakdown endorsement.'},
    ]
  },
  {
    name:'Business Interruption',slug:'business-interruption',icon:'🚫',
    desc:'Lost income during forced closure, government order shutdowns, utility failures',
    primaryKw:['business interruption insurance claim','forced closure business income loss insurance','business closed insurance claim','business interruption claim denied'],
    secondaryKw:['government shutdown business insurance claim','contingent business interruption claim','utility outage business interruption insurance','how long business interruption insurance pays'],
    covered:['Lost net income during covered closure','Continuing operating expenses (rent, payroll)','Extra expenses to minimize the loss','Civil authority coverage for mandatory evacuations','Contingent BI from supplier disruption'],
    denied:['Closure not resulting from a covered physical loss','Voluntary closures','Pandemic/virus exclusions (post-COVID standard exclusions)','Losses beyond the restoration period'],
    docTips:['Financial statements 12–24 months prior to loss','Monthly revenue records by year','Proof of physical damage causing closure','Expense documentation (rent, payroll, utilities)','Evidence of extended closure duration'],
    faq:[
      {q:'My business was closed for 3 months after a fire. What does business interruption cover?',a:'Business interruption covers your net income loss plus continuing fixed expenses (rent, insurance premiums, loan payments) during the restoration period — typically from the date of loss until you can reasonably reopen.'},
      {q:'My insurer says my business interruption period was only 6 weeks — I was closed for 4 months. What can I do?',a:'The restoration period must be "reasonable" — not just the minimum. Document every delay (contractor availability, permit delays, supply chain issues) to extend the covered period.'},
    ]
  },
  {
    name:'Structural Damage',slug:'structural',icon:'🏗️',
    desc:'Roof collapse, ceiling failure, foundation damage, wall collapse, glass breakage',
    primaryKw:['structural damage business insurance claim','roof collapse insurance claim','commercial building structural damage','ceiling collapse business insurance'],
    secondaryKw:['foundation damage commercial property insurance','wall collapse insurance claim business','floor collapse business insurance','glass breakage insurance claim business'],
    covered:['Roof collapse from snow load, storm, or sudden failure','Ceiling and floor collapse','Exterior wall structural failure','Foundation damage from sudden causes','Plate glass and storefront window breakage','Signage and awning collapse'],
    denied:['Foundation settling or gradual movement','Pre-existing structural deficiencies','Earthquake (needs separate policy)','Ordinance-required demolition of undamaged portions (needs law coverage)'],
    docTips:['Structural engineer assessment report','Photographs documenting extent of damage','Building permit history and inspection records','Evidence of sudden cause vs. gradual deterioration','Contractor repair estimates'],
    faq:[
      {q:'My commercial roof collapsed under heavy snow. Is that covered?',a:'Yes. Snow load collapse is a covered cause of loss under most commercial property policies. Document the weather conditions with National Weather Service data and photograph the damage immediately.'},
    ]
  },
  {
    name:'Mold & Environmental',slug:'environmental',icon:'☣️',
    desc:'Mold damage, chemical spills, gas leaks, asbestos, contaminated soil',
    primaryKw:['mold damage business insurance claim','chemical spill business insurance claim','gas leak insurance claim business','environmental damage commercial property'],
    secondaryKw:['black mold business insurance claim','asbestos discovery insurance claim','soil contamination insurance business','biohazard cleanup insurance claim'],
    covered:['Mold resulting from a covered water loss','Emergency gas leak response and repair','Chemical spill cleanup (with pollution endorsement)','Asbestos abatement when discovered during covered repair','Business interruption during remediation'],
    denied:['Long-term mold from neglected moisture','Pollution without pollution liability endorsement','Pre-existing contamination','Gradual environmental damage'],
    docTips:['Industrial hygienist report identifying mold species and extent','Proof that mold resulted from a covered water event','Air quality testing results','Remediation contractor scope of work','Health department closure orders'],
    faq:[
      {q:'Mold grew after a burst pipe was repaired — does insurance cover mold remediation?',a:'Yes, if the mold directly resulted from a covered water loss (the burst pipe). The key is establishing the causal link. Document the timeline clearly from pipe burst to mold discovery.'},
    ]
  },
  {
    name:'Power & Utility Failures',slug:'power-utilities',icon:'⚡',
    desc:'Extended outages, power surges, transformer explosions, utility line damage',
    primaryKw:['power outage business insurance claim','power surge damage business insurance','utility line damage business insurance','transformer explosion insurance claim'],
    secondaryKw:['extended power outage business income loss','electrical surge equipment insurance claim','utility failure business interruption claim','lightning power surge insurance'],
    covered:['Equipment damage from power surge or lightning','Food and perishable spoilage','Business interruption from utility interruption (with endorsement)','Transformer or utility equipment damage to your property','Cost of temporary power generation'],
    denied:['Standard power outages without resulting physical damage','Off-premises power failures without utility interruption endorsement','Equipment failure from gradual voltage issues'],
    docTips:['Utility company outage records with timestamps','Equipment damage assessment from qualified technician','Inventory of spoiled food or perishables','Generator rental receipts','Power quality logs if available'],
    faq:[
      {q:'A power surge fried all my restaurant equipment. Is that covered?',a:'Yes. Sudden power surges that cause physical damage to your business equipment are covered under most commercial property policies. Document each piece of damaged equipment with repair or replacement estimates.'},
    ]
  },
  {
    name:'Cyber Attacks & Data Breach',slug:'cyber',icon:'💻',
    desc:'Ransomware, data breach, wire fraud, business email compromise',
    primaryKw:['cyber attack business insurance claim','ransomware insurance claim small business','data breach business insurance claim','wire fraud business insurance claim'],
    secondaryKw:['business email compromise insurance claim','cyber liability insurance claim','customer data stolen business insurance','HIPAA breach insurance claim'],
    covered:['Ransomware payment and data recovery costs','Business interruption from system shutdown','Notification costs for data breach','Legal defense for privacy liability','Wire fraud and BEC losses (with crime endorsement)','Credit monitoring for affected customers'],
    denied:['Social engineering without specific endorsement','Losses exceeding cyber policy sublimits','Pre-existing system vulnerabilities knowingly ignored'],
    docTips:['Forensic IT investigation report','Documentation of ransom demand and payment','Customer notification records','Business income loss calculation during downtime','Incident timeline from first detection'],
    faq:[
      {q:'Ransomware locked my business systems for two weeks. Is that a covered business interruption?',a:'Yes, if you have cyber insurance with business interruption coverage. Standard commercial property policies typically exclude cyber events — a standalone cyber policy is essential.'},
    ]
  },
  {
    name:'Vehicle & Auto Accidents',slug:'vehicle',icon:'🚗',
    desc:'Company vehicle accidents, vehicles hitting your building, parking lot incidents',
    primaryKw:['commercial vehicle accident insurance claim','car hit my business insurance claim','delivery vehicle accident business insurance','fleet vehicle insurance claim'],
    secondaryKw:['vehicle crashed into store insurance','company vehicle accident liability','parking lot accident business insurance','loading dock accident insurance'],
    covered:['Damage when a vehicle strikes your building','Company vehicle at-fault accidents (commercial auto)','Uninsured motorist damage to your property','Parking lot liability for customer vehicle incidents'],
    denied:['Personal vehicles used for business without commercial auto','Employee\'s personal accidents outside scope of work','Intentional vehicle ramming without third-party coverage'],
    docTips:['Police accident report','Photos of vehicle, building damage, and scene','Driver and witness contact information','Surveillance footage','Vehicle registration and insurance of at-fault driver'],
    faq:[
      {q:'A car drove into my storefront. My building insurance or their auto insurance — which pays?',a:'File with both. Their auto liability insurance covers your property damage. Your commercial property policy can pay first and subrogate against the at-fault driver\'s insurer.'},
    ]
  },
  {
    name:'Employee Injury & Workplace Accidents',slug:'employee-injury',icon:'🏥',
    desc:'Workers compensation, employee lawsuits, workplace violence, employment practices',
    primaryKw:['employee injury insurance claim business','workers comp insurance claim','employment practices liability claim','workplace violence insurance claim'],
    secondaryKw:['worker hurt on job insurance','wrongful termination insurance claim','harassment lawsuit business insurance','employee accident insurance business'],
    covered:['Medical expenses for work injuries (workers comp)','Lost wages for injured employees (workers comp)','Employer liability for negligence claims','EPLI coverage for harassment, discrimination, wrongful termination claims','Workplace violence response costs'],
    denied:['Injuries during employee personal activities','Intentional self-harm','Injuries from intoxication on the job'],
    docTips:['Incident report filed same day','Witness statements','Medical records and treatment documentation','OSHA report if required','Workers comp claim filed within required timeframe by state'],
    faq:[
      {q:'An employee was injured at work and is now suing me personally. What covers that?',a:'Workers compensation covers medical and wage replacement. If they sue for gross negligence, employer liability coverage (part of your workers comp policy) covers your defense. EPLI covers discrimination and wrongful termination claims.'},
    ]
  },
  {
    name:'Food Spoilage & Contamination',slug:'food-spoilage',icon:'🍖',
    desc:'Power outage food loss, refrigeration failure, food poisoning liability, health closure',
    primaryKw:['food spoilage insurance claim restaurant','power outage food loss insurance','food poisoning business insurance claim','health department closure insurance'],
    secondaryKw:['refrigeration failure food loss claim','contaminated food insurance claim','restaurant forced closure insurance','food contamination liability claim'],
    covered:['Food spoilage from power failure or equipment breakdown','Contamination cleanup and disposal costs','Business interruption from mandatory closure','Product recall expenses (with endorsement)','Liability for foodborne illness (general liability)'],
    denied:['Spoilage from gradual temperature issues','Deliberate contamination (terrorism exclusion may apply)','Spoilage beyond policy sublimit'],
    docTips:['Temperature logs before and during failure','Complete food inventory with purchase prices','Health department inspection reports','Power company outage confirmation','Medical records if customer illness claimed'],
    faq:[
      {q:'I lost $12,000 in food during a power outage. How much will insurance pay?',a:'Check your policy for the food spoilage sublimit — many commercial policies cap spoilage coverage at $5,000–$25,000. Equipment breakdown coverage often has higher limits for refrigerated product losses.'},
    ]
  },
  {
    name:'General Liability Claims',slug:'general-liability',icon:'⚖️',
    desc:'Third-party bodily injury, property damage, advertising injury, product liability',
    primaryKw:['general liability insurance claim business','third party injury insurance claim','product liability insurance claim','advertising injury insurance claim'],
    secondaryKw:['business liability claim against me','property damage liability insurance claim','completed operations insurance claim','customer property damaged by business'],
    covered:['Bodily injury to non-employees on or off premises','Property damage caused by your business operations','Personal and advertising injury (defamation, copyright)','Products completed operations liability','Legal defense costs (even groundless claims)'],
    denied:['Intentional acts by the insured','Injuries to employees (workers comp)','Professional errors (needs E&O policy)','Damage to your own property'],
    docTips:['Incident report filed immediately','Photos of scene and injuries/damage','Witness statements','Preserve product samples if product liability claim','Do not admit fault or make payments without insurer authorization'],
    faq:[
      {q:'A customer says my product injured them. Does my commercial insurance cover that?',a:'Yes. Products liability is included in standard commercial general liability policies. Report the claim immediately. Your insurer defends and pays within policy limits.'},
    ]
  },
  {
    name:'Business Property Theft & Fraud',slug:'fraud',icon:'🔐',
    desc:'Internal fraud, check forgery, computer fraud, business identity theft',
    primaryKw:['business fraud insurance claim','employee embezzlement insurance','check fraud insurance claim business','commercial crime insurance claim'],
    secondaryKw:['computer fraud business insurance','wire transfer fraud insurance','fidelity bond claim','forgery insurance claim business'],
    covered:['Employee dishonesty and embezzlement','Forgery or alteration of instruments','Computer and transfer fraud','Money and securities theft','Counterfeit currency acceptance'],
    denied:['Fraud by owners or partners','Losses discovered after coverage lapse','Fraud excluded from standard commercial property'],
    docTips:['Forensic accounting report','Bank statements showing unauthorized transactions','Police report for criminal prosecution','HR records documenting discovery process','Signed authorization records for comparison'],
    faq:[
      {q:'My bookkeeper embezzled $40,000. Does my commercial insurance cover that?',a:'Only if you have a crime policy or employee dishonesty endorsement. Standard commercial property insurance excludes employee theft. A commercial crime policy or fidelity bond is the right coverage.'},
    ]
  },
  {
    name:'Restaurant & Food Service Claims',slug:'restaurant',icon:'🍽️',
    desc:'All insurance claims specific to restaurants, cafes, bars, food trucks, catering',
    primaryKw:['restaurant insurance claim','restaurant fire insurance','restaurant flood insurance claim','restaurant business interruption claim'],
    secondaryKw:['food truck insurance claim','bar insurance claim','cafe insurance claim','restaurant equipment breakdown claim','health department closure insurance restaurant'],
    covered:['Kitchen fire and grease damage','Food spoilage from power or equipment failure','Slip and fall customer injuries','Liquor liability (with endorsement)','Health department–ordered closure income loss','Equipment breakdown: ovens, fryers, refrigeration'],
    denied:['Contamination from improper food handling (no endorsement)','Gradual grease buildup causing fire (maintenance exclusion risk)'],
    docTips:['Hood cleaning maintenance records (critical for grease fire claims)','Food safety temperature logs','Health inspection history','Revenue records for business interruption calculation'],
    faq:[
      {q:'My restaurant had a grease fire. The insurer says it was due to poor hood maintenance. Can they deny my claim?',a:'They must prove the maintenance failure was the proximate cause. Regular hood cleaning records are your best defense. Even if cleaning records are imperfect, most grease fires are covered if the insured was making reasonable efforts at maintenance.'},
    ]
  },
];

// ─── CSS ──────────────────────────────────────────────────────────
const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#f6f3ee;--bg-card:#fff;--bg-subtle:#eeeae2;--ink:#14181f;--ink-2:#2a3140;--ink-3:#5b6472;--ink-4:#8a9097;--navy:#1c2333;--teal:#2a9d8f;--line:#e0dbd2;--r:10px;--r-lg:14px}
body{font-family:'Inter',system-ui,-apple-system,sans-serif;background:var(--bg);color:var(--ink);line-height:1.6;font-size:15px}
a{color:var(--navy);text-decoration:none}a:hover{text-decoration:underline}
.wrap{max-width:1120px;margin:0 auto;padding:0 24px}
/* Nav */
.nav{background:var(--navy);padding:14px 0;position:sticky;top:0;z-index:100}
.nav-inner{display:flex;align-items:center;justify-content:space-between}
.nav-logo{color:#fff;font-weight:700;font-size:16px;letter-spacing:-.02em;display:flex;align-items:center;gap:8px}
.nav-links{display:flex;gap:24px}
.nav-links a{color:rgba(255,255,255,.7);font-size:13px}
.nav-links a:hover{color:#fff;text-decoration:none}
.nav-cta{background:#fff;color:var(--navy);padding:7px 16px;border-radius:8px;font-size:13px;font-weight:600}
.nav-cta:hover{background:#f0ede8;text-decoration:none}
/* Hero */
.hero{background:linear-gradient(135deg,var(--navy) 0%,#243050 100%);color:#fff;padding:64px 0 48px}
.hero-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.15);border-radius:20px;padding:5px 12px;font-size:12px;color:rgba(255,255,255,.8);margin-bottom:20px;letter-spacing:.04em;text-transform:uppercase}
.hero h1{font-size:clamp(28px,4vw,42px);font-weight:700;letter-spacing:-.02em;line-height:1.2;margin-bottom:16px;max-width:680px}
.hero p{font-size:16px;color:rgba(255,255,255,.75);max-width:580px;line-height:1.65;margin-bottom:28px}
.hero-actions{display:flex;gap:12px;flex-wrap:wrap}
.btn-primary{background:#fff;color:var(--navy);padding:12px 24px;border-radius:10px;font-weight:600;font-size:14px;display:inline-block}
.btn-primary:hover{background:#f0ede8;text-decoration:none}
.btn-secondary{background:rgba(255,255,255,.1);color:#fff;padding:12px 24px;border-radius:10px;font-weight:500;font-size:14px;border:1px solid rgba(255,255,255,.2);display:inline-block}
.btn-secondary:hover{background:rgba(255,255,255,.18);text-decoration:none}
/* Stats bar */
.stats{background:var(--bg-card);border-bottom:1px solid var(--line);padding:20px 0}
.stats-inner{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:16px}
.stat{text-align:center}
.stat-num{font-size:22px;font-weight:700;color:var(--navy);letter-spacing:-.02em}
.stat-label{font-size:12px;color:var(--ink-3);margin-top:2px}
/* Main layout */
.page{padding:48px 0 64px}
.grid-2{display:grid;grid-template-columns:1fr 340px;gap:40px;align-items:start}
@media(max-width:800px){.grid-2{grid-template-columns:1fr}}
/* Sections */
.section{margin-bottom:48px}
.section-title{font-size:20px;font-weight:700;letter-spacing:-.015em;color:var(--navy);margin-bottom:6px}
.section-sub{font-size:13.5px;color:var(--ink-3);margin-bottom:20px}
.divider{border:none;border-top:1px solid var(--line);margin:32px 0}
/* Law box */
.law-box{background:var(--bg-card);border:1px solid var(--line);border-radius:var(--r-lg);padding:24px;margin-bottom:24px}
.law-box h3{font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink-3);margin-bottom:16px}
.law-item{display:flex;gap:12px;margin-bottom:12px;font-size:14px}
.law-label{font-weight:600;color:var(--navy);min-width:110px;flex-shrink:0}
.law-value{color:var(--ink-2)}
/* Incident grid */
.incident-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px}
.incident-card{background:var(--bg-card);border:1px solid var(--line);border-radius:var(--r);padding:16px;transition:box-shadow .15s}
.incident-card:hover{box-shadow:0 4px 16px rgba(0,0,0,.08);text-decoration:none}
.incident-icon{font-size:22px;margin-bottom:8px}
.incident-name{font-size:14px;font-weight:600;color:var(--navy);margin-bottom:4px}
.incident-desc{font-size:12.5px;color:var(--ink-3);line-height:1.5}
/* Coverage list */
.cover-list,.deny-list{list-style:none;margin-bottom:16px}
.cover-list li::before{content:"✓ ";color:var(--teal);font-weight:700}
.deny-list li::before{content:"✗ ";color:#e05252;font-weight:700}
.cover-list li,.deny-list li{font-size:14px;color:var(--ink-2);margin-bottom:6px;padding-left:4px}
/* FAQ */
.faq-item{border:1px solid var(--line);border-radius:var(--r);margin-bottom:10px;overflow:hidden}
.faq-q{font-size:14px;font-weight:600;color:var(--navy);padding:14px 16px;background:var(--bg-card)}
.faq-a{font-size:13.5px;color:var(--ink-2);padding:12px 16px 16px;background:var(--bg-subtle);border-top:1px solid var(--line);line-height:1.65}
/* Sidebar */
.sidebar-card{background:var(--bg-card);border:1px solid var(--line);border-radius:var(--r-lg);padding:24px;margin-bottom:20px}
.sidebar-card h3{font-size:15px;font-weight:700;color:var(--navy);margin-bottom:12px}
.sidebar-card p{font-size:13.5px;color:var(--ink-2);margin-bottom:16px;line-height:1.6}
.sidebar-card ul{list-style:none;margin-bottom:16px}
.sidebar-card ul li{font-size:13px;color:var(--ink-2);padding:6px 0;border-bottom:1px solid var(--line)}
.sidebar-card ul li:last-child{border-bottom:none}
/* City grid */
.city-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:8px}
.city-link{background:var(--bg-card);border:1px solid var(--line);border-radius:8px;padding:10px 14px;font-size:13px;color:var(--ink-2);display:block}
.city-link:hover{background:var(--navy);color:#fff;border-color:var(--navy);text-decoration:none}
/* State grid */
.state-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px}
.state-link{background:var(--bg-card);border:1px solid var(--line);border-radius:8px;padding:10px 14px;font-size:13px;color:var(--ink-2);display:block}
.state-link:hover{background:var(--navy);color:#fff;border-color:var(--navy);text-decoration:none}
/* Breadcrumb */
.breadcrumb{font-size:12.5px;color:var(--ink-3);margin-bottom:8px}
.breadcrumb a{color:var(--ink-3)}
.breadcrumb span{margin:0 6px;color:var(--ink-4)}
/* Tags */
.tag{display:inline-block;background:var(--bg-subtle);border-radius:20px;padding:3px 10px;font-size:11.5px;color:var(--ink-3);margin:2px}
/* Warning */
.warning{background:#fff8e1;border:1px solid #f5d060;border-radius:var(--r);padding:14px 16px;font-size:13px;color:#7a5500;margin-bottom:24px;line-height:1.6}
/* Footer */
.footer{background:var(--navy);color:rgba(255,255,255,.55);padding:40px 0;margin-top:64px}
.footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:32px;margin-bottom:32px}
@media(max-width:700px){.footer-grid{grid-template-columns:1fr 1fr}}
.footer h4{color:#fff;font-size:13px;font-weight:600;margin-bottom:12px;text-transform:uppercase;letter-spacing:.06em}
.footer ul{list-style:none}
.footer ul li{margin-bottom:8px}
.footer ul li a{color:rgba(255,255,255,.55);font-size:12.5px}
.footer ul li a:hover{color:#fff;text-decoration:none}
.footer-bottom{border-top:1px solid rgba(255,255,255,.1);padding-top:20px;font-size:11.5px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px}
.footer-disclaimer{font-size:11px;color:rgba(255,255,255,.4);margin-top:12px;line-height:1.6}
`;

// ─── SHARED PARTIALS ──────────────────────────────────────────────
function nav(root='..') {
  return `<nav class="nav"><div class="wrap nav-inner">
  <a class="nav-logo" href="${root}/index.html">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L4 5.5V11C4 15.5 7.5 19.7 12 21C16.5 19.7 20 15.5 20 11V5.5L12 2Z" stroke="#fff" stroke-width="1.7" stroke-linejoin="round"/>
      <path d="M9 12l2 2 4-4" stroke="#7ecdc8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    Shielded
  </a>
  <div class="nav-links">
    <a href="${root}/claims/index.html">All Claims</a>
    <a href="${root}/app.html">App</a>
  </div>
  <a class="nav-cta" href="${root}/app.html">Analyze My Claim →</a>
</div></nav>`;
}

function footer() {
  return `<footer class="footer"><div class="wrap">
  <div class="footer-grid">
    <div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2L4 5.5V11C4 15.5 7.5 19.7 12 21C16.5 19.7 20 15.5 20 11V5.5L12 2Z" stroke="#fff" stroke-width="1.7" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke="#7ecdc8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span style="color:#fff;font-weight:700;font-size:15px">Shielded</span>
      </div>
      <p style="font-size:12.5px;line-height:1.7;max-width:260px">Insurance claims knowledge platform for US small businesses. Free policy analysis and claim guidance.</p>
    </div>
    <div><h4>Claims by Incident</h4><ul>
      <li><a href="fire-damage/index.html">Fire Damage</a></li>
      <li><a href="water-damage/index.html">Water Damage</a></li>
      <li><a href="storm-damage/index.html">Storm Damage</a></li>
      <li><a href="theft/index.html">Theft</a></li>
      <li><a href="equipment-breakdown/index.html">Equipment</a></li>
    </ul></div>
    <div><h4>Claims by State</h4><ul>
      <li><a href="california/index.html">California</a></li>
      <li><a href="texas/index.html">Texas</a></li>
      <li><a href="florida/index.html">Florida</a></li>
      <li><a href="new-york/index.html">New York</a></li>
      <li><a href="illinois/index.html">Illinois</a></li>
    </ul></div>
    <div><h4>Resources</h4><ul>
      <li><a href="../app.html">Free Claim Analysis</a></li>
      <li><a href="index.html">Claims Hub</a></li>
    </ul></div>
  </div>
  <div class="footer-bottom">
    <span>© 2026 Shielded, Inc.</span>
    <span>Knowledge sharing · Not legal advice</span>
  </div>
  <p class="footer-disclaimer">Shielded is an informational tool, not a law firm. Nothing on this platform constitutes legal advice or creates an attorney–client relationship. All content is for educational purposes. Consult a licensed attorney in your state for legal advice.</p>
</div></footer>`;
}

function schema(type, data) {
  return `<script type="application/ld+json">${JSON.stringify(data, null, 0)}<\/script>`;
}

// ─── HUB PAGE ─────────────────────────────────────────────────────
function hubPage() {
  const incidentCards = INCIDENTS.map(i =>
    `<a class="incident-card" href="${i.slug}/index.html">
      <div class="incident-icon">${i.icon}</div>
      <div class="incident-name">${i.name}</div>
      <div class="incident-desc">${i.desc}</div>
    </a>`
  ).join('');

  const stateLinks = STATES.map(s =>
    `<a class="state-link" href="${s.slug}/index.html">${s.name}</a>`
  ).join('');

  const tier1Cities = CITIES.filter(c=>c.tier===1).map(c => {
    const state = STATES.find(s=>s.abbr===c.stateAbbr);
    return `<a class="city-link" href="${state.slug}/${c.slug}/index.html">${c.name}, ${c.stateAbbr}</a>`;
  }).join('');

  return `<!doctype html><html lang="en"><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Commercial Insurance Claims Hub — All Incidents, All States | Shielded</title>
<meta name="description" content="Free insurance claim guidance for US small businesses. Find your incident type — fire, flood, theft, storm, equipment failure and more — plus state-specific claim rights for all 50 states."/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<style>${CSS}</style>
${schema('WebPage',{'@context':'https://schema.org','@type':'WebPage',name:'Commercial Insurance Claims Hub',description:'Insurance claim guidance for US small businesses — all incident types and all 50 states',url:'https://attorneyaitools.org/claims/'})}
</head><body>
${nav('.')}
<div class="hero"><div class="wrap">
  <div class="hero-badge">Free · No signup required</div>
  <h1>Commercial Insurance Claims: Know What You're Owed</h1>
  <p>Every type of business incident. Every US state. Free claim analysis that cites your actual policy language — so you walk into negotiations knowing your number.</p>
  <div class="hero-actions">
    <a class="btn-primary" href="../app.html">Analyze My Claim Free →</a>
    <a class="btn-secondary" href="#incidents">Browse by Incident</a>
  </div>
</div></div>

<div class="stats"><div class="wrap"><div class="stats-inner">
  <div class="stat"><div class="stat-num">$14,200</div><div class="stat-label">avg gap between first offer and fair value</div></div>
  <div class="stat"><div class="stat-num">419+</div><div class="stat-label">claim keywords covered</div></div>
  <div class="stat"><div class="stat-num">50</div><div class="stat-label">states — know your local law</div></div>
  <div class="stat"><div class="stat-num">Free</div><div class="stat-label">policy analysis, no credit card</div></div>
</div></div></div>

<div class="page"><div class="wrap">
  <div class="warning">⚠ <strong>Not legal advice.</strong> Shielded is a knowledge-sharing platform. All content is informational only. For legal representation, consult a licensed attorney in your state.</div>

  <div class="section" id="incidents">
    <div class="section-title">Browse by Incident Type</div>
    <div class="section-sub">Select what happened to your business. Get the keywords, coverage facts, and documentation checklist.</div>
    <div class="incident-grid">${incidentCards}</div>
  </div>

  <hr class="divider"/>

  <div class="section" id="states">
    <div class="section-title">Browse by State — Know Your Rights</div>
    <div class="section-sub">Insurance law varies by state. Find your state's statute of limitations, bad faith law, and insurance commissioner.</div>
    <div class="state-grid">${stateLinks}</div>
  </div>

  <hr class="divider"/>

  <div class="section" id="cities">
    <div class="section-title">Major US Cities</div>
    <div class="section-sub">Local insurance claim guidance for the 50 largest US metro areas.</div>
    <div class="city-grid">${tier1Cities}</div>
  </div>
</div></div>
${footer()}
</body></html>`;
}

// ─── STATE PAGE ───────────────────────────────────────────────────
function statePage(state) {
  const stateCities = CITIES.filter(c=>c.stateAbbr===state.abbr && c.tier<=2).map(c =>
    `<a class="city-link" href="${c.slug}/index.html">${c.name}</a>`
  ).join('');

  const incidentLinks = INCIDENTS.map(i =>
    `<a class="incident-card" href="../${i.slug}/index.html">
      <div class="incident-icon">${i.icon}</div>
      <div class="incident-name">${i.name}</div>
      <div class="incident-desc">${i.desc}</div>
    </a>`
  ).join('');

  return `<!doctype html><html lang="en"><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Commercial Insurance Claims in ${state.name} — Know Your Rights | Shielded</title>
<meta name="description" content="${state.name} business insurance claim rights: ${state.badFaith}. Statute of limitations: ${state.sol} years. ${state.note} Free claim analysis."/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<style>${CSS}</style>
${schema('WebPage',{'@context':'https://schema.org','@type':'WebPage',name:`Commercial Insurance Claims in ${state.name}`,description:`${state.name} policyholder rights, bad faith law, and claim filing guidance for small businesses`,url:`https://attorneyaitools.org/claims/${state.slug}/`})}
</head><body>
${nav('../..')}
<div class="hero"><div class="wrap">
  <div class="breadcrumb" style="color:rgba(255,255,255,.6)"><a href="../index.html" style="color:rgba(255,255,255,.6)">Claims</a><span>›</span>${state.name}</div>
  <div class="hero-badge">${state.abbr} · State Insurance Law</div>
  <h1>Commercial Insurance Claims in ${state.name}</h1>
  <p>Know your rights under ${state.statute}. ${state.note}</p>
  <div class="hero-actions">
    <a class="btn-primary" href="../../app.html">Analyze My ${state.abbr} Claim →</a>
    <a class="btn-secondary" href="${state.commUrl}" target="_blank" rel="noopener">Contact ${state.commissioner} ↗</a>
  </div>
</div></div>

<div class="page"><div class="wrap"><div class="grid-2">
  <div>
    <div class="warning">⚠ <strong>Informational only.</strong> This page summarizes ${state.name} insurance law for educational purposes. Not legal advice. Consult a licensed ${state.name} attorney for your specific situation.</div>

    <div class="section">
      <div class="law-box">
        <h3>${state.name} Insurance Claim Law</h3>
        <div class="law-item"><span class="law-label">Key Statute</span><span class="law-value">${state.statute}</span></div>
        <div class="law-item"><span class="law-label">Bad Faith</span><span class="law-value">${state.badFaith}</span></div>
        <div class="law-item"><span class="law-label">SOL (contract)</span><span class="law-value">${state.sol} years from date of loss</span></div>
        <div class="law-item"><span class="law-label">Commissioner</span><span class="law-value"><a href="${state.commUrl}" target="_blank" rel="noopener">${state.commissioner} ↗</a></span></div>
        <div style="margin-top:12px;font-size:13.5px;color:var(--ink-2);line-height:1.65">${state.note}</div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">All Incident Types — ${state.name}</div>
      <div class="section-sub">Select the type of incident that happened to your business.</div>
      <div class="incident-grid">${incidentLinks}</div>
    </div>

    ${stateCities ? `<hr class="divider"/><div class="section">
      <div class="section-title">${state.name} Cities</div>
      <div class="section-sub">Local insurance claim guidance by city.</div>
      <div class="city-grid">${stateCities}</div>
    </div>` : ''}
  </div>

  <div>
    <div class="sidebar-card">
      <h3>Free Claim Analysis</h3>
      <p>Upload your ${state.name} commercial policy. Get a plain-English breakdown of what you're owed — citing your exact policy sections.</p>
      <a class="btn-primary" href="../../app.html" style="display:block;text-align:center">Analyze My Policy →</a>
    </div>
    <div class="sidebar-card">
      <h3>Your ${state.name} Claim Timeline</h3>
      <ul>
        <li>Report claim: as soon as practicable</li>
        <li>Submit proof of loss: per policy (often 60 days)</li>
        <li>Insurer must acknowledge: varies by state</li>
        <li>Sue for underpayment: within ${state.sol} years</li>
        <li>Bad faith claim: consult attorney</li>
      </ul>
    </div>
    <div class="sidebar-card">
      <h3>File a Complaint</h3>
      <p>If your insurer is acting in bad faith or unreasonably delaying your ${state.name} claim, file a complaint with the ${state.commissioner}.</p>
      <a href="${state.commUrl}" target="_blank" rel="noopener" style="font-size:13px;color:var(--navy);font-weight:600">${state.commUrl.replace('https://','').replace('http://','')} ↗</a>
    </div>
  </div>
</div></div></div>
${footer()}
</body></html>`;
}

// ─── CITY PAGE ────────────────────────────────────────────────────
function cityPage(city, state) {
  const incidentLinks = INCIDENTS.map(i =>
    `<a class="incident-card" href="../../${i.slug}/index.html">
      <div class="incident-icon">${i.icon}</div>
      <div class="incident-name">${i.name}</div>
      <div class="incident-desc">${i.desc}</div>
    </a>`
  ).join('');

  const tierLabel = city.tier===1 ? 'Major Metro' : city.tier===2 ? 'Mid-Size City' : 'Local Market';

  return `<!doctype html><html lang="en"><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Insurance Claim Help for ${city.name}, ${state.abbr} Businesses | Shielded</title>
<meta name="description" content="${city.name} business insurance claims: fire, flood, theft, storm, equipment breakdown and more. Know your ${state.name} rights under ${state.statute}. Free claim analysis."/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<style>${CSS}</style>
${schema('WebPage',{'@context':'https://schema.org','@type':'WebPage',name:`Business Insurance Claims in ${city.name}, ${state.abbr}`,description:`Insurance claim guidance for ${city.name} small businesses`,url:`https://attorneyaitools.org/claims/${state.slug}/${city.slug}/`})}
</head><body>
${nav('../../..')}
<div class="hero"><div class="wrap">
  <div class="breadcrumb" style="color:rgba(255,255,255,.6)">
    <a href="../../index.html" style="color:rgba(255,255,255,.6)">Claims</a><span>›</span>
    <a href="../index.html" style="color:rgba(255,255,255,.6)">${state.name}</a><span>›</span>${city.name}
  </div>
  <div class="hero-badge">${city.name}, ${state.abbr} · ${tierLabel}</div>
  <h1>Insurance Claim Help for ${city.name} Businesses</h1>
  <p>${city.name} is in ${state.name}. ${state.name} law gives you ${state.sol} years to pursue underpaid claims under ${state.statute}. ${state.note}</p>
  <div class="hero-actions">
    <a class="btn-primary" href="../../../app.html">Analyze My ${city.name} Claim →</a>
    <a class="btn-secondary" href="../index.html">All ${state.name} Claims</a>
  </div>
</div></div>

<div class="page"><div class="wrap"><div class="grid-2">
  <div>
    <div class="warning">⚠ <strong>Informational only.</strong> Not legal advice. Consult a licensed ${state.name} attorney for your specific situation.</div>

    <div class="section">
      <div class="law-box">
        <h3>${state.name} Law Applies to ${city.name} Claims</h3>
        <div class="law-item"><span class="law-label">Statute</span><span class="law-value">${state.statute}</span></div>
        <div class="law-item"><span class="law-label">Bad Faith</span><span class="law-value">${state.badFaith}</span></div>
        <div class="law-item"><span class="law-label">Time Limit</span><span class="law-value">${state.sol} years</span></div>
        <div class="law-item"><span class="law-label">Regulator</span><span class="law-value"><a href="${state.commUrl}" target="_blank" rel="noopener">${state.commissioner}</a></span></div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">What Happened to Your ${city.name} Business?</div>
      <div class="section-sub">Select the incident type to see coverage facts, keywords, and documentation checklist.</div>
      <div class="incident-grid">${incidentLinks}</div>
    </div>
  </div>

  <div>
    <div class="sidebar-card">
      <h3>Free Claim Analysis</h3>
      <p>Upload your commercial policy. Get a plain-English breakdown citing your exact policy sections — no signup required.</p>
      <a class="btn-primary" href="../../../app.html" style="display:block;text-align:center">Analyze My Policy →</a>
    </div>
    <div class="sidebar-card">
      <h3>${city.name} Quick Facts</h3>
      <ul>
        <li>State: ${state.name}</li>
        <li>Population: ${city.pop}</li>
        <li>Insurance law: ${state.statute}</li>
        <li>SOL: ${state.sol} years</li>
        <li>Commissioner: <a href="${state.commUrl}" target="_blank" rel="noopener">File complaint ↗</a></li>
      </ul>
    </div>
  </div>
</div></div></div>
${footer()}
</body></html>`;
}

// ─── INCIDENT PAGE ────────────────────────────────────────────────
function incidentPage(incident) {
  const covered = incident.covered.map(x=>`<li>${x}</li>`).join('');
  const denied = incident.denied.map(x=>`<li>${x}</li>`).join('');
  const docTips = incident.docTips.map(x=>`<li>${x}</li>`).join('');
  const faqs = incident.faq.map(f=>`<div class="faq-item"><div class="faq-q">${f.q}</div><div class="faq-a">${f.a}</div></div>`).join('');
  const kwTags = [...incident.primaryKw,...incident.secondaryKw].map(k=>`<span class="tag">${k}</span>`).join('');
  const stateLinks = STATES.map(s=>
    `<a class="state-link" href="../${s.slug}/index.html">${incident.name} in ${s.name}</a>`
  ).join('');

  return `<!doctype html><html lang="en"><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${incident.name} Insurance Claim Guide for Businesses | Shielded</title>
<meta name="description" content="How to file a commercial ${incident.name.toLowerCase()} insurance claim. What's covered, what's denied, how to document, and what to do if your insurer underpays. Free analysis tool."/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<style>${CSS}</style>
${schema('Article',{'@context':'https://schema.org','@type':'Article',headline:`${incident.name} Insurance Claim Guide for Businesses`,description:`How to file and win a commercial ${incident.name.toLowerCase()} insurance claim`,url:`https://attorneyaitools.org/claims/${incident.slug}/`})}
</head><body>
${nav('../..')}
<div class="hero"><div class="wrap">
  <div class="breadcrumb" style="color:rgba(255,255,255,.6)"><a href="../index.html" style="color:rgba(255,255,255,.6)">Claims</a><span>›</span>${incident.name}</div>
  <div class="hero-badge">${incident.icon} ${incident.name}</div>
  <h1>${incident.name} Insurance Claim: What Your Business Is Owed</h1>
  <p>${incident.desc}. Know what's covered, what's typically denied, and how to document your claim so the insurer can't lowball you.</p>
  <div class="hero-actions">
    <a class="btn-primary" href="../../app.html">Analyze My Claim Free →</a>
    <a class="btn-secondary" href="../index.html">All Incident Types</a>
  </div>
</div></div>

<div class="page"><div class="wrap"><div class="grid-2">
  <div>
    <div class="warning">⚠ <strong>Informational only.</strong> Not legal advice. For legal representation, consult a licensed attorney in your state.</div>

    <div class="section">
      <div class="section-title">What's Typically Covered</div>
      <ul class="cover-list">${covered}</ul>

      <div class="section-title" style="margin-top:24px">What Insurers Commonly Deny</div>
      <ul class="deny-list">${denied}</ul>
    </div>

    <hr class="divider"/>

    <div class="section">
      <div class="section-title">Documentation Checklist</div>
      <div class="section-sub">Gather these before contacting your adjuster. Missing documentation is the #1 reason claims are underpaid.</div>
      <ul class="cover-list">${docTips}</ul>
    </div>

    <hr class="divider"/>

    <div class="section">
      <div class="section-title">Frequently Asked Questions</div>
      ${faqs}
    </div>

    <hr class="divider"/>

    <div class="section">
      <div class="section-title">Search Keywords People Use</div>
      <div class="section-sub">If you found this page searching one of these terms — you're in the right place.</div>
      <div>${kwTags}</div>
    </div>

    <hr class="divider"/>

    <div class="section">
      <div class="section-title">${incident.name} Claims by State</div>
      <div class="section-sub">Insurance law varies. Find your state's specific rights and statute of limitations.</div>
      <div class="state-grid">${stateLinks}</div>
    </div>
  </div>

  <div>
    <div class="sidebar-card">
      <h3>Is Your Claim Underpaid?</h3>
      <p>Upload your commercial policy. Shielded reads your actual policy language and compares the offer to documented benchmarks — free, no signup.</p>
      <a class="btn-primary" href="../../app.html" style="display:block;text-align:center;margin-bottom:10px">Analyze My Claim →</a>
    </div>
    <div class="sidebar-card">
      <h3>If Your Claim Was Denied</h3>
      <ul>
        <li>Request denial in writing</li>
        <li>Get the specific exclusion cited</li>
        <li>File a complaint with your state commissioner</li>
        <li>Consult an insurance claim attorney</li>
        <li>Check bad faith law in your state</li>
      </ul>
    </div>
    <div class="sidebar-card">
      <h3>Average Claim Gap</h3>
      <p style="font-size:28px;font-weight:700;color:var(--navy);margin:8px 0">$14,200</p>
      <p>That's the typical difference between an insurer's first offer and the amount the policy actually supports for commercial property claims.</p>
    </div>
  </div>
</div></div></div>
${footer()}
</body></html>`;
}

// ─── GENERATE ALL PAGES ───────────────────────────────────────────
function ensureDir(dir) { mkdirSync(dir, { recursive: true }); }
function write(path, html) { writeFileSync(path, html, 'utf8'); console.log('  ✓', path.replace(__dirname+'\\','').replace(__dirname+'/','').replace(__dirname,'')); }

console.log('\n🛡  Shielded SEO Page Generator\n');

// Hub
ensureDir(BASE);
write(join(BASE,'index.html'), hubPage());

// State pages
console.log('\n📍 State pages (50):');
for (const state of STATES) {
  const dir = join(BASE, state.slug);
  ensureDir(dir);
  write(join(dir,'index.html'), statePage(state));
}

// City pages
console.log('\n🏙  City pages:');
for (const city of CITIES) {
  const state = STATES.find(s => s.abbr === city.stateAbbr);
  if (!state) { console.warn('  ⚠ Skipping city with unknown state abbr:', city.name, city.stateAbbr); continue; }
  const dir = join(BASE, state.slug, city.slug);
  ensureDir(dir);
  write(join(dir,'index.html'), cityPage(city, state));
}

// Incident pages
console.log('\n⚡ Incident pages (18):');
for (const incident of INCIDENTS) {
  const dir = join(BASE, incident.slug);
  ensureDir(dir);
  write(join(dir,'index.html'), incidentPage(incident));
}

const total = 1 + STATES.length + CITIES.length + INCIDENTS.length;
console.log(`\n✅ Done — ${total} pages generated in ./claims/`);
console.log(`   1 hub + ${STATES.length} states + ${CITIES.length} cities + ${INCIDENTS.length} incidents\n`);
