const fs = require('fs');
const path = require('path');

const files = [
    'assets/images/logo_black.png',
    'assets/images/splash-icon.png',
    'assets/images/icon.png',
    'assets/images/adaptive-icon.png'
];

files.forEach(file => {
    const filePath = path.join('c:/Users/evince/Downloads/leli-rentals/mobile', file);
    if (fs.existsSync(filePath)) {
        const buffer = Buffer.alloc(8);
        const fd = fs.openSync(filePath, 'r');
        fs.readSync(fd, buffer, 0, 8, 0);
        fs.closeSync(fd);

        // PNG signature: 89 50 4E 47 0D 0A 1A 0A
        // JPEG signature: FF D8 FF
        let type = 'unknown';
        if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
            type = 'png';
        } else if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
            type = 'jpg';
        }

        console.log(`${file}: ${type} (${buffer.toString('hex')})`);
    } else {
        console.log(`${file}: not found`);
    }
});
