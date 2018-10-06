import {createWriteStream, WriteStream} from 'fs';
import * as archiver from 'archiver';

const output: WriteStream = createWriteStream('extension.zip');
const archive = archiver('zip');

archive.on('error', (err) => {
    throw err;
});

archive.pipe(output);
archive.directory('build/', 'build/');
archive.directory('images/', 'images/');
archive.file('manifest.json', {});
archive.file('options.html', {});
archive.finalize();
