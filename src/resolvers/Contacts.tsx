import axios from "axios";

const token = "bcd062dedabcd0f1ac8a568cdcf58660c44d7e79b91763cc1a5d0c03d52c522d851fceb0";
const proxyUrl = "https://cors-anywhere.herokuapp.com/";
const contactsUrl = "https://sahmed93846.api-us1.com/api/3/contacts";

const aud = 0.71;
const usd = 1;
const eur = 1.17;

export interface Contact {
	id: string;
	name: string;
	tags: string;
	totalValue: number;
	deals: number;
	location: string;
} 
/**
 * Returns convert value to usd
 * @param {number} value - value 
 * @param {string} symbol - api urls
 */
export function convert(value: number, symbol: string) {
	switch (symbol) {
		case "usd": 
			value = Math.round(value * usd);
			break;
		case "aud": 
			value = Math.round(value * aud);
			break;
		case "eur": 
			value = Math.round(value * eur);
			break;
		default:
			value = Math.round(value * usd);	
	}

	return value;
}
/**
 * Returns makes api request and returns data 
 * @param {string} url - api urls
 */
const axiosRequest = async (url: string) => {
	try {
		const res = await axios.get(url, {
			headers: {
				"Content-Type": "application/json",
				"Api-Token": token
			}
		});
		return res.data;
	} catch (error) {
		console.log(error);
	}
}
/**
 * Returns number of deals, total deal value converted to USD and contact location
 * @param {string} contactId - the contact id associated with a user account
 * 1 api request to get contact by id. 
 */
async function getDealsLocation(contactId: string) {

	const data = await axiosRequest(`${proxyUrl}${contactsUrl}/${contactId}`);
	let total: number = 0;

	data.deals.forEach((deal: any) => {
		total = total + convert(parseInt(deal.value, 10), deal.currency);
	});
	return {
		deals: data.deals.length,
		totalValue: total,
		location: data.geoAddresses? `${data.geoAddresses.city}, ${data.geoAddresses.state}, ${data.geoAddresses.country}`: ""
	};
}
/**
 * Returns string comma separated tag values
 * @param {string} contactId - the contact id associated with a user account
 * 2 api request to get tags 1st to get contact tags 2nd to get tag value
 */
export async function getTags(contactId: string) {

	const data = await axiosRequest(`${proxyUrl}${contactsUrl}/${contactId}/contactTags`);
	let tagData: any = undefined;
	const tagArray: string[] = [];

	for (let i = 0; i < data.contactTags.length; i += 1) {
		const tagData = await axiosRequest(proxyUrl + data.contactTags[i].links.tag);
		tagArray.push(tagData.tag.tag);
	}
	return tagArray.join(",");
}

/**
 * Returns string comma separated tag values
 * @param none
 * return array of Contacts
 */
export async function getContacts() {
	// limiting data to 4 rows
	const data = await axiosRequest(`${proxyUrl}${contactsUrl}?limit=4`);
	const contacts = data.contacts;
	const map: Contact[] = [];

	for (let i = 0; i < contacts.length; i += 1) {
		const deals = await getDealsLocation(contacts[i].id);
		const tags = await getTags(contacts[i].id);
		map.push({
			id: contacts[i].id,
			name: `${contacts[i].firstName} ${contacts[i].lastName}`,
			tags: tags,
			...deals
		});
	}
	return map;
}

