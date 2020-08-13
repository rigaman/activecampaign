import React, { useState, useEffect } from 'react';
import NumberFormat from 'react-number-format';
import ReactLoading from 'react-loading';
import { getContacts, Contact } from "../resolvers/Contacts";
import './Contact.css';

export default function Contacts() {
	const [contacts, setContacts] = useState<Contact[]>();

	useEffect(() => {
		getContacts().then((conts) => {
			setContacts(conts); 
		});
	}, []);

	return (
	<div className="contact">
		{contacts && (contacts.map((contact: Contact) => {
			return (
			<table className="wrapper">
			   <thead>
				   <tr className="header">	
						<th className="pad-left-12">Contact</th>
						<th>Total Value</th>
						<th>Location</th>
						<th className="center">Deals</th>
						<th>Tags</th>
				   </tr>
				</thead>
				<tbody>
					<tr key={contact.id} className="contact-body">	
					<td className="pad-left-12 blue-text">{contact.name}</td>
					<td><NumberFormat value={contact.totalValue} displayType={'text'} thousandSeparator={true} prefix={'$'} /></td>
					<td>{contact.location}</td>
					<td className="center">{contact.deals}</td>
					<td>{contact.tags}</td>
					</tr>
			  </tbody>
			</table>
			)}))}
		{!Boolean(contacts) && (
			<ReactLoading type="spin" color="#808080" height={'20%'} width={'20%'} />
		)}
	</div>
	);
}