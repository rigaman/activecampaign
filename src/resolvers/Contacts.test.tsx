import React from 'react';
import { convert, getContacts } from './Contacts';
import axios from 'axios';

jest.mock('axios');

axios.get.mockImplementation((url) => {
  switch (url) {
    case "https://cors-anywhere.herokuapp.com/https://sahmed93846.api-us1.com/api/3/contacts": 
       return  Promise.resolve({data: {contacts:[{id: "123", firstName: "Bob", lastName: "Drop"}]}});
    case "https://cors-anywhere.herokuapp.com/https://sahmed93846.api-us1.com/api/3/contacts/123":
       return  Promise.resolve({data: {contacts:[{id: "123", firstName: "Bob", lastName: "Drop"}], deals: [{currency: "usd", value: 1}]}});
    case "https://cors-anywhere.herokuapp.com/https://sahmed93846.api-us1.com/api/3/contacts/123/contactTags":
       return  Promise.resolve({data: {contactTags: [{links: {tag: "tag-request"}}]}});
    case "https://cors-anywhere.herokuapp.com/tag-request":
       return  Promise.resolve({data: {tag: {tag: "test"}}});
  }
});

test('should convert 1:1 usd', () => {
	expect(convert(1, "usd")).toBe(1);
});
test('should convert 1:0.7 aud', () => {
	expect(convert(10, "aud")).toBe(7);
});
test('should convert 1:1.17 usd', () => {
	expect(convert(10, "eur")).toBe(12);
});

test('should return array from resolver', async () => {
	const json = await getContacts();
    expect(Array.isArray(json)).toBeTruthy();
    expect(json[0].id).toBe("123");
    expect(axios.get).toHaveBeenCalled();
});