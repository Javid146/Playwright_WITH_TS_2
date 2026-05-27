import fs from 'fs'; //fs means file system
import path from 'path';
import { parse } from 'csv-parse/sync';
import { test } from '@playwright/test';

const filePath = path.resolve('test-data/ui-data/input.csv');

const records : any = parse(fs.readFileSync(filePath, 'utf-8'), {
    columns: true,
    skip_empty_lines: true
});

for (const record of records) {
    test(`foo: ${record.key}`, async ({}) => {
        console.log(record.key, record.value, record.value2);
    });
}