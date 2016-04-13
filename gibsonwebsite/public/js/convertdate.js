// Converts a date of the format YYYY-MM-DD to format of Jan 1, 2000
function convertdate(date) {
	var split = date.split('-');
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	var ret = '';
	ret += months[Number(split[1])-1];
	ret += ' ';
	ret += split[2];
	ret += ', ';
	ret += split[0];
	return ret;
}