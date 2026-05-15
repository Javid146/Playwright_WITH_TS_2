import { test, expect } from '@playwright/test'
import path from 'path'


test('upload', async ({ page }) => {

    // upload one file
    await page.getByLabel('Upload file').setInputFiles(path.join(__dirname, 'myfile.pdf'));

    // upload multiple files
    await page.getByLabel('Upload files').setInputFiles([
        path.join(__dirname, 'file1.txt'),
        path.join(__dirname, 'file2.txt'),
    ]);

    // upload whole directory to upload (when app allows)
    await page.getByLabel('Upload directory').setInputFiles(path.join(__dirname, 'mydir'));

    // Remove all the selected files (if ui shows selected files)
    await page.getByLabel('Upload file').setInputFiles([]);

    //click to complete upload
    await page.getByRole('button', { name: 'Upload' }).click();
})


/*
Use 'upload 2' when:
upload is triggered only by custom UI button no direct <input type="file"> access.
Explanation:
- User clicks the upload button
- This triggers the real system file dialog
- Playwright catches the opened file chooser
- Selects a real file from disk and uploads it
*/
test('upload 2', async ({ page }) => {
    // Start waiting for file chooser before clicking. Note no await.
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByLabel('Upload file').click();
    const fileChooser = await fileChooserPromise;

    const input = fileChooser.element(); //It returns actual HTML input element that triggered dialog.
  
    expect(fileChooser.isMultiple()).toBeTruthy() //checks if this file upload input can upload multiple files

    await fileChooser.setFiles(path.join(__dirname, 'myfile.pdf')); //__dirname = absolute path of the current test file’s folder
})