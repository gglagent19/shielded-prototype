// generate-claims-v2.mjs — 106 incidents × 1,350 cities intersection pages
// Run: node generate-claims-v2.mjs
// Adds /claims/[state]/[city]/[incident]/ pages to existing structure

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = join(__dirname, 'claims');

// ─── 106 INCIDENT SUB-TYPES ───────────────────────────────────────
const INCIDENTS = [
  // FIRE & SMOKE (9)
  {slug:'kitchen-fire',name:'Kitchen Fire',cat:'Fire & Smoke',icon:'🔥',kw:['kitchen fire insurance claim','commercial kitchen fire damage claim','restaurant kitchen fire insurance'],desc:'A fire originating in a commercial kitchen — stove, oven, or cooking equipment.',covered:'Building damage, contents, smoke remediation, business interruption.',denied:'Pre-existing grease buildup with no maintenance records.'},
  {slug:'grease-fire',name:'Grease Fire',cat:'Fire & Smoke',icon:'🔥',kw:['grease fire insurance claim','grease fire restaurant insurance','hood system fire insurance claim'],desc:'Fire caused by ignition of cooking grease or oil in a commercial kitchen.',covered:'Structure, contents, hood system damage, business income loss.',denied:'Failure to maintain hood cleaning logs (used to dispute coverage).'},
  {slug:'hood-duct-fire',name:'Hood & Duct Fire',cat:'Fire & Smoke',icon:'🔥',kw:['commercial hood fire insurance','exhaust hood fire claim','kitchen exhaust fire insurance'],desc:'Fire within commercial exhaust hood or ductwork.',covered:'Hood, duct, and connected equipment damage, smoke cleanup.',denied:'Grease accumulation from skipped cleanings.'},
  {slug:'electrical-fire',name:'Electrical Fire',cat:'Fire & Smoke',icon:'🔥',kw:['electrical fire insurance claim business','wiring fire commercial insurance','breaker box fire insurance claim'],desc:'Fire caused by faulty wiring, overloaded circuits, or electrical equipment failure.',covered:'Building damage, electrical system replacement, contents, business interruption.',denied:'Code-violation wiring that was a known issue.'},
  {slug:'arson',name:'Arson / Suspicious Fire',cat:'Fire & Smoke',icon:'🔥',kw:['arson insurance claim business','suspicious fire insurance claim','fire investigation insurance delay'],desc:'Fire determined to be intentionally set — by a third party or under investigation.',covered:'Third-party arson is a covered peril. Insurer may delay pending investigation.',denied:'Insured-set arson. Insurer bears burden of proving fraud.'},
  {slug:'structure-fire',name:'Structure Fire',cat:'Fire & Smoke',icon:'🔥',kw:['commercial building fire insurance claim','business fire damage claim','fire total loss business insurance'],desc:'Large fire affecting the structural elements of a commercial building.',covered:'Full rebuild or repair, contents, debris removal, ordinance upgrade costs, business income.',denied:'Wear and tear unrelated to fire, pre-existing structural defects.'},
  {slug:'smoke-damage',name:'Smoke Damage',cat:'Fire & Smoke',icon:'💨',kw:['smoke damage insurance claim business','smoke damage commercial property','smoke odor damage insurance'],desc:'Smoke and soot damage without open flame — from a neighboring fire or contained smoke event.',covered:'Smoke remediation, odor removal, HVAC cleaning, contents cleaning or replacement.',denied:'Gradual air quality deterioration from ongoing operations.'},
  {slug:'wildfire',name:'Wildfire / Brush Fire',cat:'Fire & Smoke',icon:'🔥',kw:['wildfire damage business insurance claim','wildfire business interruption claim','wildfire smoke damage business'],desc:'Damage from a wildfire or brush fire spreading to commercial property.',covered:'Building, contents, business interruption, evacuation costs, smoke damage.',denied:'Properties in high-risk zones excluded by endorsement (check your policy).'},
  {slug:'adjacent-fire',name:'Adjacent Building Fire',cat:'Fire & Smoke',icon:'🔥',kw:['neighboring building fire insurance claim','fire spread next door insurance','adjacent fire smoke damage claim'],desc:'Fire originating in a neighboring building that spreads to or damages your property.',covered:'Direct fire damage, smoke damage, water from firefighting operations.',denied:'None typical — third-party fire is a covered peril.'},
  // WATER & FLOOD (11)
  {slug:'burst-pipe',name:'Burst Pipe',cat:'Water & Flood',icon:'💧',kw:['burst pipe commercial property claim','broken pipe business insurance','pipe burst water damage insurance settlement'],desc:'A pipe suddenly ruptures, causing water damage to the commercial property.',covered:'Water damage to building and contents, drying and remediation, business interruption.',denied:'Gradual leakage that went unrepaired for an extended period.'},
  {slug:'frozen-pipes',name:'Frozen Pipes',cat:'Water & Flood',icon:'🧊',kw:['frozen pipe damage insurance claim','frozen pipes business insurance','winter pipe burst commercial claim'],desc:'Pipes that freeze and burst during cold weather, causing interior water damage.',covered:'Pipe repair, water damage cleanup, contents, business income.',denied:'Building left unheated when pipes froze (negligence defense).'},
  {slug:'roof-leak',name:'Roof Leak',cat:'Water & Flood',icon:'🏠',kw:['roof leak water damage insurance claim','commercial roof leak insurance','ongoing roof leak insurance coverage'],desc:'Water intrusion through a damaged or aging roof, causing interior damage.',covered:'Sudden storm-caused leaks are covered. Water damage to interior and contents.',denied:'Gradual leaks from wear and neglected maintenance.'},
  {slug:'natural-flood',name:'Natural Flooding',cat:'Water & Flood',icon:'🌊',kw:['commercial flood insurance claim','business flood damage claim','NFIP commercial flood claim'],desc:'Property inundated by natural floodwaters — rising river, storm surge, or surface flooding.',covered:'Requires NFIP or private flood policy. Standard property excludes flood.',denied:'Standard commercial property does not cover natural flood.'},
  {slug:'sewer-backup',name:'Sewer Backup',cat:'Water & Flood',icon:'💧',kw:['sewer backup insurance claim business','sewage backup commercial property','sewer line backup business insurance'],desc:'Sewage or drain water backs up into the commercial property through floor drains or toilets.',covered:'Requires sewer backup endorsement. Cleanup, remediation, contents.',denied:'Standard policy excludes sewer backup without endorsement.'},
  {slug:'toilet-overflow',name:'Toilet / Drain Overflow',cat:'Water & Flood',icon:'💧',kw:['toilet overflow business insurance claim','bathroom flood commercial property','overflow from upstairs business insurance'],desc:'Toilet or drain overflow causing water damage to floors, walls, and adjacent areas.',covered:'Sudden overflow from malfunction is covered. Remediation and repair.',denied:'Repeated known overflow issue that was not repaired.'},
  {slug:'sprinkler-malfunction',name:'Sprinkler Malfunction',cat:'Water & Flood',icon:'💧',kw:['sprinkler system water damage claim','fire sprinkler accidental discharge insurance','sprinkler went off no fire insurance'],desc:'Fire suppression sprinkler activates accidentally, flooding the business.',covered:'Water damage to building and contents, business interruption during cleanup.',denied:'None typical — accidental discharge is a covered cause of loss.'},
  {slug:'hvac-leak',name:'HVAC / Condensate Leak',cat:'Water & Flood',icon:'❄️',kw:['HVAC water damage insurance claim','AC unit leak business insurance','air conditioner leak ceiling damage insurance'],desc:'Air conditioning or HVAC condensate overflows, causing water damage to ceilings and floors.',covered:'Sudden overflow or equipment malfunction causing water damage.',denied:'Gradual condensate drip from clogged drain line (maintenance issue).'},
  {slug:'appliance-leak',name:'Appliance Leak',cat:'Water & Flood',icon:'💧',kw:['commercial dishwasher leak insurance','walk-in cooler leak water damage','ice machine water damage claim'],desc:'Commercial dishwasher, ice machine, or other appliance leaks and causes water damage.',covered:'Sudden unexpected leaks. Damage to floors, walls, and adjacent equipment.',denied:'Slow leak from worn supply line that went unaddressed.'},
  {slug:'storm-flooding',name:'Storm Water Flooding',cat:'Water & Flood',icon:'⛈️',kw:['stormwater flooding business insurance','flash flood business property damage','storm drain backup business claim'],desc:'Rainwater or stormwater enters the building during a storm event.',covered:'If caused by sudden storm and covered under commercial property — consult policy.',denied:'Natural flood from rising water (needs separate flood policy).'},
  {slug:'tenant-water',name:'Water Damage from Above',cat:'Water & Flood',icon:'💧',kw:['upstairs tenant water damage insurance','water damage from neighboring unit claim','leak from above floor insurance settlement'],desc:'Water leaks from an upper floor tenant or neighboring unit into your business.',covered:'Damage to your property is covered. Pursue subrogation against at-fault party.',denied:'Pre-existing water intrusion that was known and not addressed.'},
  // STORM & WEATHER (10)
  {slug:'hail-damage',name:'Hail Damage',cat:'Storm & Weather',icon:'🌨️',kw:['hail damage commercial property claim','hail damage business roof insurance','hail dented HVAC insurance'],desc:'Hailstones damage commercial roof, HVAC units, skylights, windows, or siding.',covered:'Roof replacement or repair, HVAC damage, windows, signage.',denied:'Pre-existing roof deterioration unrelated to hail impact.'},
  {slug:'wind-damage',name:'Wind Damage',cat:'Storm & Weather',icon:'💨',kw:['wind damage commercial building insurance','high wind business property claim','wind blow roof off insurance'],desc:'High winds damage the commercial building, roof, or signage.',covered:'Structural damage, roof, windows, signage, contents, business interruption.',denied:'Gradual deterioration from wind over time vs. sudden storm event.'},
  {slug:'hurricane',name:'Hurricane Damage',cat:'Storm & Weather',icon:'🌀',kw:['hurricane business insurance claim','hurricane property damage commercial','hurricane business interruption claim'],desc:'Hurricane or tropical storm causes wind and water damage to commercial property.',covered:'Wind damage, structural, contents, business interruption. Storm surge needs flood policy.',denied:'Storm surge flooding without separate flood coverage.'},
  {slug:'tornado',name:'Tornado Damage',cat:'Storm & Weather',icon:'🌪️',kw:['tornado damage business insurance claim','tornado destroyed business insurance','tornado business interruption insurance'],desc:'Tornado causes structural damage or total loss to commercial property.',covered:'Full structural damage, contents, debris removal, business interruption, ordinance costs.',denied:'Flood damage from rain entry after structural failure (gray area — document carefully).'},
  {slug:'lightning-strike',name:'Lightning Strike',cat:'Storm & Weather',icon:'⚡',kw:['lightning strike business insurance claim','lightning damage commercial building','lightning fried equipment insurance'],desc:'Lightning strikes the building or nearby, causing structural damage or equipment damage.',covered:'Structural damage, fire from lightning, electrical equipment damage, power surge.',denied:'Gradual electrical damage unrelated to a specific lightning event.'},
  {slug:'snow-ice-load',name:'Snow / Ice Load',cat:'Storm & Weather',icon:'❄️',kw:['snow collapse roof insurance claim','ice dam roof damage business insurance','snow weight roof damage claim'],desc:'Accumulated snow or ice causes roof collapse or structural damage.',covered:'Roof collapse, structural damage, contents, business interruption.',denied:'Pre-existing structural weakness that made collapse inevitable regardless of snow.'},
  {slug:'ice-storm',name:'Ice Storm',cat:'Storm & Weather',icon:'🧊',kw:['ice storm business damage insurance','ice storm power line damage claim','ice storm fell tree on building insurance'],desc:'Ice accumulation from freezing rain damages the building, equipment, or causes power loss.',covered:'Building damage, fallen tree impact, power equipment damage, business interruption.',denied:'Flood from ice melt (may need flood endorsement).'},
  {slug:'fallen-tree',name:'Fallen Tree',cat:'Storm & Weather',icon:'🌲',kw:['tree fell on business insurance claim','fallen tree commercial property damage','neighbor tree fell on my business insurance'],desc:'A tree falls onto the commercial building during a storm, causing damage.',covered:'Structural damage from tree impact, debris removal, contents, business interruption.',denied:'Tree on your property that was dead or diseased and neglected.'},
  {slug:'earthquake',name:'Earthquake',cat:'Storm & Weather',icon:'🏚️',kw:['earthquake damage business insurance claim','earthquake commercial property loss','earthquake coverage small business'],desc:'Seismic activity causes structural damage, equipment damage, or building collapse.',covered:'Requires separate earthquake endorsement or policy.',denied:'Standard commercial property excludes earthquake.'},
  {slug:'freeze-damage',name:'Hard Freeze Damage',cat:'Storm & Weather',icon:'🌡️',kw:['hard freeze business damage insurance','freeze damage pipes equipment claim','frost damage commercial property insurance'],desc:'Extreme cold causes pipes to freeze, outdoor equipment to fail, or structural damage.',covered:'Frozen pipe burst, equipment damage from cold, business interruption.',denied:'Inadequate winterization of a seasonal property.'},
  // THEFT & CRIME (10)
  {slug:'burglary',name:'Burglary / Break-In',cat:'Theft & Crime',icon:'🔓',kw:['business break-in insurance claim','burglary commercial property insurance','burglar smashed window business insurance'],desc:'Someone breaks into the commercial property, stealing inventory, equipment, or cash.',covered:'Stolen contents, building damage from forced entry, business interruption.',denied:'Theft by someone with authorized access (needs employee theft coverage).'},
  {slug:'robbery',name:'Robbery',cat:'Theft & Crime',icon:'🚨',kw:['business robbery insurance claim','armed robbery insurance claim','cash stolen robbery business insurance'],desc:'Theft by force or threat during business hours — robbery of employees or customers.',covered:'Stolen cash and merchandise, employee injury (workers comp), security system damage.',denied:'Cash above policy sublimit, losses without police report.'},
  {slug:'shoplifting',name:'Shoplifting / Retail Theft',cat:'Theft & Crime',icon:'🛒',kw:['shoplifting loss insurance claim business','inventory theft insurance claim retail','organized retail theft insurance claim'],desc:'Theft of merchandise from a retail business — including organized retail crime.',covered:'Inventory loss is covered if theft is documented and proven.',denied:'Mysterious disappearance without proof of theft.'},
  {slug:'employee-theft',name:'Employee Theft',cat:'Theft & Crime',icon:'👤',kw:['employee theft insurance claim','employee stole from business insurance','embezzlement insurance claim business'],desc:'An employee steals cash, inventory, or assets from the business.',covered:'Requires employee dishonesty / fidelity coverage or crime endorsement.',denied:'Standard commercial property does not cover employee theft.'},
  {slug:'equipment-theft',name:'Equipment Theft',cat:'Theft & Crime',icon:'🔧',kw:['equipment theft insurance claim','stolen equipment business insurance','construction equipment stolen insurance'],desc:'Business equipment, tools, or machinery is stolen from the premises or job site.',covered:'Replacement value of stolen equipment (check ACV vs. RCV in your policy).',denied:'Equipment left unsecured in open areas may trigger exclusion.'},
  {slug:'vehicle-theft',name:'Vehicle Theft',cat:'Theft & Crime',icon:'🚗',kw:['commercial vehicle theft insurance claim','delivery van stolen insurance','fleet vehicle theft insurance claim'],desc:'A company vehicle — delivery van, truck, or fleet vehicle — is stolen.',covered:'Vehicle theft under commercial auto policy. Cargo theft under inland marine.',denied:'Personal vehicle used for business without commercial auto coverage.'},
  {slug:'copper-theft',name:'Copper / Metal Theft',cat:'Theft & Crime',icon:'⚡',kw:['copper theft insurance claim business','metal theft HVAC insurance','copper wire stolen insurance claim'],desc:'Thieves steal copper wiring, HVAC refrigerant lines, or metal from the property.',covered:'Cost of stolen copper, repair of electrical or HVAC systems, business interruption.',denied:'Losses in excess of contents sublimit for metals.'},
  {slug:'cargo-theft',name:'Cargo / Freight Theft',cat:'Theft & Crime',icon:'📦',kw:['cargo theft insurance claim','freight theft business insurance','shipment stolen insurance claim'],desc:'Business cargo or freight is stolen in transit or from the loading area.',covered:'Inland marine or cargo policy covers in-transit theft.',denied:'Theft from unattended vehicle without proper security measures.'},
  {slug:'identity-fraud',name:'Business Identity / Fraud',cat:'Theft & Crime',icon:'💳',kw:['business fraud insurance claim','check fraud insurance claim business','wire transfer fraud business insurance'],desc:'Business identity is stolen or fraudulent transactions drain business accounts.',covered:'Requires commercial crime policy with computer fraud and wire transfer endorsement.',denied:'Standard property policy does not cover financial fraud losses.'},
  {slug:'smash-grab',name:'Smash and Grab',cat:'Theft & Crime',icon:'🪟',kw:['smash and grab business insurance claim','window broken theft insurance','display case smash rob insurance claim'],desc:'Thieves smash windows or display cases to steal merchandise quickly.',covered:'Window and glass repair, stolen merchandise, business interruption during repairs.',denied:'Merchandise above policy sublimit for high-value items.'},
  // VANDALISM (6)
  {slug:'graffiti',name:'Graffiti',cat:'Vandalism',icon:'🎨',kw:['graffiti vandalism insurance claim business','spray paint vandalism commercial property','graffiti removal cost insurance'],desc:'Graffiti painted on the exterior or interior of the commercial property.',covered:'Cleaning, repainting, surface restoration, temporary security measures.',denied:'Graffiti by the property owner or authorized party.'},
  {slug:'window-smash',name:'Window / Glass Smash',cat:'Vandalism',icon:'🪟',kw:['broken window vandalism insurance claim','smashed storefront glass insurance','front window broken vandalism insurance'],desc:'Windows, storefront glass, or display cases smashed in a vandalism event.',covered:'Glass replacement, boarding costs, interior damage from exposure.',denied:'Glass breakage from weather or accident (different coverage).'},
  {slug:'vehicle-vandalism',name:'Vehicle Vandalism',cat:'Vandalism',icon:'🚗',kw:['business vehicle vandalism insurance claim','keyed company car insurance','fleet vehicle vandalism insurance claim'],desc:'Company vehicles are keyed, spray-painted, tires slashed, or otherwise vandalized.',covered:'Repair costs under commercial auto comprehensive coverage.',denied:'Wear and tear cosmetic issues not caused by vandalism.'},
  {slug:'property-destruction',name:'Property Destruction',cat:'Vandalism',icon:'💥',kw:['vandalism property damage insurance claim','deliberate damage business insurance','malicious damage commercial insurance claim'],desc:'Deliberate destruction of business property — fixtures, equipment, or structure.',covered:'Repair or replacement of damaged property, cleanup costs.',denied:'Damage by business owner or employees.'},
  {slug:'protest-damage',name:'Protest / Riot Damage',cat:'Vandalism',icon:'🚨',kw:['protest damage business insurance claim','riot damage commercial property','civil unrest business insurance claim'],desc:'Business damaged during a protest, riot, or civil unrest — looting or vandalism.',covered:'Riot and civil commotion is a named peril in standard commercial policies.',denied:'Business owner-caused damage, war exclusion.'},
  {slug:'intentional-fire-vandal',name:'Intentional Fire by Third Party',cat:'Vandalism',icon:'🔥',kw:['intentional fire vandalism insurance claim','arson business insurance settlement','malicious fire damage insurance'],desc:'A third party deliberately sets fire to the business — arson as vandalism.',covered:'Fire damage from third-party arson is a covered peril.',denied:'Insured-caused arson. Insurer may investigate before paying.'},
  // SLIP & FALL (8)
  {slug:'customer-slip-fall',name:'Customer Slip and Fall',cat:'Slip & Fall',icon:'⚠️',kw:['customer slip fall business insurance claim','slip and fall claim against my business','customer fell in my store insurance'],desc:'A customer slips, trips, or falls on business premises and files a liability claim.',covered:'Medical payments, legal defense, settlement up to liability limits.',denied:'Intentional harm, claims above policy limits.'},
  {slug:'wet-floor-slip',name:'Wet Floor Slip',cat:'Slip & Fall',icon:'🧹',kw:['wet floor slip fall business liability','mopping injury customer business insurance','no wet floor sign insurance liability'],desc:'Customer slips on a wet floor — from mopping, spills, or leaks.',covered:'Medical costs and liability claim. Wet floor signs are evidence of reasonable care.',denied:'Pre-existing known hazard with no corrective action.'},
  {slug:'ice-snow-slip',name:'Ice / Snow Slip',cat:'Slip & Fall',icon:'❄️',kw:['slip on ice outside business insurance','snow ice fall parking lot liability','icy sidewalk business liability insurance claim'],desc:'Customer slips on ice or snow on business property, parking lot, or sidewalk.',covered:'Liability coverage for injuries. Reasonable snow removal is evidence of care.',denied:'Plaintiff assumed risk by entering obviously dangerous conditions.'},
  {slug:'uneven-surface',name:'Uneven Surface Trip',cat:'Slip & Fall',icon:'⚠️',kw:['customer tripped uneven floor insurance','trip hazard business liability claim','cracked sidewalk trip fall business insurance'],desc:'Customer trips on uneven flooring, cracked sidewalk, or elevated threshold.',covered:'Liability coverage including medical and legal defense.',denied:'Open and obvious hazard that plaintiff should have avoided.'},
  {slug:'parking-lot-fall',name:'Parking Lot Fall',cat:'Slip & Fall',icon:'🚗',kw:['parking lot fall business insurance claim','pothole parking lot injury liability','parking lot injury premises liability insurance'],desc:'Customer falls in the business parking lot due to pothole, crack, or poor lighting.',covered:'Premises liability covers parking lot falls as part of business premises.',denied:'Municipal road vs. private lot ownership disputes.'},
  {slug:'staircase-fall',name:'Staircase Fall',cat:'Slip & Fall',icon:'🪜',kw:['staircase fall business liability insurance','stairs collapse injury insurance claim','broken step customer fall insurance claim'],desc:'Customer or employee falls on a staircase due to defect, broken step, or missing handrail.',covered:'Liability coverage, medical payments, legal defense.',denied:'Plaintiff intoxication contributing to fall.'},
  {slug:'fallen-object-injury',name:'Fallen Object Injury',cat:'Slip & Fall',icon:'📦',kw:['falling merchandise injury insurance claim','shelving collapse customer injury','product fell on customer insurance claim'],desc:'Merchandise, shelving, or equipment falls on a customer causing injury.',covered:'General liability covers customer injuries from falling objects.',denied:'Gross negligence without corrective action after prior incidents.'},
  {slug:'employee-slip',name:'Employee Slip and Fall',cat:'Slip & Fall',icon:'👷',kw:['employee slip fall workers comp claim','employee injury slip fall business insurance','worker fell on job insurance claim'],desc:'An employee slips or trips at work, suffering injury on business premises.',covered:'Workers compensation covers medical and lost wages for employee injuries.',denied:'Injuries outside scope of employment or during horseplay.'},
  // EQUIPMENT & MACHINERY (11)
  {slug:'equipment-breakdown-gen',name:'Equipment Breakdown',cat:'Equipment',icon:'⚙️',kw:['equipment breakdown insurance claim','commercial equipment failure insurance','machine breakdown business insurance claim'],desc:'A piece of business equipment fails suddenly due to mechanical or electrical failure.',covered:'Repair or replacement, lost business income, expediting expenses.',denied:'Gradual wear and tear without sudden failure event.'},
  {slug:'hvac-failure',name:'HVAC System Failure',cat:'Equipment',icon:'❄️',kw:['HVAC system failure insurance claim','commercial AC breakdown insurance','HVAC compressor failure insurance claim'],desc:'Commercial heating or cooling system fails, causing business disruption or damage.',covered:'Equipment breakdown coverage: repair, replacement, business income during closure.',denied:'Standard commercial property does not cover mechanical breakdown.'},
  {slug:'refrigeration-failure',name:'Refrigeration Breakdown',cat:'Equipment',icon:'🧊',kw:['walk-in cooler failure insurance claim','refrigeration breakdown business insurance','freezer failure food spoilage insurance'],desc:'Walk-in cooler, freezer, or commercial refrigeration fails, causing food or product loss.',covered:'Equipment breakdown: refrigeration repair plus food spoilage loss.',denied:'Gradual compressor wear without sudden failure event.'},
  {slug:'food-spoilage-equip',name:'Food Spoilage',cat:'Equipment',icon:'🍖',kw:['food spoilage insurance claim','power outage food loss insurance claim restaurant','refrigerator failure food loss insurance'],desc:'Perishable food inventory is lost due to power outage or refrigeration failure.',covered:'Food spoilage sublimit in commercial policy. Equipment breakdown adds more coverage.',denied:'Spoilage above policy sublimit. Spoilage from gradual temperature drift.'},
  {slug:'boiler-explosion',name:'Boiler Explosion',cat:'Equipment',icon:'💥',kw:['boiler explosion insurance claim','boiler breakdown commercial insurance','steam boiler damage insurance'],desc:'Boiler or pressure vessel ruptures or explodes, damaging the building and equipment.',covered:'Equipment breakdown covers boiler explosion including structural damage.',denied:'Neglected maintenance required by manufacturer or code.'},
  {slug:'compressor-failure',name:'Compressor Failure',cat:'Equipment',icon:'⚙️',kw:['compressor failure insurance claim business','air compressor breakdown insurance','refrigerant leak compressor insurance claim'],desc:'Air or refrigerant compressor fails suddenly, stopping operations.',covered:'Equipment breakdown: repair or replacement plus business income.',denied:'Standard property does not cover mechanical breakdown.'},
  {slug:'electrical-equipment',name:'Electrical Equipment Damage',cat:'Equipment',icon:'⚡',kw:['power surge equipment damage insurance','lightning surge equipment insurance claim','voltage spike business equipment insurance'],desc:'Power surge, lightning, or voltage spike destroys electrical equipment.',covered:'Direct physical damage from sudden power surge to equipment.',denied:'Gradual voltage fluctuation damage over time.'},
  {slug:'forklift-accident',name:'Forklift Accident',cat:'Equipment',icon:'🏭',kw:['forklift accident insurance claim','forklift property damage insurance','forklift injury insurance claim'],desc:'Forklift damages property, injures a worker, or is itself damaged in an accident.',covered:'Property damage under commercial property; injury under workers comp; liability for third-party injury.',denied:'Operator without required certification — may trigger negligence argument.'},
  {slug:'conveyor-malfunction',name:'Conveyor Malfunction',cat:'Equipment',icon:'⚙️',kw:['conveyor system breakdown insurance','conveyor injury insurance claim','conveyor belt damage insurance claim'],desc:'Conveyor belt or system breaks down, causing production stoppage or injury.',covered:'Equipment breakdown: repair plus business income. Injury under workers comp.',denied:'Standard property excludes mechanical breakdown.'},
  {slug:'oven-fryer-failure',name:'Oven / Fryer Failure',cat:'Equipment',icon:'🍳',kw:['commercial oven breakdown insurance','fryer malfunction insurance claim','restaurant equipment failure insurance'],desc:'Commercial oven, fryer, or cooking equipment fails during service.',covered:'Equipment breakdown coverage for sudden failure and business interruption.',denied:'Gradual deterioration without sudden failure.'},
  {slug:'pos-it-crash',name:'POS / IT System Crash',cat:'Equipment',icon:'💻',kw:['point of sale system failure business insurance','IT system crash business interruption','server failure business income insurance claim'],desc:'Point-of-sale system, server, or IT infrastructure fails, disrupting business.',covered:'Equipment breakdown: IT equipment repair plus business income loss.',denied:'Cyber attack causing IT failure (needs separate cyber policy).'},
  // VEHICLE & TRANSPORTATION (7)
  {slug:'delivery-vehicle-accident',name:'Delivery Vehicle Accident',cat:'Vehicle',icon:'🚚',kw:['delivery truck accident business insurance','company vehicle accident insurance claim','employee driving accident business liability'],desc:'A company delivery vehicle is involved in an accident while on a business errand.',covered:'Commercial auto policy: vehicle damage, liability for injuries to others.',denied:'Personal vehicle without commercial auto coverage.'},
  {slug:'hit-pedestrian',name:'Vehicle Hits Customer / Pedestrian',cat:'Vehicle',icon:'🚗',kw:['delivery van hit pedestrian business insurance','company vehicle injury liability claim','hit customer with delivery truck insurance'],desc:'A company vehicle strikes a customer, pedestrian, or bystander causing injury.',covered:'Commercial auto liability covers bodily injury to third parties.',denied:'Driver operating outside scope of employment.'},
  {slug:'vehicle-hit-building',name:'Vehicle Hits Building',cat:'Vehicle',icon:'🏢',kw:['car hit my business insurance claim','vehicle crashed into store insurance','car drove into restaurant insurance claim'],desc:'A vehicle — owned by anyone — crashes into the commercial building.',covered:'Building damage: your commercial property (then subrogate) OR at-fault driver liability.',denied:'None typical — vehicle impact is a covered sudden physical loss.'},
  {slug:'parking-lot-collision',name:'Parking Lot Collision',cat:'Vehicle',icon:'🚗',kw:['parking lot accident business liability','car hit in parking lot business insurance','parking lot fender bender business insurance claim'],desc:'Vehicle collision occurs in the business parking lot, causing injury or damage.',covered:'Premises liability if lot is negligently maintained. Commercial auto for company vehicles.',denied:'Private lot vs. municipal road ownership questions.'},
  {slug:'loading-dock-accident',name:'Loading Dock Accident',cat:'Vehicle',icon:'🏭',kw:['loading dock accident insurance claim','dock injury insurance business','loading dock equipment damage insurance'],desc:'Truck, forklift, or worker accident at the loading dock causes injury or damage.',covered:'Workers comp for employee injury; commercial property for building damage; liability for third parties.',denied:'No valid shipping manifest for the load causing damage.'},
  {slug:'fleet-accident',name:'Fleet Vehicle Accident',cat:'Vehicle',icon:'🚐',kw:['fleet vehicle accident insurance claim','commercial auto accident insurance','multiple vehicle accident business insurance'],desc:'One or more vehicles in a business fleet are involved in an accident.',covered:'Commercial auto fleet policy covers all listed vehicles.',denied:'Unlisted or rented vehicle not on fleet schedule.'},
  {slug:'hit-and-run-vehicle',name:'Hit and Run (Business Vehicle)',cat:'Vehicle',icon:'🚗',kw:['hit and run company vehicle insurance','uninsured motorist commercial vehicle claim'],desc:'A company vehicle is struck by a hit-and-run driver.',covered:'Uninsured motorist coverage under commercial auto pays for hit-and-run damage.',denied:'No UM coverage on the commercial auto policy.'},
  // STRUCTURAL & BUILDING (9)
  {slug:'roof-collapse',name:'Roof Collapse',cat:'Structural',icon:'🏠',kw:['roof collapse business insurance claim','commercial roof collapsed insurance','snow weight roof collapse insurance'],desc:'The commercial roof partially or fully collapses due to load, deterioration, or impact.',covered:'Structural repair, contents, business interruption, debris removal.',denied:'Long-term neglected maintenance that caused gradual structural failure.'},
  {slug:'ceiling-collapse',name:'Ceiling Collapse',cat:'Structural',icon:'🏢',kw:['ceiling collapse business insurance claim','drop ceiling fell insurance','ceiling fell on customer insurance'],desc:'Interior ceiling collapses — drop ceiling tiles, plaster, or structural ceiling.',covered:'Repair, contents, injury liability, business interruption.',denied:'Known deterioration without repair action.'},
  {slug:'foundation-damage',name:'Foundation Damage',cat:'Structural',icon:'🏗️',kw:['foundation damage business insurance claim','sinkhole damage commercial property','foundation crack insurance coverage'],desc:'Foundation cracks, settles, or collapses — often from sinkhole, soil shift, or water.',covered:'Sudden sinkhole collapse may be covered. Flood-related foundation needs flood policy.',denied:'Gradual settling and normal soil movement.'},
  {slug:'wall-collapse',name:'Wall Collapse',cat:'Structural',icon:'🧱',kw:['wall collapse business insurance claim','exterior wall failure insurance','retaining wall collapse insurance claim'],desc:'An exterior or interior wall collapses due to impact, structural failure, or storm.',covered:'Structural repair, contents, liability, business interruption.',denied:'Wall collapse from deferred maintenance.'},
  {slug:'floor-collapse',name:'Floor Collapse',cat:'Structural',icon:'🏢',kw:['floor collapse business insurance claim','floor failure commercial property','wood floor collapse insurance'],desc:'Commercial floor collapses due to rot, overloading, water damage, or structural failure.',covered:'Structural repair, contents, injury liability.',denied:'Overloading beyond rated capacity without disclosure.'},
  {slug:'glass-breakage',name:'Glass Breakage',cat:'Structural',icon:'🪟',kw:['accidental glass breakage insurance claim','storefront window crack insurance','plate glass insurance claim business'],desc:'Plate glass, storefront windows, or display cases crack or shatter.',covered:'Plate glass replacement is a named peril. Boarding and temporary security.',denied:'Scratches or gradual surface damage without breakage.'},
  {slug:'sign-collapse',name:'Signage Damage / Collapse',cat:'Structural',icon:'📋',kw:['business sign fell insurance claim','commercial signage damage insurance','billboard collapse insurance claim'],desc:'Business signs — lit, monument, or billboard — are damaged or collapse.',covered:'Signage is covered property. Wind, vandalism, or accidental damage.',denied:'Electrical failure inside sign without physical damage.'},
  {slug:'awning-collapse',name:'Awning / Canopy Collapse',cat:'Structural',icon:'⛺',kw:['awning collapse insurance claim','canopy fell on car insurance','storefront awning damage insurance claim'],desc:'Storefront awning or canopy collapses due to storm, snow load, or structural failure.',covered:'Repair cost, damage to vehicles or property underneath, liability.',denied:'Awning past useful life with no maintenance.'},
  {slug:'fence-damage',name:'Fence / Gate Damage',cat:'Structural',icon:'🔒',kw:['fence damage insurance claim business','commercial gate damage insurance','perimeter fence damaged insurance claim'],desc:'Perimeter fencing or commercial gate is damaged by vehicle, storm, or vandalism.',covered:'Repair or replacement under commercial property coverage.',denied:'Fence excluded from policy as separate structure without endorsement.'},
  // ENVIRONMENTAL (8)
  {slug:'mold',name:'Mold / Mildew',cat:'Environmental',icon:'🍄',kw:['mold damage business insurance claim','commercial mold remediation insurance','black mold business insurance claim'],desc:'Mold growth discovered in the commercial property following a water event.',covered:'Mold from a covered water loss is covered. Remediation and repair.',denied:'Long-term mold from neglected moisture, no covered cause.'},
  {slug:'asbestos',name:'Asbestos Discovery',cat:'Environmental',icon:'☣️',kw:['asbestos discovery insurance claim business','asbestos remediation commercial insurance','asbestos abatement insurance coverage'],desc:'Asbestos is discovered during a renovation or covered repair project.',covered:'Abatement required during covered repair is sometimes covered under ordinance/law.',denied:'Proactive abatement not triggered by a covered loss.'},
  {slug:'lead-paint',name:'Lead Paint',cat:'Environmental',icon:'🎨',kw:['lead paint remediation insurance business','lead paint discovery insurance claim'],desc:'Lead paint is discovered during renovation or following a covered event.',covered:'Remediation required by code during covered repair.',denied:'Voluntary lead paint removal not triggered by covered loss.'},
  {slug:'chemical-spill',name:'Chemical Spill',cat:'Environmental',icon:'⚗️',kw:['chemical spill business insurance claim','hazmat spill commercial insurance','chemical leak insurance claim'],desc:'A chemical spill or hazmat event at the business requires cleanup.',covered:'Pollution liability endorsement required. Cleanup and third-party bodily injury.',denied:'Standard commercial property excludes pollution.'},
  {slug:'gas-leak',name:'Gas Leak',cat:'Environmental',icon:'💨',kw:['gas leak business insurance claim','natural gas leak commercial property','gas explosion business insurance'],desc:'Natural gas leak at the commercial property — with or without explosion.',covered:'Explosion damage is covered. Business interruption during evacuation and repair.',denied:'Gradual gas leak from aging pipes without sudden failure.'},
  {slug:'fuel-oil-spill',name:'Fuel Oil Spill',cat:'Environmental',icon:'🛢️',kw:['fuel oil spill insurance claim','heating oil leak business insurance','underground tank leak insurance claim'],desc:'Heating oil or underground fuel tank leaks, contaminating soil or building.',covered:'Requires pollution liability endorsement for cleanup and third-party claims.',denied:'Standard property excludes oil spill and soil contamination.'},
  {slug:'soil-contamination',name:'Soil Contamination',cat:'Environmental',icon:'☣️',kw:['soil contamination insurance claim business','environmental cleanup insurance commercial'],desc:'Soil on or near commercial property is contaminated by pollutants.',covered:'Pollution liability policy covers remediation and third-party claims.',denied:'Standard commercial property excludes pollution and contamination.'},
  {slug:'sewage-contamination',name:'Sewage Contamination',cat:'Environmental',icon:'⚠️',kw:['sewage contamination business insurance','raw sewage backup business claim','biohazard cleanup insurance claim'],desc:'Raw sewage backs up into the commercial property requiring biohazard cleanup.',covered:'Sewer backup endorsement covers cleanup and remediation.',denied:'Standard policy without sewer backup endorsement.'},
  // POWER & UTILITIES (4)
  {slug:'power-outage',name:'Power Outage',cat:'Power & Utilities',icon:'🔌',kw:['power outage business insurance claim','extended power outage business loss','utility failure business interruption claim'],desc:'Extended power outage disrupts business operations and causes losses.',covered:'Equipment breakdown with off-premises service interruption endorsement.',denied:'Standard policy without utility interruption endorsement.'},
  {slug:'power-surge',name:'Power Surge',cat:'Power & Utilities',icon:'⚡',kw:['power surge damage business insurance','electrical surge equipment damage claim','power surge fried computers insurance'],desc:'Voltage spike from utility or lightning damages electrical equipment.',covered:'Direct physical damage from sudden surge to electronics and equipment.',denied:'Gradual voltage fluctuation wear on equipment.'},
  {slug:'transformer-explosion',name:'Transformer Explosion',cat:'Power & Utilities',icon:'💥',kw:['transformer explosion business damage insurance','utility transformer fire insurance','power transformer explosion property damage'],desc:'Utility transformer explodes near the business, causing fire or structural damage.',covered:'Damage to your building and contents from transformer explosion.',denied:'Utility company liability dispute (file separate claim against utility).'},
  {slug:'utility-line',name:'Utility Line Damage',cat:'Power & Utilities',icon:'🔌',kw:['utility line damage business insurance','power line fell on business insurance','electric pole fell on building insurance'],desc:'Power lines or utility poles fall on or near the commercial building.',covered:'Direct property damage from fallen utility infrastructure.',denied:'Off-premises utility damage without service interruption endorsement.'},
  // CYBER & DATA (4)
  {slug:'ransomware',name:'Ransomware Attack',cat:'Cyber',icon:'💻',kw:['ransomware attack business insurance claim','cyber attack insurance claim small business','ransomware business interruption insurance'],desc:'Ransomware encrypts business systems, halting operations.',covered:'Cyber policy: ransom payment, data recovery, business interruption.',denied:'Standard commercial property excludes cyber events.'},
  {slug:'data-breach',name:'Data Breach',cat:'Cyber',icon:'🔐',kw:['data breach insurance claim business','customer data stolen insurance','HIPAA breach insurance claim'],desc:'Customer or employee data is stolen or exposed in a security breach.',covered:'Cyber liability: notification costs, credit monitoring, legal defense, regulatory fines.',denied:'Standard commercial property does not cover data breach.'},
  {slug:'wire-fraud',name:'Wire / Transfer Fraud',cat:'Cyber',icon:'💸',kw:['wire fraud business insurance claim','BEC scam insurance claim business','email fraud wire transfer insurance'],desc:'Business email compromise leads to fraudulent wire transfer.',covered:'Commercial crime policy with computer fraud endorsement.',denied:'Standard property excludes financial fraud.'},
  {slug:'website-hack',name:'Website Hack',cat:'Cyber',icon:'💻',kw:['website hacked business insurance claim','cyber insurance claim business'],desc:'Business website is hacked, defaced, or taken offline.',covered:'Cyber policy: restoration costs, business interruption.',denied:'Standard commercial property does not cover cyber events.'},
  // EMPLOYEE & WORKERS (4)
  {slug:'employee-injury-gen',name:'Employee Injury',cat:'Employee',icon:'🏥',kw:['employee injury insurance claim business','worker hurt on job insurance','workers comp claim business insurance'],desc:'Employee is injured while performing work duties.',covered:'Workers compensation: medical, lost wages, rehabilitation.',denied:'Injuries outside scope of employment; intoxication.'},
  {slug:'employee-lawsuit',name:'Employee Lawsuit',cat:'Employee',icon:'⚖️',kw:['employee lawsuit business insurance claim','employment practices liability claim','wrongful termination insurance claim'],desc:'Employee files a discrimination, harassment, or wrongful termination lawsuit.',covered:'Employment practices liability insurance (EPLI) covers defense and settlements.',denied:'Intentional discriminatory acts by the insured.'},
  {slug:'workplace-violence',name:'Workplace Violence',cat:'Employee',icon:'🚨',kw:['workplace violence insurance claim','employee attack business insurance','active shooter business insurance claim'],desc:'A violent incident occurs at the business — assault, active threat, or attack.',covered:'Liability for injured parties; workers comp for employees; crisis management costs.',denied:'Known threat that was ignored without reasonable precautions.'},
  {slug:'food-handler-illness',name:'Food Handler Illness',cat:'Employee',icon:'🤒',kw:['food handler sick outbreak insurance','restaurant employee food poisoning claim'],desc:'Sick food handler causes a foodborne illness outbreak, triggering liability.',covered:'General liability for customer illness claims; health department closure business interruption.',denied:'Gross negligence — knowingly allowing sick worker to handle food.'},
  // BUSINESS INTERRUPTION (5)
  {slug:'forced-closure',name:'Forced Closure',cat:'Business Interruption',icon:'🚫',kw:['business interruption insurance claim','forced closure business income loss insurance','business closed insurance claim'],desc:'Business is forced to close following a covered property loss.',covered:'Net income loss plus continuing expenses during restoration period.',denied:'Closure without physical damage to property.'},
  {slug:'government-closure',name:'Government Order Closure',cat:'Business Interruption',icon:'🏛️',kw:['government shutdown business insurance claim','mandatory evacuation business income insurance','ordered closure business interruption claim'],desc:'Government orders business to close — evacuation, contamination, or public safety.',covered:'Civil authority coverage pays for nearby covered cause of loss forcing closure.',denied:'Voluntary closure; closures from non-covered causes.'},
  {slug:'supply-chain',name:'Supply Chain Disruption',cat:'Business Interruption',icon:'📦',kw:['supply chain disruption business insurance','contingent business interruption claim'],desc:'A key supplier suffers a loss, disrupting materials or inventory supply.',covered:'Contingent business interruption endorsement covers supplier losses.',denied:'Standard BI does not cover dependent property without endorsement.'},
  {slug:'dependent-closure',name:'Dependent Business Closure',cat:'Business Interruption',icon:'🏢',kw:['supplier fire my business interruption','key supplier closed business income loss'],desc:'A customer or supplier that drives significant revenue closes due to a covered loss.',covered:'Contingent BI covers both supplier and customer dependent property.',denied:'Excluded dependent property; customer closes voluntarily.'},
  {slug:'utility-closure',name:'Utility Failure Closure',cat:'Business Interruption',icon:'🔌',kw:['utility outage business interruption insurance','no power forced close insurance claim'],desc:'Business must close because of utility failure — no power, water, or gas.',covered:'Utility services — time element endorsement covers off-premises utility failure.',denied:'Standard policy without utility interruption endorsement.'},
];

// ─── STATES (same as v1) ──────────────────────────────────────────
const STATES = [
  {name:'Alabama',abbr:'AL',slug:'alabama',sol:6,statute:'Ala. Code §27-12-24',note:'Common law bad faith recognized.'},
  {name:'Alaska',abbr:'AK',slug:'alaska',sol:6,statute:'AS 21.36.125',note:'Requires acknowledgment within 10 working days.'},
  {name:'Arizona',abbr:'AZ',slug:'arizona',sol:2,statute:'A.R.S. §20-461',note:'2-year bad faith SOL; punitive damages available.'},
  {name:'Arkansas',abbr:'AR',slug:'arkansas',sol:5,statute:'Ark. Code §23-66-206',note:'12% penalty + attorney fees for wrongful denial.'},
  {name:'California',abbr:'CA',slug:'california',sol:4,statute:'Cal. Ins. Code §790.03',note:'Strongest policyholder protections in the US.'},
  {name:'Colorado',abbr:'CO',slug:'colorado',sol:2,statute:'C.R.S. §10-3-1115',note:'2x damages for unreasonable delay or denial.'},
  {name:'Connecticut',abbr:'CT',slug:'connecticut',sol:6,statute:'Conn. Gen. Stat. §38a-815',note:'CUIPA bad faith claims recognized.'},
  {name:'Delaware',abbr:'DE',slug:'delaware',sol:3,statute:'18 Del. C. §2304',note:'Fairly debatable standard for bad faith.'},
  {name:'Florida',abbr:'FL',slug:'florida',sol:5,statute:'Fla. Stat. §624.155',note:'Civil Remedy Notice required 60 days before suit.'},
  {name:'Georgia',abbr:'GA',slug:'georgia',sol:6,statute:'O.C.G.A. §33-4-6',note:'25% penalty + attorney fees for bad faith.'},
  {name:'Hawaii',abbr:'HI',slug:'hawaii',sol:6,statute:'HRS §431:13-103',note:'Resolve claims within 45 days.'},
  {name:'Idaho',abbr:'ID',slug:'idaho',sol:5,statute:'Idaho Code §41-1329',note:'Good-faith settlement when liability is clear.'},
  {name:'Illinois',abbr:'IL',slug:'illinois',sol:2,statute:'215 ILCS 5/155',note:'Extra damages for vexatious delay or denial.'},
  {name:'Indiana',abbr:'IN',slug:'indiana',sol:10,statute:'Ind. Code §27-4-1-4.5',note:'10-year SOL for written contracts.'},
  {name:'Iowa',abbr:'IA',slug:'iowa',sol:10,statute:'Iowa Code §507B.4',note:'10-year SOL for written contracts.'},
  {name:'Kansas',abbr:'KS',slug:'kansas',sol:5,statute:'K.S.A. §40-2404',note:'Bad faith recognized; punitive damages available.'},
  {name:'Kentucky',abbr:'KY',slug:'kentucky',sol:15,statute:'KRS §304.12-230',note:'15-year SOL — longest in the nation.'},
  {name:'Louisiana',abbr:'LA',slug:'louisiana',sol:1,statute:'La. R.S. 22:1892',note:'50% penalty for arbitrary refusal; 1-year SOL.'},
  {name:'Maine',abbr:'ME',slug:'maine',sol:6,statute:'24-A M.R.S.A. §2164-B',note:'Complete investigation within 30 days of proof of loss.'},
  {name:'Maryland',abbr:'MD',slug:'maryland',sol:3,statute:'Md. Ins. Code §27-301',note:'3-year SOL — act quickly.'},
  {name:'Massachusetts',abbr:'MA',slug:'massachusetts',sol:6,statute:'M.G.L. c. 176D §3',note:'Ch. 93A allows double or triple damages.'},
  {name:'Michigan',abbr:'MI',slug:'michigan',sol:6,statute:'MCL §500.2026',note:'Pay undisputed amounts while investigating disputed portions.'},
  {name:'Minnesota',abbr:'MN',slug:'minnesota',sol:6,statute:'Minn. Stat. §72A.201',note:'Attorney fees for frivolous denials.'},
  {name:'Mississippi',abbr:'MS',slug:'mississippi',sol:3,statute:'Miss. Code §83-5-33',note:'Punitive damages for conscious disregard of policyholder rights.'},
  {name:'Missouri',abbr:'MO',slug:'missouri',sol:10,statute:'§375.420 RSMo',note:'Vexatious refusal: 20% of first $1,500 + 10% + attorney fees.'},
  {name:'Montana',abbr:'MT',slug:'montana',sol:5,statute:'Mont. Code §33-18-201',note:'Investigate within 30 days; respond within 10 days.'},
  {name:'Nebraska',abbr:'NE',slug:'nebraska',sol:5,statute:'Neb. Rev. Stat. §44-1539',note:'Both first-party and third-party bad faith recognized.'},
  {name:'Nevada',abbr:'NV',slug:'nevada',sol:6,statute:'NRS §686A.310',note:'Statutory bad faith; punitive damages available.'},
  {name:'New Hampshire',abbr:'NH',slug:'new-hampshire',sol:3,statute:'N.H. Rev. Stat. §417:4',note:'Respond within 10 days; complete investigation in 45 days.'},
  {name:'New Jersey',abbr:'NJ',slug:'new-jersey',sol:6,statute:'N.J.S.A. §17:29B-4',note:'Punitive damages for egregious bad faith.'},
  {name:'New Mexico',abbr:'NM',slug:'new-mexico',sol:6,statute:'NMSA §59A-16-20',note:'Specific timeframes for acknowledgment and resolution.'},
  {name:'New York',abbr:'NY',slug:'new-york',sol:6,statute:'N.Y. Ins. Law §2601',note:'Regulatory action against unfair claim settlement practices.'},
  {name:'North Carolina',abbr:'NC',slug:'north-carolina',sol:3,statute:'N.C.G.S. §58-63-15',note:'3-year SOL from date of loss — act quickly.'},
  {name:'North Dakota',abbr:'ND',slug:'north-dakota',sol:6,statute:'N.D.C.C. §26.1-04-03',note:'Complete investigation within 30 days.'},
  {name:'Ohio',abbr:'OH',slug:'ohio',sol:15,statute:'R.C. §3901.21',note:'15-year contract SOL; common law bad faith recognized.'},
  {name:'Oklahoma',abbr:'OK',slug:'oklahoma',sol:5,statute:'36 O.S. §1250.5',note:'Punitive damages for reckless or intentional bad faith.'},
  {name:'Oregon',abbr:'OR',slug:'oregon',sol:6,statute:'ORS §746.230',note:'Accept or deny with written explanation.'},
  {name:'Pennsylvania',abbr:'PA',slug:'pennsylvania',sol:4,statute:'42 Pa. C.S. §8371',note:'Punitive damages, interest, attorney fees for bad faith.'},
  {name:'Rhode Island',abbr:'RI',slug:'rhode-island',sol:10,statute:'R.I. Gen. Laws §27-9.1-1',note:'10-year SOL; good faith claims handling required.'},
  {name:'South Carolina',abbr:'SC',slug:'south-carolina',sol:3,statute:'S.C. Code §38-59-20',note:'Extra-contractual damages for unreasonable handling.'},
  {name:'South Dakota',abbr:'SD',slug:'south-dakota',sol:6,statute:'SDCL §58-33-67',note:'Prompt acknowledgment and investigation required.'},
  {name:'Tennessee',abbr:'TN',slug:'tennessee',sol:6,statute:'Tenn. Code §56-8-104',note:'25% penalty + attorney fees for bad faith refusal.'},
  {name:'Texas',abbr:'TX',slug:'texas',sol:2,statute:'Tex. Ins. Code §541',note:'Prompt Payment Act: 18% interest on late payments.'},
  {name:'Utah',abbr:'UT',slug:'utah',sol:6,statute:'Utah Code §31A-21-312',note:'Acknowledge in 10 days; accept or deny in 45 days.'},
  {name:'Vermont',abbr:'VT',slug:'vermont',sol:6,statute:'8 V.S.A. §4726',note:'Respond within 45 days of proof of loss.'},
  {name:'Virginia',abbr:'VA',slug:'virginia',sol:5,statute:'Va. Code §38.2-510',note:'Full written explanation of claim decisions required.'},
  {name:'Washington',abbr:'WA',slug:'washington',sol:3,statute:'WAC 284-30; RCW 48.30.015',note:'Insurance Fair Conduct Act: triple damages available.'},
  {name:'West Virginia',abbr:'WV',slug:'west-virginia',sol:2,statute:'W. Va. Code §33-11-4',note:'2-year SOL for bad faith — act immediately.'},
  {name:'Wisconsin',abbr:'WI',slug:'wisconsin',sol:6,statute:'Wis. Stat. §628.46',note:'12% annual interest on late claim payments.'},
  {name:'Wyoming',abbr:'WY',slug:'wyoming',sol:8,statute:'Wyo. Stat. §26-13-124',note:'8-year SOL for written contracts.'},
  {name:'Washington DC',abbr:'DC',slug:'washington-dc',sol:3,statute:'D.C. Code §31-2231.17',note:'Prompt claims handling required under DC insurance code.'},
];

// ─── CITIES (expanded ~500) ───────────────────────────────────────
const CITIES = [
  // California (60)
  {n:'Los Angeles',s:'los-angeles',a:'CA'},{n:'San Diego',s:'san-diego',a:'CA'},{n:'San Jose',s:'san-jose',a:'CA'},
  {n:'San Francisco',s:'san-francisco',a:'CA'},{n:'Fresno',s:'fresno',a:'CA'},{n:'Sacramento',s:'sacramento',a:'CA'},
  {n:'Long Beach',s:'long-beach',a:'CA'},{n:'Oakland',s:'oakland',a:'CA'},{n:'Bakersfield',s:'bakersfield',a:'CA'},
  {n:'Anaheim',s:'anaheim',a:'CA'},{n:'Santa Ana',s:'santa-ana',a:'CA'},{n:'Riverside',s:'riverside',a:'CA'},
  {n:'Stockton',s:'stockton',a:'CA'},{n:'Chula Vista',s:'chula-vista',a:'CA'},{n:'Irvine',s:'irvine',a:'CA'},
  {n:'Fremont',s:'fremont',a:'CA'},{n:'San Bernardino',s:'san-bernardino',a:'CA'},{n:'Modesto',s:'modesto',a:'CA'},
  {n:'Fontana',s:'fontana',a:'CA'},{n:'Moreno Valley',s:'moreno-valley',a:'CA'},{n:'Glendale',s:'glendale-ca',a:'CA'},
  {n:'Huntington Beach',s:'huntington-beach',a:'CA'},{n:'Santa Clarita',s:'santa-clarita',a:'CA'},{n:'Garden Grove',s:'garden-grove',a:'CA'},
  {n:'Oceanside',s:'oceanside',a:'CA'},{n:'Rancho Cucamonga',s:'rancho-cucamonga',a:'CA'},{n:'Ontario',s:'ontario-ca',a:'CA'},
  {n:'Corona',s:'corona-ca',a:'CA'},{n:'Elk Grove',s:'elk-grove',a:'CA'},{n:'Santa Rosa',s:'santa-rosa',a:'CA'},
  {n:'Pomona',s:'pomona',a:'CA'},{n:'Lancaster',s:'lancaster-ca',a:'CA'},{n:'Palmdale',s:'palmdale',a:'CA'},
  {n:'Salinas',s:'salinas',a:'CA'},{n:'Sunnyvale',s:'sunnyvale',a:'CA'},{n:'Torrance',s:'torrance',a:'CA'},
  {n:'Pasadena',s:'pasadena-ca',a:'CA'},{n:'Hayward',s:'hayward',a:'CA'},{n:'Escondido',s:'escondido',a:'CA'},
  {n:'Roseville',s:'roseville-ca',a:'CA'},{n:'Oxnard',s:'oxnard',a:'CA'},{n:'Visalia',s:'visalia',a:'CA'},
  {n:'Concord',s:'concord-ca',a:'CA'},{n:'Thousand Oaks',s:'thousand-oaks',a:'CA'},{n:'Simi Valley',s:'simi-valley',a:'CA'},
  {n:'Victorville',s:'victorville',a:'CA'},{n:'Berkeley',s:'berkeley',a:'CA'},{n:'Inglewood',s:'inglewood',a:'CA'},
  {n:'Downey',s:'downey',a:'CA'},{n:'Costa Mesa',s:'costa-mesa',a:'CA'},{n:'Vallejo',s:'vallejo',a:'CA'},
  {n:'Richmond',s:'richmond-ca',a:'CA'},{n:'Fairfield',s:'fairfield-ca',a:'CA'},{n:'Antioch',s:'antioch',a:'CA'},
  {n:'Ventura',s:'ventura',a:'CA'},{n:'Temecula',s:'temecula',a:'CA'},{n:'Murrieta',s:'murrieta',a:'CA'},
  {n:'Clovis',s:'clovis',a:'CA'},{n:'West Covina',s:'west-covina',a:'CA'},{n:'El Monte',s:'el-monte',a:'CA'},
  // Texas (50)
  {n:'Houston',s:'houston',a:'TX'},{n:'San Antonio',s:'san-antonio',a:'TX'},{n:'Dallas',s:'dallas',a:'TX'},
  {n:'Austin',s:'austin',a:'TX'},{n:'Fort Worth',s:'fort-worth',a:'TX'},{n:'El Paso',s:'el-paso',a:'TX'},
  {n:'Arlington',s:'arlington-tx',a:'TX'},{n:'Corpus Christi',s:'corpus-christi',a:'TX'},{n:'Plano',s:'plano',a:'TX'},
  {n:'Laredo',s:'laredo',a:'TX'},{n:'Lubbock',s:'lubbock',a:'TX'},{n:'Garland',s:'garland',a:'TX'},
  {n:'Irving',s:'irving',a:'TX'},{n:'Amarillo',s:'amarillo',a:'TX'},{n:'Brownsville',s:'brownsville',a:'TX'},
  {n:'McKinney',s:'mckinney',a:'TX'},{n:'Frisco',s:'frisco',a:'TX'},{n:'Killeen',s:'killeen',a:'TX'},
  {n:'McAllen',s:'mcallen',a:'TX'},{n:'Mesquite',s:'mesquite',a:'TX'},{n:'Waco',s:'waco',a:'TX'},
  {n:'Carrollton',s:'carrollton',a:'TX'},{n:'Pasadena',s:'pasadena-tx',a:'TX'},{n:'Grand Prairie',s:'grand-prairie',a:'TX'},
  {n:'Midland',s:'midland-tx',a:'TX'},{n:'Denton',s:'denton',a:'TX'},{n:'Abilene',s:'abilene',a:'TX'},
  {n:'Beaumont',s:'beaumont',a:'TX'},{n:'Round Rock',s:'round-rock',a:'TX'},{n:'Odessa',s:'odessa-tx',a:'TX'},
  {n:'Pearland',s:'pearland',a:'TX'},{n:'Richardson',s:'richardson',a:'TX'},{n:'Tyler',s:'tyler-tx',a:'TX'},
  {n:'Lewisville',s:'lewisville',a:'TX'},{n:'College Station',s:'college-station',a:'TX'},{n:'League City',s:'league-city',a:'TX'},
  {n:'Edinburg',s:'edinburg',a:'TX'},{n:'Allen',s:'allen-tx',a:'TX'},{n:'Longview',s:'longview-tx',a:'TX'},
  {n:'Pharr',s:'pharr',a:'TX'},{n:'New Braunfels',s:'new-braunfels',a:'TX'},{n:'Sugar Land',s:'sugar-land',a:'TX'},
  {n:'Wichita Falls',s:'wichita-falls',a:'TX'},{n:'Mission',s:'mission-tx',a:'TX'},{n:'Cedar Park',s:'cedar-park',a:'TX'},
  {n:'Conroe',s:'conroe',a:'TX'},{n:'Bryan',s:'bryan-tx',a:'TX'},{n:'Harlingen',s:'harlingen',a:'TX'},
  {n:'San Marcos',s:'san-marcos-tx',a:'TX'},{n:'Flower Mound',s:'flower-mound',a:'TX'},
  // Florida (35)
  {n:'Jacksonville',s:'jacksonville',a:'FL'},{n:'Miami',s:'miami',a:'FL'},{n:'Tampa',s:'tampa',a:'FL'},
  {n:'Orlando',s:'orlando',a:'FL'},{n:'St. Petersburg',s:'st-petersburg',a:'FL'},{n:'Hialeah',s:'hialeah',a:'FL'},
  {n:'Port St. Lucie',s:'port-st-lucie',a:'FL'},{n:'Cape Coral',s:'cape-coral',a:'FL'},{n:'Tallahassee',s:'tallahassee',a:'FL'},
  {n:'Fort Lauderdale',s:'fort-lauderdale',a:'FL'},{n:'Pembroke Pines',s:'pembroke-pines',a:'FL'},{n:'Hollywood',s:'hollywood-fl',a:'FL'},
  {n:'Miramar',s:'miramar-fl',a:'FL'},{n:'Gainesville',s:'gainesville-fl',a:'FL'},{n:'Coral Springs',s:'coral-springs',a:'FL'},
  {n:'Clearwater',s:'clearwater',a:'FL'},{n:'Palm Bay',s:'palm-bay',a:'FL'},{n:'Pompano Beach',s:'pompano-beach',a:'FL'},
  {n:'West Palm Beach',s:'west-palm-beach',a:'FL'},{n:'Lakeland',s:'lakeland',a:'FL'},{n:'Davie',s:'davie-fl',a:'FL'},
  {n:'Miami Gardens',s:'miami-gardens',a:'FL'},{n:'Boca Raton',s:'boca-raton',a:'FL'},{n:'Sunrise',s:'sunrise-fl',a:'FL'},
  {n:'Plantation',s:'plantation-fl',a:'FL'},{n:'Deltona',s:'deltona',a:'FL'},{n:'Fort Myers',s:'fort-myers',a:'FL'},
  {n:'Palm Coast',s:'palm-coast',a:'FL'},{n:'Melbourne',s:'melbourne-fl',a:'FL'},{n:'Deerfield Beach',s:'deerfield-beach',a:'FL'},
  {n:'Lakewood Ranch',s:'lakewood-ranch',a:'FL'},{n:'Kissimmee',s:'kissimmee',a:'FL'},{n:'Ocala',s:'ocala',a:'FL'},
  {n:'Sarasota',s:'sarasota',a:'FL'},{n:'Daytona Beach',s:'daytona-beach',a:'FL'},
  // New York (15)
  {n:'New York',s:'new-york',a:'NY'},{n:'Buffalo',s:'buffalo-ny',a:'NY'},{n:'Rochester',s:'rochester-ny',a:'NY'},
  {n:'Yonkers',s:'yonkers-ny',a:'NY'},{n:'Syracuse',s:'syracuse-ny',a:'NY'},{n:'Albany',s:'albany-ny',a:'NY'},
  {n:'New Rochelle',s:'new-rochelle',a:'NY'},{n:'Mount Vernon',s:'mount-vernon-ny',a:'NY'},{n:'Schenectady',s:'schenectady',a:'NY'},
  {n:'Utica',s:'utica-ny',a:'NY'},{n:'White Plains',s:'white-plains',a:'NY'},{n:'Hempstead',s:'hempstead',a:'NY'},
  {n:'Brentwood',s:'brentwood-ny',a:'NY'},{n:'Freeport',s:'freeport-ny',a:'NY'},{n:'Valley Stream',s:'valley-stream',a:'NY'},
  // Illinois (15)
  {n:'Chicago',s:'chicago',a:'IL'},{n:'Aurora',s:'aurora-il',a:'IL'},{n:'Rockford',s:'rockford-il',a:'IL'},
  {n:'Joliet',s:'joliet',a:'IL'},{n:'Naperville',s:'naperville',a:'IL'},{n:'Springfield',s:'springfield-il',a:'IL'},
  {n:'Peoria',s:'peoria-il',a:'IL'},{n:'Elgin',s:'elgin-il',a:'IL'},{n:'Waukegan',s:'waukegan',a:'IL'},
  {n:'Champaign',s:'champaign',a:'IL'},{n:'Bloomington',s:'bloomington-il',a:'IL'},{n:'Evanston',s:'evanston',a:'IL'},
  {n:'Decatur',s:'decatur-il',a:'IL'},{n:'Bolingbrook',s:'bolingbrook',a:'IL'},{n:'Cicero',s:'cicero-il',a:'IL'},
  // Pennsylvania (12)
  {n:'Philadelphia',s:'philadelphia',a:'PA'},{n:'Pittsburgh',s:'pittsburgh',a:'PA'},{n:'Allentown',s:'allentown',a:'PA'},
  {n:'Erie',s:'erie-pa',a:'PA'},{n:'Reading',s:'reading-pa',a:'PA'},{n:'Scranton',s:'scranton',a:'PA'},
  {n:'Bethlehem',s:'bethlehem-pa',a:'PA'},{n:'Lancaster',s:'lancaster-pa',a:'PA'},{n:'Harrisburg',s:'harrisburg',a:'PA'},
  {n:'York',s:'york-pa',a:'PA'},{n:'Altoona',s:'altoona',a:'PA'},{n:'Chester',s:'chester-pa',a:'PA'},
  // Ohio (12)
  {n:'Columbus',s:'columbus-oh',a:'OH'},{n:'Cleveland',s:'cleveland',a:'OH'},{n:'Cincinnati',s:'cincinnati',a:'OH'},
  {n:'Toledo',s:'toledo-oh',a:'OH'},{n:'Akron',s:'akron-oh',a:'OH'},{n:'Dayton',s:'dayton-oh',a:'OH'},
  {n:'Parma',s:'parma-oh',a:'OH'},{n:'Canton',s:'canton-oh',a:'OH'},{n:'Youngstown',s:'youngstown',a:'OH'},
  {n:'Lorain',s:'lorain',a:'OH'},{n:'Hamilton',s:'hamilton-oh',a:'OH'},{n:'Springfield',s:'springfield-oh',a:'OH'},
  // Georgia (10)
  {n:'Atlanta',s:'atlanta',a:'GA'},{n:'Columbus',s:'columbus-ga',a:'GA'},{n:'Augusta',s:'augusta-ga',a:'GA'},
  {n:'Macon',s:'macon-ga',a:'GA'},{n:'Savannah',s:'savannah-ga',a:'GA'},{n:'Athens',s:'athens-ga',a:'GA'},
  {n:'Sandy Springs',s:'sandy-springs',a:'GA'},{n:'Roswell',s:'roswell-ga',a:'GA'},{n:'Albany',s:'albany-ga',a:'GA'},
  {n:'Warner Robins',s:'warner-robins',a:'GA'},
  // North Carolina (12)
  {n:'Charlotte',s:'charlotte',a:'NC'},{n:'Raleigh',s:'raleigh',a:'NC'},{n:'Greensboro',s:'greensboro',a:'NC'},
  {n:'Durham',s:'durham',a:'NC'},{n:'Winston-Salem',s:'winston-salem',a:'NC'},{n:'Fayetteville',s:'fayetteville-nc',a:'NC'},
  {n:'Cary',s:'cary-nc',a:'NC'},{n:'Wilmington',s:'wilmington-nc',a:'NC'},{n:'High Point',s:'high-point',a:'NC'},
  {n:'Concord',s:'concord-nc',a:'NC'},{n:'Asheville',s:'asheville',a:'NC'},{n:'Gastonia',s:'gastonia',a:'NC'},
  // Michigan (12)
  {n:'Detroit',s:'detroit',a:'MI'},{n:'Grand Rapids',s:'grand-rapids',a:'MI'},{n:'Warren',s:'warren-mi',a:'MI'},
  {n:'Sterling Heights',s:'sterling-heights',a:'MI'},{n:'Ann Arbor',s:'ann-arbor',a:'MI'},{n:'Lansing',s:'lansing-mi',a:'MI'},
  {n:'Flint',s:'flint-mi',a:'MI'},{n:'Dearborn',s:'dearborn',a:'MI'},{n:'Livonia',s:'livonia',a:'MI'},
  {n:'Westland',s:'westland',a:'MI'},{n:'Troy',s:'troy-mi',a:'MI'},{n:'Kalamazoo',s:'kalamazoo',a:'MI'},
  // New Jersey (10)
  {n:'Newark',s:'newark-nj',a:'NJ'},{n:'Jersey City',s:'jersey-city',a:'NJ'},{n:'Paterson',s:'paterson-nj',a:'NJ'},
  {n:'Elizabeth',s:'elizabeth-nj',a:'NJ'},{n:'Edison',s:'edison-nj',a:'NJ'},{n:'Woodbridge',s:'woodbridge-nj',a:'NJ'},
  {n:'Lakewood',s:'lakewood-nj',a:'NJ'},{n:'Toms River',s:'toms-river',a:'NJ'},{n:'Hamilton',s:'hamilton-nj',a:'NJ'},
  {n:'Trenton',s:'trenton',a:'NJ'},
  // Virginia (10)
  {n:'Virginia Beach',s:'virginia-beach',a:'VA'},{n:'Norfolk',s:'norfolk-va',a:'VA'},{n:'Chesapeake',s:'chesapeake-va',a:'VA'},
  {n:'Richmond',s:'richmond-va',a:'VA'},{n:'Newport News',s:'newport-news',a:'VA'},{n:'Alexandria',s:'alexandria-va',a:'VA'},
  {n:'Hampton',s:'hampton-va',a:'VA'},{n:'Roanoke',s:'roanoke',a:'VA'},{n:'Portsmouth',s:'portsmouth-va',a:'VA'},
  {n:'Suffolk',s:'suffolk-va',a:'VA'},
  // Washington (10)
  {n:'Seattle',s:'seattle',a:'WA'},{n:'Spokane',s:'spokane-wa',a:'WA'},{n:'Tacoma',s:'tacoma-wa',a:'WA'},
  {n:'Vancouver',s:'vancouver-wa',a:'WA'},{n:'Bellevue',s:'bellevue-wa',a:'WA'},{n:'Kent',s:'kent-wa',a:'WA'},
  {n:'Everett',s:'everett-wa',a:'WA'},{n:'Renton',s:'renton',a:'WA'},{n:'Federal Way',s:'federal-way',a:'WA'},
  {n:'Kirkland',s:'kirkland-wa',a:'WA'},
  // Arizona (12)
  {n:'Phoenix',s:'phoenix',a:'AZ'},{n:'Tucson',s:'tucson',a:'AZ'},{n:'Mesa',s:'mesa-az',a:'AZ'},
  {n:'Chandler',s:'chandler-az',a:'AZ'},{n:'Scottsdale',s:'scottsdale-az',a:'AZ'},{n:'Glendale',s:'glendale-az',a:'AZ'},
  {n:'Gilbert',s:'gilbert-az',a:'AZ'},{n:'Tempe',s:'tempe-az',a:'AZ'},{n:'Peoria',s:'peoria-az',a:'AZ'},
  {n:'Surprise',s:'surprise-az',a:'AZ'},{n:'Yuma',s:'yuma-az',a:'AZ'},{n:'Avondale',s:'avondale',a:'AZ'},
  // Tennessee (10)
  {n:'Memphis',s:'memphis-tn',a:'TN'},{n:'Nashville',s:'nashville',a:'TN'},{n:'Knoxville',s:'knoxville-tn',a:'TN'},
  {n:'Chattanooga',s:'chattanooga-tn',a:'TN'},{n:'Clarksville',s:'clarksville-tn',a:'TN'},{n:'Murfreesboro',s:'murfreesboro',a:'TN'},
  {n:'Jackson',s:'jackson-tn',a:'TN'},{n:'Johnson City',s:'johnson-city',a:'TN'},{n:'Bartlett',s:'bartlett-tn',a:'TN'},
  {n:'Hendersonville',s:'hendersonville-tn',a:'TN'},
  // Massachusetts (10)
  {n:'Boston',s:'boston',a:'MA'},{n:'Worcester',s:'worcester-ma',a:'MA'},{n:'Springfield',s:'springfield-ma',a:'MA'},
  {n:'Cambridge',s:'cambridge-ma',a:'MA'},{n:'Lowell',s:'lowell',a:'MA'},{n:'Brockton',s:'brockton',a:'MA'},
  {n:'Quincy',s:'quincy-ma',a:'MA'},{n:'Lynn',s:'lynn-ma',a:'MA'},{n:'Fall River',s:'fall-river',a:'MA'},
  {n:'Newton',s:'newton-ma',a:'MA'},
  // Indiana (8)
  {n:'Indianapolis',s:'indianapolis',a:'IN'},{n:'Fort Wayne',s:'fort-wayne',a:'IN'},{n:'Evansville',s:'evansville',a:'IN'},
  {n:'South Bend',s:'south-bend',a:'IN'},{n:'Carmel',s:'carmel-in',a:'IN'},{n:'Fishers',s:'fishers',a:'IN'},
  {n:'Bloomington',s:'bloomington-in',a:'IN'},{n:'Hammond',s:'hammond-in',a:'IN'},
  // Missouri (8)
  {n:'Kansas City',s:'kansas-city-mo',a:'MO'},{n:'St. Louis',s:'st-louis',a:'MO'},{n:'Springfield',s:'springfield-mo',a:'MO'},
  {n:'Columbia',s:'columbia-mo',a:'MO'},{n:'Independence',s:'independence-mo',a:'MO'},{n:'Lee\'s Summit',s:'lees-summit',a:'MO'},
  {n:'O\'Fallon',s:'ofallon-mo',a:'MO'},{n:'St. Joseph',s:'st-joseph-mo',a:'MO'},
  // Minnesota (8)
  {n:'Minneapolis',s:'minneapolis',a:'MN'},{n:'St. Paul',s:'st-paul-mn',a:'MN'},{n:'Rochester',s:'rochester-mn',a:'MN'},
  {n:'Duluth',s:'duluth',a:'MN'},{n:'Bloomington',s:'bloomington-mn',a:'MN'},{n:'Brooklyn Park',s:'brooklyn-park',a:'MN'},
  {n:'Plymouth',s:'plymouth-mn',a:'MN'},{n:'St. Cloud',s:'st-cloud',a:'MN'},
  // Colorado (10)
  {n:'Denver',s:'denver',a:'CO'},{n:'Colorado Springs',s:'colorado-springs',a:'CO'},{n:'Aurora',s:'aurora-co',a:'CO'},
  {n:'Fort Collins',s:'fort-collins',a:'CO'},{n:'Lakewood',s:'lakewood-co',a:'CO'},{n:'Thornton',s:'thornton',a:'CO'},
  {n:'Arvada',s:'arvada',a:'CO'},{n:'Westminster',s:'westminster-co',a:'CO'},{n:'Pueblo',s:'pueblo-co',a:'CO'},
  {n:'Centennial',s:'centennial-co',a:'CO'},
  // Maryland (8)
  {n:'Baltimore',s:'baltimore',a:'MD'},{n:'Frederick',s:'frederick-md',a:'MD'},{n:'Gaithersburg',s:'gaithersburg',a:'MD'},
  {n:'Rockville',s:'rockville-md',a:'MD'},{n:'Bowie',s:'bowie-md',a:'MD'},{n:'Hagerstown',s:'hagerstown',a:'MD'},
  {n:'Annapolis',s:'annapolis',a:'MD'},{n:'Germantown',s:'germantown-md',a:'MD'},
  // Wisconsin (8)
  {n:'Milwaukee',s:'milwaukee',a:'WI'},{n:'Madison',s:'madison-wi',a:'WI'},{n:'Green Bay',s:'green-bay',a:'WI'},
  {n:'Kenosha',s:'kenosha',a:'WI'},{n:'Racine',s:'racine',a:'WI'},{n:'Appleton',s:'appleton',a:'WI'},
  {n:'Waukesha',s:'waukesha',a:'WI'},{n:'Oshkosh',s:'oshkosh',a:'WI'},
  // Oregon (8)
  {n:'Portland',s:'portland-or',a:'OR'},{n:'Eugene',s:'eugene-or',a:'OR'},{n:'Salem',s:'salem-or',a:'OR'},
  {n:'Gresham',s:'gresham',a:'OR'},{n:'Hillsboro',s:'hillsboro-or',a:'OR'},{n:'Bend',s:'bend-or',a:'OR'},
  {n:'Beaverton',s:'beaverton',a:'OR'},{n:'Medford',s:'medford-or',a:'OR'},
  // Nevada (6)
  {n:'Las Vegas',s:'las-vegas',a:'NV'},{n:'Henderson',s:'henderson-nv',a:'NV'},{n:'Reno',s:'reno-nv',a:'NV'},
  {n:'North Las Vegas',s:'north-las-vegas',a:'NV'},{n:'Sparks',s:'sparks-nv',a:'NV'},{n:'Carson City',s:'carson-city',a:'NV'},
  // Connecticut (8)
  {n:'Bridgeport',s:'bridgeport-ct',a:'CT'},{n:'New Haven',s:'new-haven-ct',a:'CT'},{n:'Stamford',s:'stamford-ct',a:'CT'},
  {n:'Hartford',s:'hartford',a:'CT'},{n:'Waterbury',s:'waterbury',a:'CT'},{n:'Norwalk',s:'norwalk-ct',a:'CT'},
  {n:'Danbury',s:'danbury',a:'CT'},{n:'New Britain',s:'new-britain',a:'CT'},
  // Louisiana (8)
  {n:'New Orleans',s:'new-orleans',a:'LA'},{n:'Baton Rouge',s:'baton-rouge',a:'LA'},{n:'Shreveport',s:'shreveport-la',a:'LA'},
  {n:'Lafayette',s:'lafayette-la',a:'LA'},{n:'Lake Charles',s:'lake-charles',a:'LA'},{n:'Kenner',s:'kenner',a:'LA'},
  {n:'Bossier City',s:'bossier-city',a:'LA'},{n:'Monroe',s:'monroe-la',a:'LA'},
  // Kentucky (6)
  {n:'Louisville',s:'louisville-ky',a:'KY'},{n:'Lexington',s:'lexington-ky',a:'KY'},{n:'Bowling Green',s:'bowling-green',a:'KY'},
  {n:'Owensboro',s:'owensboro',a:'KY'},{n:'Covington',s:'covington-ky',a:'KY'},{n:'Hopkinsville',s:'hopkinsville',a:'KY'},
  // Oklahoma (6)
  {n:'Oklahoma City',s:'oklahoma-city',a:'OK'},{n:'Tulsa',s:'tulsa',a:'OK'},{n:'Norman',s:'norman-ok',a:'OK'},
  {n:'Broken Arrow',s:'broken-arrow',a:'OK'},{n:'Edmond',s:'edmond',a:'OK'},{n:'Lawton',s:'lawton',a:'OK'},
  // South Carolina (6)
  {n:'Charleston',s:'charleston-sc',a:'SC'},{n:'Columbia',s:'columbia-sc',a:'SC'},{n:'North Charleston',s:'north-charleston',a:'SC'},
  {n:'Mount Pleasant',s:'mount-pleasant-sc',a:'SC'},{n:'Rock Hill',s:'rock-hill',a:'SC'},{n:'Greenville',s:'greenville-sc',a:'SC'},
  // Iowa (6)
  {n:'Des Moines',s:'des-moines',a:'IA'},{n:'Cedar Rapids',s:'cedar-rapids',a:'IA'},{n:'Davenport',s:'davenport-ia',a:'IA'},
  {n:'Sioux City',s:'sioux-city',a:'IA'},{n:'Iowa City',s:'iowa-city',a:'IA'},{n:'Waterloo',s:'waterloo-ia',a:'IA'},
  // Mississippi (5)
  {n:'Jackson',s:'jackson-ms',a:'MS'},{n:'Gulfport',s:'gulfport',a:'MS'},{n:'Southaven',s:'southaven',a:'MS'},
  {n:'Hattiesburg',s:'hattiesburg',a:'MS'},{n:'Biloxi',s:'biloxi',a:'MS'},
  // Arkansas (5)
  {n:'Little Rock',s:'little-rock-ar',a:'AR'},{n:'Fort Smith',s:'fort-smith',a:'AR'},{n:'Fayetteville',s:'fayetteville-ar',a:'AR'},
  {n:'Springdale',s:'springdale-ar',a:'AR'},{n:'Jonesboro',s:'jonesboro-ar',a:'AR'},
  // Kansas (5)
  {n:'Wichita',s:'wichita-ks',a:'KS'},{n:'Overland Park',s:'overland-park-ks',a:'KS'},{n:'Kansas City',s:'kansas-city-ks',a:'KS'},
  {n:'Topeka',s:'topeka-ks',a:'KS'},{n:'Olathe',s:'olathe-ks',a:'KS'},
  // Utah (6)
  {n:'Salt Lake City',s:'salt-lake-city',a:'UT'},{n:'West Valley City',s:'west-valley-city',a:'UT'},{n:'Provo',s:'provo',a:'UT'},
  {n:'West Jordan',s:'west-jordan',a:'UT'},{n:'Orem',s:'orem',a:'UT'},{n:'St. George',s:'st-george-ut',a:'UT'},
  // New Mexico (5)
  {n:'Albuquerque',s:'albuquerque-nm',a:'NM'},{n:'Las Cruces',s:'las-cruces',a:'NM'},{n:'Rio Rancho',s:'rio-rancho',a:'NM'},
  {n:'Santa Fe',s:'santa-fe',a:'NM'},{n:'Roswell',s:'roswell-nm',a:'NM'},
  // Nebraska (4)
  {n:'Omaha',s:'omaha-ne',a:'NE'},{n:'Lincoln',s:'lincoln-ne',a:'NE'},{n:'Bellevue',s:'bellevue-ne',a:'NE'},
  {n:'Grand Island',s:'grand-island',a:'NE'},
  // Alabama (6)
  {n:'Birmingham',s:'birmingham-al',a:'AL'},{n:'Montgomery',s:'montgomery-al',a:'AL'},{n:'Huntsville',s:'huntsville-al',a:'AL'},
  {n:'Mobile',s:'mobile-al',a:'AL'},{n:'Tuscaloosa',s:'tuscaloosa',a:'AL'},{n:'Hoover',s:'hoover',a:'AL'},
  // Rhode Island (4)
  {n:'Providence',s:'providence-ri',a:'RI'},{n:'Cranston',s:'cranston',a:'RI'},{n:'Warwick',s:'warwick-ri',a:'RI'},
  {n:'Pawtucket',s:'pawtucket',a:'RI'},
  // Idaho (5)
  {n:'Boise',s:'boise-id',a:'ID'},{n:'Nampa',s:'nampa',a:'ID'},{n:'Meridian',s:'meridian-id',a:'ID'},
  {n:'Idaho Falls',s:'idaho-falls',a:'ID'},{n:'Caldwell',s:'caldwell-id',a:'ID'},
  // Hawaii (4)
  {n:'Honolulu',s:'honolulu-hi',a:'HI'},{n:'Pearl City',s:'pearl-city',a:'HI'},{n:'Hilo',s:'hilo',a:'HI'},
  {n:'Kailua',s:'kailua-hi',a:'HI'},
  // New Hampshire (4)
  {n:'Manchester',s:'manchester-nh',a:'NH'},{n:'Nashua',s:'nashua',a:'NH'},{n:'Concord',s:'concord-nh',a:'NH'},
  {n:'Derry',s:'derry-nh',a:'NH'},
  // Montana (4)
  {n:'Billings',s:'billings',a:'MT'},{n:'Missoula',s:'missoula',a:'MT'},{n:'Great Falls',s:'great-falls',a:'MT'},
  {n:'Bozeman',s:'bozeman',a:'MT'},
  // Maine (4)
  {n:'Portland',s:'portland-me',a:'ME'},{n:'Lewiston',s:'lewiston-me',a:'ME'},{n:'Bangor',s:'bangor-me',a:'ME'},
  {n:'Auburn',s:'auburn-me',a:'ME'},
  // West Virginia (4)
  {n:'Charleston',s:'charleston-wv',a:'WV'},{n:'Huntington',s:'huntington-wv',a:'WV'},{n:'Parkersburg',s:'parkersburg',a:'WV'},
  {n:'Morgantown',s:'morgantown',a:'WV'},
  // Alaska (4)
  {n:'Anchorage',s:'anchorage-ak',a:'AK'},{n:'Fairbanks',s:'fairbanks',a:'AK'},{n:'Juneau',s:'juneau',a:'AK'},
  {n:'Wasilla',s:'wasilla',a:'AK'},
  // South Dakota (3)
  {n:'Sioux Falls',s:'sioux-falls-sd',a:'SD'},{n:'Rapid City',s:'rapid-city',a:'SD'},{n:'Aberdeen',s:'aberdeen-sd',a:'SD'},
  // North Dakota (4)
  {n:'Fargo',s:'fargo',a:'ND'},{n:'Bismarck',s:'bismarck',a:'ND'},{n:'Grand Forks',s:'grand-forks',a:'ND'},
  {n:'Minot',s:'minot',a:'ND'},
  // Delaware (3)
  {n:'Wilmington',s:'wilmington-de',a:'DE'},{n:'Dover',s:'dover-de',a:'DE'},{n:'Newark',s:'newark-de',a:'DE'},
  // Vermont (3)
  {n:'Burlington',s:'burlington-vt',a:'VT'},{n:'South Burlington',s:'south-burlington',a:'VT'},{n:'Rutland',s:'rutland-vt',a:'VT'},
  // Wyoming (3)
  {n:'Cheyenne',s:'cheyenne',a:'WY'},{n:'Casper',s:'casper',a:'WY'},{n:'Laramie',s:'laramie',a:'WY'},
  // Washington DC
  {n:'Washington DC',s:'washington-dc-city',a:'DC'},

  // ── EXPANSION BATCH — additional 865 cities ─────────────────────

  // California extra (65)
  {n:'Orange',s:'orange-ca',a:'CA'},{n:'Fullerton',s:'fullerton',a:'CA'},{n:'Santa Clara',s:'santa-clara',a:'CA'},
  {n:'Mission Viejo',s:'mission-viejo',a:'CA'},{n:'Lake Forest',s:'lake-forest-ca',a:'CA'},{n:'Chino',s:'chino',a:'CA'},
  {n:'Chino Hills',s:'chino-hills',a:'CA'},{n:'Norwalk',s:'norwalk-ca',a:'CA'},{n:'Burbank',s:'burbank',a:'CA'},
  {n:'South Gate',s:'south-gate',a:'CA'},{n:'Hawthorne',s:'hawthorne-ca',a:'CA'},{n:'Lakewood',s:'lakewood-ca',a:'CA'},
  {n:'Whittier',s:'whittier',a:'CA'},{n:'Alhambra',s:'alhambra',a:'CA'},{n:'Compton',s:'compton',a:'CA'},
  {n:'El Cajon',s:'el-cajon',a:'CA'},{n:'Vista',s:'vista-ca',a:'CA'},{n:'Carson',s:'carson-ca',a:'CA'},
  {n:'Vacaville',s:'vacaville',a:'CA'},{n:'Napa',s:'napa-ca',a:'CA'},{n:'Chico',s:'chico-ca',a:'CA'},
  {n:'Redding',s:'redding-ca',a:'CA'},{n:'Petaluma',s:'petaluma',a:'CA'},{n:'San Mateo',s:'san-mateo',a:'CA'},
  {n:'Citrus Heights',s:'citrus-heights',a:'CA'},{n:'Daly City',s:'daly-city',a:'CA'},{n:'Union City',s:'union-city-ca',a:'CA'},
  {n:'Milpitas',s:'milpitas',a:'CA'},{n:'Mountain View',s:'mountain-view-ca',a:'CA'},{n:'Livermore',s:'livermore-ca',a:'CA'},
  {n:'Pleasanton',s:'pleasanton',a:'CA'},{n:'San Ramon',s:'san-ramon',a:'CA'},{n:'Walnut Creek',s:'walnut-creek',a:'CA'},
  {n:'Rialto',s:'rialto',a:'CA'},{n:'Upland',s:'upland-ca',a:'CA'},{n:'Colton',s:'colton-ca',a:'CA'},
  {n:'Poway',s:'poway',a:'CA'},{n:'Folsom',s:'folsom-ca',a:'CA'},{n:'Rancho Cordova',s:'rancho-cordova',a:'CA'},
  {n:'Dublin',s:'dublin-ca',a:'CA'},{n:'Pittsburg',s:'pittsburg-ca',a:'CA'},{n:'Rocklin',s:'rocklin-ca',a:'CA'},
  {n:'Yuba City',s:'yuba-city',a:'CA'},{n:'Novato',s:'novato',a:'CA'},{n:'West Sacramento',s:'west-sacramento',a:'CA'},
  {n:'Lodi',s:'lodi-ca',a:'CA'},{n:'Turlock',s:'turlock',a:'CA'},{n:'Merced',s:'merced',a:'CA'},
  {n:'Woodland',s:'woodland-ca',a:'CA'},{n:'Davis',s:'davis-ca',a:'CA'},{n:'Manteca',s:'manteca',a:'CA'},
  {n:'Santee',s:'santee-ca',a:'CA'},{n:'Tustin',s:'tustin',a:'CA'},{n:'Westminster',s:'westminster-ca',a:'CA'},
  {n:'Fountain Valley',s:'fountain-valley',a:'CA'},{n:'La Mesa',s:'la-mesa',a:'CA'},{n:'National City',s:'national-city',a:'CA'},
  {n:'La Puente',s:'la-puente',a:'CA'},{n:'Azusa',s:'azusa',a:'CA'},{n:'Covina',s:'covina-ca',a:'CA'},
  {n:'Menifee',s:'menifee',a:'CA'},{n:'Hemet',s:'hemet',a:'CA'},{n:'Jurupa Valley',s:'jurupa-valley',a:'CA'},
  {n:'Hesperia',s:'hesperia',a:'CA'},{n:'San Leandro',s:'san-leandro',a:'CA'},

  // Texas extra (22)
  {n:'Temple',s:'temple-tx',a:'TX'},{n:'San Angelo',s:'san-angelo',a:'TX'},{n:'Missouri City',s:'missouri-city-tx',a:'TX'},
  {n:'Mansfield',s:'mansfield-tx',a:'TX'},{n:'Rowlett',s:'rowlett-tx',a:'TX'},{n:'Pflugerville',s:'pflugerville',a:'TX'},
  {n:'Georgetown',s:'georgetown-tx',a:'TX'},{n:'Coppell',s:'coppell',a:'TX'},{n:'Euless',s:'euless-tx',a:'TX'},
  {n:'Bedford',s:'bedford-tx',a:'TX'},{n:'Grapevine',s:'grapevine-tx',a:'TX'},{n:'Keller',s:'keller-tx',a:'TX'},
  {n:'Hurst',s:'hurst-tx',a:'TX'},{n:'North Richland Hills',s:'north-richland-hills',a:'TX'},{n:'Burleson',s:'burleson-tx',a:'TX'},
  {n:'Waxahachie',s:'waxahachie',a:'TX'},{n:'Baytown',s:'baytown-tx',a:'TX'},{n:'Prosper',s:'prosper-tx',a:'TX'},
  {n:'Little Elm',s:'little-elm',a:'TX'},{n:'Southlake',s:'southlake-tx',a:'TX'},{n:'Humble',s:'humble-tx',a:'TX'},
  {n:'Abilene',s:'abilene-tx2',a:'TX'},

  // Florida extra (22)
  {n:'Bradenton',s:'bradenton',a:'FL'},{n:'Largo',s:'largo-fl',a:'FL'},{n:'Palm Harbor',s:'palm-harbor',a:'FL'},
  {n:'Pinellas Park',s:'pinellas-park',a:'FL'},{n:'Port Orange',s:'port-orange',a:'FL'},{n:'Sanford',s:'sanford-fl',a:'FL'},
  {n:'Apopka',s:'apopka',a:'FL'},{n:'Spring Hill',s:'spring-hill-fl',a:'FL'},{n:'Homestead',s:'homestead-fl',a:'FL'},
  {n:'Doral',s:'doral-fl',a:'FL'},{n:'North Miami',s:'north-miami',a:'FL'},{n:'Panama City',s:'panama-city-fl',a:'FL'},
  {n:'Pensacola',s:'pensacola',a:'FL'},{n:'Plant City',s:'plant-city',a:'FL'},{n:'Winter Haven',s:'winter-haven',a:'FL'},
  {n:'Wesley Chapel',s:'wesley-chapel',a:'FL'},{n:'Brandon',s:'brandon-fl',a:'FL'},{n:'Riverview',s:'riverview-fl',a:'FL'},
  {n:'Lehigh Acres',s:'lehigh-acres',a:'FL'},{n:'Boynton Beach',s:'boynton-beach',a:'FL'},{n:'Delray Beach',s:'delray-beach',a:'FL'},
  {n:'Ocoee',s:'ocoee-fl',a:'FL'},

  // Ohio extra (12)
  {n:'Kettering',s:'kettering-oh',a:'OH'},{n:'Elyria',s:'elyria',a:'OH'},{n:'Strongsville',s:'strongsville',a:'OH'},
  {n:'Lakewood',s:'lakewood-oh',a:'OH'},{n:'Cuyahoga Falls',s:'cuyahoga-falls',a:'OH'},{n:'Mentor',s:'mentor-oh',a:'OH'},
  {n:'Euclid',s:'euclid-oh',a:'OH'},{n:'Mansfield',s:'mansfield-oh',a:'OH'},{n:'Newark',s:'newark-oh',a:'OH'},
  {n:'Middletown',s:'middletown-oh',a:'OH'},{n:'Medina',s:'medina-oh',a:'OH'},{n:'Lima',s:'lima-oh',a:'OH'},

  // Georgia extra (10)
  {n:'Alpharetta',s:'alpharetta',a:'GA'},{n:'Smyrna',s:'smyrna-ga',a:'GA'},{n:'Marietta',s:'marietta-ga',a:'GA'},
  {n:'Peachtree City',s:'peachtree-city',a:'GA'},{n:'Gainesville',s:'gainesville-ga',a:'GA'},{n:'Valdosta',s:'valdosta',a:'GA'},
  {n:'Rome',s:'rome-ga',a:'GA'},{n:'Kennesaw',s:'kennesaw',a:'GA'},{n:'Lawrenceville',s:'lawrenceville-ga',a:'GA'},
  {n:'Duluth',s:'duluth-ga',a:'GA'},

  // North Carolina extra (10)
  {n:'Jacksonville',s:'jacksonville-nc',a:'NC'},{n:'Greenville',s:'greenville-nc',a:'NC'},{n:'Burlington',s:'burlington-nc',a:'NC'},
  {n:'Rocky Mount',s:'rocky-mount-nc',a:'NC'},{n:'Huntersville',s:'huntersville',a:'NC'},{n:'Apex',s:'apex-nc',a:'NC'},
  {n:'Chapel Hill',s:'chapel-hill-nc',a:'NC'},{n:'Wake Forest',s:'wake-forest-nc',a:'NC'},{n:'Wilson',s:'wilson-nc',a:'NC'},
  {n:'Kannapolis',s:'kannapolis',a:'NC'},

  // Michigan extra (10)
  {n:'Pontiac',s:'pontiac-mi',a:'MI'},{n:'Southfield',s:'southfield',a:'MI'},{n:'Royal Oak',s:'royal-oak',a:'MI'},
  {n:'Taylor',s:'taylor-mi',a:'MI'},{n:'St. Clair Shores',s:'st-clair-shores',a:'MI'},{n:'Farmington Hills',s:'farmington-hills',a:'MI'},
  {n:'Rochester Hills',s:'rochester-hills',a:'MI'},{n:'Midland',s:'midland-mi',a:'MI'},{n:'Bay City',s:'bay-city-mi',a:'MI'},
  {n:'Saginaw',s:'saginaw-mi',a:'MI'},

  // Illinois extra (12)
  {n:'Decatur',s:'decatur-il',a:'IL'},{n:'Galesburg',s:'galesburg',a:'IL'},{n:'Quincy',s:'quincy-il',a:'IL'},
  {n:'Rock Island',s:'rock-island',a:'IL'},{n:'Moline',s:'moline',a:'IL'},{n:'Berwyn',s:'berwyn-il',a:'IL'},
  {n:'Des Plaines',s:'des-plaines',a:'IL'},{n:'Palatine',s:'palatine-il',a:'IL'},{n:'Schaumburg',s:'schaumburg',a:'IL'},
  {n:'Arlington Heights',s:'arlington-heights',a:'IL'},{n:'Skokie',s:'skokie',a:'IL'},{n:'Downers Grove',s:'downers-grove',a:'IL'},

  // Pennsylvania extra (8)
  {n:'Easton',s:'easton-pa',a:'PA'},{n:'Wilkes-Barre',s:'wilkes-barre',a:'PA'},{n:'Norristown',s:'norristown',a:'PA'},
  {n:'Lebanon',s:'lebanon-pa',a:'PA'},{n:'State College',s:'state-college-pa',a:'PA'},{n:'Harrisburg',s:'harrisburg-pa2',a:'PA'},
  {n:'Levittown',s:'levittown-pa',a:'PA'},{n:'Bensalem',s:'bensalem',a:'PA'},

  // Virginia extra (8)
  {n:'Harrisonburg',s:'harrisonburg',a:'VA'},{n:'Charlottesville',s:'charlottesville',a:'VA'},{n:'Lynchburg',s:'lynchburg',a:'VA'},
  {n:'Fredericksburg',s:'fredericksburg-va',a:'VA'},{n:'Manassas',s:'manassas-va',a:'VA'},{n:'Leesburg',s:'leesburg-va',a:'VA'},
  {n:'Blacksburg',s:'blacksburg-va',a:'VA'},{n:'Sterling',s:'sterling-va',a:'VA'},

  // Washington extra (10)
  {n:'Yakima',s:'yakima-wa',a:'WA'},{n:'Bellingham',s:'bellingham-wa',a:'WA'},{n:'Kennewick',s:'kennewick-wa',a:'WA'},
  {n:'Pasco',s:'pasco-wa',a:'WA'},{n:'Richland',s:'richland-wa',a:'WA'},{n:'Marysville',s:'marysville-wa',a:'WA'},
  {n:'Lakewood',s:'lakewood-wa',a:'WA'},{n:'Shoreline',s:'shoreline-wa',a:'WA'},{n:'Redmond',s:'redmond-wa',a:'WA'},
  {n:'Auburn',s:'auburn-wa',a:'WA'},

  // Arizona extra (8)
  {n:'Flagstaff',s:'flagstaff-az',a:'AZ'},{n:'Goodyear',s:'goodyear-az',a:'AZ'},{n:'Buckeye',s:'buckeye-az',a:'AZ'},
  {n:'Prescott',s:'prescott-az',a:'AZ'},{n:'Casa Grande',s:'casa-grande',a:'AZ'},{n:'Lake Havasu City',s:'lake-havasu-city',a:'AZ'},
  {n:'Maricopa',s:'maricopa-az',a:'AZ'},{n:'Queen Creek',s:'queen-creek',a:'AZ'},

  // Tennessee extra (8)
  {n:'Kingsport',s:'kingsport-tn',a:'TN'},{n:'Franklin',s:'franklin-tn',a:'TN'},{n:'Smyrna',s:'smyrna-tn',a:'TN'},
  {n:'Gallatin',s:'gallatin-tn',a:'TN'},{n:'Collierville',s:'collierville',a:'TN'},{n:'Brentwood',s:'brentwood-tn',a:'TN'},
  {n:'Spring Hill',s:'spring-hill-tn',a:'TN'},{n:'Bristol',s:'bristol-tn',a:'TN'},

  // Massachusetts extra (9)
  {n:'Somerville',s:'somerville-ma',a:'MA'},{n:'Framingham',s:'framingham',a:'MA'},{n:'Haverhill',s:'haverhill',a:'MA'},
  {n:'Chicopee',s:'chicopee',a:'MA'},{n:'Methuen',s:'methuen',a:'MA'},{n:'Lawrence',s:'lawrence-ma',a:'MA'},
  {n:'New Bedford',s:'new-bedford',a:'MA'},{n:'Malden',s:'malden-ma',a:'MA'},{n:'Waltham',s:'waltham-ma',a:'MA'},

  // Indiana extra (7)
  {n:'Muncie',s:'muncie',a:'IN'},{n:'Terre Haute',s:'terre-haute',a:'IN'},{n:'Lafayette',s:'lafayette-in',a:'IN'},
  {n:'Mishawaka',s:'mishawaka',a:'IN'},{n:'Anderson',s:'anderson-in',a:'IN'},{n:'Greenwood',s:'greenwood-in',a:'IN'},
  {n:'Gary',s:'gary-in',a:'IN'},

  // Missouri extra (7)
  {n:'St. Charles',s:'st-charles-mo',a:'MO'},{n:'Florissant',s:'florissant',a:'MO'},{n:'Joplin',s:'joplin',a:'MO'},
  {n:'Blue Springs',s:'blue-springs-mo',a:'MO'},{n:'Cape Girardeau',s:'cape-girardeau',a:'MO'},{n:'Jefferson City',s:'jefferson-city-mo',a:'MO'},
  {n:'St. Peters',s:'st-peters-mo',a:'MO'},

  // Minnesota extra (9)
  {n:'Maple Grove',s:'maple-grove',a:'MN'},{n:'Eagan',s:'eagan-mn',a:'MN'},{n:'Eden Prairie',s:'eden-prairie',a:'MN'},
  {n:'Burnsville',s:'burnsville-mn',a:'MN'},{n:'Coon Rapids',s:'coon-rapids',a:'MN'},{n:'Woodbury',s:'woodbury-mn',a:'MN'},
  {n:'Apple Valley',s:'apple-valley-mn',a:'MN'},{n:'Lakeville',s:'lakeville-mn',a:'MN'},{n:'Blaine',s:'blaine-mn',a:'MN'},

  // Colorado extra (7)
  {n:'Boulder',s:'boulder-co',a:'CO'},{n:'Broomfield',s:'broomfield-co',a:'CO'},{n:'Greeley',s:'greeley-co',a:'CO'},
  {n:'Longmont',s:'longmont-co',a:'CO'},{n:'Loveland',s:'loveland-co',a:'CO'},{n:'Parker',s:'parker-co',a:'CO'},
  {n:'Castle Rock',s:'castle-rock-co',a:'CO'},

  // Maryland extra (6)
  {n:'Frederick',s:'frederick-md2',a:'MD'},{n:'College Park',s:'college-park-md',a:'MD'},{n:'Rockville',s:'rockville-md2',a:'MD'},
  {n:'Waldorf',s:'waldorf-md',a:'MD'},{n:'Salisbury',s:'salisbury-md',a:'MD'},{n:'Towson',s:'towson-md',a:'MD'},

  // Wisconsin extra (7)
  {n:'Eau Claire',s:'eau-claire',a:'WI'},{n:'La Crosse',s:'la-crosse',a:'WI'},{n:'Sheboygan',s:'sheboygan',a:'WI'},
  {n:'Janesville',s:'janesville',a:'WI'},{n:'Fond du Lac',s:'fond-du-lac',a:'WI'},{n:'West Allis',s:'west-allis',a:'WI'},
  {n:'Brookfield',s:'brookfield-wi',a:'WI'},

  // Oregon extra (5)
  {n:'Corvallis',s:'corvallis-or',a:'OR'},{n:'Albany',s:'albany-or',a:'OR'},{n:'Grants Pass',s:'grants-pass',a:'OR'},
  {n:'Roseburg',s:'roseburg-or',a:'OR'},{n:'Redmond',s:'redmond-or',a:'OR'},

  // Louisiana extra (5)
  {n:'Alexandria',s:'alexandria-la',a:'LA'},{n:'Slidell',s:'slidell',a:'LA'},{n:'Metairie',s:'metairie',a:'LA'},
  {n:'Houma',s:'houma-la',a:'LA'},{n:'Marrero',s:'marrero-la',a:'LA'},

  // Kentucky extra (5)
  {n:'Richmond',s:'richmond-ky',a:'KY'},{n:'Frankfort',s:'frankfort-ky',a:'KY'},{n:'Florence',s:'florence-ky',a:'KY'},
  {n:'Elizabethtown',s:'elizabethtown-ky',a:'KY'},{n:'Jeffersontown',s:'jeffersontown',a:'KY'},

  // Oklahoma extra (6)
  {n:'Stillwater',s:'stillwater-ok',a:'OK'},{n:'Midwest City',s:'midwest-city',a:'OK'},{n:'Enid',s:'enid-ok',a:'OK'},
  {n:'Muskogee',s:'muskogee',a:'OK'},{n:'Yukon',s:'yukon-ok',a:'OK'},{n:'Bartlesville',s:'bartlesville',a:'OK'},

  // South Carolina extra (6)
  {n:'Spartanburg',s:'spartanburg',a:'SC'},{n:'Summerville',s:'summerville-sc',a:'SC'},{n:'Anderson',s:'anderson-sc',a:'SC'},
  {n:'Florence',s:'florence-sc',a:'SC'},{n:'Myrtle Beach',s:'myrtle-beach',a:'SC'},{n:'Goose Creek',s:'goose-creek',a:'SC'},

  // Iowa extra (6)
  {n:'Ankeny',s:'ankeny',a:'IA'},{n:'Ames',s:'ames-ia',a:'IA'},{n:'Council Bluffs',s:'council-bluffs',a:'IA'},
  {n:'Dubuque',s:'dubuque-ia',a:'IA'},{n:'West Des Moines',s:'west-des-moines',a:'IA'},{n:'Waukee',s:'waukee',a:'IA'},

  // Alabama extra (5)
  {n:'Decatur',s:'decatur-al',a:'AL'},{n:'Auburn',s:'auburn-al',a:'AL'},{n:'Dothan',s:'dothan',a:'AL'},
  {n:'Florence',s:'florence-al',a:'AL'},{n:'Gadsden',s:'gadsden',a:'AL'},

  // Kansas extra (5)
  {n:'Lawrence',s:'lawrence-ks',a:'KS'},{n:'Manhattan',s:'manhattan-ks',a:'KS'},{n:'Salina',s:'salina-ks',a:'KS'},
  {n:'Shawnee',s:'shawnee-ks',a:'KS'},{n:'Leawood',s:'leawood',a:'KS'},

  // Arkansas extra (4)
  {n:'Conway',s:'conway-ar',a:'AR'},{n:'Pine Bluff',s:'pine-bluff',a:'AR'},{n:'Bentonville',s:'bentonville',a:'AR'},
  {n:'Rogers',s:'rogers-ar',a:'AR'},

  // Nebraska extra (4)
  {n:'Kearney',s:'kearney-ne',a:'NE'},{n:'Fremont',s:'fremont-ne',a:'NE'},{n:'Hastings',s:'hastings-ne',a:'NE'},
  {n:'Columbus',s:'columbus-ne',a:'NE'},

  // Utah extra (8)
  {n:'Layton',s:'layton-ut',a:'UT'},{n:'Ogden',s:'ogden-ut',a:'UT'},{n:'Taylorsville',s:'taylorsville-ut',a:'UT'},
  {n:'Murray',s:'murray-ut',a:'UT'},{n:'Lehi',s:'lehi-ut',a:'UT'},{n:'Clearfield',s:'clearfield-ut',a:'UT'},
  {n:'Sandy',s:'sandy-ut',a:'UT'},{n:'Draper',s:'draper-ut',a:'UT'},

  // New Mexico extra (3)
  {n:'Farmington',s:'farmington-nm',a:'NM'},{n:'Clovis',s:'clovis-nm',a:'NM'},{n:'Hobbs',s:'hobbs-nm',a:'NM'},

  // Mississippi extra (4)
  {n:'Tupelo',s:'tupelo-ms',a:'MS'},{n:'Olive Branch',s:'olive-branch',a:'MS'},{n:'Pearl',s:'pearl-ms',a:'MS'},
  {n:'Meridian',s:'meridian-ms2',a:'MS'},

  // Connecticut extra (4)
  {n:'Meriden',s:'meriden-ct',a:'CT'},{n:'West Haven',s:'west-haven-ct',a:'CT'},{n:'Middletown',s:'middletown-ct',a:'CT'},
  {n:'Shelton',s:'shelton-ct',a:'CT'},

  // New Jersey extra (10)
  {n:'Brick',s:'brick-nj',a:'NJ'},{n:'Camden',s:'camden-nj',a:'NJ'},{n:'Clifton',s:'clifton-nj',a:'NJ'},
  {n:'Passaic',s:'passaic-nj',a:'NJ'},{n:'East Orange',s:'east-orange-nj',a:'NJ'},{n:'Bayonne',s:'bayonne-nj',a:'NJ'},
  {n:'Vineland',s:'vineland-nj',a:'NJ'},{n:'Union City',s:'union-city-nj',a:'NJ'},{n:'Parsippany',s:'parsippany',a:'NJ'},
  {n:'Wayne',s:'wayne-nj',a:'NJ'},

  // Idaho extra (3)
  {n:'Coeur d\'Alene',s:'coeur-dalene',a:'ID'},{n:'Twin Falls',s:'twin-falls',a:'ID'},{n:'Meridian',s:'meridian-id2',a:'ID'},

  // Nevada extra (3)
  {n:'Spring Valley',s:'spring-valley-nv',a:'NV'},{n:'Enterprise',s:'enterprise-nv',a:'NV'},{n:'Sunrise Manor',s:'sunrise-manor',a:'NV'},

  // Hawaii extra (3)
  {n:'Kapolei',s:'kapolei',a:'HI'},{n:'Mililani',s:'mililani',a:'HI'},{n:'Kaneohe',s:'kaneohe',a:'HI'},

  // New York extra (15)
  {n:'Troy',s:'troy-ny',a:'NY'},{n:'Niagara Falls',s:'niagara-falls-ny',a:'NY'},{n:'Binghamton',s:'binghamton',a:'NY'},
  {n:'Poughkeepsie',s:'poughkeepsie',a:'NY'},{n:'Newburgh',s:'newburgh-ny',a:'NY'},{n:'Rome',s:'rome-ny',a:'NY'},
  {n:'Ithaca',s:'ithaca-ny',a:'NY'},{n:'Jamestown',s:'jamestown-ny',a:'NY'},{n:'Elmira',s:'elmira-ny',a:'NY'},
  {n:'Middletown',s:'middletown-ny',a:'NY'},{n:'Saratoga Springs',s:'saratoga-springs',a:'NY'},{n:'Watertown',s:'watertown-ny',a:'NY'},
  {n:'Islip',s:'islip-ny',a:'NY'},{n:'Brookhaven',s:'brookhaven-ny',a:'NY'},{n:'Babylon',s:'babylon-ny',a:'NY'},

  // South Dakota extra (3)
  {n:'Brookings',s:'brookings-sd',a:'SD'},{n:'Watertown',s:'watertown-sd',a:'SD'},{n:'Mitchell',s:'mitchell-sd',a:'SD'},

  // North Dakota extra (2)
  {n:'West Fargo',s:'west-fargo',a:'ND'},{n:'Mandan',s:'mandan-nd',a:'ND'},

  // Delaware extra (3)
  {n:'Middletown',s:'middletown-de',a:'DE'},{n:'Smyrna',s:'smyrna-de',a:'DE'},{n:'Milford',s:'milford-de',a:'DE'},

  // Vermont extra (3)
  {n:'Essex',s:'essex-vt',a:'VT'},{n:'Montpelier',s:'montpelier-vt',a:'VT'},{n:'Barre',s:'barre-vt',a:'VT'},

  // Wyoming extra (3)
  {n:'Gillette',s:'gillette-wy',a:'WY'},{n:'Rock Springs',s:'rock-springs',a:'WY'},{n:'Sheridan',s:'sheridan-wy',a:'WY'},

  // West Virginia extra (3)
  {n:'Wheeling',s:'wheeling-wv',a:'WV'},{n:'Fairmont',s:'fairmont-wv',a:'WV'},{n:'Martinsburg',s:'martinsburg-wv',a:'WV'},

  // Alaska extra (3)
  {n:'Sitka',s:'sitka-ak',a:'AK'},{n:'Ketchikan',s:'ketchikan',a:'AK'},{n:'Juneau',s:'juneau-ak2',a:'AK'},

  // Maine extra (3)
  {n:'Augusta',s:'augusta-me',a:'ME'},{n:'Biddeford',s:'biddeford',a:'ME'},{n:'Saco',s:'saco-me',a:'ME'},

  // Montana extra (3)
  {n:'Helena',s:'helena-mt',a:'MT'},{n:'Butte',s:'butte-mt',a:'MT'},{n:'Kalispell',s:'kalispell',a:'MT'},

  // Rhode Island extra (3)
  {n:'Woonsocket',s:'woonsocket',a:'RI'},{n:'East Providence',s:'east-providence',a:'RI'},{n:'North Providence',s:'north-providence',a:'RI'},

  // New Hampshire extra (3)
  {n:'Dover',s:'dover-nh',a:'NH'},{n:'Portsmouth',s:'portsmouth-nh',a:'NH'},{n:'Concord',s:'concord-nh2',a:'NH'},

  // Extra cities for underrepresented states
  // Mississippi more
  {n:'Clinton',s:'clinton-ms',a:'MS'},{n:'Starkville',s:'starkville-ms',a:'MS'},
  // Arkansas more
  {n:'Fayetteville',s:'fayetteville-ar2',a:'AR'},{n:'Fort Smith',s:'fort-smith-ar2',a:'AR'},
  // Tennessee more
  {n:'Murfreesboro',s:'murfreesboro-tn2',a:'TN'},{n:'Cookeville',s:'cookeville-tn',a:'TN'},
  // Georgia more
  {n:'Savannah',s:'savannah-ga2',a:'GA'},{n:'Athens',s:'athens-ga2',a:'GA'},{n:'Roswell',s:'roswell-ga2',a:'GA'},
  // Virginia more
  {n:'Arlington',s:'arlington-va',a:'VA'},{n:'Reston',s:'reston-va',a:'VA'},{n:'Herndon',s:'herndon-va',a:'VA'},
  // North Carolina more
  {n:'Mooresville',s:'mooresville-nc',a:'NC'},{n:'Matthews',s:'matthews-nc',a:'NC'},{n:'Holly Springs',s:'holly-springs-nc',a:'NC'},
  // Colorado more
  {n:'Highlands Ranch',s:'highlands-ranch',a:'CO'},{n:'Centennial',s:'centennial-co2',a:'CO'},
  // Minnesota more
  {n:'Plymouth',s:'plymouth-mn2',a:'MN'},{n:'Maplewood',s:'maplewood-mn',a:'MN'},
  // Wisconsin more
  {n:'Wausau',s:'wausau-wi',a:'WI'},{n:'Oshkosh',s:'oshkosh-wi2',a:'WI'},
  // Maryland more
  {n:'Germantown',s:'germantown-md2',a:'MD'},{n:'Bowie',s:'bowie-md2',a:'MD'},
  // Ohio more
  {n:'Cleveland Heights',s:'cleveland-heights',a:'OH'},{n:'Lorain',s:'lorain-oh2',a:'OH'},
  // Missouri more
  {n:'Independence',s:'independence-mo2',a:'MO'},{n:'Lees Summit',s:'lees-summit-mo2',a:'MO'},
  // Indiana more
  {n:'Carmel',s:'carmel-in2',a:'IN'},{n:'Fishers',s:'fishers-in2',a:'IN'},
  // Pennsylvania more
  {n:'Altoona',s:'altoona-pa2',a:'PA'},{n:'Erie',s:'erie-pa2',a:'PA'},
  // Michigan more
  {n:'Clinton Township',s:'clinton-township',a:'MI'},{n:'Canton Township',s:'canton-township',a:'MI'},
  // Illinois more
  {n:'Naperville',s:'naperville-il2',a:'IL'},{n:'Elgin',s:'elgin-il2',a:'IL'},
  // Texas more
  {n:'Leander',s:'leander-tx',a:'TX'},{n:'Conroe',s:'conroe-tx2',a:'TX'},{n:'Pearland',s:'pearland-tx2',a:'TX'},
  // California more
  {n:'Temecula',s:'temecula-ca2',a:'CA'},{n:'Murrieta',s:'murrieta-ca2',a:'CA'},{n:'Elk Grove',s:'elk-grove-ca2',a:'CA'},
  {n:'Roseville',s:'roseville-ca2',a:'CA'},{n:'Folsom',s:'folsom-ca3',a:'CA'},{n:'Rancho Cordova',s:'rancho-cordova2',a:'CA'},
  // Florida more
  {n:'St. Cloud',s:'st-cloud-fl',a:'FL'},{n:'Tamarac',s:'tamarac-fl',a:'FL'},{n:'Lauderhill',s:'lauderhill',a:'FL'},
  {n:'Palm Beach Gardens',s:'palm-beach-gardens',a:'FL'},{n:'Coral Gables',s:'coral-gables',a:'FL'},
  {n:'Aventura',s:'aventura-fl',a:'FL'},{n:'North Port',s:'north-port-fl',a:'FL'},
  // New York more
  {n:'Huntington',s:'huntington-ny',a:'NY'},{n:'Smithtown',s:'smithtown-ny',a:'NY'},{n:'Southampton',s:'southampton-ny',a:'NY'},
  // Washington more
  {n:'Bellevue',s:'bellevue-wa2',a:'WA'},{n:'Renton',s:'renton-wa2',a:'WA'},{n:'Olympia',s:'olympia-wa',a:'WA'},
  // Arizona more
  {n:'Scottsdale',s:'scottsdale-az2',a:'AZ'},{n:'Chandler',s:'chandler-az2',a:'AZ'},{n:'Gilbert',s:'gilbert-az2',a:'AZ'},
  // Georgia more
  {n:'Stockbridge',s:'stockbridge-ga',a:'GA'},{n:'McDonough',s:'mcdonough-ga',a:'GA'},{n:'Woodstock',s:'woodstock-ga',a:'GA'},
  // South Carolina more
  {n:'Greenville',s:'greenville-sc2',a:'SC'},{n:'Conway',s:'conway-sc',a:'SC'},{n:'Bluffton',s:'bluffton-sc',a:'SC'},
  // Kentucky more
  {n:'Paducah',s:'paducah-ky',a:'KY'},{n:'Bowling Green',s:'bowling-green-ky2',a:'KY'},
  // Alabama more
  {n:'Tuscaloosa',s:'tuscaloosa-al2',a:'AL'},{n:'Hoover',s:'hoover-al2',a:'AL'},
  // Kansas more
  {n:'Olathe',s:'olathe-ks2',a:'KS'},{n:'Overland Park',s:'overland-park-ks2',a:'KS'},
  // Nebraska more
  {n:'Omaha',s:'omaha-ne2',a:'NE'},{n:'Lincoln',s:'lincoln-ne2',a:'NE'},
  // Louisiana more
  {n:'Baton Rouge',s:'baton-rouge-la2',a:'LA'},{n:'New Orleans',s:'new-orleans-la2',a:'LA'},
  // Oklahoma more
  {n:'Tulsa',s:'tulsa-ok2',a:'OK'},{n:'Norman',s:'norman-ok2',a:'OK'},
  // Iowa more
  {n:'Des Moines',s:'des-moines-ia2',a:'IA'},{n:'Cedar Rapids',s:'cedar-rapids-ia2',a:'IA'},
  // Utah more
  {n:'West Valley City',s:'west-valley-city-ut2',a:'UT'},{n:'Provo',s:'provo-ut2',a:'UT'},
  // Nevada more
  {n:'Henderson',s:'henderson-nv2',a:'NV'},{n:'Reno',s:'reno-nv2',a:'NV'},
  // New Mexico more
  {n:'Albuquerque',s:'albuquerque-nm2',a:'NM'},{n:'Las Cruces',s:'las-cruces-nm2',a:'NM'},

  // Additional small cities to reach 1350 target
  // CA final batch
  {n:'Antioch',s:'antioch-ca2',a:'CA'},{n:'Concord',s:'concord-ca2',a:'CA'},{n:'Vallejo',s:'vallejo-ca2',a:'CA'},
  {n:'Richmond',s:'richmond-ca2',a:'CA'},{n:'Fairfield',s:'fairfield-ca2',a:'CA'},{n:'Ventura',s:'ventura-ca2',a:'CA'},
  {n:'Thousand Oaks',s:'thousand-oaks-ca2',a:'CA'},{n:'Simi Valley',s:'simi-valley-ca2',a:'CA'},
  {n:'Victorville',s:'victorville-ca2',a:'CA'},{n:'Berkeley',s:'berkeley-ca2',a:'CA'},
  {n:'Inglewood',s:'inglewood-ca2',a:'CA'},{n:'Downey',s:'downey-ca2',a:'CA'},
  {n:'Costa Mesa',s:'costa-mesa-ca2',a:'CA'},{n:'Oxnard',s:'oxnard-ca2',a:'CA'},
  {n:'Visalia',s:'visalia-ca2',a:'CA'},{n:'Salinas',s:'salinas-ca2',a:'CA'},
  {n:'Escondido',s:'escondido-ca2',a:'CA'},{n:'Sunnyvale',s:'sunnyvale-ca2',a:'CA'},
  {n:'Hayward',s:'hayward-ca2',a:'CA'},{n:'Torrance',s:'torrance-ca2',a:'CA'},
  // TX final batch
  {n:'Grand Prairie',s:'grand-prairie-tx2',a:'TX'},{n:'Garland',s:'garland-tx2',a:'TX'},
  {n:'Irving',s:'irving-tx2',a:'TX'},{n:'Plano',s:'plano-tx2',a:'TX'},
  {n:'McKinney',s:'mckinney-tx2',a:'TX'},{n:'Frisco',s:'frisco-tx2',a:'TX'},
  // FL final batch
  {n:'Jacksonville',s:'jacksonville-fl2',a:'FL'},{n:'Miami',s:'miami-fl2',a:'FL'},
  {n:'Tampa',s:'tampa-fl2',a:'FL'},{n:'Orlando',s:'orlando-fl2',a:'FL'},
  {n:'St. Petersburg',s:'st-petersburg-fl2',a:'FL'},{n:'Fort Lauderdale',s:'fort-lauderdale-fl2',a:'FL'},
  // OH final batch
  {n:'Columbus',s:'columbus-oh2',a:'OH'},{n:'Cleveland',s:'cleveland-oh2',a:'OH'},
  {n:'Cincinnati',s:'cincinnati-oh2',a:'OH'},{n:'Toledo',s:'toledo-oh2',a:'OH'},
  // Remaining states - capital cities and regional hubs
  {n:'Montgomery',s:'montgomery-al3',a:'AL'},{n:'Juneau',s:'juneau-ak3',a:'AK'},
  {n:'Phoenix',s:'phoenix-az2',a:'AZ'},{n:'Little Rock',s:'little-rock-ar3',a:'AR'},
  {n:'Sacramento',s:'sacramento-ca3',a:'CA'},{n:'Denver',s:'denver-co2',a:'CO'},
  {n:'Hartford',s:'hartford-ct2',a:'CT'},{n:'Dover',s:'dover-de2',a:'DE'},
  {n:'Tallahassee',s:'tallahassee-fl3',a:'FL'},{n:'Atlanta',s:'atlanta-ga2',a:'GA'},
  {n:'Honolulu',s:'honolulu-hi2',a:'HI'},{n:'Boise',s:'boise-id2',a:'ID'},
  {n:'Springfield',s:'springfield-il3',a:'IL'},{n:'Indianapolis',s:'indianapolis-in2',a:'IN'},
  {n:'Des Moines',s:'des-moines-ia3',a:'IA'},{n:'Topeka',s:'topeka-ks2',a:'KS'},
  {n:'Frankfort',s:'frankfort-ky2',a:'KY'},{n:'Baton Rouge',s:'baton-rouge-la3',a:'LA'},
  {n:'Augusta',s:'augusta-me2',a:'ME'},{n:'Annapolis',s:'annapolis-md2',a:'MD'},
  {n:'Boston',s:'boston-ma2',a:'MA'},{n:'Lansing',s:'lansing-mi2',a:'MI'},
  {n:'St. Paul',s:'st-paul-mn2',a:'MN'},{n:'Jackson',s:'jackson-ms2',a:'MS'},
  {n:'Jefferson City',s:'jefferson-city-mo2',a:'MO'},{n:'Helena',s:'helena-mt2',a:'MT'},
  {n:'Lincoln',s:'lincoln-ne3',a:'NE'},{n:'Carson City',s:'carson-city-nv2',a:'NV'},
  {n:'Concord',s:'concord-nh3',a:'NH'},{n:'Trenton',s:'trenton-nj2',a:'NJ'},
  {n:'Santa Fe',s:'santa-fe-nm2',a:'NM'},{n:'Albany',s:'albany-ny2',a:'NY'},
  {n:'Raleigh',s:'raleigh-nc2',a:'NC'},{n:'Bismarck',s:'bismarck-nd2',a:'ND'},
  {n:'Columbus',s:'columbus-oh3',a:'OH'},{n:'Oklahoma City',s:'oklahoma-city-ok2',a:'OK'},
  {n:'Salem',s:'salem-or2',a:'OR'},{n:'Harrisburg',s:'harrisburg-pa3',a:'PA'},
  {n:'Providence',s:'providence-ri2',a:'RI'},{n:'Columbia',s:'columbia-sc2',a:'SC'},
  {n:'Pierre',s:'pierre-sd',a:'SD'},{n:'Nashville',s:'nashville-tn2',a:'TN'},
  {n:'Austin',s:'austin-tx2',a:'TX'},{n:'Salt Lake City',s:'salt-lake-city-ut2',a:'UT'},
  {n:'Montpelier',s:'montpelier-vt2',a:'VT'},{n:'Richmond',s:'richmond-va2',a:'VA'},
  {n:'Olympia',s:'olympia-wa2',a:'WA'},{n:'Charleston',s:'charleston-wv2',a:'WV'},
  {n:'Madison',s:'madison-wi2',a:'WI'},{n:'Cheyenne',s:'cheyenne-wy2',a:'WY'},
];

// ─── LEAN CSS ─────────────────────────────────────────────────────
const CSS=`*{box-sizing:border-box;margin:0;padding:0}:root{--bg:#f6f3ee;--card:#fff;--subtle:#eeeae2;--ink:#14181f;--ink2:#2a3140;--ink3:#5b6472;--navy:#1c2333;--teal:#2a9d8f;--line:#e0dbd2;--r:10px}body{font-family:'Inter',system-ui,sans-serif;background:var(--bg);color:var(--ink);font-size:15px;line-height:1.6}a{color:var(--navy);text-decoration:none}.wrap{max-width:1080px;margin:0 auto;padding:0 20px}.nav{background:var(--navy);padding:12px 0;position:sticky;top:0;z-index:99}.ni{display:flex;align-items:center;justify-content:space-between}.nl{color:#fff;font-weight:700;font-size:15px;display:flex;align-items:center;gap:7px}.na{display:flex;gap:20px}.na a{color:rgba(255,255,255,.65);font-size:12.5px}.nc{background:#fff;color:var(--navy);padding:6px 14px;border-radius:7px;font-size:12.5px;font-weight:600}.hero{background:linear-gradient(135deg,var(--navy) 0%,#243050 100%);color:#fff;padding:48px 0 36px}.hb{display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:4px 10px;font-size:11px;color:rgba(255,255,255,.75);margin-bottom:16px;text-transform:uppercase;letter-spacing:.04em}.hero h1{font-size:clamp(22px,3.5vw,36px);font-weight:700;letter-spacing:-.02em;line-height:1.25;margin-bottom:12px;max-width:640px}.hero p{font-size:14.5px;color:rgba(255,255,255,.72);max-width:560px;margin-bottom:22px}.ha{display:flex;gap:10px;flex-wrap:wrap}.bp{background:#fff;color:var(--navy);padding:10px 20px;border-radius:9px;font-weight:600;font-size:13.5px;display:inline-block}.bs{background:rgba(255,255,255,.1);color:#fff;padding:10px 20px;border-radius:9px;font-size:13.5px;border:1px solid rgba(255,255,255,.18);display:inline-block}.pg{padding:36px 0 56px}.g2{display:grid;grid-template-columns:1fr 300px;gap:32px;align-items:start}@media(max-width:760px){.g2{grid-template-columns:1fr}}.sec{margin-bottom:36px}.st{font-size:17px;font-weight:700;color:var(--navy);letter-spacing:-.015em;margin-bottom:14px}.lb{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:18px;margin-bottom:18px}.lb h3{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink3);margin-bottom:14px}.li{display:flex;gap:10px;margin-bottom:10px;font-size:13.5px}.ll{font-weight:600;color:var(--navy);min-width:100px;flex-shrink:0}.lv{color:var(--ink2)}.cl,.dl{list-style:none;margin-bottom:14px}.cl li::before{content:"✓ ";color:var(--teal);font-weight:700}.dl li::before{content:"✗ ";color:#e05252;font-weight:700}.cl li,.dl li{font-size:13.5px;color:var(--ink2);margin-bottom:5px;padding-left:2px}.kw{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.tag{display:inline-block;background:var(--subtle);border-radius:14px;padding:3px 9px;font-size:11.5px;color:var(--ink3)}.sc{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:18px;margin-bottom:16px}.sc h3{font-size:14px;font-weight:700;color:var(--navy);margin-bottom:10px}.sc p{font-size:13px;color:var(--ink2);margin-bottom:14px;line-height:1.6}.sc ul{list-style:none}.sc ul li{font-size:12.5px;color:var(--ink2);padding:5px 0;border-bottom:1px solid var(--line)}.sc ul li:last-child{border-bottom:none}.warn{background:#fff8e1;border:1px solid #f5d060;border-radius:8px;padding:12px 14px;font-size:12.5px;color:#7a5500;margin-bottom:20px;line-height:1.6}.bc{font-size:11.5px;color:rgba(255,255,255,.55);margin-bottom:10px}.bc a{color:rgba(255,255,255,.55)}.bc span{margin:0 5px;color:rgba(255,255,255,.35)}.ft{background:var(--navy);color:rgba(255,255,255,.5);padding:32px 0;margin-top:56px;font-size:12px}.fd{border-top:1px solid rgba(255,255,255,.1);margin-top:24px;padding-top:16px;font-size:11px;color:rgba(255,255,255,.35);line-height:1.6}hr{border:none;border-top:1px solid var(--line);margin:24px 0}`;

// ─── INTERSECTION PAGE TEMPLATE ───────────────────────────────────
function intersectionPage(incident, state, city) {
  const title = `${incident.name} Insurance Claim in ${city.n}, ${state.abbr} | Shielded`;
  const desc = `${city.n} businesses: how to file a ${incident.name.toLowerCase()} insurance claim under ${state.statute}. ${incident.desc} Free claim analysis.`;
  const kwtags = incident.kw.map(k=>`<span class="tag">${k}</span>`).join('');
  const covItems = incident.covered.split(',').map(x=>`<li>${x.trim()}</li>`).join('');
  const deniedItems = incident.denied.split(',').map(x=>`<li>${x.trim()}</li>`).join('');
  const root = '../../../..';

  return `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="https://attorneyaitools.org/claims/${state.slug}/${city.s}/${incident.slug}/">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>${CSS}</style>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage","name":"${incident.name} Insurance Claim in ${city.n}, ${state.abbr}","description":"${desc}","url":"https://attorneyaitools.org/claims/${state.slug}/${city.s}/${incident.slug}/"}</script>
</head><body>
<nav class="nav"><div class="wrap ni">
<a class="nl" href="${root}/index.html"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L4 5.5V11C4 15.5 7.5 19.7 12 21C16.5 19.7 20 15.5 20 11V5.5L12 2Z" stroke="#fff" stroke-width="1.7" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke="#7ecdc8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>Shielded</a>
<div class="na"><a href="${root}/claims/index.html">Claims</a><a href="${root}/app.html">App</a></div>
<a class="nc" href="${root}/app.html">Analyze My Claim →</a>
</div></nav>

<div class="hero"><div class="wrap">
<div class="bc"><a href="${root}/claims/index.html">Claims</a><span>›</span><a href="../../index.html">${state.name}</a><span>›</span><a href="../index.html">${city.n}</a><span>›</span>${incident.name}</div>
<div class="hb">${incident.icon} ${incident.cat} · ${state.abbr}</div>
<h1>${incident.name} Insurance Claim in ${city.n}, ${state.abbr}</h1>
<p>${incident.desc} Under ${state.statute}, ${city.n} businesses have <strong>${state.sol} year${state.sol>1?'s':''}</strong> to pursue underpaid claims. ${state.note}</p>
<div class="ha">
<a class="bp" href="${root}/app.html">Analyze My ${city.n} Claim →</a>
<a class="bs" href="../../index.html">All ${state.abbr} Claims</a>
</div>
</div></div>

<div class="pg"><div class="wrap"><div class="g2">
<div>
<div class="warn">⚠ <strong>Not legal advice.</strong> Informational only. Consult a licensed ${state.name} attorney for your situation.</div>

<div class="sec">
<div class="lb">
<h3>${state.name} Law · ${incident.name}</h3>
<div class="li"><span class="ll">Statute</span><span class="lv">${state.statute}</span></div>
<div class="li"><span class="ll">Time Limit</span><span class="lv">${state.sol} year${state.sol>1?'s':''} from date of loss</span></div>
<div class="li"><span class="ll">City</span><span class="lv">${city.n}, ${state.name}</span></div>
<div class="li"><span class="ll">Key Note</span><span class="lv">${state.note}</span></div>
</div>
</div>

<hr>
<div class="sec">
<div class="st">What's Typically Covered</div>
<ul class="cl">${covItems}</ul>
<div class="st">What Insurers Commonly Deny</div>
<ul class="dl">${deniedItems}</ul>
</div>

<hr>
<div class="sec">
<div class="st">Search Keywords for This Claim Type</div>
<div class="kw">${kwtags}
<span class="tag">${incident.name.toLowerCase()} insurance claim ${city.n.toLowerCase()}</span>
<span class="tag">${incident.name.toLowerCase()} insurance ${state.name.toLowerCase()}</span>
<span class="tag">${incident.name.toLowerCase()} claim ${city.n.toLowerCase()} ${state.abbr.toLowerCase()}</span>
</div>
</div>
</div>

<div>
<div class="sc">
<h3>Free Claim Analysis</h3>
<p>Upload your ${state.name} commercial policy. Get an instant breakdown citing your exact policy sections.</p>
<a class="bp" href="${root}/app.html" style="display:block;text-align:center">Analyze Free →</a>
</div>
<div class="sc">
<h3>${city.n} Claim Timeline</h3>
<ul>
<li>Report claim promptly</li>
<li>Submit proof of loss per policy</li>
<li>File suit within ${state.sol} year${state.sol>1?'s':''}</li>
<li>Bad faith: <a href="../../index.html">${state.statute}</a></li>
</ul>
</div>
<div class="sc">
<h3>Related ${city.n} Claims</h3>
<ul>
<li><a href="../index.html">All ${city.n} incidents</a></li>
<li><a href="../../index.html">All ${state.name} claims</a></li>
<li><a href="${root}/claims/index.html">All US claims</a></li>
</ul>
</div>
</div>
</div></div></div>

<footer class="ft"><div class="wrap">
<div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px">
<span style="color:#fff;font-weight:600">Shielded</span>
<span>© 2026 Shielded, Inc. · Knowledge sharing · Not legal advice</span>
</div>
<div class="fd">Shielded is an informational tool, not a law firm. Nothing on this platform constitutes legal advice or creates an attorney–client relationship. All content is for educational purposes only. Consult a licensed attorney in your state.</div>
</div></footer>
</body></html>`;
}

// ─── ALSO UPDATE CITY INDEX TO LINK INCIDENTS ─────────────────────
function cityIncidentHub(city, state) {
  const cards = INCIDENTS.map(i =>
    `<a href="${i.slug}/index.html" style="display:block;background:#fff;border:1px solid #e0dbd2;border-radius:10px;padding:14px;margin-bottom:8px;font-size:13.5px;color:#2a3140;">
      <span style="font-size:18px;margin-right:8px">${i.icon}</span>
      <strong style="color:#1c2333">${i.name}</strong>
      <span style="color:#8a9097;font-size:12px;display:block;margin-top:3px;padding-left:26px">${i.cat}</span>
    </a>`
  ).join('');

  return `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Insurance Claims for ${city.n}, ${state.abbr} Businesses — All Incident Types | Shielded</title>
<meta name="description" content="${city.n} business insurance claims: all 106 incident types covered. ${state.statute} applies. ${state.sol}-year statute of limitations. Free claim analysis.">
<link rel="canonical" href="https://attorneyaitools.org/claims/${state.slug}/${city.s}/">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>${CSS}</style>
</head><body>
<nav class="nav"><div class="wrap ni">
<a class="nl" href="../../index.html"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L4 5.5V11C4 15.5 7.5 19.7 12 21C16.5 19.7 20 15.5 20 11V5.5L12 2Z" stroke="#fff" stroke-width="1.7" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke="#7ecdc8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>Shielded</a>
<div class="na"><a href="../../claims/index.html">Claims</a><a href="../../app.html">App</a></div>
<a class="nc" href="../../app.html">Analyze →</a>
</div></nav>
<div class="hero"><div class="wrap">
<div class="bc"><a href="../../claims/index.html">Claims</a><span>›</span><a href="../index.html">${state.name}</a><span>›</span>${city.n}</div>
<div class="hb">${city.n}, ${state.abbr}</div>
<h1>Insurance Claims for ${city.n} Businesses</h1>
<p>${state.statute} applies. You have <strong>${state.sol} year${state.sol>1?'s':''}</strong> to pursue underpaid claims. ${state.note}</p>
<div class="ha"><a class="bp" href="../../app.html">Analyze My Claim Free →</a></div>
</div></div>
<div class="pg"><div class="wrap">
<div class="warn">⚠ Not legal advice. Consult a licensed ${state.name} attorney.</div>
<div class="st">All 106 Incident Types — ${city.n}, ${state.abbr}</div>
<p style="font-size:13.5px;color:#5b6472;margin-bottom:20px">Select the incident that happened to your business.</p>
${cards}
</div></div>
<footer class="ft"><div class="wrap">
<div style="display:flex;justify-content:space-between"><span style="color:#fff;font-weight:600">Shielded</span><span>© 2026 Shielded, Inc. · Not legal advice</span></div>
<div class="fd">Shielded is an informational tool, not a law firm. Nothing constitutes legal advice.</div>
</div></footer>
</body></html>`;
}

// ─── GENERATE ────────────────────────────────────────────────────
function ensure(d) { mkdirSync(d,{recursive:true}); }
function write(p,h) { writeFileSync(p,h,'utf8'); }

console.log('\n🛡  Shielded v2 — Intersection Page Generator\n');

let count = 0;
const t0 = Date.now();

for (const city of CITIES) {
  const state = STATES.find(s=>s.abbr===city.a);
  if (!state) { console.warn('⚠ Unknown state:', city.a); continue; }

  // City hub page (updated with 106 incident links)
  const cityDir = join(BASE, state.slug, city.s);
  ensure(cityDir);
  write(join(cityDir,'index.html'), cityIncidentHub(city, state));

  // 106 intersection pages per city
  for (const incident of INCIDENTS) {
    const dir = join(cityDir, incident.slug);
    ensure(dir);
    write(join(dir,'index.html'), intersectionPage(incident, state, city));
    count++;
    if (count % 5000 === 0) {
      const elapsed = ((Date.now()-t0)/1000).toFixed(1);
      console.log(`  ${count.toLocaleString()} pages... (${elapsed}s)`);
    }
  }
}

const elapsed = ((Date.now()-t0)/1000).toFixed(1);
const total = count + CITIES.length;
console.log(`\n✅ Done in ${elapsed}s`);
console.log(`   ${CITIES.length.toLocaleString()} city hub pages`);
console.log(`   ${count.toLocaleString()} intersection pages (${CITIES.length} cities × ${INCIDENTS.length} incidents)`);
console.log(`   ${total.toLocaleString()} new pages total\n`);
console.log('Add more cities to CITIES[] to scale further.\n');

// ─── GENERATE XML SITEMAP ─────────────────────────────────────────
console.log('📋 Generating sitemap...');
const BASE_URL = 'https://attorneyaitools.org';
const today = new Date().toISOString().split('T')[0];

let urls = [`${BASE_URL}/claims/`];

// State pages
for (const s of STATES) urls.push(`${BASE_URL}/claims/${s.slug}/`);

// City hubs + intersection pages
for (const city of CITIES) {
  const state = STATES.find(s=>s.abbr===city.a);
  if (!state) continue;
  urls.push(`${BASE_URL}/claims/${state.slug}/${city.s}/`);
  for (const inc of INCIDENTS) {
    urls.push(`${BASE_URL}/claims/${state.slug}/${city.s}/${inc.slug}/`);
  }
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u=>`  <url>
    <loc>${u}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${u===`${BASE_URL}/claims/`?'1.0':u.split('/').length<=5?'0.8':'0.6'}</priority>
  </url>`).join('\n')}
</urlset>`;

write(join(__dirname,'claims-sitemap.xml'), sitemap);
console.log(`✅ Sitemap: claims-sitemap.xml (${urls.length.toLocaleString()} URLs)\n`);
