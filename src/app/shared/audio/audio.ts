/** Decode any browser-supported audio file to mono PCM at a target sample rate. */
export async function decodeToMono(file: File, sampleRate: number): Promise<Float32Array> {
  const arrayBuffer = await file.arrayBuffer();
  const Ctx =
    (window as unknown as { AudioContext: typeof AudioContext; webkitAudioContext?: typeof AudioContext })
      .AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const audioCtx = new Ctx({ sampleRate });
  const decoded = await audioCtx.decodeAudioData(arrayBuffer);
  await audioCtx.close();
  const numFrames = decoded.length;
  const monoData = new Float32Array(numFrames);
  for (let ch = 0; ch < decoded.numberOfChannels; ch++) {
    const channelData = decoded.getChannelData(ch);
    for (let i = 0; i < numFrames; i++) monoData[i] += channelData[i];
  }
  for (let i = 0; i < numFrames; i++) monoData[i] /= decoded.numberOfChannels;
  return monoData;
}

/** Wrap a Float32Array of samples in a 16-bit PCM WAV container. */
export function encodeWAV(samples: Float32Array, sampleRate: number): ArrayBuffer {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const writeStr = (off: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(off + i, str.charCodeAt(i));
  };
  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, 'data');
  view.setUint32(40, samples.length * 2, true);
  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }
  return buffer;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
