import React from 'react';
import { render, unmountComponentAtNode } from "react-dom";
import mockAxios from 'jest-mock-axios';
import { act } from "react-dom/test-utils";
import App from './App';
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

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test('renders contacts component', async () => {
   act(() => {
     render(<App />, container);
  });
  expect(container).toBeInTheDocument();
  expect(axios.get).toHaveBeenCalled();
});
