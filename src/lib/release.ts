import fs from 'fs';
import archiver from 'archiver';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const output = fs.createWriteStream(__dirname + '/../release.zip');
const archive = archiver('zip', {
    zlib: { level: 9 }
});

if (fs.existsSync(__dirname + '/../release.zip')) {
    fs.unlinkSync(__dirname + '/../release.zip');
}

output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
});

output.on('end', function () {
    console.log('Data has been drained');
});

archive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
        console.log(err);
    } else {
        throw err;
    }
});

archive.on('error', function (err) {
    throw err;
});

archive.pipe(output);
archive.glob('**/*', {
    cwd: __dirname + '/../',
    ignore: ['node_modules/**', 'dist/**', '**release**']
});
await archive.finalize();