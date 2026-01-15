const ffmpeg = require('fluent-ffmpeg');

const convertToWav = (inputPath, outputPath)=>{
    ffmpeg(inputPath)
    .toFormat('wav')
    .on('error', (err)=>{
        console.log('An error occurred: ' + err.message);
    })
    .on('progress', (progress)=>{
        console.log('Processing: ' + progress.percent + '% done');
    })
    .on('end', ()=>{
        console.log('Processing finished !');
    })
    .save(outputPath);
}

module.exports = {
    convertToWav
}