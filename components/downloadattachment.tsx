import { Directory, File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { fetch as expoFetch } from 'expo/fetch';
import { Alert, Platform } from 'react-native';

export async function downloadattachment(
  remoteUrl: string,
  suggestedName = 'file'
): Promise<void> {
  try {
    if (Platform.OS === 'ios') {
      const tmpDir = new Directory(Paths.cache, 'tmp_files');
      tmpDir.create();
      const tmpFile = new File(tmpDir, suggestedName);

      const resp = await expoFetch(remoteUrl);
      if (!resp.ok) throw new Error(`Network error ${resp.status}`);
      const bytes = await resp.bytes();

      await tmpFile.write(bytes);
      await Sharing.shareAsync(tmpFile.uri);
      return;
    }

    const targetDir = await Directory.pickDirectoryAsync('Choose where to save the file');
    if (!targetDir) {
      Alert.alert('Cancelled');
      return;
    }

    const resp = await expoFetch(remoteUrl);
    if (!resp.ok) throw new Error(`Failed request ${resp.status}`);

    const bytes = await resp.bytes();

    const mime = guessMimeTypeFromName(suggestedName) || 'application/octet-stream';

    const file = targetDir.createFile(suggestedName, mime);
    await file.write(bytes);

    Alert.alert('Success', `${suggestedName} saved.`);
  } catch (err: any) {
    console.error(err);
    Alert.alert('Error', err.message);
  }
}

function guessMimeTypeFromName(name: string): string | null {
  const ext = name.split('.').pop()?.toLowerCase();
  if (!ext) return null;
  if (['jpg', 'jpeg'].includes(ext)) return 'image/jpeg';
  if (ext === 'png') return 'image/png';
  if (ext === 'pdf') return 'application/pdf';
  return null;
}
