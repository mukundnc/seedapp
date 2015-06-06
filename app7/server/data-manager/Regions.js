
var id = 1;

function createStateInRegion(regionName, stateName, cities, pincodeStart){
	var allCities = [];
	var p = pincodeStart;

	cities.forEach(function(c){
		allCities.push({
			id : id,
			region : regionName,
			state : stateName,
			city : c,
			pincode : p
		});
		p++;
		id++;
	});
	return allCities;
}


var allRegions = [];

var UP_Cities = ["Kanpur", "Lucknow", "Ghaziabad", "Agra", "Varanasi", "Meerut", "Allahabad", "Bareilly", "Aligarh", "Moradabad", "Saharanpur", "Gorakhpur", "Noida", "Jhansi", "Muzaffarnagar", "Mathura", "Budaun", "Rampur", "Shahjahanpur", "Farrukhabad"]; 
var Pun_Cities = ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Ajitgarh", "Hoshiarpur", "Batala", "Pathankot", "Moga", "Abohar", "Malerkotla", "Khanna", "Phagwara", "Muktasar", "Barnala", "Rajpura", "Firozpur", "Kapurthala", "Chandigarh"]; 
var Har_Cities = ["Faridabad", "Gurgaon", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal", "Sonipat", "Panchkula", "Bhiwani", "Sirsa", "Bahadurgarh", "Jind", "Thanesar", "Kaithal", "Rewari", "Palwal"]; 
var MP_Cities = ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam", "Rewa", "Murwara", "Singrauli", "Burhanpur", "Khandwa", "Morena", "Bhind", "Chhindwar", "Vidisha", "Chhatarpur"];

var Mah_Cities = ["Mumbai", "Pune", "Nagpur", "Thane", "Pimpri", "Nashik", "Kalyan", "Vasai", "Aurangabad", "NaviMumbai", "Solapur", "Bhiwandi", "Amravati", "Nanded", "Kolhapur", "Sangli", "Jalgaon", "Akola", "Latur", "Dhule"]; 
var Guj_Cities = ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar", "Mahesana", "Morbi", "Surendranagar", "Gandhidham", "Veraval", "Navsari", "Bharuch", "Anand", "Porbandar", "Godhra", "Botad", "Sidhpur"];
var Raj_Cities = ["Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittaurgar", "Churu", "Dausa", "Dhaulpur", "Dungarpur", "Ganganagar", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalor", "Jhalawar"];
var Goa_Cities = ["Mapusa", "Margao", "NorthGoa", "OldGoa", "Panaji", "Ponda", "Siolim", "SouthGoa", "VascodaGama"];

var Ben_Cities = ["Kolkata", "Asansol", "Siliguri", "Durgapur", "Bardhaman", "Malda", "Baharampur", "Habra", "Jalpaiguri", "Kharagpur", "Shantipur", "Dankuni", "Dhulian", "Ranaghat", "Haldia", "Raiganj", "Krishnanagar", "Nabadwip", "Medinipur", "Balurghat"];
var Odi_Cities = ["Bhubaneshwar", "Cuttack", "Rourkela", "Brahmapur", "Sambalpur", "Puri", "Balasore", "Bhadrak", "Baripada", "Jharsuguda", "Bargarh", "Bhawanipatna", "Dhenkanal", "Barbil", "Angul", "Jajpur"];
var Bih_Cities = ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Arrah", "Begusarai", "Katihar", "Munger", "Chhapra", "Bettiah", "Saharsa", "Sasaram", "Hajipur", "Dehri", "Siwan", "Motihari", "Nawada"];
var Jha_Cities = ["Jamshedpur", "Dhanbad", "Ranchi", "Bokaro", "Deoghar", "Hazaribagh", "Phusro", "Giridih", "Ramgarh", "Medininagar", "Chirkunda"];
var AP_Cities = ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Ramagundam", "Khammam", "Mahbubnagar", "Nalgonda", "Adilabad", "Suryapet", "Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Anantapur", "Kurnool", "Rajahmundry", "Tirupathi", "Kakinada", "Kadapa"];
var Kar_Cities = ["Bangalore", "Belgaum", "Mysore", "Tumkur", "Gulbarga", "Bellary", "Bijapur", "Dakshina", "Davanagere", "Raichur", "Bagalkot", "Dharwad", "Mandya", "Hassan", "Shimoga", "Bidar", "Chitradurga", "Haveri", "Kolar", "Uttara"];
var TN_Cities = ["Chennai", "Coimbatore", "Madurai", "Tiruchirappal", "Salem", "Tirunelveli", "Tiruppur", "Ambattur", "Avadi", "Thoothukudi", "Thanjavur", "Tiruvottiyur", "Nagercoil", "Dindigul", "Vellore", "Cuddalore", "Kancheepuram", "Erode", "Alandur", "Pallavapuram"];
var Ker_Cities = ["Kochi", "Kozhikode", "Thrissur", "Malappuram", "Thiruvananthapuram", "Kannur", "Kollam", "Cherthala", "Kayamkulam", "Kottayam", "Palakkad", "Alappuzha", "Ottappalam", "Kanhangad", "Kasaragod", "Changanassery", "Chalakudy", "Kothamangalam", "Nileshwar", "Payyanur"];

allRegions = allRegions.concat(createStateInRegion('North', 'UP', UP_Cities, 200001));
allRegions = allRegions.concat(createStateInRegion('North', 'Punjab', Pun_Cities, 210001));
allRegions = allRegions.concat(createStateInRegion('North', 'Haryana', Har_Cities, 220001));
allRegions = allRegions.concat(createStateInRegion('North', 'MP', MP_Cities, 230001));


allRegions = allRegions.concat(createStateInRegion('West', 'Maharashtra', Mah_Cities, 300001));
allRegions = allRegions.concat(createStateInRegion('West', 'Gujrat', Guj_Cities, 310001));
allRegions = allRegions.concat(createStateInRegion('West', 'Rajasthan', Raj_Cities, 320001));
allRegions = allRegions.concat(createStateInRegion('West', 'Goa', Goa_Cities, 330001));

allRegions = allRegions.concat(createStateInRegion('East', 'Bengal', Ben_Cities, 400001));
allRegions = allRegions.concat(createStateInRegion('East', 'Odisha', Odi_Cities, 410001));
allRegions = allRegions.concat(createStateInRegion('East', 'Bihar', Bih_Cities, 420001));
allRegions = allRegions.concat(createStateInRegion('East', 'Jharkhand', Jha_Cities, 430001));


allRegions = allRegions.concat(createStateInRegion('South', 'AP', AP_Cities, 500001));
allRegions = allRegions.concat(createStateInRegion('South', 'Karnataka', Kar_Cities, 510001));
allRegions = allRegions.concat(createStateInRegion('South', 'TamilNadu', TN_Cities, 520001));
allRegions = allRegions.concat(createStateInRegion('South', 'Kerla', Ker_Cities, 530001));

module.exports = allRegions;