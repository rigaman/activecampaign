import React from 'react';
import { convert } from './Contacts';

test('should convert 1:1 usd', () => {
	expect(convert(1, "usd"))toBe(1);
});
