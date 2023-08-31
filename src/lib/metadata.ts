import Ffmpeg from 'fluent-ffmpeg';
import * as FileSystem from 'expo-file-system';
import {IMetadata, ITrack} from '../typings';

export default async (data: ITrack, file: string): Promise<string> => {
    const outputOptions: string[] = ['-map', '0:0', '-codec', 'copy'];

    const metadata: IMetadata = {
        title: data.name,
        album: data.album_name,
        artist: data.artists,
        date: data.release_date,
        //attachments: []
    };

    Object.keys(metadata).forEach((key) => {
        outputOptions.push('-metadata', `${String(key)}=${metadata[key as 'title' | 'artist' | 'date' | 'album']}`);
    });

    const out = `${file.split('.')[0]}_temp.mp3`;

    await new Promise((resolve, reject) => {
        Ffmpeg()
            .input(file)
            .on('error', (err) => {
                reject(err);
            })
            .on('end', async () => {
                await FileSystem.moveAsync({from: out, to: file}); // Using Expo File System's moveAsync
                resolve(file);
            })
            .addOutputOptions(...outputOptions)
            .saveToFile(out);
    });

    await FileSystem.deleteAsync(file); // Using Expo File System's deleteAsync

    return file;
};
