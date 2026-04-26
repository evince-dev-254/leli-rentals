// ============================================================
// lib/seo-pages-data.ts
// Master data file for all 16,808 programmatic SEO pages
// leli.rentals — GuruCrafts
// ============================================================

export type IntentType = "renter" | "owner" | "competitor"

export interface SeoCity {
  name: string
  slug: string
  country: string
  region: string
  blurb: string
}

export interface SeoKeyword {
  slug: string
  label: string
  intent: IntentType
}

export interface SeoCategoryData {
  id: string
  name: string
  renterKeywords: SeoKeyword[]
  ownerKeywords: SeoKeyword[]
  competitorKeywords: SeoKeyword[]
  blurbs: {
    renter: string
    owner: string
    competitor: string
  }
  images: {
    renter: string
    owner: string
  }
  outlinks: SeoOutlink[]
}

export interface SeoOutlink {
  anchor: string
  url: string
}

export interface SeoPage {
  slug: string
  intent: IntentType
  categoryId: string
  city?: SeoCity
  keyword: SeoKeyword
}

// ─── SUPABASE IMAGE BASE URL ──────────────────────────────────────────────────
const IMG = "https://tdtjevpnqrwqcjnuywrn.supabase.co/storage/v1/object/public/seo-images"

// ─── 100 GLOBAL CITIES ───────────────────────────────────────────────────────
export const seoCities: SeoCity[] = [
  // North America — USA
  { name: "New York", slug: "new-york", country: "USA", region: "North America", blurb: "New York City is one of the world's most dynamic rental markets, driven by millions of tourists, business travellers, film productions, and a thriving gig economy. The city's dense population, high cost of ownership, and fast-paced lifestyle make peer-to-peer rental the preferred choice for everything from vehicles and electronics to fashion and professional spaces. Whether you are a renter looking for what you need or an owner looking to monetise idle assets, New York's enormous and diverse market makes it one of the highest-demand cities on the Leli Rentals platform." },
  { name: "Los Angeles", slug: "los-angeles", country: "USA", region: "North America", blurb: "Los Angeles is a global hub for entertainment, content creation, fashion, and technology — making it one of the most active peer-to-peer rental cities in the world. From camera gear and studio spaces to luxury vehicles and designer fashion, LA's creative economy drives constant demand for rental access over ownership. The city's sprawling geography, car culture, and year-round outdoor lifestyle create diverse rental opportunities across every category on Leli Rentals, from sports equipment and fitness gear to vehicles, photography equipment, and event entertainment." },
  { name: "Chicago", slug: "chicago", country: "USA", region: "North America", blurb: "Chicago's blend of corporate headquarters, cultural institutions, tourism, and a large student population creates consistent year-round demand across every rental category. The city's extreme seasonal weather drives strong demand for fitness equipment, tools, and vehicles in summer months, while its thriving events scene generates constant need for entertainment gear, business spaces, and fashion rentals. Chicago renters and owners alike benefit from Leli Rentals' peer-to-peer marketplace, which connects the city's diverse communities with affordable, flexible rental access to the items and spaces they need." },
  { name: "Houston", slug: "houston", country: "USA", region: "North America", blurb: "Houston is one of America's largest and fastest-growing cities, with a booming energy sector, significant international population, and a sprawling metropolitan area that drives strong vehicle and equipment rental demand. The city's active construction industry creates consistent need for tools and heavy machinery, while its diverse cultural communities and large event scene generate demand for entertainment gear, fashion, and business spaces. Houston's warm climate and outdoor lifestyle also fuel demand for sports and fitness equipment rentals throughout the year on Leli Rentals." },
  { name: "Miami", slug: "miami", country: "USA", region: "North America", blurb: "Miami's unique position as a global tourism destination, luxury lifestyle hub, and gateway to Latin America makes it one of the most vibrant rental markets in North America. The city attracts millions of visitors annually who need vehicles, water sports equipment, photography gear, and fashion for events and social occasions. Miami's thriving events industry, luxury real estate scene, and year-round beach culture create exceptional demand across living spaces, vehicles, fashion, entertainment, and fitness equipment categories — making it one of the highest-traffic cities on the Leli Rentals platform." },
  { name: "Las Vegas", slug: "las-vegas", country: "USA", region: "North America", blurb: "Las Vegas hosts more events, conventions, and entertainment productions per square mile than almost any other city on earth, creating extraordinary demand for entertainment equipment, photography gear, business spaces, fashion, and vehicles. With over 40 million visitors annually, the city's rental market never sleeps — content creators need camera gear, event organisers need sound systems and lighting, visitors need vehicles, and performers need fashion and accessories. Las Vegas represents one of the highest-demand entertainment and event equipment rental markets on the entire Leli Rentals platform." },
  { name: "Orlando", slug: "orlando", country: "USA", region: "North America", blurb: "Orlando is one of America's top family tourism destinations, welcoming tens of millions of visitors annually to its world-famous theme parks, resorts, and entertainment complexes. This creates exceptional demand for baby and kids gear, vehicles, living spaces, and entertainment equipment from travelling families who prefer renting locally over travelling with bulky equipment. Orlando's large convention centre and growing tech sector also drive consistent demand for business spaces and electronics rentals, making it a diverse and active market across multiple categories on Leli Rentals." },
  { name: "Dallas", slug: "dallas", country: "USA", region: "North America", blurb: "Dallas is one of America's fastest-growing metropolitan areas, with a booming business community, significant oil and energy sector presence, and a thriving arts and entertainment scene. The city's corporate culture drives strong demand for business spaces, electronics, and vehicle rentals, while its active social calendar and large event venues create consistent need for entertainment equipment, fashion, and photography gear. Dallas's sprawling suburbs and construction activity also generate reliable demand for tools, equipment, and utility space rentals across the Leli Rentals marketplace." },
  { name: "San Francisco", slug: "san-francisco", country: "USA", region: "North America", blurb: "San Francisco's technology-driven economy, high cost of living, and environmentally conscious culture make it one of the most naturally aligned cities for the peer-to-peer rental economy. Tech professionals here embrace sharing models for everything from electric vehicles and electronics to office spaces and camera gear. The city's startup ecosystem creates constant demand for flexible business spaces, while its creative community drives photography and electronics rental activity. San Francisco's compact geography and premium real estate prices make utility space and living space rentals particularly valuable on the Leli Rentals platform." },
  { name: "Atlanta", slug: "atlanta", country: "USA", region: "North America", blurb: "Atlanta has emerged as one of America's leading cities for film and television production, music, technology, and business — creating diverse and growing demand across multiple rental categories. The city's booming film industry drives significant photography and electronics rental activity, while its major airport hub status and large corporate community fuel vehicle and business space demand. Atlanta's vibrant events and entertainment scene generates consistent need for party equipment, fashion rentals, and professional spaces, making it a highly active and growing market on the Leli Rentals platform." },
  { name: "Seattle", slug: "seattle", country: "USA", region: "North America", blurb: "Seattle's outdoor lifestyle, technology sector, and progressive sharing economy culture make it an excellent market for peer-to-peer rental across multiple categories. The city's proximity to mountains, water, and trails creates strong demand for outdoor sports and fitness equipment, while its large tech community drives electronics and business space rental activity. Seattle's active creative scene generates photography and entertainment equipment demand, and its high cost of living and limited parking availability make vehicle and utility space rentals particularly popular on the Leli Rentals platform." },
  { name: "Boston", slug: "boston", country: "USA", region: "North America", blurb: "Boston's exceptional concentration of universities, hospitals, technology companies, and financial institutions creates a diverse and educated rental market with strong year-round demand. The city's large student and academic population drives electronics, photography, and sports equipment rentals, while its corporate community fuels business space and vehicle demand. Boston's thriving events calendar, historic tourism, and active social scene generate consistent need for fashion, entertainment equipment, and living space rentals. The city's compact, walkable layout and high property values make utility space and storage rentals especially sought after on Leli Rentals." },
  { name: "Denver", slug: "denver", country: "USA", region: "North America", blurb: "Denver's outdoor lifestyle reputation, proximity to world-class skiing and hiking, and rapidly growing tech sector make it one of the most dynamic rental markets in the American West. Demand for outdoor sports and fitness equipment is exceptionally high year-round, with ski gear, mountain bikes, camping equipment, and water sports gear among the most sought-after rental categories. Denver's growing startup ecosystem and millennial-heavy population also drive electronics, photography, vehicle, and business space rentals, making it a vibrant and expanding market on the Leli Rentals platform." },
  { name: "Phoenix", slug: "phoenix", country: "USA", region: "North America", blurb: "Phoenix is one of America's fastest-growing cities, with a booming real estate market, large retiree population, and thriving tourism industry that create diverse rental demand across multiple categories. The city's warm climate and active outdoor lifestyle generate consistent fitness and sports equipment rental activity, while its large construction sector drives strong tools and equipment demand. Phoenix's significant tourism and snowbird population creates seasonal peaks in living space, vehicle, and baby gear rentals, making it an active and growing market across the Leli Rentals platform throughout the year." },
  { name: "Nashville", slug: "nashville", country: "USA", region: "North America", blurb: "Nashville's transformation into one of America's premier entertainment, music, and events cities has created extraordinary demand for rental across multiple categories. The city hosts thousands of concerts, bachelorette parties, corporate events, and festivals annually, generating consistent need for entertainment equipment, photography gear, fashion, and vehicles. Nashville's booming tourism industry also drives strong living space and vehicle rental demand from visitors who want authentic local experiences. The city's growing creative and tech community further fuels electronics and business space rentals, making Nashville one of the most exciting growing markets on the Leli Rentals platform." },
  { name: "New Orleans", slug: "new-orleans", country: "USA", region: "North America", blurb: "New Orleans is one of America's most culturally rich and event-driven cities, famous for Mardi Gras, Jazz Fest, and a year-round celebration culture that creates exceptional demand for entertainment equipment, fashion, photography gear, and vehicles. The city's massive tourism industry drives living space and vehicle rental demand from millions of annual visitors, while its vibrant creative and culinary scene generates consistent photography and electronics rental activity. New Orleans' unique event culture and festival calendar make entertainment and fashion rental categories particularly strong on the Leli Rentals platform throughout the year." },
  { name: "Austin", slug: "austin", country: "USA", region: "North America", blurb: "Austin has established itself as America's technology and creative capital, hosting SXSW, Formula 1, and a thriving startup ecosystem that drives demand across virtually every rental category. The city's enormous festival calendar creates peak demand for entertainment equipment, photography gear, fashion, and vehicles, while its growing tech community fuels electronics and business space rentals year-round. Austin's outdoor lifestyle and warm climate generate consistent fitness and sports equipment demand, and its rapidly rising property values make utility space and living space rentals increasingly valuable on the Leli Rentals platform." },
  { name: "Portland", slug: "portland", country: "USA", region: "North America", blurb: "Portland's progressive culture, strong environmental values, and thriving creative economy make it one of the most naturally suited cities for peer-to-peer rental. The city's outdoor lifestyle drives cycling, camping, and water sports equipment rentals, while its large creative community generates photography, electronics, and business space demand. Portland's commitment to sustainability and access over ownership aligns perfectly with the peer-to-peer rental model, making it a culturally engaged and growing market across fashion, tools, entertainment, and living space rental categories on the Leli Rentals platform." },
  { name: "Tampa", slug: "tampa", country: "USA", region: "North America", blurb: "Tampa's coastal location, year-round sunshine, and growing status as a business and technology hub create diverse rental demand across multiple categories. The city's beach culture and outdoor lifestyle drive strong water sports and fitness equipment rental activity, while its expanding corporate community fuels business space, vehicle, and electronics demand. Tampa's active events and social scene generate consistent entertainment equipment and fashion rental demand, and its growing tourism industry drives living space and vehicle rentals from visitors seeking affordable alternatives to traditional accommodation and car hire options." },
  { name: "Washington DC", slug: "washington-dc", country: "USA", region: "North America", blurb: "Washington DC's unique combination of government institutions, international embassies, corporate headquarters, and tourism creates a distinctive and highly active rental market. The city's large professional and diplomatic community drives business space, vehicle, and electronics rental demand, while its significant tourism industry generates living space and vehicle rental activity. DC's vibrant social and events calendar creates consistent need for fashion and entertainment equipment rentals, and its high cost of living and limited parking availability make utility space and storage rentals particularly in-demand on the Leli Rentals platform." },
  { name: "Minneapolis", slug: "minneapolis", country: "USA", region: "North America", blurb: "Minneapolis combines a strong corporate economy, world-class arts scene, and passionate outdoor culture to create a diverse and active rental market. The city's major corporate headquarters and growing tech sector drive business space and electronics rental demand, while its famous outdoor lifestyle generates strong fitness, cycling, and winter sports equipment activity. Minneapolis hosts major music, arts, and cultural events year-round that create consistent entertainment equipment and photography rental demand, making it a well-rounded and growing market across multiple categories on the Leli Rentals platform." },
  { name: "Charlotte", slug: "charlotte", country: "USA", region: "North America", blurb: "Charlotte has emerged as one of America's premier banking and financial services hubs, with a growing technology sector and thriving sports culture that create diverse rental demand. The city's corporate community drives strong business space, vehicle, and electronics rental activity, while its passionate sports fan base and major event venues generate entertainment equipment and photography gear demand. Charlotte's outdoor lifestyle and growing young professional population fuel fitness and sports equipment rentals, and its rapidly expanding population and construction activity create consistent tools and equipment demand on the Leli Rentals platform." },
  { name: "Salt Lake City", slug: "salt-lake-city", country: "USA", region: "North America", blurb: "Salt Lake City's proximity to world-renowned ski resorts and outdoor recreation areas makes it one of America's premier markets for sports and outdoor equipment rentals. Demand for ski gear, snowboards, mountain bikes, camping equipment, and water sports gear is exceptionally high year-round, driven by both local enthusiasts and the millions of visitors who come to experience Utah's natural landscapes. Salt Lake City's growing technology sector and entrepreneurial culture also fuel electronics, photography, and business space rental demand on the Leli Rentals platform." },
  { name: "Honolulu", slug: "honolulu", country: "USA", region: "North America", blurb: "Honolulu's position as America's premier Pacific island tourism destination creates extraordinary and consistent demand for rental across multiple categories. Millions of annual visitors need water sports equipment, vehicles, photography gear, and baby gear without the cost and logistics of transporting items from home. The city's luxury tourism market also drives demand for high-end fashion, living spaces, and vehicles from discerning travellers seeking premium rental options. Honolulu's year-round warm climate and outdoor culture make fitness, water sports, and adventure equipment among the highest-demand rental categories on the Leli Rentals platform." },
  // North America — Canada
  { name: "Toronto", slug: "toronto", country: "Canada", region: "North America", blurb: "Toronto is Canada's largest city and a global hub for finance, technology, film, and fashion — creating one of the most diverse and active rental markets in North America. The city's large immigrant population, major film industry, and vibrant creative scene drive consistent demand across photography, electronics, fashion, and business space categories. Toronto's high cost of living and property prices make peer-to-peer rental particularly appealing for vehicles, storage, and living spaces. With millions of residents and significant tourism, Toronto represents one of the highest-demand and most diverse rental markets on the Leli Rentals platform." },
  { name: "Vancouver", slug: "vancouver", country: "Canada", region: "North America", blurb: "Vancouver's stunning natural setting, film industry, and outdoor lifestyle culture create a uniquely active rental market spanning both urban professional and outdoor adventure categories. The city's film and television production industry drives significant photography, electronics, and vehicle rental demand, while its proximity to mountains and water generates exceptional outdoor sports equipment activity. Vancouver's high property values and cost of living make peer-to-peer utility space and vehicle rentals particularly valuable, and its progressive sharing economy culture makes it one of the most naturally engaged markets on the Leli Rentals platform." },
  { name: "Montreal", slug: "montreal", country: "Canada", region: "North America", blurb: "Montreal's rich cultural heritage, world-class festivals, and thriving arts and technology scene make it one of Canada's most vibrant rental markets. The city hosts some of the world's most famous festivals including Jazz Fest and Just For Laughs, creating exceptional peak demand for entertainment equipment, photography gear, fashion, and vehicles. Montreal's large student population and growing tech sector drive electronics, business space, and sports equipment rentals, while its affordable living relative to other major cities makes it an accessible and growing market across all categories on the Leli Rentals platform." },
  { name: "Calgary", slug: "calgary", country: "Canada", region: "North America", blurb: "Calgary's proximity to the Canadian Rockies, strong energy sector economy, and growing technology industry create a distinctive and active rental market. Demand for outdoor sports and fitness equipment is exceptionally high, driven by world-class skiing, hiking, cycling, and camping accessible from the city. Calgary's corporate energy community drives business space, vehicle, and electronics rental demand, while its major events including the Calgary Stampede generate peak entertainment equipment, fashion, and photography gear activity. It is a growing and well-rounded market across multiple categories on the Leli Rentals platform." },
  { name: "Ottawa", slug: "ottawa", country: "Canada", region: "North America", blurb: "Ottawa's unique character as Canada's capital city, combined with a large government workforce, significant technology sector, and diverse cultural scene, creates a stable and active rental market. The city's government and corporate community drive business space, electronics, and vehicle rental demand, while its major museums, festivals, and events generate photography and entertainment equipment activity. Ottawa's outdoor lifestyle and proximity to Gatineau Park create consistent fitness and sports equipment demand, and its family-friendly character makes baby and kids gear rentals particularly active on the Leli Rentals platform." },
  { name: "Edmonton", slug: "edmonton", country: "Canada", region: "North America", blurb: "Edmonton is Canada's northernmost major city and the gateway to the country's oil sands — combining a strong energy sector economy, vibrant arts scene, and a growing technology industry that create an active and diverse rental market. The city's energy sector drives strong vehicle, equipment, and tools rental demand, while its world-famous West Edmonton Mall and major events including the Edmonton Folk Music Festival generate entertainment, fashion, and photography rental activity. Edmonton's outdoor lifestyle and cold climate create seasonal peaks in sports equipment and winter gear rentals, and its growing startup and technology community fuels electronics and business space rentals across the Leli Rentals platform." },
  // Europe — UK & Ireland
  { name: "London", slug: "london", country: "UK", region: "Europe", blurb: "London is one of the world's greatest cities for peer-to-peer rental, combining extraordinary density, global tourism, a thriving creative economy, and one of the world's most dynamic business environments. The city's high cost of living, limited storage space, and car ownership challenges make peer-to-peer rental the logical choice for vehicles, utility spaces, and equipment. London's fashion industry, film productions, creative agencies, and startup ecosystem drive consistent demand across photography, electronics, fashion, business spaces, and entertainment categories, making it consistently one of the highest-volume rental markets on the entire Leli Rentals platform." },
  { name: "Manchester", slug: "manchester", country: "UK", region: "Europe", blurb: "Manchester's transformation into a global centre for music, sport, technology, and creative industries has created one of the UK's most active and diverse rental markets. The city's world-famous football culture, thriving music scene, and major event venues drive consistent entertainment equipment, photography, and fashion rental demand. Manchester's growing technology and media sector fuels electronics and business space rentals, while its large student population creates active demand across vehicles, sports equipment, and budget-friendly rental categories. It is a vibrant and rapidly growing market across multiple categories on the Leli Rentals platform." },
  { name: "Birmingham", slug: "birmingham", country: "UK", region: "Europe", blurb: "Birmingham is the UK's second city and one of its most culturally diverse, with a booming manufacturing sector, growing technology industry, and rich multicultural event scene that creates active rental demand. The city's large events calendar including major festivals, sporting events, and cultural celebrations generates consistent entertainment equipment, fashion, and photography rental activity. Birmingham's significant construction and manufacturing presence drives strong tools and equipment demand, while its growing young professional population fuels vehicle, electronics, and business space rentals across the Leli Rentals platform." },
  { name: "Edinburgh", slug: "edinburgh", country: "UK", region: "Europe", blurb: "Edinburgh is one of the world's most visited cities, welcoming millions of tourists annually for its historic attractions, whisky culture, and the world's largest arts festival — the Edinburgh Festival Fringe. This extraordinary tourism concentration creates peak demand for living spaces, vehicles, photography gear, fashion, and entertainment equipment during festival season, with consistent year-round rental activity driven by the city's university population, financial services sector, and thriving creative scene. Edinburgh is one of the most culturally engaged and consistently active markets on the Leli Rentals platform." },
  { name: "Glasgow", slug: "glasgow", country: "UK", region: "Europe", blurb: "Glasgow's reputation as one of Europe's great music cities, combined with a thriving design industry, major university presence, and regenerated waterfront district, creates an active and growing rental market. The city's music and events scene drives strong entertainment equipment, photography, and fashion rental demand, while its universities and creative agencies fuel electronics and business space activity. Glasgow's outdoor lifestyle and proximity to the Scottish Highlands generate sports and fitness equipment rentals, and its progressive sharing economy culture makes it an engaged and growing market across multiple categories on Leli Rentals." },
  { name: "Dublin", slug: "dublin", country: "Ireland", region: "Europe", blurb: "Dublin's status as Europe's technology capital — home to the European headquarters of Google, Meta, Apple, and countless tech giants — creates exceptional demand for electronics, business spaces, and professional equipment rentals. The city's large young professional and international population drives fashion, vehicle, and living space rental activity, while its thriving pub culture, major festivals, and social scene generate consistent entertainment equipment and photography demand. Dublin's high cost of living and rapidly rising property values make peer-to-peer rental particularly appealing, and it represents one of the most economically active markets on the Leli Rentals platform." },
  // Europe — Western & Southern
  { name: "Paris", slug: "paris", country: "France", region: "Europe", blurb: "Paris is the world's fashion, art, and romance capital — and one of the most visited cities on earth, creating extraordinary and diverse rental demand across virtually every category. The city's global fashion industry makes it one of the highest-demand markets for fashion and accessories rentals, while its massive tourism industry drives living space and vehicle rental activity from millions of annual visitors. Paris's thriving creative, photography, and film sectors generate consistent photography and electronics rental demand, and its world-class events and entertainment scene creates strong entertainment equipment activity. Paris is among the most active and prestigious markets on the entire Leli Rentals platform." },
  { name: "Berlin", slug: "berlin", country: "Germany", region: "Europe", blurb: "Berlin's status as Europe's creative capital, combined with its thriving startup ecosystem, world-famous club culture, and massive arts scene, creates one of Europe's most dynamic rental markets. The city's creative and tech community drives photography, electronics, and business space rental demand, while its legendary nightlife and events scene generates exceptional entertainment equipment and fashion rental activity. Berlin's large student and young professional population embraces the sharing economy enthusiastically, and its affordable living relative to other European capitals makes peer-to-peer rental particularly appealing across vehicle, utility space, and living space categories on Leli Rentals." },
  { name: "Amsterdam", slug: "amsterdam", country: "Netherlands", region: "Europe", blurb: "Amsterdam's progressive culture, world-class museums, and extraordinary cycle-friendly infrastructure create a unique and active rental market. The city's cycling culture and outdoor lifestyle drive bicycle and fitness equipment rentals at exceptionally high volumes, while its significant tourism industry — over 20 million visitors annually — creates living space and vehicle rental demand. Amsterdam's thriving creative agencies, startups, and design community fuel photography, electronics, and business space rentals, and its world-famous events and nightlife scene generates entertainment equipment and fashion rental activity. It is a highly engaged and culturally active market on the Leli Rentals platform." },
  { name: "Barcelona", slug: "barcelona", country: "Spain", region: "Europe", blurb: "Barcelona's Mediterranean lifestyle, world-class architecture, thriving creative industry, and enormous tourism make it one of Europe's most active and sought-after rental markets. The city's beach culture and outdoor lifestyle drive sports, water sports, and fitness equipment rentals, while its massive tourism industry creates living space and vehicle demand from millions of visitors. Barcelona's creative agencies, fashion industry, and major events generate photography, fashion, and entertainment equipment rental activity, and its thriving startup ecosystem fuels electronics and business space rentals. It consistently ranks as one of Southern Europe's most active markets on the Leli Rentals platform." },
  { name: "Madrid", slug: "madrid", country: "Spain", region: "Europe", blurb: "Madrid's status as Spain's capital and economic heart, combined with a world-class arts scene, vibrant nightlife, and significant corporate presence, creates a diverse and active rental market. The city's large corporate and government community drives business space, vehicle, and electronics rental demand, while its world-famous museums, festivals, and events generate photography and entertainment equipment activity. Madrid's thriving fashion industry makes it one of Europe's stronger fashion rental markets, and its warm climate, outdoor lifestyle, and passionate sports culture drive consistent fitness and sports equipment rentals across the Leli Rentals platform." },
  { name: "Rome", slug: "rome", country: "Italy", region: "Europe", blurb: "Rome's extraordinary history, magnificent architecture, and position as one of the world's great tourism destinations create consistent and high-volume rental demand, particularly in living spaces, vehicles, and photography gear. The city welcomes tens of millions of visitors annually who need accommodation alternatives, transportation, and photography equipment to capture iconic landmarks and experiences. Rome's fashion industry, film productions, and corporate community drive fashion, photography, and business space rentals, and its vibrant events calendar generates entertainment equipment demand across the Leli Rentals platform." },
  { name: "Milan", slug: "milan", country: "Italy", region: "Europe", blurb: "Milan is the world's fashion and design capital, home to the most prestigious fashion weeks and design exhibitions on earth, creating extraordinary demand for fashion, accessories, photography, and professional space rentals. Fashion designers, photographers, models, stylists, and creative professionals drive some of the highest-value rental activity in the entire fashion category on Leli Rentals. Milan's significant corporate and financial community also drives business space and vehicle rental demand, and its thriving events and entertainment industry generates photography and entertainment equipment rental activity across the Leli Rentals platform throughout the year." },
  { name: "Lisbon", slug: "lisbon", country: "Portugal", region: "Europe", blurb: "Lisbon has emerged as one of Europe's most exciting cities, attracting digital nomads, tech startups, and international visitors with its warm climate, affordable living, and thriving creative scene that create exceptional rental demand. The city's rapidly growing digital nomad and remote worker community drives business space, electronics, and vehicle rental activity, while its tourism boom generates living space and photography rental demand. Lisbon's fashion and creative industries create fashion rental activity, and its vibrant events scene — including Web Summit, Europe's largest tech conference — drives significant professional space and electronics rental demand across the Leli Rentals platform." },
  { name: "Vienna", slug: "vienna", country: "Austria", region: "Europe", blurb: "Vienna's exceptional quality of life, world-class cultural institutions, and significant international organisation presence create a stable and professionally active rental market. The city's large diplomatic and international business community drives business space, vehicle, and electronics rental demand, while its world-famous opera, classical music, and arts scene generate photography, fashion, and entertainment equipment rental activity. Vienna's significant tourism industry and high standard of living create consistent living space and vehicle rental demand, and its growing startup ecosystem fuels electronics and professional space rentals across multiple categories on the Leli Rentals platform." },
  { name: "Prague", slug: "prague", country: "Czech Republic", region: "Europe", blurb: "Prague is one of Europe's most beautiful and most-visited cities, welcoming enormous volumes of international tourism that create active living space, vehicle, and photography rental markets. The city's thriving film and production industry — Prague is one of Europe's most popular film locations — drives significant photography, electronics, and equipment rental demand. Prague's growing tech sector and affordable operating costs attract startups and creative agencies that fuel business space and electronics rentals, and its vibrant social scene generates entertainment equipment and fashion rental activity across the Leli Rentals platform." },
  { name: "Budapest", slug: "budapest", country: "Hungary", region: "Europe", blurb: "Budapest's thermal baths, stunning architecture, and reputation as one of Europe's great party and travel destinations create a vibrant and active rental market driven by tourism and a thriving local creative scene. The city's enormous event and festival industry — including one of Europe's largest music festivals — generates peak entertainment equipment, photography, and fashion rental demand. Budapest's growing technology sector and affordable business environment attract startups and remote workers who drive electronics and business space rentals, and its significant tourism industry creates consistent living space and vehicle rental activity on the Leli Rentals platform." },
  { name: "Warsaw", slug: "warsaw", country: "Poland", region: "Europe", blurb: "Warsaw has transformed into one of Central Europe's most dynamic business and technology hubs, with a rapidly growing startup ecosystem, significant corporate presence, and thriving creative scene that create active rental demand. The city's booming technology sector drives electronics, business space, and vehicle rental activity, while its growing events and entertainment industry generates photography and entertainment equipment demand. Warsaw's large young professional population embraces the sharing economy, and its rapidly rising standard of living creates expanding demand across fashion, sports equipment, and living space rental categories on the Leli Rentals platform." },
  { name: "Stockholm", slug: "stockholm", country: "Sweden", region: "Europe", blurb: "Stockholm's world-leading technology ecosystem, exceptional quality of life, and strong sustainability culture make it one of Europe's most naturally aligned cities for the peer-to-peer rental economy. The city's globally recognised tech industry — home to Spotify, Klarna, and countless successful startups — drives strong electronics, photography, and business space rental demand. Stockholm's outdoor lifestyle culture generates fitness, cycling, and water sports equipment rentals, and its design and fashion industry creates fashion rental activity. Sweden's progressive sharing economy culture makes Stockholm one of Europe's most engaged and environmentally conscious rental markets on Leli Rentals." },
  { name: "Copenhagen", slug: "copenhagen", country: "Denmark", region: "Europe", blurb: "Copenhagen's reputation for design excellence, cycling culture, and progressive sustainability values creates one of Europe's most naturally suited environments for peer-to-peer rental. The city's cycling infrastructure and outdoor lifestyle drive bicycle and fitness equipment rentals at exceptional volumes, while its world-class design and fashion industries create strong fashion and photography rental demand. Copenhagen's thriving technology sector and high standard of living fuel electronics and business space rentals, and its significant tourism and major events calendar generate living space and entertainment equipment rental activity across the Leli Rentals platform." },
  { name: "Zurich", slug: "zurich", country: "Switzerland", region: "Europe", blurb: "Zurich's position as one of the world's great financial centres, combined with exceptional quality of life and proximity to the Swiss Alps, creates a highly affluent and active rental market. The city's large banking and financial community drives business space, vehicle, and electronics rental demand, while its proximity to ski resorts and outdoor recreation areas generates exceptional sports and outdoor equipment rental activity. Zurich's luxury market creates high-value fashion and vehicle rentals, and its significant international business events and conferences drive photography, professional space, and entertainment equipment rental demand across the Leli Rentals platform." },
  { name: "Munich", slug: "munich", country: "Germany", region: "Europe", blurb: "Munich's combination of world-class corporate headquarters, Oktoberfest, BMW and tech industry presence, and proximity to the Bavarian Alps creates a uniquely diverse and active rental market. The city's major corporate community drives business space, vehicle, and electronics rental demand, while Oktoberfest and major events generate extraordinary peak entertainment equipment, fashion, and photography rental activity. Munich's outdoor lifestyle and access to Alpine skiing and hiking generate strong sports equipment rentals, and its thriving creative and media sector fuels photography and electronics rental demand across multiple categories on the Leli Rentals platform." },
  { name: "Frankfurt", slug: "frankfurt", country: "Germany", region: "Europe", blurb: "Frankfurt's status as Europe's financial capital and home to the European Central Bank creates one of Europe's most business-focused and professionally active rental markets. The city's enormous banking and financial community drives business space, vehicle, and electronics rental demand, and its world-famous trade fairs — including the Frankfurt Book Fair and Automechanika — generate significant peak photography, equipment, and professional space rental activity. Frankfurt's large international business population creates living space and vehicle rental demand, and its growing creative sector fuels photography and fashion rental activity across the Leli Rentals platform." },
  { name: "Brussels", slug: "brussels", country: "Belgium", region: "Europe", blurb: "Brussels' unique status as the capital of the European Union, home to NATO headquarters and hundreds of international institutions, creates an exceptionally international and professionally active rental market. The city's large diplomatic, NGO, and corporate community drives business space, vehicle, and electronics rental demand, and its major international events and summits generate photography, entertainment, and professional space rental activity. Brussels' diverse multicultural population and strong arts scene create fashion and entertainment equipment rental demand, and its central European location makes it a strategically important market on the Leli Rentals platform." },
  { name: "Athens", slug: "athens", country: "Greece", region: "Europe", blurb: "Athens' extraordinary ancient history, Mediterranean climate, and growing tourism industry create active rental demand particularly in living spaces, vehicles, and photography gear. The city welcomes millions of visitors annually who need accommodation alternatives, transportation to explore historic sites, and photography equipment to capture iconic landmarks. Athens' growing technology and startup scene, supported by a young and educated population, drives electronics and business space rental demand, and its vibrant social and events scene generates entertainment equipment and fashion rental activity across the Leli Rentals platform." },
  // Oceania
  { name: "Sydney", slug: "sydney", country: "Australia", region: "Oceania", blurb: "Sydney's iconic harbour setting, world-class beaches, and thriving business community make it Australia's premier rental market. The city's outdoor lifestyle creates exceptional demand for water sports equipment, fitness gear, and photography rentals, while its significant tourism industry drives living space and vehicle rental activity from millions of international visitors. Sydney's high property values and cost of living make peer-to-peer utility space, vehicle, and storage rentals particularly valuable. Its thriving creative, fashion, and events industries generate consistent demand across fashion, entertainment, and photography categories on the Leli Rentals platform." },
  { name: "Melbourne", slug: "melbourne", country: "Australia", region: "Oceania", blurb: "Melbourne consistently ranks as one of the world's most liveable cities, with a vibrant arts scene, world-class food culture, major sporting events, and a thriving startup ecosystem that create exceptional rental demand. The city's fashion and design community drives strong fashion and photography rental activity, while its major sporting events including the Australian Open and Formula 1 Grand Prix generate peak entertainment and photography gear demand. Melbourne's progressive sharing economy culture and high cost of living make it one of Australia's most naturally aligned peer-to-peer rental markets on the Leli Rentals platform." },
  { name: "Brisbane", slug: "brisbane", country: "Australia", region: "Oceania", blurb: "Brisbane's warm climate, growing population, and emerging technology and creative sectors create an active and expanding rental market. The city's outdoor lifestyle and proximity to the Gold Coast and Sunshine Coast beaches generate strong sports, water sports, and fitness equipment demand year-round. Brisbane's growing events scene, expanding business community, and major infrastructure projects drive equipment, business space, and electronics rental activity. The city's increasing tourism profile and status as a gateway to Queensland's natural attractions make it a growing and diverse market across multiple categories on the Leli Rentals platform." },
  { name: "Perth", slug: "perth", country: "Australia", region: "Oceania", blurb: "Perth's isolation, outdoor lifestyle culture, and strong mining and resources economy create a distinctive rental market with unique demand characteristics. The city's outdoor enthusiasts drive strong camping, sports, and water sports equipment rental activity, while its significant resources sector generates construction equipment and tools demand. Perth's large fly-in fly-out worker population creates consistent short-term living space and vehicle rental demand, and its growing arts and events scene fuels photography and entertainment equipment rentals. Perth represents a growing and actively developing market across multiple categories on the Leli Rentals platform." },
  { name: "Gold Coast", slug: "gold-coast", country: "Australia", region: "Oceania", blurb: "Gold Coast's world-famous beaches, thriving tourism industry, and year-round sunshine create extraordinary demand for outdoor sports, water sports, and fitness equipment rentals. Millions of domestic and international visitors annually drive living space and vehicle rental demand, while the city's events and entertainment scene generates consistent photography and entertainment equipment activity. Gold Coast's growing film industry — one of Australia's most active production hubs — drives significant camera gear and electronics rentals, and its dynamic tourism market makes it one of the most seasonally active rental cities on the Leli Rentals platform." },
  { name: "Auckland", slug: "auckland", country: "New Zealand", region: "Oceania", blurb: "Auckland is New Zealand's largest city and economic capital, combining a stunning harbour setting, thriving technology sector, and diverse multicultural community that creates active rental demand across multiple categories. The city's outdoor lifestyle and sailing culture drive sports and water sports equipment rentals, while its growing technology and creative industries fuel electronics, photography, and business space demand. Auckland's significant tourism from international visitors and domestic travellers creates living space and vehicle rental activity, and its multicultural events calendar generates consistent fashion and entertainment equipment rentals on the Leli Rentals platform." },
  { name: "Queenstown", slug: "queenstown", country: "New Zealand", region: "Oceania", blurb: "Queenstown is the world's adventure capital, welcoming millions of thrill-seeking visitors annually for skiing, bungee jumping, skydiving, and a spectacular alpine environment that makes it one of the highest-demand adventure sports equipment rental markets globally. Ski gear, mountain bikes, camping equipment, and water sports gear are among the most sought-after rental categories, driven by year-round international tourism. Queenstown's luxury tourism market also creates demand for high-end photography gear, vehicles, and living spaces, making it an exceptionally active market across adventure and lifestyle rental categories on Leli Rentals." },
  // Middle East
  { name: "Dubai", slug: "dubai", country: "UAE", region: "Middle East", blurb: "Dubai is a global crossroads for luxury, business, and tourism — consistently ranking among the world's wealthiest and most visited cities, creating extraordinary rental demand across every category. The city's luxury culture drives high-end vehicle, fashion, and photography gear rentals, while its massive business events and conference industry generates consistent demand for professional spaces, electronics, and entertainment equipment. Dubai's enormous expatriate population and constant flow of international visitors create active living space and vehicle rental markets, and its year-round sunshine and outdoor amenities fuel sports equipment rentals. Dubai is among the highest-value markets on the entire Leli Rentals platform." },
  { name: "Abu Dhabi", slug: "abu-dhabi", country: "UAE", region: "Middle East", blurb: "Abu Dhabi's status as the UAE's capital and a global hub for government, culture, and business creates a distinctive and active rental market. The city's major events including Formula 1, international conferences, and cultural festivals drive entertainment, photography, and vehicle rental demand. Abu Dhabi's large expatriate professional community fuels business space, electronics, and vehicle rental activity, while its luxury tourism sector creates demand for high-end living spaces and fashion rentals. The city's investment in cultural institutions, sports venues, and business infrastructure makes it a growing and increasingly active market on the Leli Rentals platform." },
  { name: "Riyadh", slug: "riyadh", country: "Saudi Arabia", region: "Middle East", blurb: "Riyadh is one of the Middle East's fastest-growing metropolitan economies, undergoing rapid transformation under Vision 2030 with booming construction, entertainment, and tourism sectors that create expanding rental demand. The city's massive infrastructure and construction activity drives strong equipment and tools rental demand, while its emerging entertainment sector and growing events industry generate photography, entertainment equipment, and business space rentals. Riyadh's large young population and growing consumer culture fuel electronics, fashion, and vehicle rental activity, making it one of the Middle East's most exciting and rapidly growing markets on the Leli Rentals platform." },
  { name: "Doha", slug: "doha", country: "Qatar", region: "Middle East", blurb: "Doha's extraordinary wealth, major international events, and ambitious cultural development have established it as one of the Middle East's premier rental markets. The city's large expatriate professional community drives electronics, vehicle, and business space rental demand, while its major sporting events and cultural festivals generate photography, entertainment equipment, and fashion rental activity. Doha's thriving construction sector creates consistent tools and equipment demand, and its luxury tourism market drives high-end vehicle and living space rentals. Qatar's investment in becoming a global destination makes Doha an increasingly active and growing market on the Leli Rentals platform." },
  { name: "Muscat", slug: "muscat", country: "Oman", region: "Middle East", blurb: "Muscat's growing tourism industry, stable economy, and position as the Arabian Peninsula's most authentically cultural destination create a developing but promising rental market. The city's outdoor landscape and adventure tourism generate demand for camping, sports, and photography equipment rentals, while its growing business community fuels vehicle and electronics rental activity. Muscat's expanding expatriate community and increasing international tourism create living space and vehicle rental demand, and its unique cultural events and festivals generate photography and entertainment equipment rentals. It is a growing market with significant potential across multiple categories on the Leli Rentals platform." },
  { name: "Tel Aviv", slug: "tel-aviv", country: "Israel", region: "Middle East", blurb: "Tel Aviv is the Middle East's technology capital — dubbed the 'Silicon Wadi' — with one of the world's highest concentrations of startups per capita and a globally recognised innovation ecosystem that creates exceptional electronics, business space, and professional rental demand. The city's vibrant beach culture and outdoor lifestyle drive sports and fitness equipment rentals, while its world-class fashion and nightlife scene generate fashion and entertainment rental activity. Tel Aviv's significant international business community and major tech events fuel professional space and electronics rental demand, making it one of the most technologically engaged markets on the Leli Rentals platform." },
  // Africa
  { name: "Nairobi", slug: "nairobi", country: "Kenya", region: "Africa", blurb: "Nairobi is East Africa's technology and business capital — home to a thriving startup ecosystem known as Silicon Savannah, major international organisations, and a rapidly growing middle class that increasingly embraces the sharing economy. The city's tech community drives electronics, photography, and business space rental demand, while its significant NGO and corporate community fuels vehicle and professional space rentals. Nairobi's vibrant events scene, growing fashion industry, and active social calendar create consistent entertainment, fashion, and photography rental activity. As Leli Rentals' home market, Nairobi is a flagship city and one of the platform's most active and deeply engaged rental communities." },
  { name: "Lagos", slug: "lagos", country: "Nigeria", region: "Africa", blurb: "Lagos is Africa's largest city and one of the world's fastest-growing megacities, with a booming entertainment industry, thriving tech ecosystem, and an entrepreneurial culture that makes it one of the continent's most dynamic rental markets. The city's enormous Nollywood film industry drives significant photography, electronics, and equipment rental demand, while its active events, music, and fashion scene generate consistent entertainment gear, fashion, and photography activity. Lagos' large business community fuels vehicle and professional space rentals, and its rapidly expanding middle class creates growing demand across all rental categories on the Leli Rentals platform." },
  { name: "Cape Town", slug: "cape-town", country: "South Africa", region: "Africa", blurb: "Cape Town is Africa's most visited city and one of the world's great tourism destinations — combining world-class wine, adventure activities, pristine beaches, and a thriving creative economy that creates exceptional rental demand. The city's booming film production industry drives significant photography, electronics, and vehicle rental activity, while its outdoor lifestyle and adventure tourism generate strong sports and water sports equipment demand. Cape Town's growing startup ecosystem fuels business space rentals, and its vibrant fashion and design community creates fashion rental activity. It is consistently one of the highest-demand rental markets on the African continent across the Leli Rentals platform." },
  { name: "Johannesburg", slug: "johannesburg", country: "South Africa", region: "Africa", blurb: "Johannesburg is Africa's economic powerhouse and the continent's largest city by economic output, creating one of Africa's most active and diverse business and consumer rental markets. The city's corporate sector drives strong business space, vehicle, and electronics rental demand, while its vibrant entertainment and events industry generates photography, fashion, and entertainment equipment activity. Johannesburg's large middle-class population, significant tourism, and active social scene create consistent demand across all rental categories. As the financial heart of sub-Saharan Africa, Johannesburg represents one of the most commercially active markets on the Leli Rentals platform." },
  { name: "Accra", slug: "accra", country: "Ghana", region: "Africa", blurb: "Accra is West Africa's most progressive and business-friendly capital, with a growing technology sector, thriving creative industry, and stable economy that create an active and developing rental market. The city's expanding tech and startup community drives electronics and business space rental demand, while its vibrant Afrobeats music scene, fashion industry, and major events generate photography, entertainment, and fashion rental activity. Accra's significant expatriate community and growing tourism industry create vehicle and living space rental demand, making it one of West Africa's most promising and actively growing markets on the Leli Rentals platform." },
  { name: "Cairo", slug: "cairo", country: "Egypt", region: "Africa", blurb: "Cairo is Africa's most populous city and one of the Arab world's great cultural capitals, with a massive population, significant tourism industry, and growing technology sector that create substantial rental demand. The city's enormous population drives consistent demand across vehicle, electronics, and equipment rental categories, while its significant tourism industry — built around ancient wonders — creates photography and living space rental activity. Cairo's growing tech sector and expanding middle class fuel electronics and business space demand, and its vibrant social and events scene generates entertainment and fashion rental activity across the Leli Rentals platform." },
  { name: "Casablanca", slug: "casablanca", country: "Morocco", region: "Africa", blurb: "Casablanca is Morocco's economic capital and the largest city in the Maghreb region, with a significant business community, growing tourism industry, and vibrant cultural scene that create active rental demand. The city's corporate sector drives vehicle, electronics, and business space rental activity, while its growing creative and fashion industry generates fashion and photography rental demand. Casablanca's position as a gateway for both European and African business creates consistent professional rental activity, and its active events calendar and tourism industry generate entertainment equipment and living space rentals across multiple categories on the Leli Rentals platform." },
  { name: "Dar es Salaam", slug: "dar-es-salaam", country: "Tanzania", region: "Africa", blurb: "Dar es Salaam is Tanzania's largest city and commercial hub, serving as a gateway to some of Africa's greatest wildlife and natural wonders including Serengeti and Zanzibar. The city's tourism industry drives photography, vehicle, and living space rental demand from international visitors, while its growing business community fuels electronics and professional space rentals. Dar es Salaam's active events scene and growing middle class generate entertainment and fashion rental activity, and its role as a regional commercial hub creates consistent equipment and tools rental demand across the Leli Rentals platform." },
  { name: "Kampala", slug: "kampala", country: "Uganda", region: "Africa", blurb: "Kampala is East Africa's most vibrant and fast-growing capital city, with a youthful population, expanding tech sector, and one of Africa's most active social and nightlife scenes that create growing rental demand. The city's energetic youth culture and events scene drive entertainment equipment, photography, and fashion rental activity, while its expanding business community fuels electronics and professional space rentals. Kampala's significant NGO presence and growing middle class create vehicle and equipment rental demand, and its entrepreneurial culture makes it an increasingly engaged market across multiple categories on the Leli Rentals platform." },
  { name: "Kigali", slug: "kigali", country: "Rwanda", region: "Africa", blurb: "Kigali has emerged as Africa's most modern and well-governed capital city, with a booming conference industry, thriving technology sector, and clean, safe environment that attract significant international business and tourism. The city's major conference and events business generates professional space, photography, and entertainment equipment rental demand, while its growing tech community fuels electronics and business space rentals. Kigali's expanding tourism industry and significant expatriate community create vehicle and living space rental activity, making it one of Africa's most forward-looking and professionally active markets on the Leli Rentals platform." },
  { name: "Durban", slug: "durban", country: "South Africa", region: "Africa", blurb: "Durban's warm Indian Ocean coastline, significant port economy, and vibrant Indian cultural heritage create a distinctive rental market with strong tourism and outdoor lifestyle components. The city's beach culture and water sports environment drive surfing, water sports, and fitness equipment rentals year-round, while its major events including the Comrades Marathon and international conferences generate sports, photography, and entertainment equipment demand. Durban's growing business community fuels vehicle and professional space rentals, and its vibrant multicultural events calendar creates fashion and entertainment rental activity across the Leli Rentals platform." },
  { name: "Mombasa", slug: "mombasa", country: "Kenya", region: "Africa", blurb: "Mombasa is East Africa's oldest and most historic port city, with world-class beaches, significant tourism, and a growing business community that create active rental demand. The city's thriving coastal tourism industry drives water sports equipment, photography, vehicle, and living space rental demand from both international and domestic visitors. Mombasa's growing construction and port activity create equipment and tools rental demand, and its active events and social scene generate entertainment and fashion rental activity. As Leli Rentals' second major Kenyan market, Mombasa represents a key coastal hub for the platform's East African growth strategy." },
  { name: "Addis Ababa", slug: "addis-ababa", country: "Ethiopia", region: "Africa", blurb: "Addis Ababa is Africa's diplomatic capital — home to the African Union and hundreds of international organisations — and one of the continent's fastest-growing cities, creating a uniquely international and professionally active rental market. The city's large diplomatic, NGO, and international business community drives business space, vehicle, and electronics rental demand, and its growing events industry generates photography and entertainment equipment rental activity. Addis Ababa's rapidly expanding middle class and entrepreneurial culture fuel electronics and sports equipment rentals, and its increasing international profile makes it one of East Africa's most promising developing markets on the Leli Rentals platform." },
  // Asia
  { name: "Singapore", slug: "singapore", country: "Singapore", region: "Asia", blurb: "Singapore's extraordinary wealth, world-class business environment, and position as Asia's technology and financial hub create one of the region's most affluent and active rental markets. The city-state's large professional expatriate community drives business space, electronics, and vehicle rental demand, while its major events including Formula 1 and international conferences generate photography, entertainment, and professional space rental activity. Singapore's high cost of living and limited space make peer-to-peer utility space and storage rentals particularly valuable, and its thriving startup ecosystem and progressive sharing economy culture make it one of Asia's most engaged rental markets on Leli Rentals." },
  { name: "Tokyo", slug: "tokyo", country: "Japan", region: "Asia", blurb: "Tokyo is one of the world's most fascinating and populous megacities, combining cutting-edge technology, world-class fashion, extraordinary food culture, and a unique social ecosystem that create diverse rental demand. The city's enormous population and high cost of living make peer-to-peer rental particularly compelling for vehicles, storage, and electronics. Tokyo's global fashion influence drives fashion and accessories rental demand, while its significant tourism industry — over 10 million international visitors annually — creates living space and vehicle rental activity. Japan's technology culture and creative industries fuel electronics, photography, and business space rentals across the Leli Rentals platform." },
  { name: "Bangkok", slug: "bangkok", country: "Thailand", region: "Asia", blurb: "Bangkok is one of Asia's most vibrant and visited cities, welcoming tens of millions of tourists annually with its extraordinary food, culture, nightlife, and entertainment that create highly active rental demand. The city's massive tourism industry drives living space, vehicle, and photography rental activity, while its thriving events and entertainment scene generates entertainment equipment and fashion rental demand. Bangkok's growing startup ecosystem and significant expatriate business community fuel electronics and professional space rentals, and its outdoor lifestyle and proximity to beaches and national parks create sports equipment rental activity across the Leli Rentals platform." },
  { name: "Kuala Lumpur", slug: "kuala-lumpur", country: "Malaysia", region: "Asia", blurb: "Kuala Lumpur's position as Southeast Asia's second-largest financial centre, combined with a thriving creative scene, significant tourism, and a young digitally-native population, creates an active and growing rental market. The city's large corporate community drives business space, vehicle, and electronics rental demand, while its major shopping and events culture generates fashion and entertainment equipment rental activity. Kuala Lumpur's growing film and creative industry fuels photography and production equipment rentals, and its expanding middle class and sharing economy culture make it an increasingly active market across multiple categories on the Leli Rentals platform." },
  { name: "Hong Kong", slug: "hong-kong", country: "China", region: "Asia", blurb: "Hong Kong's extraordinary density, world-class business environment, and position as Asia's luxury retail capital create a unique and highly active rental market. The city's sky-high property prices and limited space make peer-to-peer utility space, storage, and vehicle rentals exceptionally valuable, and its large financial and corporate community drives business space and electronics rental demand. Hong Kong's global fashion influence and luxury retail scene create fashion and accessories rental activity, while its significant international business events and tourism generate photography, entertainment, and professional space rental demand across the Leli Rentals platform." },
  { name: "Seoul", slug: "seoul", country: "South Korea", region: "Asia", blurb: "Seoul's global influence on technology, beauty, fashion, and entertainment — the epicentre of the K-pop phenomenon — creates extraordinary rental demand across fashion, electronics, photography, and entertainment categories. The city's massive entertainment industry generates significant photography, video equipment, and professional space rental activity, while its fashion-forward culture drives fashion and accessories rental demand. Seoul's world-leading technology sector fuels electronics and business space rentals, and its enormous population, high cost of living, and active outdoor culture create vehicle, sports equipment, and utility space rental demand across the Leli Rentals platform." },
  { name: "Mumbai", slug: "mumbai", country: "India", region: "Asia", blurb: "Mumbai is India's financial capital and home to Bollywood — the world's most prolific film industry — creating one of Asia's most active markets for photography, video production equipment, and creative space rentals. The city's enormous film and entertainment industry drives significant camera gear, lighting equipment, electronics, and professional space rental activity, while its major corporate and financial community fuels business space and vehicle demand. Mumbai's large population, fashion industry, and vibrant social scene create fashion and entertainment rental activity, and its rapidly growing middle class and startup ecosystem drive electronics and sports equipment rentals across the Leli Rentals platform." },
  { name: "Delhi", slug: "delhi", country: "India", region: "Asia", blurb: "Delhi is India's capital and one of the world's most populous cities, with a massive and diverse economy spanning government, technology, manufacturing, and tourism that creates significant rental demand across multiple categories. The city's large corporate and government community drives business space, vehicle, and electronics rental demand, while its significant tourism industry — built around historic monuments and cultural attractions — creates photography and living space rental activity. Delhi's thriving wedding and events industry generates consistent entertainment equipment and fashion rental demand, and its rapidly expanding startup ecosystem fuels electronics and professional space rentals across the Leli Rentals platform." },
  { name: "Bangalore", slug: "bangalore", country: "India", region: "Asia", blurb: "Bangalore is India's Silicon Valley — home to the country's most concentrated technology ecosystem, with hundreds of multinational tech companies and thousands of startups that create exceptional electronics, business space, and professional rental demand. The city's large young professional and tech worker population embraces the sharing economy enthusiastically, driving vehicle, electronics, and fitness equipment rentals. Bangalore's growing creative and startup culture fuels photography and coworking space demand, and its vibrant social and events scene generates entertainment and fashion rental activity. It is one of India's most digitally engaged and rapidly growing rental markets on the Leli Rentals platform." },
  { name: "Manila", slug: "manila", country: "Philippines", region: "Asia", blurb: "Manila's enormous and young population, growing business process outsourcing industry, and vibrant creative scene create active and expanding rental demand across multiple categories. The city's large BPO and corporate community drives business space, electronics, and vehicle rental demand, while its thriving social media, content creation, and entertainment culture fuels photography, electronics, and production equipment rentals. Manila's fashion-conscious culture and active events scene generate fashion and entertainment rental activity, and its significant international tourism creates living space and vehicle rental demand across the growing Leli Rentals platform presence in Southeast Asia." },
  { name: "Jakarta", slug: "jakarta", country: "Indonesia", region: "Asia", blurb: "Jakarta is Southeast Asia's largest city and one of the world's great megacities, with a massive and rapidly growing economy, enormous young population, and thriving creative sector that create substantial rental demand. The city's large corporate community and rapid infrastructure development drive vehicle, equipment, and business space rental demand, while its enormous entertainment industry and active social scene generate fashion, photography, and entertainment equipment rentals. Jakarta's young, digitally native population enthusiastically embraces sharing economy models, making it one of Southeast Asia's most populous and fastest-growing rental markets on the Leli Rentals platform." },
  { name: "Ho Chi Minh City", slug: "ho-chi-minh-city", country: "Vietnam", region: "Asia", blurb: "Ho Chi Minh City is Vietnam's economic engine and one of Southeast Asia's fastest-growing business and technology hubs, with a young entrepreneurial population and booming startup ecosystem that create active and expanding rental demand. The city's growing technology and business community drives electronics, business space, and vehicle rental demand, while its thriving creative and content creation scene generates photography and production equipment rentals. Ho Chi Minh City's vibrant social scene, fashion-forward culture, and significant tourism industry create fashion, entertainment, and living space rental activity, making it an increasingly active market on the Leli Rentals platform." },
  { name: "Karachi", slug: "karachi", country: "Pakistan", region: "Asia", blurb: "Karachi is Pakistan's largest city and economic capital, with a massive population, significant manufacturing and textile industry, and growing digital economy that create substantial rental demand across multiple categories. The city's large business community drives vehicle, equipment, and professional space rental demand, while its thriving fashion and textile industry creates fashion and accessories rental activity. Karachi's growing technology sector and young population fuel electronics and business space rentals, and its active events and entertainment scene generates photography and entertainment equipment demand, making it an important and growing market on the Leli Rentals platform." },
  // South America
  { name: "São Paulo", slug: "sao-paulo", country: "Brazil", region: "South America", blurb: "São Paulo is South America's largest city and economic powerhouse, with a massive corporate sector, thriving creative industry, and diverse multicultural population that create one of the continent's most active rental markets. The city's enormous business community drives vehicle, business space, and electronics rental demand, while its world-class fashion, arts, and entertainment scene generate photography, fashion, and event equipment rental activity. São Paulo's high cost of urban living makes peer-to-peer rental increasingly attractive for vehicles and utility spaces, and its rapidly growing sharing economy culture makes it South America's most commercially active market on the Leli Rentals platform." },
  { name: "Buenos Aires", slug: "buenos-aires", country: "Argentina", region: "South America", blurb: "Buenos Aires' reputation as the 'Paris of South America' is well earned — with a world-class tango culture, thriving arts and fashion scene, and cosmopolitan lifestyle that create active rental demand across creative and lifestyle categories. The city's fashion-forward culture drives fashion and accessories rental activity, while its significant film, photography, and creative industries generate equipment rental demand. Buenos Aires' large and educated professional class embraces the sharing economy, and its growing technology sector fuels electronics and business space rentals. Its vibrant events calendar and active social scene generate consistent entertainment and photography rental activity on Leli Rentals." },
  { name: "Bogotá", slug: "bogota", country: "Colombia", region: "South America", blurb: "Bogotá has transformed into one of South America's most dynamic and innovative cities, with a thriving startup ecosystem, major film industry, and growing tourism sector that create expanding rental demand across multiple categories. The city's technology and startup community drives electronics, business space, and vehicle rental demand, while its growing film and creative industry fuels photography and production equipment rentals. Bogotá's vibrant arts and fashion scene generates fashion and entertainment rental activity, and its significant events calendar — including major music festivals — creates consistent photography and entertainment equipment demand across the Leli Rentals platform." },
  { name: "Lima", slug: "lima", country: "Peru", region: "South America", blurb: "Lima is South America's most underrated major city — home to the world's best restaurant scene, a growing technology ecosystem, and one of the continent's most rapidly developing middle-class economies that create active and expanding rental demand. The city's growing corporate and technology community drives business space, electronics, and vehicle rental demand, while its world-class food tourism and cultural scene generate photography and living space rental activity. Lima's expanding creative industry and active social scene generate fashion and entertainment rental demand, and its developing sharing economy culture makes it an increasingly active market on the Leli Rentals platform." },
  { name: "Santiago", slug: "santiago", country: "Chile", region: "South America", blurb: "Santiago's position as South America's most economically stable and technologically advanced capital, combined with proximity to the Andes and Pacific coast, creates a diverse and active rental market. The city's strong corporate and mining sector drives business space, vehicle, and equipment rental demand, while its outdoor lifestyle and adventure tourism generate sports, skiing, and outdoor equipment rentals. Santiago's growing startup ecosystem and educated professional class fuel electronics and business space rentals, and its vibrant arts and social scene generate fashion, photography, and entertainment equipment rental activity across the Leli Rentals platform." },
  // Europe/Asia
  { name: "Istanbul", slug: "istanbul", country: "Turkey", region: "Europe", blurb: "Istanbul's unique position spanning two continents, combined with its extraordinary history, thriving tourism industry, and significant business community, creates one of the world's most geographically and culturally distinctive rental markets. The city's enormous tourism industry drives living space, vehicle, and photography rental demand from millions of annual visitors, while its growing technology sector and large corporate community fuel electronics and business space rentals. Istanbul's fashion industry, vibrant social scene, and major events generate fashion and entertainment rental activity, and its strategic position as a Eurasian business hub makes it a commercially important market across the Leli Rentals platform." },
]

// ─── CATEGORY DATA ────────────────────────────────────────────────────────────
export const seoCategories: SeoCategoryData[] = [
  {
    id: "vehicles",
    name: "Vehicles",
    renterKeywords: [
      { slug: "rent-a-car", label: "Rent a Car", intent: "renter" },
      { slug: "hire-a-car", label: "Hire a Car", intent: "renter" },
      { slug: "peer-to-peer-car-rental", label: "Peer to Peer Car Rental", intent: "renter" },
      { slug: "cheap-car-hire", label: "Cheap Car Hire", intent: "renter" },
      { slug: "luxury-car-rental", label: "Luxury Car Rental", intent: "renter" },
      { slug: "rent-suv", label: "Rent SUV", intent: "renter" },
      { slug: "rent-a-van", label: "Rent a Van", intent: "renter" },
      { slug: "rent-electric-vehicle", label: "Rent Electric Vehicle", intent: "renter" },
      { slug: "short-term-car-rental", label: "Short Term Car Rental", intent: "renter" },
      { slug: "rent-a-minivan", label: "Rent a Minivan", intent: "renter" },
      { slug: "rent-a-truck-for-moving", label: "Rent a Truck for Moving", intent: "renter" },
      { slug: "self-drive-car-hire", label: "Self Drive Car Hire", intent: "renter" },
      { slug: "affordable-car-rental", label: "Affordable Car Rental", intent: "renter" },
      { slug: "rent-a-pickup-truck", label: "Rent a Pickup Truck", intent: "renter" },
      { slug: "rent-tesla", label: "Rent Tesla", intent: "renter" },
    ],
    ownerKeywords: [
      { slug: "how-to-make-money-renting-my-car", label: "How to Make Money Renting My Car", intent: "owner" },
      { slug: "list-my-car-for-rent", label: "List My Car for Rent", intent: "owner" },
      { slug: "passive-income-from-my-car", label: "Passive Income From My Car", intent: "owner" },
      { slug: "rent-out-my-car-when-not-using-it", label: "Rent Out My Car When Not Using It", intent: "owner" },
      { slug: "how-much-can-i-earn-renting-my-tesla", label: "How Much Can I Earn Renting My Tesla", intent: "owner" },
      { slug: "make-money-from-idle-car", label: "Make Money From Idle Car", intent: "owner" },
      { slug: "peer-to-peer-car-listing-platform", label: "Peer to Peer Car Listing Platform", intent: "owner" },
      { slug: "how-to-list-car-on-rental-site", label: "How to List Car on Rental Site", intent: "owner" },
      { slug: "earn-money-renting-personal-vehicle", label: "Earn Money Renting Personal Vehicle", intent: "owner" },
      { slug: "monetize-my-car", label: "Monetize My Car", intent: "owner" },
      { slug: "rent-out-my-van-for-income", label: "Rent Out My Van for Income", intent: "owner" },
      { slug: "side-hustle-renting-my-car", label: "Side Hustle Renting My Car", intent: "owner" },
      { slug: "how-to-rent-out-fleet-of-cars", label: "How to Rent Out Fleet of Cars", intent: "owner" },
      { slug: "best-site-to-list-car-for-rent", label: "Best Site to List Car for Rent", intent: "owner" },
      { slug: "car-rental-income-calculator", label: "Car Rental Income Calculator", intent: "owner" },
    ],
    competitorKeywords: [
      { slug: "turo-alternative", label: "Turo Alternative", intent: "competitor" },
      { slug: "cheaper-than-turo", label: "Cheaper Than Turo", intent: "competitor" },
      { slug: "sites-like-turo-with-lower-fees", label: "Sites Like Turo With Lower Fees", intent: "competitor" },
      { slug: "turo-vs-leli-rentals", label: "Turo vs Leli Rentals", intent: "competitor" },
      { slug: "getaround-alternative", label: "Getaround Alternative", intent: "competitor" },
      { slug: "avoid-turo-commission", label: "Avoid Turo Commission", intent: "competitor" },
      { slug: "turo-high-fees-alternative", label: "Turo High Fees Alternative", intent: "competitor" },
      { slug: "hyrecar-alternative", label: "HyreCar Alternative", intent: "competitor" },
      { slug: "best-turo-competitor", label: "Best Turo Competitor", intent: "competitor" },
      { slug: "peer-to-peer-car-rental-without-commission", label: "Peer to Peer Car Rental Without Commission", intent: "competitor" },
      { slug: "turo-alternatives-2026", label: "Turo Alternatives 2026", intent: "competitor" },
      { slug: "lower-commission-car-rental-platform", label: "Lower Commission Car Rental Platform", intent: "competitor" },
      { slug: "turo-fees-too-high", label: "Turo Fees Too High", intent: "competitor" },
    ],
    blurbs: {
      renter: "Whether you need a car for a weekend road trip, a business meeting, or a cross-city commute, renting a vehicle has never been easier. Leli Rentals connects you directly with trusted local vehicle owners offering competitive daily, weekly, and monthly rental rates — with no hidden commission fees eating into your budget. Our peer-to-peer vehicle rental marketplace features a wide range of cars, SUVs, vans, electric vehicles, pickup trucks, and luxury models available in cities around the world. Every vehicle listing on Leli Rentals includes owner ratings, verified reviews, transparent pricing, and flexible booking terms. Unlike traditional car hire companies that charge inflated depot fees, our platform puts you directly in touch with the owner, meaning better prices for renters and more income for owners. Browse available vehicles near you, compare rates, and book securely — all in one place. Your next journey starts here.",
      owner: "Your vehicle is one of your most valuable assets — and when it sits idle in your driveway or parking lot, it earns you nothing. Listing your car, van, SUV, or truck on Leli Rentals transforms your idle vehicle into a consistent stream of passive income. Our platform connects vehicle owners with thousands of verified renters searching for affordable, flexible transport options in cities worldwide. Unlike Turo or Getaround which charge hosts between 25% and 40% commission per booking, Leli Rentals operates on a flat subscription model — you pay just a small monthly fee and keep 100% of every rental payment. Setting up your vehicle listing takes less than five minutes. Add photos, set your daily rate, define your availability, and start earning. Whether you own one car or manage a fleet, Leli Rentals gives you the tools to monetize your vehicles and build a reliable rental income stream.",
      competitor: "If you have been listing your vehicle on Turo, Getaround, or HyreCar, you already know the frustration — commission fees between 25% and 40% on every booking mean you are handing over a significant portion of your hard-earned rental income to the platform before you see a single cent. On a $1,000 monthly rental, that is up to $400 gone before you even count expenses. Leli Rentals was built specifically to solve this problem. Our peer-to-peer vehicle rental marketplace charges hosts a simple flat monthly subscription — no percentage cuts, no booking fees, no hidden deductions. Every dollar your vehicle earns goes directly to you. We offer the same trusted rental experience — verified renters, secure bookings, flexible availability settings, and a global marketplace — but at a fraction of the cost to hosts. Join thousands of vehicle owners who have already switched to Leli Rentals and are keeping more of what their vehicles earn.",
    },
    images: {
      renter: `${IMG}/vehicles-renter.jpg`,
      owner: `${IMG}/vehicles-owner.jpg`,
    },
    outlinks: [
      { anchor: "Vehicle safety and driving tips from RAC", url: "https://www.rac.co.uk/drive/advice/" },
      { anchor: "Vehicle safety standards from the NHTSA", url: "https://www.nhtsa.gov/vehicle-safety" },
      { anchor: "Road trip planning resources from AAA", url: "https://www.aaa.com/vacation/" },
      { anchor: "Vehicle reviews and ratings on Edmunds", url: "https://www.edmunds.com/car-reviews/" },
    ],
  },
  {
    id: "living",
    name: "Living Spaces",
    renterKeywords: [
      { slug: "rent-apartment-short-term", label: "Rent Apartment Short Term", intent: "renter" },
      { slug: "holiday-rental", label: "Holiday Rental", intent: "renter" },
      { slug: "rent-house-for-weekend", label: "Rent House for Weekend", intent: "renter" },
      { slug: "vacation-rental", label: "Vacation Rental", intent: "renter" },
      { slug: "short-stay-rental", label: "Short Stay Rental", intent: "renter" },
      { slug: "rent-furnished-apartment", label: "Rent Furnished Apartment", intent: "renter" },
      { slug: "monthly-rental", label: "Monthly Rental", intent: "renter" },
      { slug: "rent-villa", label: "Rent Villa", intent: "renter" },
      { slug: "affordable-holiday-home", label: "Affordable Holiday Home", intent: "renter" },
      { slug: "rent-beach-house", label: "Rent Beach House", intent: "renter" },
      { slug: "corporate-housing", label: "Corporate Housing", intent: "renter" },
      { slug: "rent-serviced-apartment", label: "Rent Serviced Apartment", intent: "renter" },
      { slug: "luxury-home-rental", label: "Luxury Home Rental", intent: "renter" },
      { slug: "rent-studio-apartment", label: "Rent Studio Apartment", intent: "renter" },
      { slug: "rent-penthouse", label: "Rent Penthouse", intent: "renter" },
    ],
    ownerKeywords: [
      { slug: "how-to-make-money-renting-my-home", label: "How to Make Money Renting My Home", intent: "owner" },
      { slug: "list-my-apartment-on-rental-site", label: "List My Apartment on Rental Site", intent: "owner" },
      { slug: "passive-income-from-property", label: "Passive Income From Property", intent: "owner" },
      { slug: "rent-out-my-house-when-travelling", label: "Rent Out My House When Travelling", intent: "owner" },
      { slug: "how-much-can-i-earn-renting-my-apartment", label: "How Much Can I Earn Renting My Apartment", intent: "owner" },
      { slug: "airbnb-alternative-for-hosts", label: "Airbnb Alternative for Hosts", intent: "owner" },
      { slug: "make-money-from-spare-room", label: "Make Money From Spare Room", intent: "owner" },
      { slug: "short-term-rental-income-calculator", label: "Short Term Rental Income Calculator", intent: "owner" },
      { slug: "list-my-villa-for-rent", label: "List My Villa for Rent", intent: "owner" },
      { slug: "how-to-become-a-rental-host", label: "How to Become a Rental Host", intent: "owner" },
      { slug: "monetize-my-property", label: "Monetize My Property", intent: "owner" },
      { slug: "rent-out-my-furnished-apartment", label: "Rent Out My Furnished Apartment", intent: "owner" },
      { slug: "best-platform-to-list-vacation-rental", label: "Best Platform to List Vacation Rental", intent: "owner" },
      { slug: "earn-from-renting-holiday-home", label: "Earn From Renting Holiday Home", intent: "owner" },
      { slug: "how-to-list-property-for-short-stay", label: "How to List Property for Short Stay", intent: "owner" },
    ],
    competitorKeywords: [
      { slug: "airbnb-alternative", label: "Airbnb Alternative", intent: "competitor" },
      { slug: "cheaper-than-airbnb", label: "Cheaper Than Airbnb", intent: "competitor" },
      { slug: "sites-like-airbnb-with-lower-fees", label: "Sites Like Airbnb With Lower Fees", intent: "competitor" },
      { slug: "airbnb-vs-leli-rentals", label: "Airbnb vs Leli Rentals", intent: "competitor" },
      { slug: "vrbo-alternative", label: "Vrbo Alternative", intent: "competitor" },
      { slug: "avoid-airbnb-service-fees", label: "Avoid Airbnb Service Fees", intent: "competitor" },
      { slug: "airbnb-host-fees-too-high", label: "Airbnb Host Fees Too High", intent: "competitor" },
      { slug: "booking-com-alternative-for-hosts", label: "Booking.com Alternative for Hosts", intent: "competitor" },
      { slug: "best-airbnb-competitor-for-hosts", label: "Best Airbnb Competitor for Hosts", intent: "competitor" },
      { slug: "vacation-rental-without-commission", label: "Vacation Rental Without Commission", intent: "competitor" },
      { slug: "airbnb-alternatives-2026", label: "Airbnb Alternatives 2026", intent: "competitor" },
      { slug: "lower-fee-short-term-rental-platform", label: "Lower Fee Short Term Rental Platform", intent: "competitor" },
      { slug: "vrbo-fees-comparison", label: "Vrbo Fees Comparison", intent: "competitor" },
    ],
    blurbs: {
      renter: "Finding the perfect short-term living space — whether for a vacation, business trip, corporate relocation, or extended stay — is easier than ever with Leli Rentals. Our platform connects travellers and temporary residents directly with property owners offering fully furnished apartments, holiday homes, beach houses, serviced studios, luxury villas, and unique stays in hundreds of cities worldwide. Every living space listing on Leli Rentals includes verified photos, transparent pricing, owner ratings, and flexible booking periods ranging from a single night to several months. We believe accommodation rental should be fair for both renters and hosts — which is why we charge no sky-high service fees like Airbnb or booking platforms that add 15% to 20% on top of the listed price. What you see is what you pay. Browse thousands of verified short-term living spaces globally and find your perfect home away from home today.",
      owner: "Your property is more than a place to live — it is a powerful income-generating asset. Whether you own a spare bedroom, a fully furnished apartment, a holiday villa, or a serviced residence, listing it on Leli Rentals connects you with thousands of verified short-term tenants and travellers actively searching for quality accommodation worldwide. Unlike Airbnb or Vrbo, which deduct significant host service fees from every booking, Leli Rentals charges hosts a simple flat monthly subscription — meaning you keep more of every payment you receive. Our platform makes property listing straightforward: upload photos, write your description, set your nightly or monthly rate, and define your availability. Within minutes your property is live and visible to renters in your city and beyond. Thousands of property owners across Africa, Europe, Asia, and the Americas already use Leli Rentals to generate consistent short-term rental income from their homes and investment properties.",
      competitor: "Airbnb, Vrbo, and Booking.com have built enormous platforms — but their fee structures are designed to maximise platform revenue, not host income. Airbnb alone charges hosts up to 3% per booking plus guest service fees that can reach 14%, making your property appear more expensive to renters while cutting into your earnings simultaneously. Many hosts report losing between $200 and $500 monthly purely to platform fees. Leli Rentals offers a genuine alternative. Our short-term property rental marketplace charges hosts a single flat monthly subscription with absolutely zero commission deductions per booking. Your listed price is your earned price — nothing taken out at checkout. We provide the same professional hosting tools — verified guest profiles, secure payments, booking management, and global visibility — without the punishing fee structure. Whether you are switching from Airbnb, Vrbo, or any other platform, joining Leli Rentals means more of your property's earning potential stays exactly where it belongs — with you.",
    },
    images: {
      renter: `${IMG}/living-spaces-renter.jpg`,
      owner: `${IMG}/living-spaces-owner.jpg`,
    },
    outlinks: [
      { anchor: "Global housing trends from UN-Habitat", url: "https://unhabitat.org/topic/housing" },
      { anchor: "Property rental income guide from Investopedia", url: "https://www.investopedia.com/articles/investing/090815/buying-your-first-investment-property-top-10-tips.asp" },
      { anchor: "Interior design inspiration on Architectural Digest", url: "https://www.architecturaldigest.com/" },
      { anchor: "Short-term rental market insights from Forbes", url: "https://www.forbes.com/real-estate/" },
    ],
  },
  {
    id: "equipment",
    name: "Equipment & Tools",
    renterKeywords: [
      { slug: "rent-power-tools", label: "Rent Power Tools", intent: "renter" },
      { slug: "hire-construction-equipment", label: "Hire Construction Equipment", intent: "renter" },
      { slug: "rent-pressure-washer", label: "Rent Pressure Washer", intent: "renter" },
      { slug: "hire-skid-steer", label: "Hire Skid Steer", intent: "renter" },
      { slug: "rent-excavator", label: "Rent Excavator", intent: "renter" },
      { slug: "tool-hire", label: "Tool Hire", intent: "renter" },
      { slug: "rent-scaffolding", label: "Rent Scaffolding", intent: "renter" },
      { slug: "hire-jackhammer", label: "Hire Jackhammer", intent: "renter" },
      { slug: "rent-concrete-mixer", label: "Rent Concrete Mixer", intent: "renter" },
      { slug: "rent-generator", label: "Rent Generator", intent: "renter" },
      { slug: "hire-earth-mover", label: "Hire Earth Mover", intent: "renter" },
      { slug: "rent-lawn-equipment", label: "Rent Lawn Equipment", intent: "renter" },
      { slug: "rent-chainsaw", label: "Rent Chainsaw", intent: "renter" },
      { slug: "construction-equipment-hire", label: "Construction Equipment Hire", intent: "renter" },
      { slug: "rent-heavy-machinery", label: "Rent Heavy Machinery", intent: "renter" },
    ],
    ownerKeywords: [
      { slug: "how-to-make-money-renting-my-tools", label: "How to Make Money Renting My Tools", intent: "owner" },
      { slug: "list-my-tools-for-rent", label: "List My Tools for Rent", intent: "owner" },
      { slug: "passive-income-from-equipment", label: "Passive Income From Equipment", intent: "owner" },
      { slug: "rent-out-my-construction-equipment", label: "Rent Out My Construction Equipment", intent: "owner" },
      { slug: "how-much-can-i-earn-renting-my-skid-steer", label: "How Much Can I Earn Renting My Skid Steer", intent: "owner" },
      { slug: "make-money-from-idle-machinery", label: "Make Money From Idle Machinery", intent: "owner" },
      { slug: "best-site-to-list-tools-for-rent", label: "Best Site to List Tools for Rent", intent: "owner" },
      { slug: "earn-from-renting-power-tools", label: "Earn From Renting Power Tools", intent: "owner" },
      { slug: "how-to-rent-out-heavy-equipment", label: "How to Rent Out Heavy Equipment", intent: "owner" },
      { slug: "monetize-construction-equipment", label: "Monetize Construction Equipment", intent: "owner" },
      { slug: "list-excavator-for-rent", label: "List Excavator for Rent", intent: "owner" },
      { slug: "side-hustle-renting-tools", label: "Side Hustle Renting Tools", intent: "owner" },
      { slug: "equipment-rental-income-calculator", label: "Equipment Rental Income Calculator", intent: "owner" },
      { slug: "how-to-list-machinery-for-hire", label: "How to List Machinery for Hire", intent: "owner" },
      { slug: "rent-out-my-generator-for-income", label: "Rent Out My Generator for Income", intent: "owner" },
    ],
    competitorKeywords: [
      { slug: "home-depot-rental-alternative", label: "Home Depot Rental Alternative", intent: "competitor" },
      { slug: "cheaper-than-sunbelt-rentals", label: "Cheaper Than Sunbelt Rentals", intent: "competitor" },
      { slug: "united-rentals-alternative", label: "United Rentals Alternative", intent: "competitor" },
      { slug: "avoid-equipment-rental-depot-fees", label: "Avoid Equipment Rental Depot Fees", intent: "competitor" },
      { slug: "peer-to-peer-tool-rental", label: "Peer to Peer Tool Rental", intent: "competitor" },
      { slug: "tool-hire-without-depot-markup", label: "Tool Hire Without Depot Markup", intent: "competitor" },
      { slug: "best-alternative-to-home-depot-rental", label: "Best Alternative to Home Depot Rental", intent: "competitor" },
      { slug: "sunbelt-rentals-vs-leli", label: "Sunbelt Rentals vs Leli", intent: "competitor" },
      { slug: "equipment-rental-platform-lower-fees", label: "Equipment Rental Platform Lower Fees", intent: "competitor" },
      { slug: "tool-rental-marketplace-alternative", label: "Tool Rental Marketplace Alternative", intent: "competitor" },
      { slug: "construction-equipment-hire-alternative-2026", label: "Construction Equipment Hire Alternative 2026", intent: "competitor" },
      { slug: "cheaper-tool-hire-option", label: "Cheaper Tool Hire Option", intent: "competitor" },
      { slug: "peer-to-peer-equipment-rental-site", label: "Peer to Peer Equipment Rental Site", intent: "competitor" },
    ],
    blurbs: {
      renter: "Access professional-grade equipment and tools without the enormous upfront cost of ownership. Leli Rentals connects contractors, DIY enthusiasts, landscapers, and project managers directly with local equipment owners offering daily and weekly hire of power tools, construction machinery, pressure washers, excavators, concrete mixers, generators, skid steers, scaffolding, and much more. Renting equipment through our peer-to-peer marketplace means you pay only for the time you actually need the tool — saving thousands compared to purchasing outright. Every equipment listing on Leli Rentals includes owner ratings, condition details, transparent hire rates, and flexible booking terms. Whether you are tackling a home renovation, a large construction project, or a seasonal landscaping job, you will find the right tool available near you at a fraction of the retail price. Browse available equipment and tools in your city and get your project started today — no long-term commitment required.",
      owner: "Professional equipment and power tools represent a significant investment — and for most owners, those assets sit unused for large portions of the year. Listing your tools and equipment on Leli Rentals turns that idle capital into consistent rental income. Our peer-to-peer equipment hire marketplace connects tool owners with contractors, tradespeople, and DIY enthusiasts in their city who need short-term access to professional-grade machinery. Whether you own a pressure washer, a concrete mixer, a skid steer, an excavator, or a collection of power tools, there is consistent demand from renters who need exactly what you have. Unlike equipment depot companies that operate on complex insurance and markup structures, Leli Rentals keeps it simple — a flat monthly subscription gives you unlimited listings and you keep every cent your equipment earns. Start listing your tools today and let your equipment work for you even when you are not working yourself.",
      competitor: "Home Depot Tool Rental, Sunbelt Rentals, and United Rentals dominate the equipment hire industry — but their pricing models are built around corporate overhead, depot maintenance costs, and shareholder margins, not fair rates for owners or renters. Equipment owners who list through traditional depot channels receive a fraction of the actual hire revenue, while renters pay inflated rates that fund enormous physical infrastructure. Leli Rentals cuts through all of that. Our peer-to-peer equipment rental marketplace connects tool and machinery owners directly with the people who need them — no depot middleman, no inflated markup, no corporate fee structure. Equipment owners keep 100% of every hire payment under a simple flat monthly subscription. Renters access the same professional-grade tools and machinery at significantly lower daily rates. Whether you are an equipment owner tired of unfair revenue splits or a renter looking for better rates than the big depot chains offer, Leli Rentals is the smarter, fairer alternative for equipment hire.",
    },
    images: {
      renter: `${IMG}/equipment-tools-renter.jpg`,
      owner: `${IMG}/equipment-tools-owner.jpg`,
    },
    outlinks: [
      { anchor: "Equipment safety standards from OSHA", url: "https://www.osha.gov/tools-equipment" },
      { anchor: "Professional tool reviews on Popular Mechanics", url: "https://www.popularmechanics.com/home/tools/" },
      { anchor: "Home improvement and tool guides from This Old House", url: "https://www.thisoldhouse.com/tools" },
      { anchor: "Construction industry news and equipment trends", url: "https://www.constructiondive.com/" },
    ],
  },
  {
    id: "electronics",
    name: "Electronics",
    renterKeywords: [
      { slug: "rent-gaming-pc", label: "Rent Gaming PC", intent: "renter" },
      { slug: "hire-laptop", label: "Hire Laptop", intent: "renter" },
      { slug: "rent-projector", label: "Rent Projector", intent: "renter" },
      { slug: "hire-vr-headset", label: "Hire VR Headset", intent: "renter" },
      { slug: "rent-drone", label: "Rent Drone", intent: "renter" },
      { slug: "rent-ipad", label: "Rent iPad", intent: "renter" },
      { slug: "hire-smart-tv", label: "Hire Smart TV", intent: "renter" },
      { slug: "rent-gaming-console", label: "Rent Gaming Console", intent: "renter" },
      { slug: "rent-dj-equipment", label: "Rent DJ Equipment", intent: "renter" },
      { slug: "hire-sound-system", label: "Hire Sound System", intent: "renter" },
      { slug: "rent-streaming-equipment", label: "Rent Streaming Equipment", intent: "renter" },
      { slug: "rent-macbook", label: "Rent MacBook", intent: "renter" },
      { slug: "hire-4k-monitor", label: "Hire 4K Monitor", intent: "renter" },
      { slug: "rent-home-theatre-system", label: "Rent Home Theatre System", intent: "renter" },
      { slug: "rent-audio-equipment", label: "Rent Audio Equipment", intent: "renter" },
    ],
    ownerKeywords: [
      { slug: "how-to-make-money-renting-my-electronics", label: "How to Make Money Renting My Electronics", intent: "owner" },
      { slug: "list-my-laptop-for-rent", label: "List My Laptop for Rent", intent: "owner" },
      { slug: "passive-income-from-gadgets", label: "Passive Income From Gadgets", intent: "owner" },
      { slug: "rent-out-my-gaming-pc", label: "Rent Out My Gaming PC", intent: "owner" },
      { slug: "how-much-can-i-earn-renting-my-drone", label: "How Much Can I Earn Renting My Drone", intent: "owner" },
      { slug: "make-money-from-idle-electronics", label: "Make Money From Idle Electronics", intent: "owner" },
      { slug: "best-site-to-list-electronics-for-rent", label: "Best Site to List Electronics for Rent", intent: "owner" },
      { slug: "earn-from-renting-gadgets", label: "Earn From Renting Gadgets", intent: "owner" },
      { slug: "how-to-rent-out-tech-equipment", label: "How to Rent Out Tech Equipment", intent: "owner" },
      { slug: "monetize-my-macbook", label: "Monetize My MacBook", intent: "owner" },
      { slug: "list-gaming-console-for-rent", label: "List Gaming Console for Rent", intent: "owner" },
      { slug: "side-hustle-renting-electronics", label: "Side Hustle Renting Electronics", intent: "owner" },
      { slug: "electronics-rental-income-calculator", label: "Electronics Rental Income Calculator", intent: "owner" },
      { slug: "how-to-list-vr-headset-for-hire", label: "How to List VR Headset for Hire", intent: "owner" },
      { slug: "rent-out-my-projector-for-income", label: "Rent Out My Projector for Income", intent: "owner" },
    ],
    competitorKeywords: [
      { slug: "fat-llama-alternative", label: "Fat Llama Alternative", intent: "competitor" },
      { slug: "cheaper-than-fat-llama", label: "Cheaper Than Fat Llama", intent: "competitor" },
      { slug: "sites-like-fat-llama-with-lower-fees", label: "Sites Like Fat Llama With Lower Fees", intent: "competitor" },
      { slug: "fat-llama-vs-leli-rentals", label: "Fat Llama vs Leli Rentals", intent: "competitor" },
      { slug: "lumoid-alternative", label: "Lumoid Alternative", intent: "competitor" },
      { slug: "avoid-fat-llama-commission", label: "Avoid Fat Llama Commission", intent: "competitor" },
      { slug: "borrowlenses-alternative", label: "BorrowLenses Alternative", intent: "competitor" },
      { slug: "best-fat-llama-competitor", label: "Best Fat Llama Competitor", intent: "competitor" },
      { slug: "electronics-rental-without-commission", label: "Electronics Rental Without Commission", intent: "competitor" },
      { slug: "gadget-hire-lower-fees-2026", label: "Gadget Hire Lower Fees 2026", intent: "competitor" },
      { slug: "peer-to-peer-electronics-rental", label: "Peer to Peer Electronics Rental", intent: "competitor" },
      { slug: "fat-llama-fees-too-high", label: "Fat Llama Fees Too High", intent: "competitor" },
      { slug: "tech-rental-marketplace-alternative", label: "Tech Rental Marketplace Alternative", intent: "competitor" },
    ],
    blurbs: {
      renter: "Access the latest technology without the steep cost of ownership by renting electronics through Leli Rentals. Our peer-to-peer electronics rental marketplace connects renters with trusted local owners offering laptops, gaming PCs, projectors, VR headsets, drones, iPads, smart TVs, gaming consoles, DJ equipment, sound systems, 4K monitors, MacBooks, streaming gear, and audio equipment for daily, weekly, or monthly hire. Whether you need a high-performance laptop for a work trip, a projector for a conference, a gaming console for a weekend, or a professional sound system for an event, Leli Rentals has you covered across hundreds of cities worldwide. Every electronics listing includes verified owner ratings, condition descriptions, transparent hire rates, and secure booking. Stop paying full retail price for technology you only need temporarily — rent directly from a trusted local owner and get exactly what you need, when you need it, at a fraction of the purchase price.",
      owner: "Your electronics depreciate in value whether you use them or not — so why not make them earn while they sit idle? Listing your gadgets, tech equipment, and electronics on Leli Rentals connects you with thousands of verified renters actively searching to hire laptops, gaming PCs, drones, projectors, VR headsets, sound systems, and more in cities worldwide. The consumer electronics rental market is growing rapidly as more individuals and businesses choose access over ownership — and your devices are exactly what they are looking for. Unlike platforms that take significant commission cuts from every booking, Leli Rentals charges a simple flat monthly subscription, meaning 100% of your rental earnings stay in your pocket. Setting up an electronics listing takes minutes — add photos, set your daily rate, describe the condition and included accessories, and go live. Whether you have one item or a full catalogue of tech gear, start listing today and let your electronics generate income on your schedule.",
      competitor: "Fat Llama, Lumoid, and BorrowLenses have created a market for peer-to-peer electronics rental — but their commission structures take a substantial cut from every transaction, reducing the income equipment owners actually receive. Fat Llama alone charges owners up to 15% commission per rental, meaning on a $200 weekly hire you lose $30 before accounting for any other costs. For frequent listers with multiple devices, those deductions add up to thousands of dollars annually. Leli Rentals offers electronics owners a fundamentally better deal. Our marketplace charges a single flat monthly subscription — no per-transaction commission, no percentage deductions, no surprise fees at payout. List your laptops, drones, cameras, gaming gear, projectors, and audio equipment and keep every cent renters pay you. We provide the same secure platform, verified renter profiles, and global marketplace visibility — simply without taking a cut of your income. Switch to Leli Rentals and immediately increase what your electronics actually earn you.",
    },
    images: {
      renter: `${IMG}/electronics-renter.jpg`,
      owner: `${IMG}/electronics-owner.jpg`,
    },
    outlinks: [
      { anchor: "In-depth electronics reviews on CNET", url: "https://www.cnet.com/reviews/" },
      { anchor: "Latest technology news and reviews from The Verge", url: "https://www.theverge.com/" },
      { anchor: "Expert electronics recommendations from Wirecutter", url: "https://www.nytimes.com/wirecutter/electronics/" },
      { anchor: "Global technology standards from IEEE", url: "https://www.ieee.org/" },
    ],
  },
  {
    id: "fashion",
    name: "Fashion & Accessories",
    renterKeywords: [
      { slug: "rent-designer-dress", label: "Rent Designer Dress", intent: "renter" },
      { slug: "hire-evening-gown", label: "Hire Evening Gown", intent: "renter" },
      { slug: "rent-luxury-handbag", label: "Rent Luxury Handbag", intent: "renter" },
      { slug: "hire-tuxedo", label: "Hire Tuxedo", intent: "renter" },
      { slug: "rent-wedding-outfit", label: "Rent Wedding Outfit", intent: "renter" },
      { slug: "hire-prom-dress", label: "Hire Prom Dress", intent: "renter" },
      { slug: "rent-designer-suit", label: "Rent Designer Suit", intent: "renter" },
      { slug: "hire-gala-dress", label: "Hire Gala Dress", intent: "renter" },
      { slug: "rent-jewellery", label: "Rent Jewellery", intent: "renter" },
      { slug: "hire-formal-wear", label: "Hire Formal Wear", intent: "renter" },
      { slug: "rent-accessories", label: "Rent Accessories", intent: "renter" },
      { slug: "hire-luxury-shoes", label: "Hire Luxury Shoes", intent: "renter" },
      { slug: "rent-bridesmaid-dress", label: "Rent Bridesmaid Dress", intent: "renter" },
      { slug: "hire-costume", label: "Hire Costume", intent: "renter" },
      { slug: "rent-designer-clothes", label: "Rent Designer Clothes", intent: "renter" },
    ],
    ownerKeywords: [
      { slug: "how-to-make-money-renting-my-clothes", label: "How to Make Money Renting My Clothes", intent: "owner" },
      { slug: "list-my-designer-dress-for-rent", label: "List My Designer Dress for Rent", intent: "owner" },
      { slug: "passive-income-from-fashion-items", label: "Passive Income From Fashion Items", intent: "owner" },
      { slug: "rent-out-my-luxury-handbag", label: "Rent Out My Luxury Handbag", intent: "owner" },
      { slug: "how-much-can-i-earn-renting-my-wardrobe", label: "How Much Can I Earn Renting My Wardrobe", intent: "owner" },
      { slug: "make-money-from-designer-clothes", label: "Make Money From Designer Clothes", intent: "owner" },
      { slug: "best-site-to-list-fashion-for-rent", label: "Best Site to List Fashion for Rent", intent: "owner" },
      { slug: "earn-from-renting-accessories", label: "Earn From Renting Accessories", intent: "owner" },
      { slug: "how-to-rent-out-luxury-items", label: "How to Rent Out Luxury Items", intent: "owner" },
      { slug: "monetize-my-wardrobe", label: "Monetize My Wardrobe", intent: "owner" },
      { slug: "list-tuxedo-for-rent", label: "List Tuxedo for Rent", intent: "owner" },
      { slug: "side-hustle-renting-fashion", label: "Side Hustle Renting Fashion", intent: "owner" },
      { slug: "fashion-rental-income-calculator", label: "Fashion Rental Income Calculator", intent: "owner" },
      { slug: "how-to-list-designer-wear-for-hire", label: "How to List Designer Wear for Hire", intent: "owner" },
      { slug: "rent-out-my-jewellery-for-income", label: "Rent Out My Jewellery for Income", intent: "owner" },
    ],
    competitorKeywords: [
      { slug: "rent-the-runway-alternative", label: "Rent the Runway Alternative", intent: "competitor" },
      { slug: "cheaper-than-rent-the-runway", label: "Cheaper Than Rent the Runway", intent: "competitor" },
      { slug: "sites-like-rent-the-runway-lower-fees", label: "Sites Like Rent the Runway Lower Fees", intent: "competitor" },
      { slug: "nuuly-alternative", label: "Nuuly Alternative", intent: "competitor" },
      { slug: "avoid-rent-the-runway-commission", label: "Avoid Rent the Runway Commission", intent: "competitor" },
      { slug: "by-rotation-alternative", label: "By Rotation Alternative", intent: "competitor" },
      { slug: "best-fashion-rental-app-alternative", label: "Best Fashion Rental App Alternative", intent: "competitor" },
      { slug: "designer-clothes-rental-without-fees", label: "Designer Clothes Rental Without Fees", intent: "competitor" },
      { slug: "fashion-hire-lower-commission-2026", label: "Fashion Hire Lower Commission 2026", intent: "competitor" },
      { slug: "peer-to-peer-clothes-rental", label: "Peer to Peer Clothes Rental", intent: "competitor" },
      { slug: "rent-the-runway-fees-too-high", label: "Rent the Runway Fees Too High", intent: "competitor" },
      { slug: "luxury-fashion-rental-marketplace", label: "Luxury Fashion Rental Marketplace", intent: "competitor" },
      { slug: "clothes-rental-site-comparison", label: "Clothes Rental Site Comparison", intent: "competitor" },
    ],
    blurbs: {
      renter: "Wear designer fashion and luxury accessories for any occasion without paying full retail price. Leli Rentals connects fashion-conscious renters directly with wardrobe owners offering designer dresses, evening gowns, luxury handbags, tuxedos, wedding outfits, prom dresses, gala wear, formal suits, jewellery, shoes, costumes, and accessories for hire worldwide. Whether you are attending a wedding, a gala dinner, a corporate event, a themed party, or a photoshoot, our peer-to-peer fashion rental marketplace gives you access to premium styles at a fraction of the boutique rental price. Every fashion listing on Leli Rentals includes verified photos, sizing details, owner ratings, transparent hire rates, and flexible booking periods. Unlike traditional dress hire shops with limited inventory and high markups, our platform connects you directly with wardrobe owners who care for their pieces and offer them at competitive rates. Browse fashion and accessories available near you and dress for every occasion without the ownership cost.",
      owner: "Your designer wardrobe is a goldmine waiting to be unlocked. Listing your fashion items and accessories on Leli Rentals connects you with style-conscious renters searching for designer dresses, luxury handbags, formal wear, jewellery, and accessories for weddings, galas, photoshoots, and special events in cities worldwide. The peer-to-peer fashion rental market is one of the fastest growing segments in the sharing economy — and your wardrobe items are exactly what renters are looking for. Unlike Rent the Runway or By Rotation which charge owners significant commission fees on every transaction, Leli Rentals operates on a simple flat monthly subscription, meaning you keep 100% of every rental payment. Listing a fashion item takes minutes — photograph it clearly, describe the size and condition, set your daily hire rate, and go live. Whether you have a single statement piece or an entire curated wardrobe, start earning from your fashion collection today.",
      competitor: "Rent the Runway, Nuuly, and By Rotation pioneered fashion rental — but the economics for wardrobe owners on these platforms leave much to be desired. Commission rates, complex cleaning fee policies, and platform-controlled pricing mean owners often receive far less than their items are worth per rental. By Rotation charges owners a percentage of every hire while maintaining control over dispute resolution and payout timelines. Leli Rentals gives fashion and wardrobe owners full control and full earnings. Our peer-to-peer fashion rental marketplace charges a flat monthly subscription — no commission per rental, no percentage deductions, no platform-controlled pricing. You set your hire rate, you receive the full payment, and you manage your items on your terms. Whether you are listing a single designer handbag, a collection of evening wear, or an entire curated wardrobe, Leli Rentals ensures your fashion earns what it is genuinely worth. Make the switch and keep 100% of every rental your wardrobe generates.",
    },
    images: {
      renter: `${IMG}/fashion-accessories-renter.jpg`,
      owner: `${IMG}/fashion-accessories-owner.jpg`,
    },
    outlinks: [
      { anchor: "Global fashion trends and style guides on Vogue", url: "https://www.vogue.com/fashion" },
      { anchor: "Fashion industry insights from Business of Fashion", url: "https://www.businessoffashion.com/" },
      { anchor: "Fashion inspiration and style advice from Harper's Bazaar", url: "https://www.harpersbazaar.com/fashion/" },
      { anchor: "Sustainable fashion and circular economy report", url: "https://www.thredup.com/resale/" },
    ],
  },
  {
    id: "entertainment",
    name: "Entertainment",
    renterKeywords: [
      { slug: "rent-party-equipment", label: "Rent Party Equipment", intent: "renter" },
      { slug: "hire-bouncy-castle", label: "Hire Bouncy Castle", intent: "renter" },
      { slug: "rent-photo-booth", label: "Rent Photo Booth", intent: "renter" },
      { slug: "hire-dj-equipment", label: "Hire DJ Equipment", intent: "renter" },
      { slug: "rent-karaoke-machine", label: "Rent Karaoke Machine", intent: "renter" },
      { slug: "hire-party-tent", label: "Hire Party Tent", intent: "renter" },
      { slug: "rent-arcade-games", label: "Rent Arcade Games", intent: "renter" },
      { slug: "hire-stage-lighting", label: "Hire Stage Lighting", intent: "renter" },
      { slug: "rent-pa-system", label: "Rent PA System", intent: "renter" },
      { slug: "hire-popcorn-machine", label: "Hire Popcorn Machine", intent: "renter" },
      { slug: "rent-event-furniture", label: "Rent Event Furniture", intent: "renter" },
      { slug: "hire-cocktail-bar", label: "Hire Cocktail Bar", intent: "renter" },
      { slug: "rent-outdoor-cinema", label: "Rent Outdoor Cinema", intent: "renter" },
      { slug: "hire-foam-machine", label: "Hire Foam Machine", intent: "renter" },
      { slug: "rent-carnival-games", label: "Rent Carnival Games", intent: "renter" },
    ],
    ownerKeywords: [
      { slug: "how-to-make-money-renting-party-equipment", label: "How to Make Money Renting Party Equipment", intent: "owner" },
      { slug: "list-my-entertainment-gear-for-rent", label: "List My Entertainment Gear for Rent", intent: "owner" },
      { slug: "passive-income-from-event-equipment", label: "Passive Income From Event Equipment", intent: "owner" },
      { slug: "rent-out-my-bouncy-castle", label: "Rent Out My Bouncy Castle", intent: "owner" },
      { slug: "how-much-can-i-earn-renting-my-photo-booth", label: "How Much Can I Earn Renting My Photo Booth", intent: "owner" },
      { slug: "make-money-from-party-supplies", label: "Make Money From Party Supplies", intent: "owner" },
      { slug: "best-site-to-list-entertainment-equipment", label: "Best Site to List Entertainment Equipment", intent: "owner" },
      { slug: "earn-from-renting-event-gear", label: "Earn From Renting Event Gear", intent: "owner" },
      { slug: "how-to-rent-out-dj-equipment", label: "How to Rent Out DJ Equipment", intent: "owner" },
      { slug: "monetize-my-party-equipment", label: "Monetize My Party Equipment", intent: "owner" },
      { slug: "list-pa-system-for-rent", label: "List PA System for Rent", intent: "owner" },
      { slug: "side-hustle-renting-entertainment-gear", label: "Side Hustle Renting Entertainment Gear", intent: "owner" },
      { slug: "event-equipment-rental-income-calculator", label: "Event Equipment Rental Income Calculator", intent: "owner" },
      { slug: "how-to-list-party-items-for-hire", label: "How to List Party Items for Hire", intent: "owner" },
      { slug: "rent-out-my-stage-lighting", label: "Rent Out My Stage Lighting", intent: "owner" },
    ],
    competitorKeywords: [
      { slug: "party-equipment-rental-alternative", label: "Party Equipment Rental Alternative", intent: "competitor" },
      { slug: "cheaper-than-party-hire-companies", label: "Cheaper Than Party Hire Companies", intent: "competitor" },
      { slug: "peer-to-peer-entertainment-rental", label: "Peer to Peer Entertainment Rental", intent: "competitor" },
      { slug: "avoid-party-hire-depot-fees", label: "Avoid Party Hire Depot Fees", intent: "competitor" },
      { slug: "event-equipment-rental-without-markup", label: "Event Equipment Rental Without Markup", intent: "competitor" },
      { slug: "best-alternative-to-party-hire-company", label: "Best Alternative to Party Hire Company", intent: "competitor" },
      { slug: "entertainment-gear-rental-lower-fees", label: "Entertainment Gear Rental Lower Fees", intent: "competitor" },
      { slug: "party-supply-rental-marketplace", label: "Party Supply Rental Marketplace", intent: "competitor" },
      { slug: "event-equipment-hire-alternative-2026", label: "Event Equipment Hire Alternative 2026", intent: "competitor" },
      { slug: "peer-to-peer-party-rental-site", label: "Peer to Peer Party Rental Site", intent: "competitor" },
      { slug: "cheaper-bouncy-castle-hire", label: "Cheaper Bouncy Castle Hire", intent: "competitor" },
      { slug: "entertainment-rental-platform-comparison", label: "Entertainment Rental Platform Comparison", intent: "competitor" },
      { slug: "lower-fee-event-equipment-rental", label: "Lower Fee Event Equipment Rental", intent: "competitor" },
    ],
    blurbs: {
      renter: "Make every event unforgettable by renting professional entertainment equipment through Leli Rentals. Our peer-to-peer entertainment hire marketplace connects event planners, party hosts, and entertainers directly with local equipment owners offering photo booths, bouncy castles, DJ equipment, karaoke machines, party tents, arcade games, stage lighting, PA systems, popcorn machines, cocktail bars, outdoor cinema setups, foam machines, carnival games, and event furniture for hire worldwide. Whether you are organising a birthday party, a corporate event, a wedding reception, a festival, or a community gathering, you will find exactly the entertainment equipment you need available near you at competitive daily hire rates. Every entertainment listing on Leli Rentals includes verified owner ratings, condition details, transparent pricing, and flexible booking terms. Stop overpaying traditional event hire companies — rent directly from local owners and create the perfect event atmosphere without the inflated depot markup.",
      owner: "Party and entertainment equipment represents a significant investment — and for most owners, it sits in storage between events earning nothing. Listing your entertainment gear on Leli Rentals puts those idle assets to work. Our marketplace connects entertainment equipment owners with event planners, party hosts, and entertainers across hundreds of cities who need short-term access to photo booths, DJ setups, bouncy castles, PA systems, lighting rigs, outdoor cinemas, and more. The event hire market runs year-round — birthdays, weddings, corporate events, and festivals happen every weekend in every city. Your equipment can be earning between your own events rather than collecting dust. Leli Rentals charges a flat monthly subscription with zero commission deductions — every rental payment goes directly to you. Setting up an entertainment equipment listing is simple: photograph your gear, describe what is included, set your daily rate, and publish. Start listing your entertainment equipment today and turn every idle weekend into income.",
      competitor: "Traditional party and event hire companies — from local depot operators to national chains — built their pricing models on physical showrooms, large staff teams, and significant overhead costs. That overhead is passed directly to renters in the form of inflated hire rates and to equipment owners through unfair revenue splits. Leli Rentals eliminates the middleman entirely. Our peer-to-peer entertainment equipment marketplace connects party gear owners directly with event organisers, party hosts, and entertainers in their city — no depot overhead, no showroom markup, no commission structure eating into earnings. Equipment owners list their photo booths, PA systems, bouncy castles, lighting rigs, and event furniture on a simple flat monthly subscription and keep every cent each hire generates. Renters access the same professional-grade entertainment equipment at rates significantly below traditional hire companies. Whether you are an equipment owner looking for a better revenue model or a renter tired of overpaying for party gear, Leli Rentals is the smarter choice for entertainment equipment hire.",
    },
    images: {
      renter: `${IMG}/entertainment-renter.jpg`,
      owner: `${IMG}/entertainment-owner.jpg`,
    },
    outlinks: [
      { anchor: "Event planning tips and guides from Eventbrite", url: "https://www.eventbrite.com/blog/" },
      { anchor: "Entertainment industry news from Billboard", url: "https://www.billboard.com/" },
      { anchor: "Technology and entertainment culture from Wired", url: "https://www.wired.com/" },
      { anchor: "Wedding planning and entertainment ideas from The Knot", url: "https://www.theknot.com/" },
    ],
  },
  {
    id: "utility",
    name: "Utility Spaces",
    renterKeywords: [
      { slug: "rent-storage-unit", label: "Rent Storage Unit", intent: "renter" },
      { slug: "hire-parking-space", label: "Hire Parking Space", intent: "renter" },
      { slug: "rent-workshop-space", label: "Rent Workshop Space", intent: "renter" },
      { slug: "hire-garage", label: "Hire Garage", intent: "renter" },
      { slug: "rent-studio-space", label: "Rent Studio Space", intent: "renter" },
      { slug: "hire-loading-bay", label: "Hire Loading Bay", intent: "renter" },
      { slug: "rent-warehouse-space", label: "Rent Warehouse Space", intent: "renter" },
      { slug: "hire-pop-up-shop-space", label: "Hire Pop Up Shop Space", intent: "renter" },
      { slug: "rent-cold-storage", label: "Rent Cold Storage", intent: "renter" },
      { slug: "hire-driveway", label: "Hire Driveway", intent: "renter" },
      { slug: "rent-garden-storage", label: "Rent Garden Storage", intent: "renter" },
      { slug: "rent-self-storage", label: "Rent Self Storage", intent: "renter" },
      { slug: "hire-secure-parking", label: "Hire Secure Parking", intent: "renter" },
      { slug: "rent-commercial-storage", label: "Rent Commercial Storage", intent: "renter" },
      { slug: "hire-studio-apartment-storage", label: "Hire Studio Apartment Storage", intent: "renter" },
    ],
    ownerKeywords: [
      { slug: "how-to-make-money-renting-my-garage", label: "How to Make Money Renting My Garage", intent: "owner" },
      { slug: "list-my-parking-space-for-rent", label: "List My Parking Space for Rent", intent: "owner" },
      { slug: "passive-income-from-spare-storage", label: "Passive Income From Spare Storage", intent: "owner" },
      { slug: "rent-out-my-driveway", label: "Rent Out My Driveway", intent: "owner" },
      { slug: "how-much-can-i-earn-renting-my-storage", label: "How Much Can I Earn Renting My Storage", intent: "owner" },
      { slug: "make-money-from-unused-space", label: "Make Money From Unused Space", intent: "owner" },
      { slug: "best-site-to-list-storage-for-rent", label: "Best Site to List Storage for Rent", intent: "owner" },
      { slug: "earn-from-renting-parking-space", label: "Earn From Renting Parking Space", intent: "owner" },
      { slug: "how-to-rent-out-warehouse", label: "How to Rent Out Warehouse", intent: "owner" },
      { slug: "monetize-my-garage", label: "Monetize My Garage", intent: "owner" },
      { slug: "list-workshop-for-rent", label: "List Workshop for Rent", intent: "owner" },
      { slug: "side-hustle-renting-utility-spaces", label: "Side Hustle Renting Utility Spaces", intent: "owner" },
      { slug: "storage-rental-income-calculator", label: "Storage Rental Income Calculator", intent: "owner" },
      { slug: "how-to-list-parking-for-hire", label: "How to List Parking for Hire", intent: "owner" },
      { slug: "rent-out-my-studio-space", label: "Rent Out My Studio Space", intent: "owner" },
    ],
    competitorKeywords: [
      { slug: "neighbor-alternative", label: "Neighbor Alternative", intent: "competitor" },
      { slug: "cheaper-than-neighbor-storage", label: "Cheaper Than Neighbor Storage", intent: "competitor" },
      { slug: "spacer-alternative", label: "Spacer Alternative", intent: "competitor" },
      { slug: "avoid-storage-facility-fees", label: "Avoid Storage Facility Fees", intent: "competitor" },
      { slug: "peer-to-peer-storage-rental", label: "Peer to Peer Storage Rental", intent: "competitor" },
      { slug: "self-storage-without-corporate-markup", label: "Self Storage Without Corporate Markup", intent: "competitor" },
      { slug: "best-alternative-to-neighbor", label: "Best Alternative to Neighbor", intent: "competitor" },
      { slug: "storage-rental-lower-fees-2026", label: "Storage Rental Lower Fees 2026", intent: "competitor" },
      { slug: "peer-to-peer-parking-rental", label: "Peer to Peer Parking Rental", intent: "competitor" },
      { slug: "storeatmyhouse-alternative", label: "StoreAtMyHouse Alternative", intent: "competitor" },
      { slug: "cheaper-storage-option", label: "Cheaper Storage Option", intent: "competitor" },
      { slug: "utility-space-rental-marketplace", label: "Utility Space Rental Marketplace", intent: "competitor" },
      { slug: "lower-fee-storage-platform", label: "Lower Fee Storage Platform", intent: "competitor" },
    ],
    blurbs: {
      renter: "Finding affordable storage, parking, workshop space, or utility space in busy cities has never been easier. Leli Rentals connects individuals and businesses directly with local space owners offering garage hire, parking spaces, workshop rentals, warehouse space, self-storage units, cold storage, loading bays, driveways, garden storage, pop-up shop spaces, and studio apartments for short and long-term hire worldwide. Whether you need temporary storage during a move, a secure parking spot in a busy city centre, a workshop for a project, or a commercial space for a pop-up business, our peer-to-peer utility space marketplace has affordable options available near you. Every space listing on Leli Rentals includes verified photos, accurate dimensions, owner ratings, transparent pricing, and flexible booking periods. Stop paying inflated rates to corporate storage facilities and parking operators — rent directly from local space owners and access exactly what you need at fair market rates.",
      owner: "Unused space is lost income — and most property owners have more rentable space than they realise. A spare garage, an unused driveway, an empty storage room, a vacant workshop, or a spare parking bay can all generate consistent monthly rental income when listed on Leli Rentals. Our peer-to-peer utility space marketplace connects space owners with individuals and businesses in their city actively searching for affordable garage hire, parking, storage, workshop space, and loading bays. In dense urban areas, demand for flexible utility space far exceeds supply — meaning your unused space could be earning from the very first week it goes live. Unlike corporate storage operators that keep most of the revenue, Leli Rentals charges a simple flat monthly subscription and you keep every cent renters pay you. Listing your utility space takes minutes — add photos, describe the size and access, set your monthly rate, and publish. Start monetising your empty space today.",
      competitor: "Neighbor, Spacer, and StoreAtMyHouse opened the peer-to-peer storage market — but their commission structures mean space owners consistently receive less than their spaces are worth. Neighbor charges hosts up to 30% commission on every storage payment, significantly reducing the monthly income property owners receive for sharing their garages, driveways, and spare rooms. On $500 monthly storage income, that is $150 gone before you see a cent. Leli Rentals gives utility space owners the full value of their listings. Our peer-to-peer space rental marketplace charges a single flat monthly subscription — no commission per booking, no percentage deductions, no payout delays. List your garage, parking space, workshop, warehouse, driveway, or storage room and keep 100% of every payment your space generates. We provide the same verified renter profiles, secure payment processing, and marketplace visibility as the established platforms — simply without taking a share of your earnings. Switch to Leli Rentals and immediately keep more of what your space is worth.",
    },
    images: {
      renter: `${IMG}/utility-spaces-renter.jpg`,
      owner: `${IMG}/utility-spaces-owner.jpg`,
    },
    outlinks: [
      { anchor: "Safe storage and environmental guidelines from the EPA", url: "https://www.epa.gov/" },
      { anchor: "Fire safety standards for storage spaces from NFPA", url: "https://www.nfpa.org/" },
      { anchor: "Urban real estate and space trends from ULI", url: "https://americas.uli.org/" },
      { anchor: "How to earn passive income from your space — Investopedia", url: "https://www.investopedia.com/passive-income-5069396" },
    ],
  },
  {
    id: "business",
    name: "Business Spaces",
    renterKeywords: [
      { slug: "rent-meeting-room", label: "Rent Meeting Room", intent: "renter" },
      { slug: "hire-office-space", label: "Hire Office Space", intent: "renter" },
      { slug: "rent-conference-room", label: "Rent Conference Room", intent: "renter" },
      { slug: "hire-coworking-desk", label: "Hire Coworking Desk", intent: "renter" },
      { slug: "rent-training-room", label: "Rent Training Room", intent: "renter" },
      { slug: "hire-boardroom", label: "Hire Boardroom", intent: "renter" },
      { slug: "rent-private-office", label: "Rent Private Office", intent: "renter" },
      { slug: "hire-event-space", label: "Hire Event Space", intent: "renter" },
      { slug: "rent-photoshoot-studio", label: "Rent Photoshoot Studio", intent: "renter" },
      { slug: "hire-podcast-studio", label: "Hire Podcast Studio", intent: "renter" },
      { slug: "rent-hot-desk", label: "Rent Hot Desk", intent: "renter" },
      { slug: "hire-seminar-room", label: "Hire Seminar Room", intent: "renter" },
      { slug: "rent-virtual-office", label: "Rent Virtual Office", intent: "renter" },
      { slug: "hire-presentation-room", label: "Hire Presentation Room", intent: "renter" },
      { slug: "rent-pop-up-office", label: "Rent Pop Up Office", intent: "renter" },
    ],
    ownerKeywords: [
      { slug: "how-to-make-money-renting-my-office", label: "How to Make Money Renting My Office", intent: "owner" },
      { slug: "list-my-meeting-room-for-rent", label: "List My Meeting Room for Rent", intent: "owner" },
      { slug: "passive-income-from-office-space", label: "Passive Income From Office Space", intent: "owner" },
      { slug: "rent-out-my-conference-room", label: "Rent Out My Conference Room", intent: "owner" },
      { slug: "how-much-can-i-earn-renting-my-workspace", label: "How Much Can I Earn Renting My Workspace", intent: "owner" },
      { slug: "make-money-from-unused-office", label: "Make Money From Unused Office", intent: "owner" },
      { slug: "best-site-to-list-business-space", label: "Best Site to List Business Space", intent: "owner" },
      { slug: "earn-from-renting-meeting-room", label: "Earn From Renting Meeting Room", intent: "owner" },
      { slug: "how-to-rent-out-coworking-space", label: "How to Rent Out Coworking Space", intent: "owner" },
      { slug: "monetize-my-office", label: "Monetize My Office", intent: "owner" },
      { slug: "list-boardroom-for-rent", label: "List Boardroom for Rent", intent: "owner" },
      { slug: "side-hustle-renting-business-spaces", label: "Side Hustle Renting Business Spaces", intent: "owner" },
      { slug: "office-rental-income-calculator", label: "Office Rental Income Calculator", intent: "owner" },
      { slug: "how-to-list-conference-room-for-hire", label: "How to List Conference Room for Hire", intent: "owner" },
      { slug: "rent-out-my-training-room", label: "Rent Out My Training Room", intent: "owner" },
    ],
    competitorKeywords: [
      { slug: "wework-alternative", label: "WeWork Alternative", intent: "competitor" },
      { slug: "cheaper-than-wework", label: "Cheaper Than WeWork", intent: "competitor" },
      { slug: "regus-alternative", label: "Regus Alternative", intent: "competitor" },
      { slug: "avoid-wework-membership-fees", label: "Avoid WeWork Membership Fees", intent: "competitor" },
      { slug: "peerspace-alternative", label: "Peerspace Alternative", intent: "competitor" },
      { slug: "peer-to-peer-office-rental", label: "Peer to Peer Office Rental", intent: "competitor" },
      { slug: "best-wework-competitor", label: "Best WeWork Competitor", intent: "competitor" },
      { slug: "business-space-without-corporate-fees", label: "Business Space Without Corporate Fees", intent: "competitor" },
      { slug: "meeting-room-rental-lower-cost-2026", label: "Meeting Room Rental Lower Cost 2026", intent: "competitor" },
      { slug: "peerspace-fees-too-high", label: "Peerspace Fees Too High", intent: "competitor" },
      { slug: "cheaper-coworking-alternative", label: "Cheaper Coworking Alternative", intent: "competitor" },
      { slug: "office-space-rental-marketplace", label: "Office Space Rental Marketplace", intent: "competitor" },
      { slug: "lower-fee-meeting-room-platform", label: "Lower Fee Meeting Room Platform", intent: "competitor" },
    ],
    blurbs: {
      renter: "Access professional business spaces on your own schedule without the long-term commitment of a traditional lease. Leli Rentals connects entrepreneurs, startups, remote workers, and corporate teams directly with space owners offering meeting rooms, private offices, conference rooms, coworking desks, training rooms, boardrooms, event spaces, photoshoot studios, podcast studios, hot desks, seminar rooms, and presentation rooms for hourly, daily, or weekly hire in cities worldwide. Whether you need a professional meeting room to impress a client, a private office for focused work, a conference room for a team workshop, or a podcast studio for content creation, our peer-to-peer business space marketplace has flexible options available near you at competitive rates. Every listing includes verified photos, capacity details, amenities descriptions, owner ratings, and transparent pricing. Stop overpaying WeWork or Regus for rigid membership plans — book exactly the space you need, exactly when you need it.",
      owner: "Your office, meeting room, boardroom, or commercial space could be generating income every day it sits empty. Listing your business space on Leli Rentals connects you with thousands of entrepreneurs, remote workers, corporate teams, and content creators actively searching for professional spaces to hire by the hour, day, or week in cities worldwide. The demand for flexible workspace has grown dramatically — businesses increasingly prefer paying for space only when they need it rather than committing to expensive long-term leases. Your space is exactly what they are looking for. Unlike WeWork or Peerspace which charge hosts significant commission fees, Leli Rentals operates on a flat monthly subscription — meaning you keep 100% of every space rental payment you receive. Whether you have a single meeting room, a full office floor, or a creative studio, listing takes minutes. Add photos, describe your space and amenities, set your hourly or daily rate, and start earning from your professional space today.",
      competitor: "WeWork, Regus, and Peerspace have dominated the flexible workspace market — but each comes with significant drawbacks for both space owners and users. WeWork and Regus lock users into membership plans and monthly commitments that charge for access whether you use the space or not. Peerspace charges space owners up to 15% commission on every booking, reducing what hosts actually earn from their meeting rooms and studios. Leli Rentals offers a genuinely better model for both sides. Business space owners pay a flat monthly subscription and keep 100% of every booking payment — no commission cuts, no percentage deductions regardless of how many bookings they receive. Renters access professional meeting rooms, private offices, conference rooms, and creative studios on a true pay-as-you-go basis with transparent pricing and no membership commitments. Whether you are a space owner looking to maximise rental income or a business user tired of inflexible membership structures, Leli Rentals delivers the professional workspace experience without the punishing cost model.",
    },
    images: {
      renter: `${IMG}/business-spaces-renter.jpg`,
      owner: `${IMG}/business-spaces-owner.jpg`,
    },
    outlinks: [
      { anchor: "The future of flexible workspaces from Forbes", url: "https://www.forbes.com/future-of-work/" },
      { anchor: "Remote work and flexible office insights from HBR", url: "https://hbr.org/topic/remote-work" },
      { anchor: "Commercial real estate market trends from CBRE", url: "https://www.cbre.com/insights/" },
      { anchor: "Small business and entrepreneurship advice from Inc.", url: "https://www.inc.com/" },
    ],
  },
  {
    id: "photography",
    name: "Photography",
    renterKeywords: [
      { slug: "rent-camera", label: "Rent Camera", intent: "renter" },
      { slug: "hire-photography-equipment", label: "Hire Photography Equipment", intent: "renter" },
      { slug: "rent-dslr", label: "Rent DSLR", intent: "renter" },
      { slug: "hire-sony-a7", label: "Hire Sony A7", intent: "renter" },
      { slug: "rent-canon-r5", label: "Rent Canon R5", intent: "renter" },
      { slug: "hire-camera-lens", label: "Hire Camera Lens", intent: "renter" },
      { slug: "rent-film-camera", label: "Rent Film Camera", intent: "renter" },
      { slug: "hire-lighting-equipment", label: "Hire Lighting Equipment", intent: "renter" },
      { slug: "rent-video-camera", label: "Rent Video Camera", intent: "renter" },
      { slug: "hire-gimbal", label: "Hire Gimbal", intent: "renter" },
      { slug: "rent-drone-for-photography", label: "Rent Drone for Photography", intent: "renter" },
      { slug: "hire-studio-flash", label: "Hire Studio Flash", intent: "renter" },
      { slug: "rent-mirrorless-camera", label: "Rent Mirrorless Camera", intent: "renter" },
      { slug: "hire-camera-bag", label: "Hire Camera Bag", intent: "renter" },
      { slug: "rent-cinema-camera", label: "Rent Cinema Camera", intent: "renter" },
    ],
    ownerKeywords: [
      { slug: "how-to-make-money-renting-my-camera", label: "How to Make Money Renting My Camera", intent: "owner" },
      { slug: "list-my-photography-equipment-for-rent", label: "List My Photography Equipment for Rent", intent: "owner" },
      { slug: "passive-income-from-camera-gear", label: "Passive Income From Camera Gear", intent: "owner" },
      { slug: "rent-out-my-dslr", label: "Rent Out My DSLR", intent: "owner" },
      { slug: "how-much-can-i-earn-renting-my-sony-a7", label: "How Much Can I Earn Renting My Sony A7", intent: "owner" },
      { slug: "make-money-from-idle-camera", label: "Make Money From Idle Camera", intent: "owner" },
      { slug: "best-site-to-list-camera-for-rent", label: "Best Site to List Camera for Rent", intent: "owner" },
      { slug: "earn-from-renting-photography-gear", label: "Earn From Renting Photography Gear", intent: "owner" },
      { slug: "how-to-rent-out-cinema-camera", label: "How to Rent Out Cinema Camera", intent: "owner" },
      { slug: "monetize-my-camera-equipment", label: "Monetize My Camera Equipment", intent: "owner" },
      { slug: "list-lenses-for-rent", label: "List Lenses for Rent", intent: "owner" },
      { slug: "side-hustle-renting-photography-gear", label: "Side Hustle Renting Photography Gear", intent: "owner" },
      { slug: "camera-rental-income-calculator", label: "Camera Rental Income Calculator", intent: "owner" },
      { slug: "how-to-list-lighting-equipment-for-hire", label: "How to List Lighting Equipment for Hire", intent: "owner" },
      { slug: "rent-out-my-gimbal-for-income", label: "Rent Out My Gimbal for Income", intent: "owner" },
    ],
    competitorKeywords: [
      { slug: "fat-llama-alternative-photography", label: "Fat Llama Alternative Photography", intent: "competitor" },
      { slug: "cheaper-than-fat-llama-cameras", label: "Cheaper Than Fat Llama Cameras", intent: "competitor" },
      { slug: "sharegrid-alternative", label: "ShareGrid Alternative", intent: "competitor" },
      { slug: "kitsplit-alternative", label: "KitSplit Alternative", intent: "competitor" },
      { slug: "avoid-fat-llama-commission-cameras", label: "Avoid Fat Llama Commission Cameras", intent: "competitor" },
      { slug: "best-photography-rental-alternative", label: "Best Photography Rental Alternative", intent: "competitor" },
      { slug: "camera-gear-rental-without-fees", label: "Camera Gear Rental Without Fees", intent: "competitor" },
      { slug: "photography-equipment-hire-lower-cost", label: "Photography Equipment Hire Lower Cost", intent: "competitor" },
      { slug: "peer-to-peer-camera-rental-2026", label: "Peer to Peer Camera Rental 2026", intent: "competitor" },
      { slug: "sharegrid-fees-too-high", label: "ShareGrid Fees Too High", intent: "competitor" },
      { slug: "cheaper-camera-hire-option", label: "Cheaper Camera Hire Option", intent: "competitor" },
      { slug: "photography-rental-marketplace", label: "Photography Rental Marketplace", intent: "competitor" },
      { slug: "lower-fee-camera-rental-platform", label: "Lower Fee Camera Rental Platform", intent: "competitor" },
    ],
    blurbs: {
      renter: "Access professional photography and videography equipment without the enormous upfront cost of ownership. Leli Rentals connects photographers, filmmakers, content creators, and event professionals directly with local gear owners offering cameras, DSLR rentals, mirrorless cameras, Sony A7 series, Canon R5, cinema cameras, lenses, lighting equipment, video cameras, gimbals, studio flash systems, camera bags, and drones for photography hire worldwide. Whether you are shooting a wedding, a commercial project, a music video, a travel documentary, a corporate event, or a personal creative project, finding the right camera gear for hire has never been easier. Every photography equipment listing on Leli Rentals includes verified owner ratings, gear condition details, included accessories, transparent hire rates, and flexible booking terms. Stop paying inflated rates at traditional camera hire shops — rent directly from trusted local photographers and videographers who maintain their gear to professional standards and offer it at competitive daily hire rates.",
      owner: "Your camera gear is expensive — and when it sits on the shelf between your own shoots, it earns you nothing. Listing your photography and videography equipment on Leli Rentals connects you with photographers, filmmakers, content creators, and event professionals in your city actively searching to hire cameras, lenses, lighting, gimbals, and studio equipment. The camera gear rental market is highly active — creative projects, weddings, commercial shoots, and content creation happen constantly in every major city, and not every professional wants to own every piece of equipment they use. Your gear can earn consistent rental income between your own bookings. Unlike Fat Llama or ShareGrid which charge significant commission on every transaction, Leli Rentals charges a flat monthly subscription and you keep 100% of every hire payment. Listing your photography equipment takes minutes — photograph your gear clearly, describe condition and included accessories, set your daily rate, and publish. Start earning from your camera collection today.",
      competitor: "Fat Llama, ShareGrid, and KitSplit serve the photography and videography equipment rental market — but their commission structures consistently reduce what gear owners actually earn. ShareGrid charges owners between 10% and 20% commission per rental transaction, meaning on a $300 camera hire your earnings are reduced by up to $60 before payout. For photographers and videographers with multiple items listed, those commission deductions represent thousands of dollars in lost income annually. Leli Rentals was built to give photography equipment owners the rental income they actually deserve. Our marketplace charges a single flat monthly subscription — no commission per hire, no percentage deductions, no transaction fees reducing your payout. List your cameras, lenses, lighting equipment, gimbals, drones, and cinema gear and keep every cent each hire generates. We provide the same verified renter profiles, equipment condition standards, and global marketplace reach — simply without taking a share of your photography rental income. Switch today and immediately increase what your gear earns.",
    },
    images: {
      renter: `${IMG}/photography-renter.jpg`,
      owner: `${IMG}/photography-owner.jpg`,
    },
    outlinks: [
      { anchor: "Professional photography tutorials and resources from Adobe", url: "https://www.adobe.com/creativecloud/photography.html" },
      { anchor: "In-depth camera and lens reviews on DPReview", url: "https://www.dpreview.com/" },
      { anchor: "Photography inspiration and techniques from National Geographic", url: "https://www.nationalgeographic.com/photography/" },
      { anchor: "Photography industry news and trends from PDN", url: "https://www.pdnpulse.com/" },
    ],
  },
  {
    id: "fitness",
    name: "Fitness & Sports",
    renterKeywords: [
      { slug: "rent-gym-equipment", label: "Rent Gym Equipment", intent: "renter" },
      { slug: "hire-sports-gear", label: "Hire Sports Gear", intent: "renter" },
      { slug: "rent-bicycle", label: "Rent Bicycle", intent: "renter" },
      { slug: "hire-kayak", label: "Hire Kayak", intent: "renter" },
      { slug: "rent-surfboard", label: "Rent Surfboard", intent: "renter" },
      { slug: "hire-ski-equipment", label: "Hire Ski Equipment", intent: "renter" },
      { slug: "rent-treadmill", label: "Rent Treadmill", intent: "renter" },
      { slug: "hire-camping-gear", label: "Hire Camping Gear", intent: "renter" },
      { slug: "rent-golf-clubs", label: "Rent Golf Clubs", intent: "renter" },
      { slug: "hire-stand-up-paddleboard", label: "Hire Stand Up Paddleboard", intent: "renter" },
      { slug: "rent-tennis-equipment", label: "Rent Tennis Equipment", intent: "renter" },
      { slug: "hire-rock-climbing-gear", label: "Hire Rock Climbing Gear", intent: "renter" },
      { slug: "rent-fitness-equipment", label: "Rent Fitness Equipment", intent: "renter" },
      { slug: "hire-mountain-bike", label: "Hire Mountain Bike", intent: "renter" },
      { slug: "rent-water-sports-equipment", label: "Rent Water Sports Equipment", intent: "renter" },
    ],
    ownerKeywords: [
      { slug: "how-to-make-money-renting-my-gym-equipment", label: "How to Make Money Renting My Gym Equipment", intent: "owner" },
      { slug: "list-my-sports-gear-for-rent", label: "List My Sports Gear for Rent", intent: "owner" },
      { slug: "passive-income-from-fitness-equipment", label: "Passive Income From Fitness Equipment", intent: "owner" },
      { slug: "rent-out-my-bicycle", label: "Rent Out My Bicycle", intent: "owner" },
      { slug: "how-much-can-i-earn-renting-my-kayak", label: "How Much Can I Earn Renting My Kayak", intent: "owner" },
      { slug: "make-money-from-idle-sports-gear", label: "Make Money From Idle Sports Gear", intent: "owner" },
      { slug: "best-site-to-list-fitness-equipment", label: "Best Site to List Fitness Equipment", intent: "owner" },
      { slug: "earn-from-renting-sports-equipment", label: "Earn From Renting Sports Equipment", intent: "owner" },
      { slug: "how-to-rent-out-camping-gear", label: "How to Rent Out Camping Gear", intent: "owner" },
      { slug: "monetize-my-gym-equipment", label: "Monetize My Gym Equipment", intent: "owner" },
      { slug: "list-golf-clubs-for-rent", label: "List Golf Clubs for Rent", intent: "owner" },
      { slug: "side-hustle-renting-sports-gear", label: "Side Hustle Renting Sports Gear", intent: "owner" },
      { slug: "fitness-equipment-rental-income-calculator", label: "Fitness Equipment Rental Income Calculator", intent: "owner" },
      { slug: "how-to-list-surfboard-for-hire", label: "How to List Surfboard for Hire", intent: "owner" },
      { slug: "rent-out-my-ski-equipment", label: "Rent Out My Ski Equipment", intent: "owner" },
    ],
    competitorKeywords: [
      { slug: "spinlister-alternative", label: "Spinlister Alternative", intent: "competitor" },
      { slug: "cheaper-than-sports-gear-rental-shops", label: "Cheaper Than Sports Gear Rental Shops", intent: "competitor" },
      { slug: "peer-to-peer-sports-rental", label: "Peer to Peer Sports Rental", intent: "competitor" },
      { slug: "avoid-sports-store-rental-markup", label: "Avoid Sports Store Rental Markup", intent: "competitor" },
      { slug: "best-sports-equipment-rental-alternative", label: "Best Sports Equipment Rental Alternative", intent: "competitor" },
      { slug: "fitness-gear-rental-without-depot-fees", label: "Fitness Gear Rental Without Depot Fees", intent: "competitor" },
      { slug: "sports-hire-lower-cost-2026", label: "Sports Hire Lower Cost 2026", intent: "competitor" },
      { slug: "peer-to-peer-fitness-equipment-rental", label: "Peer to Peer Fitness Equipment Rental", intent: "competitor" },
      { slug: "cheaper-bike-hire-option", label: "Cheaper Bike Hire Option", intent: "competitor" },
      { slug: "sports-rental-marketplace-alternative", label: "Sports Rental Marketplace Alternative", intent: "competitor" },
      { slug: "lower-fee-outdoor-gear-rental", label: "Lower Fee Outdoor Gear Rental", intent: "competitor" },
      { slug: "spinlister-fees-comparison", label: "Spinlister Fees Comparison", intent: "competitor" },
      { slug: "sports-equipment-hire-platform", label: "Sports Equipment Hire Platform", intent: "competitor" },
    ],
    blurbs: {
      renter: "Access premium fitness and sports equipment without the cost of ownership or the commitment of a gym membership. Leli Rentals connects active individuals, athletes, and sports enthusiasts directly with local equipment owners offering bicycles, kayaks, surfboards, ski equipment, treadmills, camping gear, golf clubs, stand-up paddleboards, tennis equipment, rock climbing gear, mountain bikes, water sports equipment, and full gym setups for daily, weekly, and monthly hire worldwide. Whether you are visiting a new city and want to explore by bike, planning a kayaking adventure, trying a new sport before committing to buying gear, or setting up a temporary home gym, our peer-to-peer sports equipment rental marketplace has exactly what you need available near you. Every listing includes owner ratings, gear condition details, transparent hire rates, and flexible booking terms. Rent directly from passionate local sports enthusiasts and access the equipment you need at a fraction of the retail purchase price.",
      owner: "Sports and fitness equipment is expensive to buy — and for most owners, it spends more time in storage than in use. Listing your fitness and sports gear on Leli Rentals connects you with athletes, adventurers, and fitness enthusiasts in your city actively searching to hire bicycles, kayaks, surfboards, golf clubs, camping gear, ski equipment, gym machines, and water sports gear. Whether you own a single high-value item or a collection of sports equipment, there is consistent local and visitor demand for exactly what you have. Tourists visiting your city often want to experience outdoor activities without travelling with bulky equipment — your gear is the solution they are searching for. Leli Rentals charges a simple flat monthly subscription with zero commission deductions, meaning every hire payment goes directly to you. Setting up a fitness and sports equipment listing is simple — photograph your gear, describe condition and size specifications, set your daily rate, and go live today.",
      competitor: "Spinlister, DICK's Sporting Goods rental programs, and local sports hire shops have served the equipment rental market for years — but each comes with limitations that cost owners and renters alike. Spinlister charges commission on peer-to-peer rentals, reducing owner earnings on every transaction. Local sports hire shops operate on thin margins that result in inflated daily hire rates for renters. Neither model truly serves the owner who wants maximum income from their equipment or the renter who wants access at a fair price. Leli Rentals solves both problems simultaneously. Sports and fitness equipment owners list on a flat monthly subscription and keep 100% of every hire payment — no commission, no percentage cuts, no transaction fees. Renters access bikes, kayaks, surfboards, ski gear, golf clubs, camping equipment, and gym machinery directly from local owners at rates significantly below traditional hire shops. Whether you own premium sports gear looking for a better earning platform or a sports enthusiast seeking fairer hire rates, Leli Rentals delivers the better peer-to-peer sports equipment rental experience.",
    },
    images: {
      renter: `${IMG}/fitness-sports-renter.jpg`,
      owner: `${IMG}/fitness-sports-owner.jpg`,
    },
    outlinks: [
      { anchor: "Physical activity and fitness guidelines from the WHO", url: "https://www.who.int/news-room/fact-sheets/detail/physical-activity" },
      { anchor: "Fitness training tips and guides from Runner's World", url: "https://www.runnersworld.com/" },
      { anchor: "Outdoor adventure and sports equipment guides from REI", url: "https://www.rei.com/learn/expert-advice.html" },
      { anchor: "Adventure sports and outdoor lifestyle from Outside Magazine", url: "https://www.outsideonline.com/" },
    ],
  },
  {
    id: "baby",
    name: "Baby & Kids",
    renterKeywords: [
      { slug: "rent-baby-gear", label: "Rent Baby Gear", intent: "renter" },
      { slug: "hire-pram", label: "Hire Pram", intent: "renter" },
      { slug: "rent-car-seat", label: "Rent Car Seat", intent: "renter" },
      { slug: "hire-crib", label: "Hire Crib", intent: "renter" },
      { slug: "rent-baby-cot", label: "Rent Baby Cot", intent: "renter" },
      { slug: "hire-high-chair", label: "Hire High Chair", intent: "renter" },
      { slug: "rent-stroller", label: "Rent Stroller", intent: "renter" },
      { slug: "hire-baby-monitor", label: "Hire Baby Monitor", intent: "renter" },
      { slug: "rent-baby-bouncer", label: "Rent Baby Bouncer", intent: "renter" },
      { slug: "hire-kids-bicycle", label: "Hire Kids Bicycle", intent: "renter" },
      { slug: "rent-baby-bath", label: "Rent Baby Bath", intent: "renter" },
      { slug: "hire-play-gym", label: "Hire Play Gym", intent: "renter" },
      { slug: "rent-baby-carrier", label: "Rent Baby Carrier", intent: "renter" },
      { slug: "hire-baby-swing", label: "Hire Baby Swing", intent: "renter" },
      { slug: "rent-toddler-toys", label: "Rent Toddler Toys", intent: "renter" },
    ],
    ownerKeywords: [
      { slug: "how-to-make-money-renting-baby-gear", label: "How to Make Money Renting Baby Gear", intent: "owner" },
      { slug: "list-my-pram-for-rent", label: "List My Pram for Rent", intent: "owner" },
      { slug: "passive-income-from-baby-equipment", label: "Passive Income From Baby Equipment", intent: "owner" },
      { slug: "rent-out-my-car-seat", label: "Rent Out My Car Seat", intent: "owner" },
      { slug: "how-much-can-i-earn-renting-my-baby-items", label: "How Much Can I Earn Renting My Baby Items", intent: "owner" },
      { slug: "make-money-from-outgrown-baby-gear", label: "Make Money From Outgrown Baby Gear", intent: "owner" },
      { slug: "best-site-to-list-baby-equipment", label: "Best Site to List Baby Equipment", intent: "owner" },
      { slug: "earn-from-renting-pram", label: "Earn From Renting Pram", intent: "owner" },
      { slug: "how-to-rent-out-baby-furniture", label: "How to Rent Out Baby Furniture", intent: "owner" },
      { slug: "monetize-baby-gear", label: "Monetize Baby Gear", intent: "owner" },
      { slug: "list-crib-for-rent", label: "List Crib for Rent", intent: "owner" },
      { slug: "side-hustle-renting-baby-items", label: "Side Hustle Renting Baby Items", intent: "owner" },
      { slug: "baby-gear-rental-income-calculator", label: "Baby Gear Rental Income Calculator", intent: "owner" },
      { slug: "how-to-list-stroller-for-hire", label: "How to List Stroller for Hire", intent: "owner" },
      { slug: "rent-out-my-kids-bicycle", label: "Rent Out My Kids Bicycle", intent: "owner" },
    ],
    competitorKeywords: [
      { slug: "babyquip-alternative", label: "BabyQuip Alternative", intent: "competitor" },
      { slug: "cheaper-than-babyquip", label: "Cheaper Than BabyQuip", intent: "competitor" },
      { slug: "traveling-baby-alternative", label: "Traveling Baby Alternative", intent: "competitor" },
      { slug: "avoid-baby-gear-rental-fees", label: "Avoid Baby Gear Rental Fees", intent: "competitor" },
      { slug: "peer-to-peer-baby-equipment-rental", label: "Peer to Peer Baby Equipment Rental", intent: "competitor" },
      { slug: "best-babyquip-competitor", label: "Best BabyQuip Competitor", intent: "competitor" },
      { slug: "baby-gear-hire-lower-cost-2026", label: "Baby Gear Hire Lower Cost 2026", intent: "competitor" },
      { slug: "rent-a-crib-alternative", label: "Rent a Crib Alternative", intent: "competitor" },
      { slug: "cheaper-pram-hire-option", label: "Cheaper Pram Hire Option", intent: "competitor" },
      { slug: "baby-rental-marketplace-alternative", label: "Baby Rental Marketplace Alternative", intent: "competitor" },
      { slug: "lower-fee-kids-gear-rental", label: "Lower Fee Kids Gear Rental", intent: "competitor" },
      { slug: "babyquip-fees-too-high", label: "BabyQuip Fees Too High", intent: "competitor" },
      { slug: "baby-equipment-rental-platform-comparison", label: "Baby Equipment Rental Platform Comparison", intent: "competitor" },
    ],
    blurbs: {
      renter: "Travelling with young children or hosting family visits does not have to mean buying bulky baby gear you will only use temporarily. Leli Rentals connects parents and caregivers directly with local equipment owners offering prams, car seats, cribs, baby cots, high chairs, strollers, baby monitors, baby bouncers, kids bicycles, baby baths, play gyms, baby carriers, baby swings, and toddler toys for daily, weekly, and monthly hire worldwide. Whether you are visiting a new city with an infant, hosting grandparents who need safe equipment for a grandchild's visit, or simply trying out a piece of baby gear before committing to purchase, our peer-to-peer baby equipment rental marketplace has trusted options available near you. Every baby and kids listing on Leli Rentals includes verified owner ratings, safety condition details, transparent hire rates, and flexible booking terms. Rent quality baby gear from trusted local parents and keep your family comfortable wherever you go.",
      owner: "Baby and kids equipment is expensive to buy and grows redundant remarkably quickly as children develop. Instead of selling outgrown baby gear for a fraction of its value, listing it on Leli Rentals allows you to generate ongoing rental income from equipment other families genuinely need. Our peer-to-peer baby equipment marketplace connects parents, caregivers, and grandparents with trusted local owners offering prams, car seats, cribs, strollers, high chairs, baby monitors, and play equipment for hire. Visiting families, travelling parents, and short-term caregivers represent a large and consistent pool of renters actively searching for quality baby gear in their destination city — and your trusted, well-maintained equipment is exactly what they need. Leli Rentals charges a flat monthly subscription with zero commission, meaning you keep every cent your baby equipment earns. Listing takes minutes — photograph your items, describe condition and age range suitability, set your daily hire rate, and publish. Turn outgrown gear into income today.",
      competitor: "BabyQuip, Traveling Baby Company, and Rent-A-Crib have built businesses around travelling families who need temporary baby gear — but their pricing structures and commission models mean equipment owners consistently receive less than their items are worth per rental. BabyQuip charges hosts a significant commission percentage on every booking, reducing the income parents and caregivers earn from listing their quality baby equipment. For owners with multiple items, those deductions represent a substantial portion of potential earnings lost to the platform. Leli Rentals gives baby equipment owners the full value of every rental. Our peer-to-peer baby and kids gear marketplace charges a single flat monthly subscription — no commission per booking, no percentage deductions, no surprise payout reductions. List your prams, car seats, cribs, strollers, high chairs, and baby gear and keep 100% of every hire payment. We provide the same safety-focused verified renter community and global marketplace reach that established platforms offer — simply without taking a cut of your baby equipment rental income.",
    },
    images: {
      renter: `${IMG}/baby-kids-renter.jpg`,
      owner: `${IMG}/baby-kids-owner.jpg`,
    },
    outlinks: [
      { anchor: "Child safety standards and guidelines from UNICEF", url: "https://www.unicef.org/child-safety" },
      { anchor: "Child health and safety recommendations from the AAP", url: "https://www.aap.org/" },
      { anchor: "Baby gear reviews and parent guides from What to Expect", url: "https://www.whattoexpect.com/baby-products/" },
      { anchor: "Baby product safety ratings from Consumer Reports", url: "https://www.consumerreports.org/babies-kids/" },
    ],
  },
]

// ─── UNIVERSAL OUTLINKS (on every page) ──────────────────────────────────────
export const universalOutlinks = (cityName: string, citySlug: string): SeoOutlink[] => [
  {
    anchor: `Learn more about ${cityName} on Wikipedia`,
    url: `https://en.wikipedia.org/wiki/${cityName.replace(/ /g, "_")}`,
  },
  {
    anchor: `${cityName} travel guide on TripAdvisor`,
    url: `https://www.tripadvisor.com/Tourism-g${citySlug}-${cityName.replace(/ /g, "_")}.html`,
  },
  {
    anchor: `Explore ${cityName} on Google Maps`,
    url: `https://maps.google.com/?q=${encodeURIComponent(cityName)}`,
  },
]

// ─── HELPER FUNCTIONS ─────────────────────────────────────────────────────────

/** Get a category by its ID */
export function getSeoCategoryById(id: string): SeoCategoryData | undefined {
  return seoCategories.find((c) => c.id === id)
}

/** Get a city by its slug */
export function getSeoCityBySlug(slug: string): SeoCity | undefined {
  return seoCities.find((c) => c.slug === slug)
}

/**
 * Given a URL slug, determine which page it maps to.
 * Returns null if slug is not a valid SEO page.
 */
export function resolveSeoSlug(slug: string): SeoPage | null {
  // Check renter intent: slug = keyword-in-city
  for (const category of seoCategories) {
    for (const kw of category.renterKeywords) {
      for (const city of seoCities) {
        const fullSlug = `${kw.slug}-in-${city.slug}`
        if (fullSlug === slug) {
          return { slug, intent: "renter", categoryId: category.id, city, keyword: kw }
        }
      }
    }
    // Check owner intent: slug = keyword (global)
    for (const kw of category.ownerKeywords) {
      if (kw.slug === slug) {
        return { slug, intent: "owner", categoryId: category.id, keyword: kw }
      }
    }
    // Check competitor intent: slug = keyword (global)
    for (const kw of category.competitorKeywords) {
      if (kw.slug === slug) {
        return { slug, intent: "competitor", categoryId: category.id, keyword: kw }
      }
    }
  }
  return null
}

/**
 * Generate all valid SEO slugs for generateStaticParams
 */
export function getAllSeoSlugs(): string[] {
  const slugs: string[] = []
  for (const category of seoCategories) {
    // Renter: keyword + city combinations
    for (const kw of category.renterKeywords) {
      for (const city of seoCities) {
        slugs.push(`${kw.slug}-in-${city.slug}`)
      }
    }
    // Owner: global pages
    for (const kw of category.ownerKeywords) {
      slugs.push(kw.slug)
    }
    // Competitor: global pages
    for (const kw of category.competitorKeywords) {
      slugs.push(kw.slug)
    }
  }
  return slugs
}

/**
 * Generate page metadata for SEO pages
 */
export function generateSeoPageMeta(page: SeoPage, category: SeoCategoryData) {
  const cityName = page.city?.name ?? ""
  const keyword = page.keyword.label

  if (page.intent === "renter") {
    return {
      title: `${keyword} in ${cityName} — Find the Best Deals | Leli Rentals`,
      description: `Looking to ${keyword.toLowerCase()} in ${cityName}? Browse trusted local listings on Leli Rentals. No hidden fees, verified owners, flexible booking. Find your perfect ${category.name.toLowerCase()} rental in ${cityName} today.`,
      keywords: [
        `${keyword.toLowerCase()} in ${cityName}`,
        `${keyword.toLowerCase()} ${cityName}`,
        `${category.name.toLowerCase()} rental ${cityName}`,
        `rent ${category.name.toLowerCase()} ${cityName}`,
        `hire ${category.name.toLowerCase()} ${cityName}`,
        `best ${keyword.toLowerCase()} ${cityName}`,
        `cheap ${keyword.toLowerCase()} ${cityName}`,
        `affordable ${category.name.toLowerCase()} ${cityName}`,
        `peer to peer ${category.name.toLowerCase()} ${cityName}`,
        `${cityName} ${category.name.toLowerCase()} hire`,
        `book ${category.name.toLowerCase()} ${cityName}`,
        `local ${category.name.toLowerCase()} rental ${cityName}`,
      ],
    }
  }

  if (page.intent === "owner") {
    return {
      title: `${keyword} — Earn From Your Assets | Leli Rentals`,
      description: `${keyword}? List your ${category.name.toLowerCase()} on Leli Rentals and start earning passive income. No commission fees — just a flat monthly subscription. Join thousands of owners already earning on Leli Rentals.`,
      keywords: [
        keyword.toLowerCase(),
        `earn from ${category.name.toLowerCase()}`,
        `passive income ${category.name.toLowerCase()}`,
        `list ${category.name.toLowerCase()} for rent`,
        `monetize ${category.name.toLowerCase()}`,
        `${category.name.toLowerCase()} rental income`,
        `make money ${category.name.toLowerCase()}`,
        `${category.name.toLowerCase()} side hustle`,
        `rent out ${category.name.toLowerCase()}`,
        `${category.name.toLowerCase()} listing platform`,
        `best site to list ${category.name.toLowerCase()}`,
        `peer to peer ${category.name.toLowerCase()} rental`,
      ],
    }
  }

  // competitor
  return {
    title: `${keyword} — Switch to Leli Rentals | No Commission Fees`,
    description: `Searching for a ${keyword.toLowerCase()}? Leli Rentals charges zero commission — just a flat monthly fee. Keep 100% of your rental earnings. Join thousands of owners who have already made the switch from expensive platforms.`,
    keywords: [
      keyword.toLowerCase(),
      `${keyword.toLowerCase()} 2026`,
      `best ${keyword.toLowerCase()}`,
      `${category.name.toLowerCase()} without commission`,
      `${category.name.toLowerCase()} lower fees`,
      `switch rental platform`,
      `no commission ${category.name.toLowerCase()} rental`,
      `flat fee ${category.name.toLowerCase()} platform`,
      `${category.name.toLowerCase()} marketplace alternative`,
      `best peer to peer ${category.name.toLowerCase()}`,
      `${category.name.toLowerCase()} rental comparison`,
      `save on ${category.name.toLowerCase()} fees`,
    ],
  }
}